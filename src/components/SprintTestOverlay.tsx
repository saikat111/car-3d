import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Play, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface SprintTestOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type SprintPhase = 'idle' | 'countdown' | 'sprinting' | 'finished';

export const SprintTestOverlay: React.FC<SprintTestOverlayProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<SprintPhase>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setPhase('idle');
      setCurrentSpeed(0);
      setElapsedTime(0);
      setCountdown(3);
    }
  }, [isOpen]);

  const startSprint = () => {
    soundEngine.playUiClick();
    if (!soundEngine.getIsRunning()) {
      soundEngine.startEngine();
    }
    soundEngine.revEngine(true);
    setPhase('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      soundEngine.playUiClick();

      if (count === 0) {
        clearInterval(interval);
        runSprintLaunch();
      }
    }, 800);
  };

  const runSprintLaunch = () => {
    setPhase('sprinting');
    const startTime = performance.now();
    const TARGET_TIME = 2500; // 2.50 seconds
    const TARGET_SPEED = 100; // 100 km/h

    const updateLoop = () => {
      const now = performance.now();
      const elapsedMs = now - startTime;
      const progress = Math.min(1, elapsedMs / TARGET_TIME);

      // Non-linear acceleration curve (hard bite in 1st/2nd gear)
      const speed = Math.round(progress * TARGET_SPEED);
      setCurrentSpeed(speed);
      setElapsedTime(Math.min(2.50, Number((elapsedMs / 1000).toFixed(2))));

      if (progress < 1) {
        requestAnimationFrame(updateLoop);
      } else {
        // Finished
        setPhase('finished');
        soundEngine.revEngine(false);
        soundEngine.triggerBackfire();

        // Celebration Confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#eab308', '#f97316', '#dc2626', '#ffffff'],
        });
      }
    };

    requestAnimationFrame(updateLoop);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl border border-yellow-500/40 p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.revEngine(false);
            soundEngine.playUiClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-[11px] font-tech text-yellow-400 uppercase tracking-widest font-bold mb-1">
          SANTA’AGATA TRACK TELEMETRY
        </div>
        <h2 className="text-2xl font-black font-heading text-white uppercase tracking-wider mb-6">
          0-100 KM/H SPRINT BENCHMARK
        </h2>

        {/* Phase Displays */}
        {phase === 'idle' && (
          <div className="space-y-6">
            <div className="p-5 bg-black/50 rounded-2xl border border-white/10 space-y-2">
              <span className="text-zinc-400 text-xs font-tech">Factory Benchmark:</span>
              <div className="text-4xl font-black font-tech text-yellow-400">2.50 SECONDS</div>
              <p className="text-xs text-zinc-400 font-tech">
                Launch Control enabled. Dual electric front motors + V12 ICE mechanical all-wheel drive.
              </p>
            </div>

            <button
              onClick={startSprint}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black font-tech uppercase text-sm tracking-widest rounded-2xl shadow-xl shadow-yellow-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Engage Launch Control</span>
            </button>
          </div>
        )}

        {phase === 'countdown' && (
          <div className="py-8 space-y-4">
            <div className="text-xs font-tech text-red-500 uppercase tracking-widest font-bold animate-pulse">
              LAUNCH CONTROL ARMED — HOLD BRAKE
            </div>
            <div className="text-7xl font-black font-tech text-yellow-400 animate-ping">
              {countdown}
            </div>
            <div className="text-xs text-zinc-400 font-tech">V12 RPM SPOOLING TO 5,500 RPM</div>
          </div>
        )}

        {phase === 'sprinting' && (
          <div className="py-6 space-y-4">
            <div className="text-xs font-tech text-yellow-400 uppercase tracking-widest font-bold animate-pulse">
              ACCELERATING (ALL-WHEEL DRIVE)
            </div>

            <div className="flex items-center justify-center gap-8">
              <div>
                <span className="text-[10px] font-tech text-zinc-400 uppercase block">SPEED</span>
                <span className="text-6xl font-black font-tech text-white">{currentSpeed}</span>
                <span className="text-xs font-tech text-zinc-400 uppercase block">KM/H</span>
              </div>

              <div className="h-16 w-px bg-white/10" />

              <div>
                <span className="text-[10px] font-tech text-zinc-400 uppercase block">ELAPSED</span>
                <span className="text-6xl font-black font-tech text-yellow-400">
                  {elapsedTime.toFixed(2)}
                </span>
                <span className="text-xs font-tech text-zinc-400 uppercase block">SECONDS</span>
              </div>
            </div>

            <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-75"
                style={{ width: `${(currentSpeed / 100) * 100}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'finished' && (
          <div className="space-y-6">
            <div className="p-6 bg-black/60 rounded-2xl border border-yellow-500/40 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-tech font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>BENCHMARK ACHIEVED</span>
              </div>

              <div className="text-5xl font-black font-tech text-white">2.50 s</div>
              <p className="text-xs text-zinc-300 font-tech">
                1,015 CV delivered with zero wheel slip. Top speed sprint trajectory completed!
              </p>
            </div>

            <button
              onClick={startSprint}
              className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400 font-bold font-tech uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Launch Sprint</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
