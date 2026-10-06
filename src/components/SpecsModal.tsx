import React from 'react';
import { X, Cpu, Zap, Wind, Shield, Award } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-yellow-500/30 overflow-hidden shadow-2xl">
        {/* Header with Italian flag stripe & Close button */}
        <div className="relative px-6 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-green-500 via-white to-red-500 rounded-full" />
            <div>
              <h2 className="text-xl md:text-2xl font-black font-heading tracking-widest text-white uppercase">
                LAMBORGHINI REVUELTO
              </h2>
              <p className="text-xs text-yellow-400 font-tech uppercase tracking-wider">
                Official Engineering Dossier • Sant’Agata Bolognese
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playUiClick();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-widest block">
                MAX POWER
              </span>
              <span className="text-2xl md:text-3xl font-black font-tech text-yellow-400">
                1,015 CV
              </span>
              <span className="text-[9px] text-zinc-500 font-tech block mt-0.5">1,001 HP Total</span>
            </div>

            <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-widest block">
                0-100 KM/H
              </span>
              <span className="text-2xl md:text-3xl font-black font-tech text-yellow-400">
                2.5 s
              </span>
              <span className="text-[9px] text-zinc-500 font-tech block mt-0.5">Launch Control</span>
            </div>

            <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-widest block">
                TOP SPEED
              </span>
              <span className="text-2xl md:text-3xl font-black font-tech text-yellow-400">
                &gt;350
              </span>
              <span className="text-[9px] text-zinc-500 font-tech block mt-0.5">km/h (217+ mph)</span>
            </div>

            <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-widest block">
                REDLINE
              </span>
              <span className="text-2xl md:text-3xl font-black font-tech text-yellow-400">
                9,500
              </span>
              <span className="text-[9px] text-zinc-500 font-tech block mt-0.5">RPM V12 Limit</span>
            </div>
          </div>

          {/* Technical Architecture Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Powertrain */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-tech uppercase text-xs tracking-wider">
                <Cpu className="w-4 h-4" />
                <span className="font-bold">HPEV Hybrid Powertrain</span>
              </div>
              <ul className="text-xs text-zinc-300 font-tech space-y-1.5 pt-1">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Internal Combustion:</span>
                  <span className="font-bold">6.5L Naturally Aspirated V12</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Electric Propulsion:</span>
                  <span className="font-bold">3x Axial-Flux Electric Motors</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Transmission:</span>
                  <span className="font-bold">8-Speed Transverse Dual-Clutch</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Battery Capacity:</span>
                  <span className="font-bold">3.8 kWh High-Power Lithium-Ion</span>
                </li>
              </ul>
            </div>

            {/* Chassis & Aerodynamics */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-tech uppercase text-xs tracking-wider">
                <Shield className="w-4 h-4" />
                <span className="font-bold">Chassis & Aero Package</span>
              </div>
              <ul className="text-xs text-zinc-300 font-tech space-y-1.5 pt-1">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Chassis Tub:</span>
                  <span className="font-bold">Forged Composites Monofuselage</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Torsional Rigidity:</span>
                  <span className="font-bold">61,000 Nm/° (+25%)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Active Wing:</span>
                  <span className="font-bold">3 Electric Aero Positions</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Braking (100-0 km/h):</span>
                  <span className="font-bold">31.5 m (CCMR Plus)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-white/10 flex items-center justify-between text-[11px] font-tech text-zinc-400">
          <span>DESIGNED BY CENTRO STILE LAMBORGHINI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
