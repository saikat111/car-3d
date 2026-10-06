import React from 'react';
import { Volume2, VolumeX, Gauge, Zap, Sparkles, Compass, Camera } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface NavigationProps {
  mode: 'studio' | 'drive';
  onToggleMode: (mode: 'studio' | 'drive') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSpecs: () => void;
  onOpenSprintTest: () => void;
  onOpenRealGallery: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  mode,
  onToggleMode,
  soundEnabled,
  onToggleSound,
  onOpenSpecs,
  onOpenSprintTest,
  onOpenRealGallery,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 pointer-events-none flex items-center justify-between">
      {/* Brand & Supercar Name */}
      <div className="pointer-events-auto flex items-center gap-3 md:gap-4">
        {/* Lamborghini Gold Shield Emblem */}
        <div className="relative group cursor-pointer">
          <div className="w-10 h-11 md:w-12 md:h-13 bg-gradient-to-b from-yellow-500 via-amber-600 to-yellow-700 clip-hexagon flex items-center justify-center p-0.5 shadow-lg shadow-yellow-500/25 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-zinc-950 clip-hexagon flex items-center justify-center">
              <span className="text-yellow-400 font-black text-sm md:text-base font-heading tracking-tighter">
                🐂
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-black font-heading tracking-widest text-white uppercase drop-shadow-md">
              LAMBORGHINI
            </h1>
            <span className="px-1.5 py-0.5 bg-yellow-500 text-black text-[9px] md:text-[10px] font-bold font-tech uppercase tracking-wider rounded-sm">
              REAL 3D & 4K
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-zinc-400 font-tech uppercase tracking-widest">
            AVENTADOR SVJ & REVUELTO • SANT’AGATA BOLOGNESE
          </p>
        </div>
      </div>

      {/* Center Mode Switcher */}
      <div className="pointer-events-auto hidden md:flex items-center bg-black/70 backdrop-blur-xl border border-white/10 p-1 rounded-full shadow-2xl">
        <button
          onClick={() => {
            soundEngine.playUiClick();
            onToggleMode('studio');
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-tech font-bold uppercase tracking-wider transition-all ${
            mode === 'studio'
              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Real 3D Studio
        </button>

        <button
          onClick={() => {
            soundEngine.playUiClick();
            onToggleMode('drive');
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-tech font-bold uppercase tracking-wider transition-all ${
            mode === 'drive'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Race Drive Mode
        </button>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
        {/* Real 4K Photography Showcase Button */}
        <button
          onClick={() => {
            soundEngine.playUiClick();
            onOpenRealGallery();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-bold border border-yellow-400 text-xs font-tech uppercase tracking-wider rounded-md backdrop-blur-md transition-all shadow-lg shadow-yellow-500/25 active:scale-95"
          title="Open Real Lamborghini 4K Photography Gallery"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Real 4K Gallery</span>
        </button>

        {/* 0-100 Sprint Test */}
        <button
          onClick={() => {
            soundEngine.playUiClick();
            onOpenSprintTest();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400 text-xs font-tech uppercase tracking-wider rounded-md backdrop-blur-md transition-all shadow-md active:scale-95"
          title="Simulate 0-100 km/h Launch Control"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>0-100 Test</span>
        </button>

        {/* Technical Specs Button */}
        <button
          onClick={() => {
            soundEngine.playUiClick();
            onOpenSpecs();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 hover:border-white/30 text-xs font-tech uppercase tracking-wider rounded-md backdrop-blur-md transition-all shadow-md active:scale-95"
          title="Vehicle Dossier & Engineering Specs"
        >
          <Gauge className="w-3.5 h-3.5 text-yellow-400" />
          <span className="hidden sm:inline">Specs</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-md border backdrop-blur-md transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400'
              : 'bg-zinc-900/80 border-white/10 text-zinc-500'
          }`}
          title={soundEnabled ? 'Mute V12 Audio' : 'Unmute V12 Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
