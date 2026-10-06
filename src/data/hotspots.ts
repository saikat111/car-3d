import { HotspotInfo } from '../types/car';

export const HOTSPOTS: HotspotInfo[] = [
  {
    id: 'monocoque',
    title: 'Monofuselage Chassis',
    subtitle: 'Aeronautic Carbon Fiber Tub',
    description:
      'Forged Composites carbon fiber aeronautic monocoque engineered in Sant’Agata Bolognese. Delivers 25% higher torsional stiffness than the Aventador while reducing structural chassis weight by 10%.',
    position: [-0.9, 0.7, 0.4],
    specs: [
      { label: 'Torsional Rigidity', value: '61,000 Nm/°' },
      { label: 'Weight Reduction', value: '-10% vs Aventador' },
      { label: 'Front Structure', value: '100% Forged Carbon' },
    ],
  },
  {
    id: 'v12',
    title: '6.5L Naturally Aspirated V12',
    subtitle: 'High-Performance Electrified Vehicle (HPEV)',
    description:
      'The heart of Revuelto & Aventador: the lightest and most powerful V12 in Lamborghini history. Screams up to 9,500 RPM, paired with axial-flux electric motors producing a staggering total output.',
    position: [0, 0.95, -0.9],
    specs: [
      { label: 'Power Output', value: '1,015 CV / 770 CV SVJ' },
      { label: 'Max Engine RPM', value: '9,500 RPM' },
      { label: 'Valves', value: '48-Valve Titanium' },
      { label: '0-100 km/h', value: '2.5 - 2.8 Seconds' },
    ],
  },
  {
    id: 'aero',
    title: 'Active Aerodynamics & Aero Wing',
    subtitle: 'Integrated High-Downforce Package',
    description:
      'Integrated active rear wing adapts across dynamic aerodynamic states: Low Drag, High Downforce, and Airbrake. Increases high-speed stability and cornering grip across circuits worldwide.',
    position: [0, 1.15, -1.9],
    specs: [
      { label: 'Rear Downforce', value: '+74% Downforce' },
      { label: 'Positions', value: 'Active Aero Modes' },
      { label: 'Diffuser Fins', value: 'Vertical Carbon Strakes' },
    ],
  },
  {
    id: 'brakes',
    title: 'CCMR Plus Carbon-Ceramic Brakes',
    subtitle: 'Motorsport Deceleration System',
    description:
      'Carbon Ceramic Material & Resin (CCMR) racing brakes gripped by monobloc calipers, delivering relentless stopping power from 350+ km/h.',
    position: [-1.15, 0.45, 1.45],
    specs: [
      { label: 'Front Discs', value: '410 x 38 mm CCMR' },
      { label: 'Rear Discs', value: '390 x 32 mm CCMR' },
      { label: '100-0 km/h', value: '31.5 Meters' },
    ],
  },
];
