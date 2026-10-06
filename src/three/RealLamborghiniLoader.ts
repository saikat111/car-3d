import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CarColor, CaliperColor, PaintFinish, WheelConfig } from '../types/car';

export interface RealCarLoadedModel {
  root: THREE.Group;
  bodyMaterials: THREE.MeshPhysicalMaterial[];
  mirrorMaterials: THREE.MeshPhysicalMaterial[];
  wheelMaterials: THREE.MeshStandardMaterial[];
  caliperMaterials: THREE.MeshStandardMaterial[];
  glassMaterials: THREE.Material[];
  exhaustPoints: THREE.Vector3[];
  wheels: THREE.Object3D[];
}

export function loadRealLamborghini(
  onProgress?: (percent: number) => void
): Promise<RealCarLoadedModel> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      '/models/aventador/aventador.gltf',
      (gltf) => {
        const car = gltf.scene;

        const bodyMaterials: THREE.MeshPhysicalMaterial[] = [];
        const mirrorMaterials: THREE.MeshPhysicalMaterial[] = [];
        const wheelMaterials: THREE.MeshStandardMaterial[] = [];
        const caliperMaterials: THREE.MeshStandardMaterial[] = [];
        const glassMaterials: THREE.Material[] = [];
        const wheels: THREE.Object3D[] = [];

        // Center and scale model properly
        const box = new THREE.Box3().setFromObject(car);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target length ~4.8 units
        const scale = 4.8 / Math.max(size.x, size.y, size.z);
        car.scale.set(scale, scale, scale);

        // Center on X and Z, place wheels directly on ground plane Y=0
        const updatedBox = new THREE.Box3().setFromObject(car);
        car.position.x = -center.x * scale;
        car.position.z = -center.z * scale;
        car.position.y = -updatedBox.min.y;

        // Traverse all meshes to enhance materials to photorealistic PBR
        car.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const mat = mesh.material as THREE.Material;

            if (mat && mat.name) {
              // 1. Car Body Paint (Mt_Body)
              if (mat.name === 'Mt_Body') {
                const physicalMat = new THREE.MeshPhysicalMaterial({
                  name: 'Mt_Body',
                  color: new THREE.Color('#eab308'),
                  metalness: 0.88,
                  roughness: 0.16,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.06,
                  reflectivity: 0.9,
                });
                mesh.material = physicalMat;
                bodyMaterials.push(physicalMat);
              }
              // 2. Mirror Covers (Mt_MirrorCover)
              else if (mat.name === 'Mt_MirrorCover') {
                const mirrorMat = new THREE.MeshPhysicalMaterial({
                  name: 'Mt_MirrorCover',
                  color: new THREE.Color('#eab308'),
                  metalness: 0.88,
                  roughness: 0.16,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.06,
                });
                mesh.material = mirrorMat;
                mirrorMaterials.push(mirrorMat);
              }
              // 3. Forged Alloy Wheels (Mt_AlloyWheels)
              else if (mat.name === 'Mt_AlloyWheels') {
                const rimMat = new THREE.MeshStandardMaterial({
                  name: 'Mt_AlloyWheels',
                  color: new THREE.Color('#d97706'),
                  metalness: 0.92,
                  roughness: 0.22,
                });
                mesh.material = rimMat;
                wheelMaterials.push(rimMat);
              }
              // 4. Brake Calipers (Mt_BrakeCaliper)
              else if (mat.name === 'Mt_BrakeCaliper') {
                const calMat = new THREE.MeshStandardMaterial({
                  name: 'Mt_BrakeCaliper',
                  color: new THREE.Color('#eab308'),
                  metalness: 0.65,
                  roughness: 0.28,
                });
                mesh.material = calMat;
                caliperMaterials.push(calMat);
              }
              // 5. Windows & Windshields
              else if (mat.name === 'Mt_Glass_Translucent' || mat.name === 'Mt_WindScreens') {
                const glassMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color('#0c1322'),
                  metalness: 0.1,
                  roughness: 0.05,
                  transmission: 0.9,
                  transparent: true,
                  opacity: 0.82,
                });
                mesh.material = glassMat;
                glassMaterials.push(glassMat);
              }
              // 6. Chrome & Exhaust Pipes
              else if (mat.name === 'Mt_Chrome') {
                const chromeMat = new THREE.MeshStandardMaterial({
                  color: new THREE.Color('#ffffff'),
                  metalness: 0.98,
                  roughness: 0.12,
                });
                mesh.material = chromeMat;
              }
              // 7. Headlight & Taillight Lenses
              else if (mat.name === 'Mt_Glass_Lens') {
                const lensMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color('#ffffff'),
                  roughness: 0.05,
                  metalness: 0.2,
                  transmission: 0.85,
                  transparent: true,
                  opacity: 0.9,
                });
                mesh.material = lensMat;
              }
            }

            // Track wheel objects for rolling animation
            if (mesh.name.toLowerCase().includes('wheel') || mesh.name.toLowerCase().includes('rim') || mesh.name.toLowerCase().includes('tyre')) {
              wheels.push(mesh);
            }
          }
        });

        // Exhaust flame emitter positions at rear of car
        const exhaustPoints = [
          new THREE.Vector3(-0.16, 0.62, -2.25),
          new THREE.Vector3(0.16, 0.62, -2.25),
        ];

        resolve({
          root: car,
          bodyMaterials,
          mirrorMaterials,
          wheelMaterials,
          caliperMaterials,
          glassMaterials,
          exhaustPoints,
          wheels,
        });
      },
      (xhr) => {
        if (xhr.lengthComputable && onProgress) {
          onProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * Apply dynamic paint & parts state to Real Lamborghini model
 */
export function updateRealCarAppearance(
  model: RealCarLoadedModel,
  color: CarColor,
  finish: PaintFinish,
  wheel: WheelConfig,
  caliper: CaliperColor,
  wireframe: boolean
) {
  const baseColor = new THREE.Color(color.hex);

  // 1. Update Body Paint
  model.bodyMaterials.forEach((mat) => {
    mat.color.copy(baseColor);
    mat.wireframe = wireframe;

    if (finish === 'metallic') {
      mat.metalness = 0.88;
      mat.roughness = 0.16;
      mat.clearcoat = 1.0;
      mat.clearcoatRoughness = 0.06;
    } else if (finish === 'matte') {
      mat.metalness = 0.25;
      mat.roughness = 0.65;
      mat.clearcoat = 0.0;
      mat.clearcoatRoughness = 0.5;
    } else if (finish === 'carbon') {
      mat.color.set('#27272a');
      mat.metalness = 0.55;
      mat.roughness = 0.38;
      mat.clearcoat = 0.7;
    }
    mat.needsUpdate = true;
  });

  // 2. Update Mirrors
  model.mirrorMaterials.forEach((mat) => {
    mat.color.copy(baseColor);
    mat.wireframe = wireframe;
    mat.needsUpdate = true;
  });

  // 3. Update Alloy Rims
  const rimColor = new THREE.Color(wheel.rimColor);
  model.wheelMaterials.forEach((mat) => {
    mat.color.copy(rimColor);
    mat.metalness = wheel.rimMetalness;
    mat.roughness = wheel.rimRoughness;
    mat.wireframe = wireframe;
    mat.needsUpdate = true;
  });

  // 4. Update Brake Calipers
  const calColor = new THREE.Color(caliper.hex);
  model.caliperMaterials.forEach((mat) => {
    mat.color.copy(calColor);
    mat.wireframe = wireframe;
    mat.needsUpdate = true;
  });
}
