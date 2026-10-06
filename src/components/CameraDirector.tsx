import React from 'react';
import { CameraPreset } from '../types/car';
import { soundEngine } from '../sound/engineAudio';
import { Video, Shield, Maximize2, RotateCcw, User, Orbit } from 'lucide-react';

interface CameraDirectorProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
}

const PRESETS: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
  { id: 'hero', label: 'Hero 3/4', icon: <Orbit className="w-3.5 h-3.5" /> },
  { id: 'front', label: 'Front Fascia', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'profile', label: 'Side Aero', icon: <Maximize2 className="w-3.5 h-3.5" /> },
  { id: 'rear', label: 'Beast Rear', icon: <RotateCcw className="w-3.5 h-3.5" /> },
  { id: 'cockpit', label: 'Cockpit POV', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'top', label: 'Top Drone', icon: <Video className="w-3.5 h-3.5" /> },
];

export const CameraDirector: React.FC<CameraDirectorProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  return (
    <aside className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col gap-1.5">
      <div className="text-[10px] font-tech text-yellow-400 uppercase tracking-widest pl-1 mb-1 font-bold">
        DIRECTOR ANGLES
      </div>

      {PRESETS.map((p) => {
        const isSelected = currentPreset === p.id;
        return (
          <button
            key={p.id}
            onClick={() => {
              soundEngine.playUiClick();
              onSelectPreset(p.id);
            }}
            className={`pointer-events-auto flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-tech uppercase tracking-wider backdrop-blur-md transition-all ${
              isSelected
                ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/30 scale-105'
                : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
