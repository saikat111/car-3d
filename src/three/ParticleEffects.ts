import * as THREE from 'three';

export interface ParticleSystemManager {
  update: (delta: number, isRevving: boolean, isDrifting: boolean, carPos: THREE.Vector3, carRotationY: number) => void;
  triggerBackfireFlame: () => void;
  setWindTunnelActive: (active: boolean) => void;
  dispose: () => void;
}

export function createParticleEffects(
  scene: THREE.Scene,
  exhaustPoints: THREE.Vector3[]
): ParticleSystemManager {
  // ==========================================
  // 1. EXHAUST FLAME CONES & GLOW
  // ==========================================
  const flameGroup = new THREE.Group();
  scene.add(flameGroup);

  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, // Hot blue/cyan core
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  const flameOuterMaterial = new THREE.MeshBasicMaterial({
    color: 0xf97316, // Orange/Yellow tip
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  const flameMeshes: { inner: THREE.Mesh; outer: THREE.Mesh; point: THREE.Vector3 }[] = [];

  exhaustPoints.forEach((pt) => {
    // Inner cyan flame cone
    const innerGeom = new THREE.ConeGeometry(0.06, 0.45, 12);
    innerGeom.rotateX(-Math.PI / 2);
    const inner = new THREE.Mesh(innerGeom, flameMaterial);
    inner.position.copy(pt);
    flameGroup.add(inner);

    // Outer orange flame cone
    const outerGeom = new THREE.ConeGeometry(0.1, 0.7, 12);
    outerGeom.rotateX(-Math.PI / 2);
    const outer = new THREE.Mesh(outerGeom, flameOuterMaterial);
    outer.position.copy(pt);
    flameGroup.add(outer);

    flameMeshes.push({ inner, outer, point: pt });
  });

  let backfireTimer = 0;

  // ==========================================
  // 2. TIRE BURNOUT SMOKE PARTICLES
  // ==========================================
  const SMOKE_COUNT = 120;
  const smokeGeom = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(SMOKE_COUNT * 3);
  const smokeOpacities = new Float32Array(SMOKE_COUNT);
  const smokeSizes = new Float32Array(SMOKE_COUNT);
  const smokeVelocities: THREE.Vector3[] = [];

  for (let i = 0; i < SMOKE_COUNT; i++) {
    smokePositions[i * 3 + 0] = 0;
    smokePositions[i * 3 + 1] = -100; // Hidden initially
    smokePositions[i * 3 + 2] = 0;
    smokeOpacities[i] = 0;
    smokeSizes[i] = 0.4;
    smokeVelocities.push(new THREE.Vector3());
  }

  smokeGeom.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

  // Procedural soft particle circular texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const pctx = particleCanvas.getContext('2d');
  if (pctx) {
    const radGrad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radGrad.addColorStop(0.5, 'rgba(200, 200, 210, 0.4)');
    radGrad.addColorStop(1, 'rgba(200, 200, 210, 0)');
    pctx.fillStyle = radGrad;
    pctx.fillRect(0, 0, 32, 32);
  }
  const particleTex = new THREE.CanvasTexture(particleCanvas);

  const smokeMat = new THREE.PointsMaterial({
    size: 0.8,
    map: particleTex,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.NormalBlending,
    color: 0x94a3b8,
  });

  const smokePoints = new THREE.Points(smokeGeom, smokeMat);
  scene.add(smokePoints);

  let nextSmokeIdx = 0;

  // ==========================================
  // 3. AERODYNAMIC WIND TUNNEL STREAMLINES
  // ==========================================
  const STREAM_COUNT = 240;
  const streamGeom = new THREE.BufferGeometry();
  const streamPositions = new Float32Array(STREAM_COUNT * 3);
  const streamInitPos: { x: number; y: number; z: number; speed: number }[] = [];

  for (let i = 0; i < STREAM_COUNT; i++) {
    const x = (Math.random() - 0.5) * 2.2;
    const y = 0.2 + Math.random() * 1.2;
    const z = 4.0 + Math.random() * 2.0;
    const speed = 7.0 + Math.random() * 5.0;

    streamPositions[i * 3 + 0] = x;
    streamPositions[i * 3 + 1] = y;
    streamPositions[i * 3 + 2] = z;

    streamInitPos.push({ x, y, z, speed });
  }

  streamGeom.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));

  const streamMat = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });

  const streamPoints = new THREE.Points(streamGeom, streamMat);
  scene.add(streamPoints);

  let isWindTunnelActive = false;

  const triggerBackfireFlame = () => {
    backfireTimer = 0.18; // Short burst
  };

  const setWindTunnelActive = (active: boolean) => {
    isWindTunnelActive = active;
    streamMat.opacity = active ? 0.75 : 0.0;
  };

  const update = (
    delta: number,
    isRevving: boolean,
    isDrifting: boolean,
    carPos: THREE.Vector3,
    carRotationY: number
  ) => {
    // 1. Update Exhaust Flames
    if (backfireTimer > 0) {
      backfireTimer -= delta;
      const flicker = 0.7 + Math.random() * 0.6;
      flameMaterial.opacity = 0.95;
      flameOuterMaterial.opacity = 0.85;

      flameMeshes.forEach(({ inner, outer, point }) => {
        // Position relative to car world transform
        const rotatedPt = point.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotationY).add(carPos);
        inner.position.copy(rotatedPt);
        outer.position.copy(rotatedPt);
        inner.rotation.y = carRotationY;
        outer.rotation.y = carRotationY;

        inner.scale.set(flicker, flicker, flicker * 1.5);
        outer.scale.set(flicker * 1.2, flicker * 1.2, flicker * 2.0);
      });
    } else if (isRevving) {
      // High RPM blue glow
      const flicker = 0.5 + Math.random() * 0.4;
      flameMaterial.opacity = 0.6;
      flameOuterMaterial.opacity = 0.4;

      flameMeshes.forEach(({ inner, outer, point }) => {
        const rotatedPt = point.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotationY).add(carPos);
        inner.position.copy(rotatedPt);
        outer.position.copy(rotatedPt);
        inner.rotation.y = carRotationY;
        outer.rotation.y = carRotationY;

        inner.scale.set(flicker * 0.8, flicker * 0.8, flicker * 1.1);
        outer.scale.set(flicker * 0.9, flicker * 0.9, flicker * 1.3);
      });
    } else {
      flameMaterial.opacity = 0;
      flameOuterMaterial.opacity = 0;
    }

    // 2. Update Tire Smoke (during drift or high acceleration)
    if (isDrifting) {
      // Spawn smoke at rear wheels
      for (let s = 0; s < 2; s++) {
        const idx = nextSmokeIdx;
        nextSmokeIdx = (nextSmokeIdx + 1) % SMOKE_COUNT;

        const side = s === 0 ? -1.0 : 1.0;
        const wheelLocal = new THREE.Vector3(side, 0.2, -1.35);
        const spawnPos = wheelLocal.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotationY).add(carPos);

        smokePositions[idx * 3 + 0] = spawnPos.x + (Math.random() - 0.5) * 0.2;
        smokePositions[idx * 3 + 1] = spawnPos.y + Math.random() * 0.1;
        smokePositions[idx * 3 + 2] = spawnPos.z + (Math.random() - 0.5) * 0.2;

        smokeVelocities[idx].set(
          (Math.random() - 0.5) * 0.8,
          0.8 + Math.random() * 0.8,
          (Math.random() - 0.5) * 0.8
        );
      }
    }

    // Animate active smoke particles
    for (let i = 0; i < SMOKE_COUNT; i++) {
      if (smokePositions[i * 3 + 1] > -50) {
        smokePositions[i * 3 + 0] += smokeVelocities[i].x * delta;
        smokePositions[i * 3 + 1] += smokeVelocities[i].y * delta;
        smokePositions[i * 3 + 2] += smokeVelocities[i].z * delta;

        // Despawn once too high
        if (smokePositions[i * 3 + 1] > 2.5) {
          smokePositions[i * 3 + 1] = -100;
        }
      }
    }
    smokeGeom.attributes.position.needsUpdate = true;

    // 3. Update Wind Tunnel Streamlines
    if (isWindTunnelActive) {
      for (let i = 0; i < STREAM_COUNT; i++) {
        streamPositions[i * 3 + 2] -= streamInitPos[i].speed * delta;

        // Reset if behind car
        if (streamPositions[i * 3 + 2] < -4.5) {
          streamPositions[i * 3 + 2] = 4.0;
        }

        // Curve streamline over car roof geometry
        const z = streamPositions[i * 3 + 2];
        if (z > 0 && z < 2.0) {
          // Hood curve
          streamPositions[i * 3 + 1] = THREE.MathUtils.lerp(0.4, 1.1, (2.0 - z) / 2.0);
        } else if (z <= 0 && z > -1.5) {
          // Roof
          streamPositions[i * 3 + 1] = 1.15;
        } else if (z <= -1.5) {
          // Down diffuser
          streamPositions[i * 3 + 1] = THREE.MathUtils.lerp(1.15, 0.4, (-1.5 - z) / 2.5);
        }
      }
      streamGeom.attributes.position.needsUpdate = true;
    }
  };

  const dispose = () => {
    scene.remove(flameGroup);
    scene.remove(smokePoints);
    scene.remove(streamPoints);
  };

  return {
    update,
    triggerBackfireFlame,
    setWindTunnelActive,
    dispose,
  };
}
