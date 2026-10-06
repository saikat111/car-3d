import React from 'react';
import { DriveTelemetry } from '../types/car';
import { ArrowLeft, Compass } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface DriveHUDProps {
  telemetry: DriveTelemetry;
  onExitDrive: () => void;
}

export const DriveHUD: React.FC<DriveHUDProps> = ({ telemetry, onExitDrive }) => {
  const isHighSpeed = telemetry.speedKmh > 200;
  const isRedline = telemetry.rpm > 8500;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar with Exit Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playUiClick();
            onExitDrive();
          }}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-yellow-400 border border-yellow-500/40 backdrop-blur-md text-xs font-tech uppercase tracking-wider transition-all shadow-xl active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Studio</span>
        </button>

        {/* Driving Status Badge */}
        <div className="flex items-center gap-3">
          {telemetry.isDrifting && (
            <div className="px-3 py-1 bg-red-600/90 text-white text-xs font-tech font-bold uppercase tracking-widest rounded-md animate-pulse shadow-lg shadow-red-500/40">
              DRIFTING / BURNOUT
            </div>
          )}
          <div className="px-3 py-1 bg-zinc-900/80 border border-white/10 text-zinc-300 text-xs font-tech uppercase tracking-wider rounded-md backdrop-blur-md">
            CORSA TRACK MODE
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Cluster */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        {/* Driving Controls Legend */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/10 text-xs font-tech text-zinc-300 backdrop-blur-xl">
          <div className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold mb-2">
            PILOT CONTROLS
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-mono text-[10px] border border-white/10">W / ↑</span>
              <span>Throttle</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-mono text-[10px] border border-white/10">S / ↓</span>
              <span>Brake / Reverse</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-mono text-[10px] border border-white/10">A / D</span>
              <span>Steer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-mono text-[10px] border border-white/10">SPACE</span>
              <span>Handbrake</span>
            </div>
          </div>
        </div>

        {/* Central Supercar Telemetry Instrument Cluster */}
        <div className="glass-panel-glow p-5 rounded-3xl flex items-center gap-6 border border-yellow-500/30">
          {/* Gear Indicator */}
          <div className="text-center px-3 border-r border-white/10">
            <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-wider block">
              GEAR
            </span>
            <span className="text-4xl md:text-5xl font-black font-tech text-yellow-400">
              {telemetry.gear}
            </span>
          </div>

          {/* Speedometer */}
          <div className="text-center min-w-28 md:min-w-32">
            <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-wider block">
              SPEED
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className={`text-5xl md:text-6xl font-black font-tech tracking-tight transition-colors ${
                  isHighSpeed ? 'text-red-500' : 'text-white'
                }`}
              >
                {telemetry.speedKmh}
              </span>
              <span className="text-xs font-tech text-zinc-400 uppercase">KM/H</span>
            </div>
          </div>

          {/* RPM & Throttle Bar */}
          <div className="w-28 md:w-36 flex flex-col justify-center border-l border-white/10 pl-3">
            <div className="flex items-center justify-between text-[10px] font-tech text-zinc-400 mb-1">
              <span>RPM</span>
              <span className={`font-bold ${isRedline ? 'text-red-500' : 'text-zinc-200'}`}>
                {telemetry.rpm}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-white/10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  isRedline
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                }`}
                style={{ width: `${Math.min(100, (telemetry.rpm / 9500) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[8px] font-tech text-zinc-500 mt-1">
              <span>0</span>
              <span className="text-red-400">9500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
