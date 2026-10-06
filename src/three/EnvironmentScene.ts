import * as THREE from 'three';
import { EnvironmentTheme } from '../types/car';

export const ENVIRONMENT_THEMES: EnvironmentTheme[] = [
  {
    id: 'stealth',
    name: 'Stealth Atelier',
    bgHex: 0x070709,
    groundHex: 0x0c0c10,
    gridHex: 0x22222b,
    accentLightHex: 0xfacc15, // Lamborghini gold
    intensity: 1.2,
    fogDensity: 0.02,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bgHex: 0x050512,
    groundHex: 0x080816,
    gridHex: 0x06b6d4, // Cyan
    accentLightHex: 0xec4899, // Neon Pink
    intensity: 1.5,
    fogDensity: 0.018,
  },
  {
    id: 'monza',
    name: 'Monza Pit Lane',
    bgHex: 0x0a0c10,
    groundHex: 0x14161d,
    gridHex: 0xef4444, // Racing Red
    accentLightHex: 0xffffff,
    intensity: 1.3,
    fogDensity: 0.015,
  },
  {
    id: 'sunset',
    name: 'Tuscan Sunset',
    bgHex: 0x180b06,
    groundHex: 0x1f110a,
    gridHex: 0xf97316, // Amber sunset
    accentLightHex: 0xfbbf24,
    intensity: 1.4,
    fogDensity: 0.016,
  },
];

export interface StudioEnvironment {
  scene: THREE.Scene;
  mainLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  accentLight: THREE.PointLight;
  groundMesh: THREE.Mesh;
  gridHelper: THREE.GridHelper;
  updateTheme: (theme: EnvironmentTheme) => void;
}

export function setupEnvironment(scene: THREE.Scene): StudioEnvironment {
  // Fog
  scene.fog = new THREE.FogExp2(0x070709, 0.02);

  // Soft Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Key Studio Softbox Light
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
  mainLight.position.set(6, 12, 8);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 40;
  mainLight.shadow.camera.left = -6;
  mainLight.shadow.camera.right = 6;
  mainLight.shadow.camera.top = 6;
  mainLight.shadow.camera.bottom = -6;
  mainLight.shadow.bias = -0.0005;
  scene.add(mainLight);

  // Fill Light from opposite side
  const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
  fillLight.position.set(-8, 6, -6);
  scene.add(fillLight);

  // Dramatic Rim / Silhouette Light
  const rimLight = new THREE.DirectionalLight(0xfacc15, 2.0);
  rimLight.position.set(0, 4, -9);
  scene.add(rimLight);

  // Overhead Studio Light Panel / Softbox Rect
  const overheadLight = new THREE.DirectionalLight(0xffffff, 1.0);
  overheadLight.position.set(0, 8, 0);
  scene.add(overheadLight);

  // Colored Dynamic Accent Light
  const accentLight = new THREE.PointLight(0xfacc15, 3.0, 15, 1.5);
  accentLight.position.set(0, 0.4, 0); // Underglow
  scene.add(accentLight);

  // Ground Showroom Floor with Mirror-like contact shadow
  const groundGeom = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c10,
    roughness: 0.35,
    metalness: 0.65,
  });
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Futuristic Hexagonal/Radial Grid Floor
  const gridHelper = new THREE.GridHelper(60, 60, 0xfacc15, 0x22222b);
  gridHelper.position.y = 0.005;
  scene.add(gridHelper);

  // Decorative Showroom Light Pillars
  const pillarGeom = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
  const pillarMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const pillarPositions = [
    [-8, 4, -8],
    [8, 4, -8],
    [-8, 4, 8],
    [8, 4, 8],
  ];
  pillarPositions.forEach(([x, y, z]) => {
    const p = new THREE.Mesh(pillarGeom, pillarMat);
    p.position.set(x, y, z);
    scene.add(p);
  });

  const updateTheme = (theme: EnvironmentTheme) => {
    scene.background = new THREE.Color(theme.bgHex);
    if (scene.fog) {
      scene.fog.color = new THREE.Color(theme.bgHex);
      (scene.fog as THREE.FogExp2).density = theme.fogDensity;
    }
    groundMat.color.setHex(theme.groundHex);
    accentLight.color.setHex(theme.accentLightHex);
    rimLight.color.setHex(theme.accentLightHex);

    // Grid color update
    scene.remove(gridHelper);
    const newGrid = new THREE.GridHelper(60, 60, theme.accentLightHex, theme.gridHex);
    newGrid.position.y = 0.005;
    scene.add(newGrid);
  };

  // Set initial theme
  updateTheme(ENVIRONMENT_THEMES[0]);

  return {
    scene,
    mainLight,
    fillLight,
    rimLight,
    accentLight,
    groundMesh,
    gridHelper,
    updateTheme,
  };
}
