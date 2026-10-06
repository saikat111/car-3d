import React, { useState } from 'react';
import {
  CarColor,
  WheelConfig,
  CaliperColor,
  PaintFinish,
  EnvironmentTheme,
} from '../types/car';
import { ENVIRONMENT_THEMES } from '../three/EnvironmentScene';
import { soundEngine } from '../sound/engineAudio';
import {
  Palette,
  Disc,
  Sliders,
  SunMedium,
  Wind,
  Box,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CAR_COLORS: CarColor[] = [
  {
    id: 'giallo-auge',
    name: 'Giallo Auge',
    hex: '#eab308',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Iconic Pearl Yellow',
  },
  {
    id: 'verde-mantis',
    name: 'Verde Mantis',
    hex: '#22c55e',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Acid Toxic Green',
  },
  {
    id: 'arancio-argos',
    name: 'Arancio Argos',
    hex: '#f97316',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Deep Pearl Orange',
  },
  {
    id: 'rosso-bia',
    name: 'Rosso Bia',
    hex: '#dc2626',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Dramatic Metallic Crimson',
  },
  {
    id: 'viola-pasifae',
    name: 'Viola Pasifae',
    hex: '#9333ea',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Royal Metallic Violet',
  },
  {
    id: 'blu-cepheus',
    name: 'Blu Cepheus',
    hex: '#06b6d4',
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Riviera Cyan Blue',
  },
  {
    id: 'nero-nemesis',
    name: 'Nero Nemesis',
    hex: '#18181b',
    roughness: 0.25,
    metalness: 0.8,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
    badge: 'Stealth Matte Black',
  },
  {
    id: 'bianco-monocerus',
    name: 'Bianco Monocerus',
    hex: '#f4f4f5',
    roughness: 0.16,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    badge: 'Polar Ice Pearl White',
  },
];

export const WHEEL_CONFIGS: WheelConfig[] = [
  {
    id: 'bronze',
    name: 'Bronze Forged',
    rimColor: '#d97706',
    rimMetalness: 0.92,
    rimRoughness: 0.22,
  },
  {
    id: 'titanium',
    name: 'Diamond Titanium',
    rimColor: '#94a3b8',
    rimMetalness: 0.95,
    rimRoughness: 0.18,
  },
  {
    id: 'black',
    name: 'Gloss Nero',
    rimColor: '#09090b',
    rimMetalness: 0.85,
    rimRoughness: 0.15,
  },
  {
    id: 'silver',
    name: 'Argento Silver',
    rimColor: '#e2e8f0',
    rimMetalness: 0.96,
    rimRoughness: 0.14,
  },
];

export const CALIPER_COLORS: CaliperColor[] = [
  { id: 'yellow', name: 'Giallo Yellow', hex: '#eab308' },
  { id: 'red', name: 'Rosso Red', hex: '#dc2626' },
  { id: 'green', name: 'Verde Green', hex: '#16a34a' },
  { id: 'orange', name: 'Arancio Orange', hex: '#ea580c' },
  { id: 'silver', name: 'Argento Silver', hex: '#94a3b8' },
];

interface CustomizerDockProps {
  currentColor: CarColor;
  onChangeColor: (color: CarColor) => void;
  finish: PaintFinish;
  onChangeFinish: (finish: PaintFinish) => void;
  currentWheel: WheelConfig;
  onChangeWheel: (wheel: WheelConfig) => void;
  currentCaliper: CaliperColor;
  onChangeCaliper: (caliper: CaliperColor) => void;
  doorsOpen: boolean;
  onToggleDoors: () => void;
  spoilerDeployed: boolean;
  onToggleSpoiler: () => void;
  engineCoverOpen: boolean;
  onToggleEngineCover: () => void;
  headlightsOn: boolean;
  onToggleHeadlights: () => void;
  windTunnelActive: boolean;
  onToggleWindTunnel: () => void;
  wireframeActive: boolean;
  onToggleWireframe: () => void;
  currentEnv: EnvironmentTheme;
  onChangeEnv: (env: EnvironmentTheme) => void;
}

type TabType = 'color' | 'wheels' | 'aero' | 'studio';

export const CustomizerDock: React.FC<CustomizerDockProps> = ({
  currentColor,
  onChangeColor,
  finish,
  onChangeFinish,
  currentWheel,
  onChangeWheel,
  currentCaliper,
  onChangeCaliper,
  doorsOpen,
  onToggleDoors,
  spoilerDeployed,
  onToggleSpoiler,
  engineCoverOpen,
  onToggleEngineCover,
  headlightsOn,
  onToggleHeadlights,
  windTunnelActive,
  onToggleWindTunnel,
  wireframeActive,
  onToggleWireframe,
  currentEnv,
  onChangeEnv,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('color');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleSelectTab = (tab: TabType) => {
    soundEngine.playUiClick();
    setActiveTab(tab);
    if (isCollapsed) setIsCollapsed(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* Top Tab Bar & Collapse Handle */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-black/40">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleSelectTab('color')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                activeTab === 'color' && !isCollapsed
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Paint Shop</span>
            </button>

            <button
              onClick={() => handleSelectTab('wheels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                activeTab === 'wheels' && !isCollapsed
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Wheels</span>
            </button>

            <button
              onClick={() => handleSelectTab('aero')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                activeTab === 'aero' && !isCollapsed
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Aero & Parts</span>
            </button>

            <button
              onClick={() => handleSelectTab('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                activeTab === 'studio' && !isCollapsed
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => {
              soundEngine.playUiClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md transition-colors"
            title={isCollapsed ? 'Expand Dock' : 'Collapse Dock'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Tab Body (Collapsible) */}
        {!isCollapsed && (
          <div className="p-4 bg-zinc-950/60 backdrop-blur-xl">
            {/* 1. PAINT SHOP */}
            {activeTab === 'color' && (
              <div className="space-y-4">
                {/* Active Color Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <span className="text-sm font-bold font-heading uppercase text-white tracking-wider">
                      {currentColor.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-tech">({currentColor.badge})</span>
                  </div>

                  {/* Finish Switcher */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-md border border-white/10">
                    {(['metallic', 'matte', 'carbon'] as PaintFinish[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          soundEngine.playUiClick();
                          onChangeFinish(f);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-tech uppercase tracking-wider transition-all ${
                          finish === f
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {CAR_COLORS.map((c) => {
                    const isSelected = currentColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundEngine.playUiClick();
                          onChangeColor(c);
                        }}
                        className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-500/20 scale-105'
                            : 'border-white/10 hover:border-white/30 bg-black/30'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="mt-1.5 text-[9px] font-tech uppercase text-zinc-300 truncate w-full text-center">
                          {c.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. WHEELS & CALIPERS */}
            {activeTab === 'wheels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rim Selection */}
                <div>
                  <h4 className="text-[11px] font-tech uppercase text-zinc-400 tracking-wider mb-2">
                    Forged Alloy Rims
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {WHEEL_CONFIGS.map((w) => {
                      const isSelected = currentWheel.id === w.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => {
                            soundEngine.playUiClick();
                            onChangeWheel(w);
                          }}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-500/15'
                              : 'border-white/10 bg-black/30 hover:border-white/20'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                            style={{ backgroundColor: w.rimColor }}
                          />
                          <span className="text-xs font-tech text-zinc-200 truncate">{w.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Caliper Selection */}
                <div>
                  <h4 className="text-[11px] font-tech uppercase text-zinc-400 tracking-wider mb-2">
                    Brembo Brake Calipers
                  </h4>
                  <div className="flex items-center gap-2">
                    {CALIPER_COLORS.map((c) => {
                      const isSelected = currentCaliper.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            soundEngine.playUiClick();
                            onChangeCaliper(c);
                          }}
                          className={`group relative p-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-500/20 scale-105'
                              : 'border-white/10 bg-black/30 hover:border-white/20'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-6 h-6 rounded-full block border border-white/30 shadow-md group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 3. AERO & INTERACTIVE PARTS */}
            {activeTab === 'aero' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Scissor Doors */}
                <button
                  onClick={() => {
                    soundEngine.playDoorSound();
                    onToggleDoors();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    doorsOpen
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400 font-bold shadow-md shadow-yellow-500/20'
                      : 'border-white/10 bg-black/40 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-tech uppercase tracking-wider">Scissor Doors</span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {doorsOpen ? 'OPEN (65°)' : 'CLOSED'}
                  </span>
                </button>

                {/* Active Aero Spoiler */}
                <button
                  onClick={() => {
                    soundEngine.playSpoilerSound();
                    onToggleSpoiler();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    spoilerDeployed
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400 font-bold shadow-md shadow-yellow-500/20'
                      : 'border-white/10 bg-black/40 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-tech uppercase tracking-wider">Aero Spoiler</span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {spoilerDeployed ? 'DOWNFORCE' : 'CRUISE'}
                  </span>
                </button>

                {/* V12 Engine Bonnet */}
                <button
                  onClick={() => {
                    soundEngine.playDoorSound();
                    onToggleEngineCover();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    engineCoverOpen
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400 font-bold shadow-md shadow-yellow-500/20'
                      : 'border-white/10 bg-black/40 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-tech uppercase tracking-wider">V12 Bonnet</span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {engineCoverOpen ? 'REVEAL V12' : 'CLOSED'}
                  </span>
                </button>

                {/* LED Headlights */}
                <button
                  onClick={() => {
                    soundEngine.playUiClick();
                    onToggleHeadlights();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    headlightsOn
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400 font-bold shadow-md shadow-yellow-500/20'
                      : 'border-white/10 bg-black/40 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-tech uppercase tracking-wider">Y-LED Lights</span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {headlightsOn ? 'ACTIVE DRL' : 'STANDBY'}
                  </span>
                </button>
              </div>
            )}

            {/* 4. STUDIO & ENVIRONMENT */}
            {activeTab === 'studio' && (
              <div className="space-y-4">
                {/* 4 Studio Environments */}
                <div>
                  <h4 className="text-[11px] font-tech uppercase text-zinc-400 tracking-wider mb-2">
                    Showroom Environments
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ENVIRONMENT_THEMES.map((env) => {
                      const isSelected = currentEnv.id === env.id;
                      return (
                        <button
                          key={env.id}
                          onClick={() => {
                            soundEngine.playUiClick();
                            onChangeEnv(env);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400 font-bold'
                              : 'border-white/10 bg-black/30 text-zinc-300 hover:border-white/25'
                          }`}
                        >
                          <span className="text-xs font-tech uppercase tracking-wider block">
                            {env.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mode Toggles: Wind Tunnel & Wireframe */}
                <div className="flex items-center gap-3 pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      onToggleWindTunnel();
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-tech uppercase tracking-wider transition-all ${
                      windTunnelActive
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'border-white/10 bg-black/30 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Wind Tunnel (CFD)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      onToggleWireframe();
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-tech uppercase tracking-wider transition-all ${
                      wireframeActive
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-white/10 bg-black/30 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>X-Ray Wireframe</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
