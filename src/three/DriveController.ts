import * as THREE from 'three';
import { DriveTelemetry } from '../types/car';
import { ModelParts } from './LamborghiniModel';

export interface DrivePhysicsController {
  update: (delta: number, camera: THREE.PerspectiveCamera, isActive: boolean) => DriveTelemetry;
  resetPosition: () => void;
  dispose: () => void;
}

export function createDriveController(parts: ModelParts): DrivePhysicsController {
  // Input tracking
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    handbrake: false,
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = true;
        break;
      case 'Space':
        keys.handbrake = true;
        break;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = false;
        break;
      case 'Space':
        keys.handbrake = false;
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Physics state
  let speed = 0; // units per second (1 unit ~= 4.5 meters)
  let maxSpeed = 35; // ~350 km/h scale
  let maxReverseSpeed = -10;
  let acceleration = 24.0;
  let braking = 32.0;
  let friction = 4.5;
  let steeringAngle = 0;
  let maxSteer = 0.55; // radians (~32 degrees)
  let steerSpeed = 2.8;

  const carPosition = parts.group.position;
  let carHeading = 0; // rotation around Y axis

  // Camera chase settings
  const idealOffset = new THREE.Vector3(0, 2.2, 5.8);
  const idealLookat = new THREE.Vector3(0, 0.8, -1.0);
  const currentCameraPos = new THREE.Vector3();
  const currentCameraLookat = new THREE.Vector3();

  const resetPosition = () => {
    speed = 0;
    carHeading = 0;
    steeringAngle = 0;
    carPosition.set(0, 0, 0);
    parts.group.rotation.set(0, 0, 0);
    parts.frontLeftWheel.rotation.y = 0;
    parts.frontRightWheel.rotation.y = 0;
  };

  const update = (delta: number, camera: THREE.PerspectiveCamera, isActive: boolean): DriveTelemetry => {
    if (!isActive) {
      return {
        speedKmh: 0,
        rpm: 850,
        gear: 'N',
        steering: 0,
        throttle: 0,
        isBraking: false,
        isDrifting: false,
      };
    }

    const dt = Math.min(delta, 0.1);

    // 1. Steering Logic
    if (keys.left) {
      steeringAngle = Math.min(steeringAngle + steerSpeed * dt, maxSteer);
    } else if (keys.right) {
      steeringAngle = Math.max(steeringAngle - steerSpeed * dt, -maxSteer);
    } else {
      // Return to center
      if (steeringAngle > 0) {
        steeringAngle = Math.max(0, steeringAngle - steerSpeed * 1.5 * dt);
      } else if (steeringAngle < 0) {
        steeringAngle = Math.min(0, steeringAngle + steerSpeed * 1.5 * dt);
      }
    }

    // Apply front wheel visual steer angle
    parts.frontLeftWheel.rotation.y = steeringAngle;
    parts.frontRightWheel.rotation.y = steeringAngle;

    // 2. Throttle & Braking
    let throttle = 0;
    let isBraking = false;

    if (keys.forward) {
      throttle = 1.0;
      if (speed < 0) {
        // Braking while in reverse
        speed += braking * dt;
        isBraking = true;
      } else {
        speed = Math.min(maxSpeed, speed + acceleration * dt);
      }
    } else if (keys.backward) {
      throttle = -0.6;
      if (speed > 0) {
        // Braking while moving forward
        speed = Math.max(0, speed - braking * dt);
        isBraking = true;
      } else {
        speed = Math.max(maxReverseSpeed, speed - acceleration * 0.5 * dt);
      }
    } else {
      // Natural friction / rolling resistance
      if (speed > 0) {
        speed = Math.max(0, speed - friction * dt);
      } else if (speed < 0) {
        speed = Math.min(0, speed + friction * dt);
      }
    }

    // Handbrake
    const isDrifting = keys.handbrake && Math.abs(speed) > 4;
    if (keys.handbrake) {
      isBraking = true;
      speed *= 0.96;
    }

    // 3. Movement & Heading
    // Turn radius is proportional to speed and steering angle
    const turnFactor = (speed / maxSpeed) * (isDrifting ? 1.8 : 1.0);
    carHeading += steeringAngle * turnFactor * 3.5 * dt;

    parts.group.rotation.y = carHeading;

    // Move forward along car's forward vector (Z is backwards in Three.js, so -Z is forward)
    const forwardVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), carHeading);
    carPosition.addScaledVector(forwardVec, speed * dt);

    // 4. Wheel Roll Animation
    const wheelRotSpeed = (speed / 0.4) * dt;
    parts.wheelGroups.forEach((w) => {
      // Spin the wheel meshes around their local X axis
      w.children[0].rotation.x += wheelRotSpeed;
    });

    // 5. Dynamic Third-Person Chase Camera
    const rotatedOffset = idealOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carHeading);
    const targetCameraPos = carPosition.clone().add(rotatedOffset);

    const rotatedLookat = idealLookat.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carHeading);
    const targetCameraLookat = carPosition.clone().add(rotatedLookat);

    // Smooth lerp
    currentCameraPos.lerp(targetCameraPos, 0.12);
    currentCameraLookat.lerp(targetCameraLookat, 0.15);

    camera.position.copy(currentCameraPos);
    camera.lookAt(currentCameraLookat);

    // 6. Telemetry calculations
    const speedKmh = Math.round(Math.abs(speed) * 10.2); // Scaled to ~350 km/h top

    // Virtual 8-Speed DCT Gearbox simulation
    let gear = '1';
    let gearRatioRpm = 1000;
    if (speed < -0.1) {
      gear = 'R';
      gearRatioRpm = 1200 + Math.abs(speedKmh) * 120;
    } else if (speedKmh < 1) {
      gear = '1';
      gearRatioRpm = 850;
    } else if (speedKmh < 55) {
      gear = '1';
      gearRatioRpm = 1500 + (speedKmh / 55) * 7500;
    } else if (speedKmh < 105) {
      gear = '2';
      gearRatioRpm = 4000 + ((speedKmh - 55) / 50) * 5200;
    } else if (speedKmh < 160) {
      gear = '3';
      gearRatioRpm = 4500 + ((speedKmh - 105) / 55) * 4800;
    } else if (speedKmh < 220) {
      gear = '4';
      gearRatioRpm = 5000 + ((speedKmh - 160) / 60) * 4400;
    } else if (speedKmh < 275) {
      gear = '5';
      gearRatioRpm = 5500 + ((speedKmh - 220) / 55) * 4000;
    } else if (speedKmh < 320) {
      gear = '6';
      gearRatioRpm = 6000 + ((speedKmh - 275) / 45) * 3500;
    } else {
      gear = '7';
      gearRatioRpm = 6800 + ((speedKmh - 320) / 40) * 2700;
    }

    const calculatedRpm = Math.min(9500, Math.max(850, Math.round(gearRatioRpm)));

    return {
      speedKmh,
      rpm: calculatedRpm,
      gear,
      steering: steeringAngle / maxSteer,
      throttle,
      isBraking,
      isDrifting,
    };
  };

  const dispose = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };

  return {
    update,
    resetPosition,
    dispose,
  };
}
