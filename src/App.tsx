import React, { useState, useCallback } from 'react';
import {
  CarState,
  DriveTelemetry,
  HotspotInfo,
  CarColor,
  WheelConfig,
  CaliperColor,
  PaintFinish,
  EnvironmentTheme,
  CameraPreset,
} from './types/car';
import { CarCanvas } from './components/CarCanvas';
import { Navigation } from './components/Navigation';
import {
  CustomizerDock,
  CAR_COLORS,
  WHEEL_CONFIGS,
  CALIPER_COLORS,
} from './components/CustomizerDock';
import { CameraDirector } from './components/CameraDirector';
import { SoundRevPanel } from './components/SoundRevPanel';
import { DriveHUD } from './components/DriveHUD';
import { SpecsModal } from './components/SpecsModal';
import { HotspotDrawer } from './components/HotspotDrawer';
import { SprintTestOverlay } from './components/SprintTestOverlay';
import { RealCarGallery } from './components/RealCarGallery';
import { ENVIRONMENT_THEMES } from './three/EnvironmentScene';
import { soundEngine } from './sound/engineAudio';

export const App: React.FC = () => {
  // Car Appearance State
  const [color, setColor] = useState<CarColor>(CAR_COLORS[0]); // Giallo Auge
  const [finish, setFinish] = useState<PaintFinish>('metallic');
  const [wheel, setWheel] = useState<WheelConfig>(WHEEL_CONFIGS[0]); // Bronze Forged
  const [caliper, setCaliper] = useState<CaliperColor>(CALIPER_COLORS[0]); // Giallo Yellow

  // Interactive Mechanical Parts
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [spoilerDeployed, setSpoilerDeployed] = useState<boolean>(false);
  const [engineCoverOpen, setEngineCoverOpen] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [windTunnelActive, setWindTunnelActive] = useState<boolean>(false);
  const [wireframeActive, setWireframeActive] = useState<boolean>(false);

  // Environment & Camera
  const [envTheme, setEnvTheme] = useState<EnvironmentTheme>(ENVIRONMENT_THEMES[0]);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');

  // Audio & Engine
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [rpm, setRpm] = useState<number>(850);
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Application Mode
  const [mode, setMode] = useState<'studio' | 'drive'>('studio');
  const [telemetry, setTelemetry] = useState<DriveTelemetry>({
    speedKmh: 0,
    rpm: 850,
    gear: '1',
    steering: 0,
    throttle: 0,
    isBraking: false,
    isDrifting: false,
  });

  // Modals & Drawers
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isSprintOpen, setIsSprintOpen] = useState<boolean>(false);
  const [isRealGalleryOpen, setIsRealGalleryOpen] = useState<boolean>(false);

  // Toggle Engine Ignition
  const handleToggleEngine = useCallback(() => {
    if (isEngineRunning) {
      soundEngine.stopEngine();
      setIsEngineRunning(false);
      setIsRevving(false);
    } else {
      soundEngine.startEngine();
      setIsEngineRunning(true);
    }
  }, [isEngineRunning]);

  // Gas pedal rev handlers
  const handleRevStart = useCallback(() => {
    if (isEngineRunning) {
      setIsRevving(true);
      soundEngine.revEngine(true);
    }
  }, [isEngineRunning]);

  const handleRevEnd = useCallback(() => {
    if (isEngineRunning) {
      setIsRevving(false);
      soundEngine.revEngine(false);
    }
  }, [isEngineRunning]);

  // Sound Mute Toggle
  const handleToggleSound = useCallback(() => {
    const unmuted = soundEngine.toggleMute();
    setSoundEnabled(unmuted);
  }, []);

  // Assemble consolidated CarState
  const carState: CarState = {
    color,
    finish,
    wheel,
    caliper,
    doorsOpen,
    spoilerDeployed,
    engineCoverOpen,
    headlightsOn,
    windTunnelActive,
    wireframeActive,
    envTheme,
    cameraPreset,
    isEngineRunning,
    rpm,
    isRevving,
    soundEnabled,
    mode,
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans select-none">
      {/* 3D WebGL Canvas Layer */}
      <CarCanvas
        carState={carState}
        onUpdateTelemetry={setTelemetry}
        onSelectHotspot={setSelectedHotspot}
      />

      {/* Top Navigation */}
      <Navigation
        mode={mode}
        onToggleMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'drive' && !isEngineRunning) {
            handleToggleEngine();
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenSprintTest={() => setIsSprintOpen(true)}
        onOpenRealGallery={() => setIsRealGalleryOpen(true)}
      />

      {/* Studio Showroom Controls */}
      {mode === 'studio' && (
        <>
          {/* Camera Director Angles */}
          <CameraDirector
            currentPreset={cameraPreset}
            onSelectPreset={setCameraPreset}
          />

          {/* Customizer Bottom Dock */}
          <CustomizerDock
            currentColor={color}
            onChangeColor={setColor}
            finish={finish}
            onChangeFinish={setFinish}
            currentWheel={wheel}
            onChangeWheel={setWheel}
            currentCaliper={caliper}
            onChangeCaliper={setCaliper}
            doorsOpen={doorsOpen}
            onToggleDoors={() => setDoorsOpen(!doorsOpen)}
            spoilerDeployed={spoilerDeployed}
            onToggleSpoiler={() => setSpoilerDeployed(!spoilerDeployed)}
            engineCoverOpen={engineCoverOpen}
            onToggleEngineCover={() => setEngineCoverOpen(!engineCoverOpen)}
            headlightsOn={headlightsOn}
            onToggleHeadlights={() => setHeadlightsOn(!headlightsOn)}
            windTunnelActive={windTunnelActive}
            onToggleWindTunnel={() => setWindTunnelActive(!windTunnelActive)}
            wireframeActive={wireframeActive}
            onToggleWireframe={() => setWireframeActive(!wireframeActive)}
            currentEnv={envTheme}
            onChangeEnv={setEnvTheme}
          />

          {/* V12 Sound & Rev Panel */}
          <SoundRevPanel
            isEngineRunning={isEngineRunning}
            onToggleEngine={handleToggleEngine}
            isRevving={isRevving}
            onRevStart={handleRevStart}
            onRevEnd={handleRevEnd}
          />

          {/* Hotspot Info Drawer */}
          <HotspotDrawer
            hotspot={selectedHotspot}
            onClose={() => setSelectedHotspot(null)}
          />
        </>
      )}

      {/* Race Drive Mode HUD */}
      {mode === 'drive' && (
        <DriveHUD
          telemetry={telemetry}
          onExitDrive={() => setMode('studio')}
        />
      )}

      {/* Full Vehicle Specifications Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* 0-100 km/h Sprint Benchmark Overlay */}
      <SprintTestOverlay
        isOpen={isSprintOpen}
        onClose={() => setIsSprintOpen(false)}
      />

      {/* Real Lamborghini 4K Photography Showcase Gallery */}
      <RealCarGallery
        isOpen={isRealGalleryOpen}
        onClose={() => setIsRealGalleryOpen(false)}
      />
    </main>
  );
};
