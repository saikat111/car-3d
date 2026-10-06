import React, { useState } from 'react';
import { X, Sparkles, ChevronLeft, ChevronRight, Eye, Shield, Cpu, Gauge } from 'lucide-react';
import { soundEngine } from '../sound/engineAudio';

export interface RealCarPhoto {
  id: string;
  title: string;
  subtitle: string;
  model: string;
  category: 'exterior' | 'interior' | 'track' | 'detail';
  imageUrl: string;
  location: string;
  specs: {
    engine: string;
    power: string;
    topSpeed: string;
    zeroToHundred: string;
  };
  description: string;
}

export const REAL_CAR_PHOTOS: RealCarPhoto[] = [
  {
    id: 'aventador-yellow',
    title: 'Lamborghini Aventador SVJ',
    subtitle: 'Sant’Agata Bolognese Studio Edition',
    model: 'Aventador SVJ LP 770-4',
    category: 'exterior',
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=2400&q=85',
    location: 'Sant’Agata Bolognese, Italy',
    specs: {
      engine: '6.5L Naturally Aspirated V12',
      power: '770 CV (759 HP)',
      topSpeed: '>352 km/h',
      zeroToHundred: '2.8 s',
    },
    description:
      'The pinnacle of naturally aspirated V12 performance. Equipped with patented Aerodinamica Lamborghini Attiva (ALA 2.0) dynamic active aero management and lightweight forged carbon monofuselage.',
  },
  {
    id: 'aventador-rear',
    title: 'Aerodynamic Beast Diffuser',
    subtitle: 'High-Mount Titanium Exhaust & ALA Wing',
    model: 'Aventador LP 700-4',
    category: 'detail',
    imageUrl: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=2400&q=85',
    location: 'Monaco Harbor Paddock',
    specs: {
      engine: 'Mid-Mounted Longitudinal V12',
      power: '700 CV',
      topSpeed: '350 km/h',
      zeroToHundred: '2.9 s',
    },
    description:
      'Massive carbon fiber ground-effect rear diffuser paired with high-temperature titanium central exhaust geometry delivering the unfiltered Sant’Agata V12 harmonic scream.',
  },
  {
    id: 'superveloce-green',
    title: 'Verde Mantis Superveloce',
    subtitle: 'Track Day Aerodynamic Attack Stance',
    model: 'Huracán STO / SV Spec',
    category: 'track',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2400&q=85',
    location: 'Autodromo Nazionale Monza',
    specs: {
      engine: '5.2L Naturally Aspirated V10 / V12 Aero',
      power: '640 CV Track Tune',
      topSpeed: '325 km/h',
      zeroToHundred: '3.0 s',
    },
    description:
      'Aggressive shark fin aerodynamic stabilizer, roof-scoop induction cooling, and magnesium forged center-lock wheels wrapped in bespoke Bridgestone Potenza race compounds.',
  },
  {
    id: 'arancio-side',
    title: 'Arancio Argos Wedge Silhouette',
    subtitle: 'Golden Hour Supercar Profile',
    model: 'Aventador LP 700-4 Roadster',
    category: 'exterior',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2400&q=85',
    location: 'Tuscan Hillclimb Route',
    specs: {
      engine: '6.5L NA V12 60° Bank Angle',
      power: '700 CV',
      topSpeed: '350 km/h',
      zeroToHundred: '2.9 s',
    },
    description:
      'The unmistakable Gandini wedge profile reimagined for the modern era. Scissor door cutouts channel high-velocity air directly into the side radiator intake scoops.',
  },
  {
    id: 'cockpit-interior',
    title: 'Fighter Jet Pilot Cockpit',
    subtitle: 'Alcantara, Forged Carbon & Anodized Start Cover',
    model: 'Aventador Cockpit Interior',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2400&q=85',
    location: 'Centro Stile Atelier',
    specs: {
      engine: 'Driver Telemetry TFT Cluster',
      power: 'G-Force Accelerometer',
      topSpeed: 'Carbon Paddle Shifters',
      zeroToHundred: 'Strada / Sport / Corsa Modes',
    },
    description:
      'Every control angled toward the driver. The signature red flip-cover ignition switch evokes military fighter jets, flanked by carbon fiber paddle shifters and digital tachometer telemetry.',
  },
  {
    id: 'track-apex',
    title: 'High-Downforce Apex Sprint',
    subtitle: 'All-Wheel Drive Torque Vectoring',
    model: 'Lamborghini Motorsport Edition',
    category: 'track',
    imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=2400&q=85',
    location: 'Nürburgring Nordschleife',
    specs: {
      engine: 'Haldex Gen IV AWD System',
      power: 'Pushrod Magnetorheological Suspension',
      topSpeed: '350+ km/h',
      zeroToHundred: '2.8 s',
    },
    description:
      'Pushrod suspension inspired by Formula 1 with active dampers neutralizing roll. Electronic stability systems calibrated for maximum yaw angle in Corsa track mode.',
  },
  {
    id: 'scissor-doors',
    title: 'Iconic Scissor Doors Deployed',
    subtitle: 'Signature Dihedral Architecture',
    model: 'Aventador Atelier Showcase',
    category: 'detail',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2400&q=85',
    location: 'Bologna Automotive Exhibition',
    specs: {
      engine: 'Dihedral Hydraulic Struts',
      power: 'Full Carbon Fiber Monocoque',
      topSpeed: 'Aeronautic Fuselage',
      zeroToHundred: 'Pure Automotive Art',
    },
    description:
      'A hallmark of V12 Lamborghini halo cars since the Countach LP 400. Rotating vertically to allow effortless entry even against tight curbs.',
  },
];

interface RealCarGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealCarGallery: React.FC<RealCarGalleryProps> = ({ isOpen, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'exterior' | 'interior' | 'track' | 'detail'>('all');

  if (!isOpen) return null;

  const filteredPhotos = REAL_CAR_PHOTOS.filter(
    (p) => activeFilter === 'all' || p.category === activeFilter
  );

  const currentPhoto = REAL_CAR_PHOTOS[selectedIdx] || REAL_CAR_PHOTOS[0];

  const handlePrev = () => {
    soundEngine.playUiClick();
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : REAL_CAR_PHOTOS.length - 1));
  };

  const handleNext = () => {
    soundEngine.playUiClick();
    setSelectedIdx((prev) => (prev < REAL_CAR_PHOTOS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] glass-panel-glow rounded-3xl border border-yellow-500/40 overflow-hidden flex flex-col shadow-2xl">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 bg-yellow-400 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-heading tracking-widest text-white uppercase">
                  REAL LAMBORGHINI 4K CINEMA GALLERY
                </h2>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] font-tech uppercase rounded font-bold">
                  AUTHENTIC PHOTOGRAPHY
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-tech">
                Factory Masterpieces & Track Shots • High-Resolution Media
              </p>
            </div>
          </div>

          {/* Filter Pills & Close */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
              {(['all', 'exterior', 'interior', 'track', 'detail'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playUiClick();
                    setActiveFilter(cat);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                    activeFilter === cat
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
        </div>

        {/* Main Content Area: Large Photo Display + Specs Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Large Hero Image Viewer (8 cols) */}
          <div className="relative lg:col-span-8 bg-black flex items-center justify-center overflow-hidden group">
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90"
              title="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90"
              title="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Overlay Caption on Image */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <span className="text-[10px] font-tech text-yellow-400 uppercase tracking-widest font-bold block">
                {currentPhoto.location}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white uppercase drop-shadow-md">
                {currentPhoto.title}
              </h3>
              <p className="text-xs text-zinc-300 font-tech">{currentPhoto.subtitle}</p>
            </div>
          </div>

          {/* Details & Specifications Panel (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-zinc-950/90 border-l border-white/10 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-tech text-yellow-400 uppercase tracking-widest font-bold">
                  MODEL DOSSIER
                </span>
                <h4 className="text-xl font-black font-heading text-white uppercase mt-0.5">
                  {currentPhoto.model}
                </h4>
                <p className="text-xs text-zinc-400 font-tech mt-2 leading-relaxed">
                  {currentPhoto.description}
                </p>
              </div>

              {/* Performance Specs Table */}
              <div className="bg-black/50 rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="text-[10px] font-tech text-zinc-400 uppercase tracking-widest font-bold">
                  FACTORY BENCHMARKS
                </div>

                <div className="flex items-center justify-between text-xs font-tech border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-yellow-400" />
                    Powertrain
                  </span>
                  <span className="font-bold text-white text-right">{currentPhoto.specs.engine}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-tech border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-yellow-400" />
                    Output
                  </span>
                  <span className="font-bold text-yellow-400">{currentPhoto.specs.power}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-tech border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                    Top Speed
                  </span>
                  <span className="font-bold text-white">{currentPhoto.specs.topSpeed}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-tech">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    0-100 km/h
                  </span>
                  <span className="font-bold text-yellow-400">{currentPhoto.specs.zeroToHundred}</span>
                </div>
              </div>
            </div>

            {/* Bottom Photography Index */}
            <div className="pt-4 border-t border-white/10 text-xs font-tech text-zinc-400 flex items-center justify-between">
              <span>PHOTO {selectedIdx + 1} OF {REAL_CAR_PHOTOS.length}</span>
              <span className="text-yellow-400 font-bold uppercase">4K ULTRA-HD</span>
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Filmstrip */}
        <div className="p-3 bg-black/90 border-t border-white/10 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2.5">
            {REAL_CAR_PHOTOS.map((p, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEngine.playUiClick();
                    setSelectedIdx(idx);
                  }}
                  className={`relative shrink-0 w-24 h-15 rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-yellow-400 scale-105 shadow-lg shadow-yellow-500/40'
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
