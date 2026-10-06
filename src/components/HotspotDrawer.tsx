import React from 'react';
import { HotspotInfo } from '../types/car';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

interface HotspotDrawerProps {
  hotspot: HotspotInfo | null;
  onClose: () => void;
}

export const HotspotDrawer: React.FC<HotspotDrawerProps> = ({ hotspot, onClose }) => {
  if (!hotspot) return null;

  return (
    <div className="absolute top-20 right-4 md:right-8 z-40 w-full max-w-sm pointer-events-none animate-slide-left">
      <div className="pointer-events-auto glass-panel-glow p-5 rounded-3xl border border-yellow-500/40 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-tech text-yellow-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AERONAUTIC COMPONENT</span>
            </div>
            <h3 className="text-base font-black font-heading text-white uppercase mt-0.5">
              {hotspot.title}
            </h3>
            <p className="text-xs text-zinc-400 font-tech">{hotspot.subtitle}</p>
          </div>

          <button
            onClick={() => {
              soundEngine.playUiClick();
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="py-3 text-xs text-zinc-300 font-tech leading-relaxed">
          {hotspot.description}
        </p>

        {/* Specifications grid */}
        <div className="bg-black/50 rounded-2xl p-3 border border-white/10 space-y-2">
          {hotspot.specs.map((spec, i) => (
            <div key={i} className="flex items-center justify-between text-xs font-tech">
              <span className="text-zinc-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-yellow-400" />
                {spec.label}:
              </span>
              <span className="font-bold text-white">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
