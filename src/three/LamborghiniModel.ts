import * as THREE from 'three';
import { CarColor, CaliperColor, PaintFinish, WheelConfig } from '../types/car';

export interface ModelParts {
  group: THREE.Group;
  bodyMeshes: THREE.Mesh[];
  carbonMeshes: THREE.Mesh[];
  glassMeshes: THREE.Mesh[];
  wheelGroups: THREE.Group[];
  frontLeftWheel: THREE.Group;
  frontRightWheel: THREE.Group;
  rearLeftWheel: THREE.Group;
  rearRightWheel: THREE.Group;
  rimMeshes: THREE.Mesh[];
  caliperMeshes: THREE.Mesh[];
  headlightLeds: THREE.Mesh[];
  headlightLights: THREE.SpotLight[];
  taillightLeds: THREE.Mesh[];
  leftDoorPivot: THREE.Group;
  rightDoorPivot: THREE.Group;
  spoilerPivot: THREE.Group;
  engineCoverPivot: THREE.Group;
  exhaustPipes: THREE.Mesh[];
  exhaustFlameEmitters: THREE.Vector3[];
}

export function createLamborghiniModel(): ModelParts {
  const group = new THREE.Group();
  group.name = 'Lamborghini_Revuelto';

  const bodyMeshes: THREE.Mesh[] = [];
  const carbonMeshes: THREE.Mesh[] = [];
  const glassMeshes: THREE.Mesh[] = [];
  const rimMeshes: THREE.Mesh[] = [];
  const caliperMeshes: THREE.Mesh[] = [];
  const headlightLeds: THREE.Mesh[] = [];
  const headlightLights: THREE.SpotLight[] = [];
  const taillightLeds: THREE.Mesh[] = [];
  const exhaustPipes: THREE.Mesh[] = [];

  // ==========================================
  // PROCEDURAL TEXTURES (Carbon Fiber & Grille)
  // ==========================================
  const carbonCanvas = document.createElement('canvas');
  carbonCanvas.width = 128;
  carbonCanvas.height = 128;
  const cctx = carbonCanvas.getContext('2d');
  if (cctx) {
    cctx.fillStyle = '#141416';
    cctx.fillRect(0, 0, 128, 128);
    cctx.fillStyle = '#222226';
    for (let x = 0; x < 128; x += 8) {
      for (let y = 0; y < 128; y += 8) {
        if ((x / 8 + y / 8) % 2 === 0) {
          cctx.fillRect(x, y, 8, 8);
        }
      }
    }
  }
  const carbonTexture = new THREE.CanvasTexture(carbonCanvas);
  carbonTexture.wrapS = THREE.RepeatWrapping;
  carbonTexture.wrapT = THREE.RepeatWrapping;
  carbonTexture.repeat.set(16, 16);

  // Honeycomb Grille Texture
  const grilleCanvas = document.createElement('canvas');
  grilleCanvas.width = 64;
  grilleCanvas.height = 64;
  const gctx = grilleCanvas.getContext('2d');
  if (gctx) {
    gctx.fillStyle = '#0a0a0c';
    gctx.fillRect(0, 0, 64, 64);
    gctx.strokeStyle = '#282830';
    gctx.lineWidth = 2;
    gctx.strokeRect(4, 4, 24, 24);
    gctx.strokeRect(36, 36, 24, 24);
  }
  const grilleTexture = new THREE.CanvasTexture(grilleCanvas);
  grilleTexture.wrapS = THREE.RepeatWrapping;
  grilleTexture.wrapT = THREE.RepeatWrapping;
  grilleTexture.repeat.set(8, 4);

  // Tire Tread Texture
  const tireCanvas = document.createElement('canvas');
  tireCanvas.width = 128;
  tireCanvas.height = 128;
  const tctx = tireCanvas.getContext('2d');
  if (tctx) {
    tctx.fillStyle = '#1c1c1f';
    tctx.fillRect(0, 0, 128, 128);
    tctx.fillStyle = '#0f0f11';
    for (let i = 0; i < 128; i += 16) {
      tctx.fillRect(i, 0, 8, 128);
    }
  }
  const tireTexture = new THREE.CanvasTexture(tireCanvas);
  tireTexture.wrapS = THREE.RepeatWrapping;
  tireTexture.wrapT = THREE.RepeatWrapping;
  tireTexture.repeat.set(12, 1);

  // ==========================================
  // SHARED MATERIALS
  // ==========================================
  // Primary Car Body Material (Giallo Auge Default)
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#eab308'),
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
  });

  // Carbon Fiber Material
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#16161a'),
    roughness: 0.35,
    metalness: 0.45,
    map: carbonTexture,
  });

  // Gloss Black Trim
  const glossBlackMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0c0c0e'),
    roughness: 0.15,
    metalness: 0.8,
  });

  // Grille Mesh Material
  const grilleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#08080a'),
    roughness: 0.8,
    metalness: 0.2,
    map: grilleTexture,
  });

  // Dark Tinted Glass
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0f172a'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.5,
    transparent: true,
    opacity: 0.85,
  });

  // Headlight LED Material (Glowing White/Ice-Cyan)
  const headlightLedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    emissive: new THREE.Color('#e0f2fe'),
    emissiveIntensity: 3.5,
    roughness: 0.1,
  });

  // Taillight LED Material (Glowing Ruby Red)
  const taillightLedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ef4444'),
    emissive: new THREE.Color('#dc2626'),
    emissiveIntensity: 3.0,
    roughness: 0.2,
  });

  // Titanium Exhaust Material
  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#64748b'),
    metalness: 0.95,
    roughness: 0.25,
  });

  // Wheel Rim Material (Default Bronze Forged)
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d97706'),
    metalness: 0.92,
    roughness: 0.22,
  });

  // Brake Caliper Material (Default Giallo Yellow)
  const caliperMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#eab308'),
    metalness: 0.6,
    roughness: 0.3,
  });

  // Brake Disc Material
  const brakeDiscMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#94a3b8'),
    metalness: 0.9,
    roughness: 0.35,
  });

  // Tire Rubber Material
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#18181b'),
    roughness: 0.85,
    metalness: 0.08,
    map: tireTexture,
  });

  // Interior Alcantara Material
  const interiorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#18181b'),
    roughness: 0.9,
    metalness: 0.05,
  });

  // ==========================================
  // 1. CHASSIS / UNDERBODY PLATFORM
  // ==========================================
  const chassisGeom = new THREE.BoxGeometry(1.9, 0.12, 4.4);
  const chassis = new THREE.Mesh(chassisGeom, carbonMaterial);
  chassis.position.y = 0.24;
  chassis.castShadow = true;
  group.add(chassis);
  carbonMeshes.push(chassis);

  // ==========================================
  // 2. MAIN SCULPTED CAR BODY
  // ==========================================
  // Lower Main Hull
  const hullGeom = new THREE.BoxGeometry(1.95, 0.38, 3.8);
  const hull = new THREE.Mesh(hullGeom, bodyMaterial);
  hull.position.set(0, 0.44, 0.05);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);
  bodyMeshes.push(hull);

  // Front Hood Wedge (Sloping forward aggressively)
  const hoodShape = new THREE.Shape();
  hoodShape.moveTo(-0.95, 0);
  hoodShape.lineTo(0.95, 0);
  hoodShape.lineTo(0.82, -1.5);
  hoodShape.lineTo(-0.82, -1.5);
  hoodShape.closePath();

  const hoodExtrudeSettings = { depth: 0.22, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
  const hoodGeom = new THREE.ExtrudeGeometry(hoodShape, hoodExtrudeSettings);
  const hood = new THREE.Mesh(hoodGeom, bodyMaterial);
  hood.rotation.x = Math.PI / 2 + 0.14;
  hood.position.set(0, 0.46, 0.72);
  hood.castShadow = true;
  group.add(hood);
  bodyMeshes.push(hood);

  // Front Aerodynamic Hood Air Nostrils (Recessed carbon channels)
  const nostrilLGeom = new THREE.BoxGeometry(0.24, 0.04, 0.65);
  const nostrilL = new THREE.Mesh(nostrilLGeom, carbonMaterial);
  nostrilL.rotation.x = 0.14;
  nostrilL.position.set(-0.35, 0.58, 1.35);
  group.add(nostrilL);
  carbonMeshes.push(nostrilL);

  const nostrilR = nostrilL.clone();
  nostrilR.position.x = 0.35;
  group.add(nostrilR);
  carbonMeshes.push(nostrilR);

  // Front Nose Cone & Lamborghini Hexagonal Shield Badge
  const noseGeom = new THREE.CylinderGeometry(0.04, 0.88, 0.28, 6);
  const nose = new THREE.Mesh(noseGeom, bodyMaterial);
  nose.rotation.z = Math.PI / 2;
  nose.position.set(0, 0.36, 2.18);
  nose.castShadow = true;
  group.add(nose);
  bodyMeshes.push(nose);

  // Gold Hexagon Shield Logo
  const badgeGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.015, 6);
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.95, roughness: 0.1 });
  const badge = new THREE.Mesh(badgeGeom, badgeMat);
  badge.rotation.x = Math.PI / 3;
  badge.position.set(0, 0.49, 1.95);
  group.add(badge);

  // Front Splitter (Carbon Fiber Aerodynamic Ground-Effects Wing)
  const splitterGeom = new THREE.BoxGeometry(2.08, 0.04, 0.7);
  const splitter = new THREE.Mesh(splitterGeom, carbonMaterial);
  splitter.position.set(0, 0.16, 2.05);
  splitter.castShadow = true;
  group.add(splitter);
  carbonMeshes.push(splitter);

  // Splitter Aerodynamic Side Canards / Dive Planes
  const canardLGeom = new THREE.BoxGeometry(0.04, 0.16, 0.28);
  const canardL = new THREE.Mesh(canardLGeom, carbonMaterial);
  canardL.position.set(-1.05, 0.24, 2.15);
  canardL.rotation.y = 0.2;
  group.add(canardL);
  carbonMeshes.push(canardL);

  const canardR = canardL.clone();
  canardR.position.x = 1.05;
  canardR.rotation.y = -0.2;
  group.add(canardR);
  carbonMeshes.push(canardR);

  // Front Air Intake Hexagonal Mesh Grilles
  const grilleLGeom = new THREE.BoxGeometry(0.55, 0.22, 0.08);
  const grilleL = new THREE.Mesh(grilleLGeom, grilleMaterial);
  grilleL.position.set(-0.52, 0.32, 2.12);
  group.add(grilleL);

  const grilleR = grilleL.clone();
  grilleR.position.x = 0.52;
  group.add(grilleR);

  // ==========================================
  // 3. SIGNATURE Y-SHAPED HEADLIGHTS (REVUELTO DNA)
  // ==========================================
  function createYLight(isRight: boolean): THREE.Group {
    const yGroup = new THREE.Group();
    const sign = isRight ? 1 : -1;

    // Stem of the Y
    const stemGeom = new THREE.BoxGeometry(0.04, 0.03, 0.35);
    const stem = new THREE.Mesh(stemGeom, headlightLedMaterial);
    stem.position.set(0, 0, 0);
    yGroup.add(stem);
    headlightLeds.push(stem);

    // Upper branch of the Y
    const branch1Geom = new THREE.BoxGeometry(0.04, 0.03, 0.32);
    const branch1 = new THREE.Mesh(branch1Geom, headlightLedMaterial);
    branch1.position.set(sign * 0.1, 0.03, -0.24);
    branch1.rotation.y = sign * 0.65;
    branch1.rotation.x = 0.1;
    yGroup.add(branch1);
    headlightLeds.push(branch1);

    // Lower branch of the Y
    const branch2Geom = new THREE.BoxGeometry(0.04, 0.03, 0.28);
    const branch2 = new THREE.Mesh(branch2Geom, headlightLedMaterial);
    branch2.position.set(sign * 0.09, -0.04, -0.22);
    branch2.rotation.y = sign * 0.45;
    branch2.rotation.x = -0.15;
    yGroup.add(branch2);
    headlightLeds.push(branch2);

    // Main projection lens housing
    const projGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12);
    const proj = new THREE.Mesh(projGeom, headlightLedMaterial);
    proj.rotation.x = Math.PI / 2;
    proj.position.set(sign * 0.02, 0.02, 0.16);
    yGroup.add(proj);
    headlightLeds.push(proj);

    // Projector Spotlight
    const spot = new THREE.SpotLight(0xe0f2fe, 5.0, 25, Math.PI / 6, 0.4, 1.2);
    spot.position.set(0, 0, 0.2);
    spot.target.position.set(sign * 0.4, -0.4, 8);
    yGroup.add(spot);
    yGroup.add(spot.target);
    headlightLights.push(spot);

    return yGroup;
  }

  const yLightL = createYLight(false);
  yLightL.position.set(-0.76, 0.42, 1.84);
  yLightL.rotation.y = -0.22;
  yLightL.rotation.z = -0.05;
  group.add(yLightL);

  const yLightR = createYLight(true);
  yLightR.position.set(0.76, 0.42, 1.84);
  yLightR.rotation.y = 0.22;
  yLightR.rotation.z = 0.05;
  group.add(yLightR);

  // ==========================================
  // 4. CABIN GREENHOUSE, ROOF & TINTED GLASS
  // ==========================================
  // Cockpit Roof
  const roofGeom = new THREE.BoxGeometry(1.24, 0.05, 1.45);
  const roof = new THREE.Mesh(roofGeom, carbonMaterial);
  roof.position.set(0, 1.08, -0.1);
  roof.castShadow = true;
  group.add(roof);
  carbonMeshes.push(roof);

  // Double-Bubble Aero Indent on Roof
  const scoopGeom = new THREE.BoxGeometry(0.35, 0.06, 1.1);
  const scoop = new THREE.Mesh(scoopGeom, carbonMaterial);
  scoop.position.set(0, 1.11, -0.05);
  group.add(scoop);
  carbonMeshes.push(scoop);

  // Slanted Front Windshield
  const windshieldGeom = new THREE.BoxGeometry(1.3, 0.04, 1.22);
  const windshield = new THREE.Mesh(windshieldGeom, glassMaterial);
  windshield.rotation.x = -0.66;
  windshield.position.set(0, 0.86, 0.82);
  windshield.castShadow = true;
  group.add(windshield);
  glassMeshes.push(windshield);

  // A-Pillars (Carbon fiber structural windshield frame)
  const aPillarLGeom = new THREE.BoxGeometry(0.06, 0.06, 1.28);
  const aPillarL = new THREE.Mesh(aPillarLGeom, carbonMaterial);
  aPillarL.rotation.x = -0.66;
  aPillarL.rotation.z = -0.12;
  aPillarL.position.set(-0.68, 0.86, 0.82);
  group.add(aPillarL);
  carbonMeshes.push(aPillarL);

  const aPillarR = aPillarL.clone();
  aPillarR.rotation.z = 0.12;
  aPillarR.position.x = 0.68;
  group.add(aPillarR);
  carbonMeshes.push(aPillarR);

  // Rear Engine Glass Louvers (Revealing V12)
  const rearGlassGeom = new THREE.BoxGeometry(1.12, 0.03, 1.15);
  const rearGlass = new THREE.Mesh(rearGlassGeom, glassMaterial);
  rearGlass.rotation.x = 0.42;
  rearGlass.position.set(0, 0.88, -1.02);
  group.add(rearGlass);
  glassMeshes.push(rearGlass);

  // Side Glass Windows
  const sideGlassLGeom = new THREE.BoxGeometry(0.03, 0.38, 1.08);
  const sideGlassL = new THREE.Mesh(sideGlassLGeom, glassMaterial);
  sideGlassL.position.set(-0.68, 0.84, -0.02);
  sideGlassL.rotation.z = -0.18;
  group.add(sideGlassL);
  glassMeshes.push(sideGlassL);

  const sideGlassR = sideGlassL.clone();
  sideGlassR.position.x = 0.68;
  sideGlassR.rotation.z = 0.18;
  group.add(sideGlassR);
  glassMeshes.push(sideGlassR);

  // ==========================================
  // 5. INTERIOR COCKPIT (STEERING, SEATS, HUD)
  // ==========================================
  const cockpitInterior = new THREE.Group();
  cockpitInterior.position.set(0, 0.4, 0);

  // Sport Bucket Seats (Dual Carbon Bucket Seats)
  function createBucketSeat(xPos: number): THREE.Group {
    const seatGroup = new THREE.Group();
    // Base cushion
    const baseGeom = new THREE.BoxGeometry(0.44, 0.12, 0.52);
    const base = new THREE.Mesh(baseGeom, interiorMaterial);
    seatGroup.add(base);

    // Seat back
    const backGeom = new THREE.BoxGeometry(0.42, 0.68, 0.14);
    const back = new THREE.Mesh(backGeom, interiorMaterial);
    back.position.set(0, 0.34, -0.22);
    back.rotation.x = -0.2;
    seatGroup.add(back);

    // Headrest with gold stitched bull
    const headrestGeom = new THREE.BoxGeometry(0.24, 0.18, 0.1);
    const headrest = new THREE.Mesh(headrestGeom, interiorMaterial);
    headrest.position.set(0, 0.72, -0.3);
    headrest.rotation.x = -0.15;
    seatGroup.add(headrest);

    // Side bolsters
    const bolsterLGeom = new THREE.BoxGeometry(0.08, 0.5, 0.18);
    const bolsterL = new THREE.Mesh(bolsterLGeom, bodyMaterial);
    bolsterL.position.set(-0.2, 0.3, -0.18);
    seatGroup.add(bolsterL);
    bodyMeshes.push(bolsterL);

    const bolsterR = bolsterL.clone();
    bolsterR.position.x = 0.2;
    seatGroup.add(bolsterR);
    bodyMeshes.push(bolsterR);

    seatGroup.position.set(xPos, 0.16, -0.12);
    return seatGroup;
  }

  cockpitInterior.add(createBucketSeat(-0.35)); // Driver seat (Left-hand drive)
  cockpitInterior.add(createBucketSeat(0.35));  // Passenger seat

  // Dashboard & Center Console
  const dashGeom = new THREE.BoxGeometry(1.22, 0.22, 0.45);
  const dash = new THREE.Mesh(dashGeom, interiorMaterial);
  dash.position.set(0, 0.44, 0.44);
  dash.rotation.x = 0.15;
  cockpitInterior.add(dash);

  // Digital Instrument Cluster Display (Glowing Cyan/Amber Screen)
  const displayGeom = new THREE.PlaneGeometry(0.26, 0.12);
  const displayMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const display = new THREE.Mesh(displayGeom, displayMat);
  display.position.set(-0.35, 0.54, 0.48);
  display.rotation.x = -0.2;
  cockpitInterior.add(display);

  // Racing Steering Wheel
  const wheelRimGeom = new THREE.TorusGeometry(0.14, 0.02, 8, 24);
  const steeringWheel = new THREE.Mesh(wheelRimGeom, interiorMaterial);
  steeringWheel.position.set(-0.35, 0.5, 0.32);
  steeringWheel.rotation.x = 0.35;
  cockpitInterior.add(steeringWheel);

  group.add(cockpitInterior);

  // ==========================================
  // 6. MID-MOUNTED 6.5L V12 HYBRID ENGINE BLOCK
  // ==========================================
  const enginePivot = new THREE.Group();
  enginePivot.position.set(0, 0.5, -0.9);

  // Engine Crankcase & Block
  const blockGeom = new THREE.BoxGeometry(0.8, 0.32, 0.95);
  const block = new THREE.Mesh(blockGeom, carbonMaterial);
  enginePivot.add(block);
  carbonMeshes.push(block);

  // Dual Red V12 Cylinder Heads (Iconic Lamborghini Red Crackle Finish)
  const headLGeom = new THREE.BoxGeometry(0.26, 0.16, 0.88);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35, metalness: 0.6 });
  const headL = new THREE.Mesh(headLGeom, headMat);
  headL.position.set(-0.25, 0.2, 0);
  headL.rotation.z = -0.25;
  enginePivot.add(headL);

  const headR = headL.clone();
  headR.position.x = 0.25;
  headR.rotation.z = 0.25;
  enginePivot.add(headR);

  // 12 Chrome Intake Runners / Velocity Stacks
  for (let i = -2; i <= 2; i++) {
    const stackGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12);
    const stackL = new THREE.Mesh(stackGeom, titaniumMaterial);
    stackL.position.set(-0.12, 0.28, i * 0.16);
    enginePivot.add(stackL);

    const stackR = stackL.clone();
    stackR.position.x = 0.12;
    enginePivot.add(stackR);
  }

  // Carbon Fiber Engine X-Brace (Cross Strut Bar)
  const brace1Geom = new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8);
  const brace1 = new THREE.Mesh(brace1Geom, carbonMaterial);
  brace1.rotation.z = Math.PI / 2;
  brace1.rotation.y = 0.7;
  brace1.position.y = 0.34;
  enginePivot.add(brace1);

  const brace2 = brace1.clone();
  brace2.rotation.y = -0.7;
  enginePivot.add(brace2);

  group.add(enginePivot);

  // Openable Glass Engine Deck Cover
  const engineCoverPivot = new THREE.Group();
  engineCoverPivot.position.set(0, 0.96, -0.35); // Hinge location behind roof
  const engineDeckGeom = new THREE.BoxGeometry(1.28, 0.04, 1.35);
  const engineDeck = new THREE.Mesh(engineDeckGeom, bodyMaterial);
  engineDeck.position.set(0, -0.04, -0.65);
  engineCoverPivot.add(engineDeck);
  bodyMeshes.push(engineDeck);
  group.add(engineCoverPivot);

  // ==========================================
  // 7. SCISSOR DOORS (DIHEDRAL ROTATION ON PIVOTS)
  // ==========================================
  // Left Door Pivot (A-Pillar base)
  const leftDoorPivot = new THREE.Group();
  leftDoorPivot.position.set(-0.95, 0.55, 0.55);

  const doorLGeom = new THREE.BoxGeometry(0.12, 0.52, 1.35);
  const doorL = new THREE.Mesh(doorLGeom, bodyMaterial);
  doorL.position.set(0, 0, -0.65);
  doorL.castShadow = true;
  leftDoorPivot.add(doorL);
  bodyMeshes.push(doorL);

  // Door Carbon Aerodynamic Intake Blade
  const bladeLGeom = new THREE.BoxGeometry(0.06, 0.32, 0.85);
  const bladeL = new THREE.Mesh(bladeLGeom, carbonMaterial);
  bladeL.position.set(-0.06, -0.05, -0.75);
  leftDoorPivot.add(bladeL);
  carbonMeshes.push(bladeL);

  // Aerodynamic Wing Mirror
  const mirrorLGeom = new THREE.BoxGeometry(0.24, 0.1, 0.14);
  const mirrorL = new THREE.Mesh(mirrorLGeom, carbonMaterial);
  mirrorL.position.set(-0.14, 0.28, 0.05);
  leftDoorPivot.add(mirrorL);
  carbonMeshes.push(mirrorL);

  group.add(leftDoorPivot);

  // Right Door Pivot
  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(0.95, 0.55, 0.55);

  const doorR = doorL.clone();
  rightDoorPivot.add(doorR);
  bodyMeshes.push(doorR);

  const bladeR = bladeL.clone();
  bladeR.position.x = 0.06;
  rightDoorPivot.add(bladeR);
  carbonMeshes.push(bladeR);

  const mirrorR = mirrorL.clone();
  mirrorR.position.x = 0.14;
  rightDoorPivot.add(mirrorR);
  carbonMeshes.push(mirrorR);

  group.add(rightDoorPivot);

  // ==========================================
  // 8. SIDE AIR INTAKES & REAR QUARTER FENDERS
  // ==========================================
  // Rear side wide-body scoops
  const flankLGeom = new THREE.BoxGeometry(0.28, 0.44, 1.4);
  const flankL = new THREE.Mesh(flankLGeom, bodyMaterial);
  flankL.position.set(-1.02, 0.52, -1.05);
  flankL.castShadow = true;
  group.add(flankL);
  bodyMeshes.push(flankL);

  const flankR = flankL.clone();
  flankR.position.x = 1.02;
  group.add(flankR);
  bodyMeshes.push(flankR);

  // Massive Radiator Air Scoops
  const scoopLGeom = new THREE.BoxGeometry(0.18, 0.35, 0.5);
  const scoopL = new THREE.Mesh(scoopLGeom, grilleMaterial);
  scoopL.position.set(-0.95, 0.48, -0.55);
  scoopL.rotation.y = 0.25;
  group.add(scoopL);

  const scoopR = scoopL.clone();
  scoopR.position.x = 0.95;
  scoopR.rotation.y = -0.25;
  group.add(scoopR);

  // Carbon Side Skirts with Aero Winglets
  const skirtLGeom = new THREE.BoxGeometry(0.14, 0.06, 2.3);
  const skirtL = new THREE.Mesh(skirtLGeom, carbonMaterial);
  skirtL.position.set(-1.02, 0.2, 0.0);
  group.add(skirtL);
  carbonMeshes.push(skirtL);

  const skirtR = skirtL.clone();
  skirtR.position.x = 1.02;
  group.add(skirtR);
  carbonMeshes.push(skirtR);

  // ==========================================
  // 9. REAR BEAST END & DUAL HEXAGONAL EXHAUSTS
  // ==========================================
  // Rear Fascia Panel
  const rearFasciaGeom = new THREE.BoxGeometry(1.9, 0.42, 0.3);
  const rearFascia = new THREE.Mesh(rearFasciaGeom, glossBlackMaterial);
  rearFascia.position.set(0, 0.52, -2.05);
  group.add(rearFascia);

  // Dual High-Mounted Central Hexagonal Exhaust Tips
  const exhaustFlameEmitters: THREE.Vector3[] = [];

  function createHexExhaust(xPos: number): THREE.Mesh {
    const hexGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.28, 6);
    const pipe = new THREE.Mesh(hexGeom, titaniumMaterial);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(xPos, 0.62, -2.16);
    group.add(pipe);
    exhaustPipes.push(pipe);
    exhaustFlameEmitters.push(new THREE.Vector3(xPos, 0.62, -2.32));
    return pipe;
  }

  createHexExhaust(-0.16);
  createHexExhaust(0.16);

  // Transverse Y-Shaped Glowing LED Taillights
  function createRearYLight(isRight: boolean): THREE.Group {
    const rearY = new THREE.Group();
    const sign = isRight ? 1 : -1;

    // Horizontal bar
    const barGeom = new THREE.BoxGeometry(0.48, 0.035, 0.04);
    const bar = new THREE.Mesh(barGeom, taillightLedMaterial);
    bar.position.set(sign * 0.45, 0, 0);
    rearY.add(bar);
    taillightLeds.push(bar);

    // Diagonals forming the Y
    const diag1Geom = new THREE.BoxGeometry(0.24, 0.035, 0.04);
    const diag1 = new THREE.Mesh(diag1Geom, taillightLedMaterial);
    diag1.rotation.z = sign * 0.45;
    diag1.position.set(sign * 0.72, 0.05, 0);
    rearY.add(diag1);
    taillightLeds.push(diag1);

    const diag2Geom = new THREE.BoxGeometry(0.24, 0.035, 0.04);
    const diag2 = new THREE.Mesh(diag2Geom, taillightLedMaterial);
    diag2.rotation.z = sign * -0.45;
    diag2.position.set(sign * 0.72, -0.05, 0);
    rearY.add(diag2);
    taillightLeds.push(diag2);

    rearY.position.set(0, 0.62, -2.12);
    return rearY;
  }

  group.add(createRearYLight(false));
  group.add(createRearYLight(true));

  // Massive Carbon Fiber Rear Diffuser with 6 Vertical Strakes
  const diffuserGeom = new THREE.BoxGeometry(2.0, 0.16, 0.65);
  const diffuser = new THREE.Mesh(diffuserGeom, carbonMaterial);
  diffuser.position.set(0, 0.22, -2.05);
  diffuser.rotation.x = -0.15;
  diffuser.castShadow = true;
  group.add(diffuser);
  carbonMeshes.push(diffuser);

  // 6 Diffuser Aerodynamic Fins / Strakes
  for (let i = -2.5; i <= 2.5; i += 1.0) {
    const strakeGeom = new THREE.BoxGeometry(0.03, 0.22, 0.6);
    const strake = new THREE.Mesh(strakeGeom, carbonMaterial);
    strake.position.set(i * 0.34, 0.18, -2.08);
    strake.rotation.x = -0.15;
    group.add(strake);
    carbonMeshes.push(strake);
  }

  // ==========================================
  // 10. ACTIVE REAR AERODYNAMIC WING (SPOILER)
  // ==========================================
  const spoilerPivot = new THREE.Group();
  spoilerPivot.position.set(0, 0.76, -1.9);

  // Dual Carbon Fiber Pylons / Stanchions
  const pylonLGeom = new THREE.BoxGeometry(0.04, 0.32, 0.18);
  const pylonL = new THREE.Mesh(pylonLGeom, carbonMaterial);
  pylonL.position.set(-0.45, 0.14, -0.05);
  pylonL.rotation.x = -0.3;
  spoilerPivot.add(pylonL);
  carbonMeshes.push(pylonL);

  const pylonR = pylonL.clone();
  pylonR.position.x = 0.45;
  spoilerPivot.add(pylonR);
  carbonMeshes.push(pylonR);

  // Main High-Downforce Aerofoil Wing
  const wingGeom = new THREE.BoxGeometry(1.95, 0.045, 0.38);
  const wing = new THREE.Mesh(wingGeom, carbonMaterial);
  wing.position.set(0, 0.28, -0.1);
  wing.rotation.x = 0.08;
  wing.castShadow = true;
  spoilerPivot.add(wing);
  carbonMeshes.push(wing);

  // Wing Endplates
  const endplateLGeom = new THREE.BoxGeometry(0.03, 0.16, 0.42);
  const endplateL = new THREE.Mesh(endplateLGeom, carbonMaterial);
  endplateL.position.set(-0.98, 0.28, -0.1);
  spoilerPivot.add(endplateL);
  carbonMeshes.push(endplateL);

  const endplateR = endplateL.clone();
  endplateR.position.x = 0.98;
  spoilerPivot.add(endplateR);
  carbonMeshes.push(endplateR);

  group.add(spoilerPivot);

  // ==========================================
  // 11. WHEELS, BRAKES & TIRES (4 UNITS)
  // ==========================================
  function createWheel(isFront: boolean, isRight: boolean): THREE.Group {
    const wheelGroup = new THREE.Group();
    const radius = isFront ? 0.38 : 0.41;
    const width = isFront ? 0.32 : 0.38;

    // Tire
    const tireGeom = new THREE.CylinderGeometry(radius, radius, width, 32);
    const tire = new THREE.Mesh(tireGeom, tireMaterial);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim Outer Lip / Barrel
    const rimLipGeom = new THREE.CylinderGeometry(radius * 0.85, radius * 0.85, width + 0.01, 32, 1, true);
    const rimLip = new THREE.Mesh(rimLipGeom, rimMaterial);
    rimLip.rotation.z = Math.PI / 2;
    wheelGroup.add(rimLip);
    rimMeshes.push(rimLip);

    // 5-Spoke Directional Forged Alloy Design
    const spokeGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spokeGeom = new THREE.BoxGeometry(0.045, radius * 0.72, 0.02);
      const spoke = new THREE.Mesh(spokeGeom, rimMaterial);
      spoke.position.set(0, Math.cos(angle) * (radius * 0.4), Math.sin(angle) * (radius * 0.4));
      spoke.rotation.x = angle;
      spokeGroup.add(spoke);
      rimMeshes.push(spoke);
    }
    // Center Lock Nut (Gold anodized hex nut)
    const centerNutGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 6);
    const centerNut = new THREE.Mesh(centerNutGeom, badgeMat);
    centerNut.rotation.z = Math.PI / 2;
    centerNut.position.x = isRight ? width / 2 : -width / 2;
    spokeGroup.add(centerNut);

    spokeGroup.position.x = isRight ? 0.02 : -0.02;
    wheelGroup.add(spokeGroup);

    // Drilled Carbon-Ceramic Brake Disc
    const discGeom = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, 0.03, 32);
    const disc = new THREE.Mesh(discGeom, brakeDiscMaterial);
    disc.rotation.z = Math.PI / 2;
    wheelGroup.add(disc);

    // Brembo 6-Piston Caliper
    const caliperGeom = new THREE.BoxGeometry(0.08, 0.22, 0.12);
    const caliper = new THREE.Mesh(caliperGeom, caliperMaterial);
    caliper.position.set(0, radius * 0.45, 0);
    wheelGroup.add(caliper);
    caliperMeshes.push(caliper);

    return wheelGroup;
  }

  // Create Wheels
  const frontLeftWheel = createWheel(true, false);
  frontLeftWheel.position.set(-0.95, 0.38, 1.45);
  group.add(frontLeftWheel);

  const frontRightWheel = createWheel(true, true);
  frontRightWheel.position.set(0.95, 0.38, 1.45);
  group.add(frontRightWheel);

  const rearLeftWheel = createWheel(false, false);
  rearLeftWheel.position.set(-1.0, 0.41, -1.35);
  group.add(rearLeftWheel);

  const rearRightWheel = createWheel(false, true);
  rearRightWheel.position.set(1.0, 0.41, -1.35);
  group.add(rearRightWheel);

  const wheelGroups = [frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel];

  return {
    group,
    bodyMeshes,
    carbonMeshes,
    glassMeshes,
    wheelGroups,
    frontLeftWheel,
    frontRightWheel,
    rearLeftWheel,
    rearRightWheel,
    rimMeshes,
    caliperMeshes,
    headlightLeds,
    headlightLights,
    taillightLeds,
    leftDoorPivot,
    rightDoorPivot,
    spoilerPivot,
    engineCoverPivot,
    exhaustPipes,
    exhaustFlameEmitters,
  };
}

/**
 * Apply dynamic state & materials to model parts
 */
export function updateCarAppearance(
  parts: ModelParts,
  color: CarColor,
  finish: PaintFinish,
  wheel: WheelConfig,
  caliper: CaliperColor,
  wireframe: boolean
) {
  const baseColor = new THREE.Color(color.hex);

  // Update Body Color & Finish
  parts.bodyMeshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
    if (mat) {
      mat.color.copy(baseColor);
      mat.wireframe = wireframe;

      if (finish === 'metallic') {
        mat.metalness = 0.88;
        mat.roughness = 0.16;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.08;
      } else if (finish === 'matte') {
        mat.metalness = 0.25;
        mat.roughness = 0.65;
        mat.clearcoat = 0.0;
        mat.clearcoatRoughness = 0.5;
      } else if (finish === 'carbon') {
        mat.color.set('#27272a');
        mat.metalness = 0.5;
        mat.roughness = 0.4;
        mat.clearcoat = 0.6;
      }
      mat.needsUpdate = true;
    }
  });

  // Update Rims
  const rimColor = new THREE.Color(wheel.rimColor);
  parts.rimMeshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.color.copy(rimColor);
      mat.metalness = wheel.rimMetalness;
      mat.roughness = wheel.rimRoughness;
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    }
  });

  // Update Calipers
  const caliperColor = new THREE.Color(caliper.hex);
  parts.caliperMeshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.color.copy(caliperColor);
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    }
  });
}
