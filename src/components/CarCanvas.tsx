import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CarState,
  DriveTelemetry,
  HotspotInfo,
  CameraPreset,
} from '../types/car';
import {
  createLamborghiniModel,
  updateCarAppearance,
  ModelParts,
} from '../three/LamborghiniModel';
import {
  loadRealLamborghini,
  updateRealCarAppearance,
  RealCarLoadedModel,
} from '../three/RealLamborghiniLoader';
import {
  setupEnvironment,
  StudioEnvironment,
} from '../three/EnvironmentScene';
import {
  createParticleEffects,
  ParticleSystemManager,
} from '../three/ParticleEffects';
import {
  createDriveController,
  DrivePhysicsController,
} from '../three/DriveController';
import { soundEngine } from '../sound/engineAudio';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface CarCanvasProps {
  carState: CarState;
  onUpdateTelemetry: (telemetry: DriveTelemetry) => void;
  onSelectHotspot: (hotspot: HotspotInfo | null) => void;
}

import { HOTSPOTS } from '../data/hotspots';

const CAMERA_TARGETS: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  hero: {
    pos: new THREE.Vector3(4.5, 2.0, 5.0),
    target: new THREE.Vector3(0, 0.5, 0),
  },
  front: {
    pos: new THREE.Vector3(0, 1.1, 4.8),
    target: new THREE.Vector3(0, 0.45, 1.5),
  },
  profile: {
    pos: new THREE.Vector3(-5.8, 1.4, 0),
    target: new THREE.Vector3(0, 0.5, 0),
  },
  rear: {
    pos: new THREE.Vector3(0, 1.3, -4.8),
    target: new THREE.Vector3(0, 0.55, -1.6),
  },
  cockpit: {
    pos: new THREE.Vector3(-0.35, 1.05, 0.1),
    target: new THREE.Vector3(-0.35, 0.7, 1.4),
  },
  top: {
    pos: new THREE.Vector3(0, 7.2, 0.01),
    target: new THREE.Vector3(0, 0, 0),
  },
};

export const CarCanvas: React.FC<CarCanvasProps> = ({
  carState,
  onUpdateTelemetry,
  onSelectHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partsRef = useRef<ModelParts | null>(null);
  const realCarRef = useRef<RealCarLoadedModel | null>(null);
  const envRef = useRef<StudioEnvironment | null>(null);
  const particlesRef = useRef<ParticleSystemManager | null>(null);
  const driveRef = useRef<DrivePhysicsController | null>(null);

  // Loading indicator states for the real car model
  const [isLoadingRealModel, setIsLoadingRealModel] = useState<boolean>(true);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [realModelReady, setRealModelReady] = useState<boolean>(false);

  // Animation values for smooth mechanical parts
  const animStates = useRef({
    doorAngle: 0,
    targetDoorAngle: 0,
    spoilerY: 0,
    targetSpoilerY: 0,
    engineCoverAngle: 0,
    targetEngineCoverAngle: 0,
    cameraPos: new THREE.Vector3(4.5, 2.0, 5.0),
    cameraTarget: new THREE.Vector3(0, 0.5, 0),
  });

  // State refs to read in animation loop without tearing
  const stateRef = useRef(carState);
  stateRef.current = carState;

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 2.0, 5.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Studio Mode)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go through floor
    controls.minDistance = 1.2;
    controls.maxDistance = 14.0;
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    let isInteracting = false;
    controls.addEventListener('start', () => {
      isInteracting = true;
    });
    controls.addEventListener('end', () => {
      isInteracting = false;
    });

    // 5. Studio Environment
    const env = setupEnvironment(scene);
    envRef.current = env;

    // 6. Build Initial/Drive Model
    const parts = createLamborghiniModel();
    scene.add(parts.group);
    partsRef.current = parts;

    // 7. Particle Effects
    const particles = createParticleEffects(scene, parts.exhaustFlameEmitters);
    particlesRef.current = particles;

    // 8. Drive Physics Controller
    const drive = createDriveController(parts);
    driveRef.current = drive;

    // 9. Load REAL 3D Lamborghini Model
    loadRealLamborghini((percent) => {
      setLoadPercent(percent);
    })
      .then((realCar) => {
        // Real model loaded successfully!
        scene.remove(parts.group);
        scene.add(realCar.root);
        realCarRef.current = realCar;

        // Apply active color and options to real car
        updateRealCarAppearance(
          realCar,
          stateRef.current.color,
          stateRef.current.finish,
          stateRef.current.wheel,
          stateRef.current.caliper,
          stateRef.current.wireframeActive
        );

        setIsLoadingRealModel(false);
        setRealModelReady(true);
      })
      .catch((err) => {
        console.warn('Real model loading notice, using fallback:', err);
        setIsLoadingRealModel(false);
      });

    // Clock
    const clock = new THREE.Clock();

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const current = stateRef.current;

      // Update mechanical door animation
      const targetDoor = current.doorsOpen ? 1.0 : 0.0;
      animStates.current.doorAngle += (targetDoor - animStates.current.doorAngle) * 0.08;
      const dAngle = animStates.current.doorAngle;
      parts.leftDoorPivot.rotation.z = -dAngle * 1.05;
      parts.leftDoorPivot.rotation.y = dAngle * 0.25;
      parts.rightDoorPivot.rotation.z = dAngle * 1.05;
      parts.rightDoorPivot.rotation.y = -dAngle * 0.25;

      // Update Active Spoiler animation
      const targetSpoiler = current.spoilerDeployed ? 1.0 : 0.0;
      animStates.current.spoilerY += (targetSpoiler - animStates.current.spoilerY) * 0.08;
      const sY = animStates.current.spoilerY;
      parts.spoilerPivot.position.y = 0.76 + sY * 0.22;
      parts.spoilerPivot.rotation.x = -sY * 0.28;

      // Update Glass Engine Cover Bonnet
      const targetBonnet = current.engineCoverOpen ? 1.0 : 0.0;
      animStates.current.engineCoverAngle += (targetBonnet - animStates.current.engineCoverAngle) * 0.08;
      parts.engineCoverPivot.rotation.x = -animStates.current.engineCoverAngle * 0.85;

      // Headlight & Taillight glow
      const headIntensity = current.headlightsOn ? 3.8 : 0.2;
      parts.headlightLeds.forEach((led) => {
        (led.material as THREE.MeshStandardMaterial).emissiveIntensity = headIntensity;
      });
      parts.headlightLights.forEach((light) => {
        light.intensity = current.headlightsOn ? 5.0 : 0;
      });
      const tailIntensity = current.headlightsOn ? 3.0 : 0.8;
      parts.taillightLeds.forEach((led) => {
        (led.material as THREE.MeshStandardMaterial).emissiveIntensity = tailIntensity;
      });

      // Synchronize Real Car transform in Drive Mode
      if (realCarRef.current) {
        realCarRef.current.root.position.copy(parts.group.position);
        realCarRef.current.root.rotation.copy(parts.group.rotation);
      }

      if (current.mode === 'drive') {
        // Drive mode active
        controls.enabled = false;
        const telemetry = drive.update(delta, camera, true);
        onUpdateTelemetry(telemetry);

        if (current.isEngineRunning) {
          soundEngine.setRpm(telemetry.rpm);
        }

        if (telemetry.throttle < 0 && telemetry.speedKmh > 50 && Math.random() < 0.08) {
          particles.triggerBackfireFlame();
        }

        particles.update(
          delta,
          current.isRevving,
          telemetry.isDrifting || telemetry.isBraking,
          parts.group.position,
          parts.group.rotation.y
        );
      } else {
        // Studio mode active
        controls.enabled = true;

        const presetTarget = CAMERA_TARGETS[current.cameraPreset] || CAMERA_TARGETS.hero;
        animStates.current.cameraPos.lerp(presetTarget.pos, 0.05);
        animStates.current.cameraTarget.lerp(presetTarget.target, 0.05);

        if (!isInteracting) {
          camera.position.lerp(animStates.current.cameraPos, 0.035);
          controls.target.lerp(animStates.current.cameraTarget, 0.035);
        }

        controls.update();

        particles.update(
          delta,
          current.isRevving,
          false,
          parts.group.position,
          parts.group.rotation.y
        );

        onUpdateTelemetry({
          speedKmh: 0,
          rpm: soundEngine.getRpm(),
          gear: current.isEngineRunning ? '1' : 'P',
          steering: 0,
          throttle: current.isRevving ? 1 : 0,
          isBraking: false,
          isDrifting: false,
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      particles.dispose();
      drive.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Appearance when state changes
  useEffect(() => {
    // Update procedural model
    if (partsRef.current) {
      updateCarAppearance(
        partsRef.current,
        carState.color,
        carState.finish,
        carState.wheel,
        carState.caliper,
        carState.wireframeActive
      );
    }
    // Update REAL 3D model
    if (realCarRef.current) {
      updateRealCarAppearance(
        realCarRef.current,
        carState.color,
        carState.finish,
        carState.wheel,
        carState.caliper,
        carState.wireframeActive
      );
    }
  }, [
    carState.color,
    carState.finish,
    carState.wheel,
    carState.caliper,
    carState.wireframeActive,
  ]);

  // Update Environment Theme
  useEffect(() => {
    if (envRef.current) {
      envRef.current.updateTheme(carState.envTheme);
    }
  }, [carState.envTheme]);

  // Update Wind Tunnel active state
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.setWindTunnelActive(carState.windTunnelActive);
    }
  }, [carState.windTunnelActive]);

  // Reset car position if switching from drive mode back to studio
  useEffect(() => {
    if (carState.mode === 'studio' && driveRef.current && partsRef.current) {
      driveRef.current.resetPosition();
      if (realCarRef.current) {
        realCarRef.current.root.position.set(0, 0, 0);
        realCarRef.current.root.rotation.set(0, 0, 0);
      }
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0.5, 0);
      }
    }
  }, [carState.mode]);

  // Handle Hotspot Click
  const handleHotspotClick = useCallback((hotspot: HotspotInfo) => {
    soundEngine.playUiClick();
    onSelectHotspot(hotspot);
  }, [onSelectHotspot]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Real Model Status Badge */}
      <div className="absolute top-20 left-4 md:left-8 z-30 pointer-events-none">
        {isLoadingRealModel ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-yellow-500/30 text-yellow-400 text-xs font-tech backdrop-blur-md shadow-lg animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>LOADING REAL LAMBORGHINI 3D ASSETS ({loadPercent}%)</span>
          </div>
        ) : realModelReady ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-emerald-500/30 text-emerald-400 text-xs font-tech backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">AUTHENTIC 3D LAMBORGHINI AVENTADOR ACTIVE</span>
          </div>
        ) : null}
      </div>

      {/* Interactive 3D Hotspot Tags (Studio Mode Only) */}
      {carState.mode === 'studio' && !carState.windTunnelActive && (
        <div className="absolute inset-0 pointer-events-none">
          {HOTSPOTS.map((h, i) => (
            <button
              key={h.id}
              onClick={() => handleHotspotClick(h)}
              className="pointer-events-auto absolute group transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 focus:outline-none"
              style={{
                left: i === 0 ? '38%' : i === 1 ? '50%' : i === 2 ? '62%' : '30%',
                top: i === 0 ? '45%' : i === 1 ? '38%' : i === 2 ? '52%' : '65%',
              }}
              title={h.title}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-yellow-500/30 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/40 text-yellow-400 text-[10px] font-bold font-tech">
                  0{i + 1}
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[11px] font-tech uppercase tracking-wider px-2 py-1 rounded border border-yellow-500/40 whitespace-nowrap shadow-xl">
                {h.title}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
