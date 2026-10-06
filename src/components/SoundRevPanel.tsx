import React, { useState, useEffect } from 'react';
import { Power, Flame } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface SoundRevPanelProps {
  isEngineRunning: boolean;
  onToggleEngine: () => void;
  isRevving: boolean;
  onRevStart: () => void;
  onRevEnd: () => void;
}

export const SoundRevPanel: React.FC<SoundRevPanelProps> = ({
  isEngineRunning,
  onToggleEngine,
  isRevving,
  onRevStart,
  onRevEnd,
}) => {
  const [rpm, setRpm] = useState(850);

  // Poll current RPM from sound engine
  useEffect(() => {
    let animId: number;
    const poll = () => {
      setRpm(soundEngine.getRpm());
      animId = requestAnimationFrame(poll);
    };
    animId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(animId);
  }, []);

  const rpmPercent = Math.min(100, Math.max(0, ((rpm - 800) / (9500 - 800)) * 100));
  const isRedlining = rpm >= 8500;

  return (
    <aside className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-end gap-3">
      {/* V12 Digital Tachometer Display */}
      <div className="pointer-events-auto glass-panel p-3.5 rounded-2xl w-44 md:w-48 text-right shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-tech text-yellow-400 uppercase tracking-widest font-bold">
            V12 TACHO
          </span>
          <span
            className={`text-[9px] font-tech px-1.5 py-0.5 rounded ${
              isEngineRunning
                ? isRedlining
                  ? 'bg-red-500 text-white animate-pulse font-bold'
                  : 'bg-emerald-500/20 text-emerald-400'
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            {isEngineRunning ? (isRedlining ? 'REDLINE!' : 'IDLE 850') : 'OFF'}
          </span>
        </div>

        {/* RPM Number */}
        <div className="flex items-baseline justify-end gap-1">
          <span
            className={`text-2xl md:text-3xl font-black font-tech tracking-tight transition-colors ${
              isRedlining ? 'text-red-500 animate-pulse' : isEngineRunning ? 'text-white' : 'text-zinc-600'
            }`}
          >
            {isEngineRunning ? rpm.toLocaleString() : '0'}
          </span>
          <span className="text-[10px] text-zinc-400 font-tech uppercase">RPM</span>
        </div>

        {/* Dynamic RPM Progress Bar */}
        <div className="w-full bg-zinc-900 rounded-full h-2 mt-2 overflow-hidden border border-white/10 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              isRedlining
                ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600'
                : 'bg-gradient-to-r from-emerald-500 to-yellow-400'
            }`}
            style={{ width: `${isEngineRunning ? rpmPercent : 0}%` }}
          />
        </div>

        <div className="flex justify-between text-[8px] font-tech text-zinc-500 mt-1">
          <span>0</span>
          <span>4K</span>
          <span className="text-red-400 font-bold">9.5K MAX</span>
        </div>
      </div>

      {/* Lamborghini Fighter Jet Start/Stop Ignition Button */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div className="relative group">
          {/* Flip guard cover styling */}
          <button
            onClick={() => {
              soundEngine.playUiClick();
              onToggleEngine();
            }}
            className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 border-2 shadow-2xl ${
              isEngineRunning
                ? 'bg-gradient-to-b from-red-600 to-red-900 border-red-500 shadow-red-500/40 text-white'
                : 'bg-gradient-to-b from-zinc-800 to-zinc-950 border-yellow-500/40 shadow-yellow-500/20 text-yellow-400 hover:border-yellow-400'
            }`}
          >
            <Power className={`w-6 h-6 mb-1 ${isEngineRunning ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-tech font-bold uppercase tracking-wider">
              {isEngineRunning ? 'ENGINE ON' : 'START V12'}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Gas Pedal REV Button */}
      <div className="pointer-events-auto">
        <button
          onMouseDown={onRevStart}
          onMouseUp={onRevEnd}
          onTouchStart={onRevStart}
          onTouchEnd={onRevEnd}
          disabled={!isEngineRunning}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-tech uppercase text-xs tracking-wider transition-all shadow-xl active:scale-95 ${
            !isEngineRunning
              ? 'bg-zinc-900/60 text-zinc-600 border border-white/5 cursor-not-allowed'
              : isRevving
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold border border-orange-400 shadow-orange-500/50 scale-105'
              : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/40'
          }`}
        >
          <Flame className={`w-4 h-4 ${isRevving ? 'text-yellow-200 animate-bounce' : 'text-yellow-400'}`} />
          <span>{isRevving ? 'SCREAMING V12!' : 'HOLD TO REV'}</span>
        </button>
      </div>
    </aside>
  );
};
