export interface CarColor {
  id: string;
  name: string;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  badge: string;
}

export type PaintFinish = 'metallic' | 'matte' | 'carbon';

export interface WheelConfig {
  id: string;
  name: string;
  rimColor: string;
  rimMetalness: number;
  rimRoughness: number;
}

export interface CaliperColor {
  id: string;
  name: string;
  hex: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  bgHex: number;
  groundHex: number;
  gridHex: number;
  accentLightHex: number;
  intensity: number;
  fogDensity: number;
}

export type CameraPreset = 'hero' | 'front' | 'profile' | 'rear' | 'cockpit' | 'top';

export interface HotspotInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  specs: { label: string; value: string }[];
}

export interface CarState {
  // Appearance
  color: CarColor;
  finish: PaintFinish;
  wheel: WheelConfig;
  caliper: CaliperColor;
  
  // Interactive Parts
  doorsOpen: boolean;
  spoilerDeployed: boolean;
  engineCoverOpen: boolean;
  headlightsOn: boolean;
  windTunnelActive: boolean;
  wireframeActive: boolean;

  // Environment & Studio
  envTheme: EnvironmentTheme;
  cameraPreset: CameraPreset;

  // Engine & Audio
  isEngineRunning: boolean;
  rpm: number; // 800 (idle) to 9500 (redline)
  isRevving: boolean;
  soundEnabled: boolean;

  // App Modes
  mode: 'studio' | 'drive';
}

export interface DriveTelemetry {
  speedKmh: number;
  rpm: number;
  gear: string;
  steering: number;
  throttle: number;
  isBraking: boolean;
  isDrifting: boolean;
}
