# 🏎️ LAMBORGHINI 3D EXPERIENCE — Real Supercar WebGL Configurator

[![Three.js](https://img.shields.io/badge/Three.js-r180-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An immersive, luxury 3D automotive experience showcasing the legendary **Lamborghini Aventador SVJ & Revuelto HPEV V12** with real-time WebGL 3D rendering, authentic 4K cinema photography, procedural engine sound synthesis, dynamic race driving simulation, and Italian design aesthetics.

---

## 🌟 Key Highlights & Features

### 1. 🏎️ Authentic 3D Lamborghini Model & PBR Materials
- **High-Polygon Automotive Geometry**: Features real Lamborghini body lines, sculpted aerodynamic vents, carbon-ceramic brake discs, Brembo calipers, forged alloy rims, low-profile Pirelli P-Zero tires, crystalline headlight lenses, and signature titanium exhaust tips.
- **Physical Automotive Clearcoat (`MeshPhysicalMaterial`)**: Realistic clearcoat reflection, metalness, and roughness mapped to simulate factory Italian pearlescent and satin finishes.

### 2. 🎨 Paint Shop & Real-Time Customizer
- **Iconic Factory Colors**:
  - *Giallo Auge / Orion* (Pearl Yellow)
  - *Verde Mantis / Ithaca* (Acid Toxic Green)
  - *Arancio Argos* (Deep Pearl Orange)
  - *Rosso Bia / Mars* (Metallic Crimson)
  - *Viola Pasifae* (Royal Metallic Violet)
  - *Blu Cepheus* (Riviera Cyan Blue)
  - *Nero Nemesis* (Stealth Matte Black)
  - *Bianco Monocerus* (Polar Ice Pearl White)
- **Finish Options**: Gloss Metallic, Satin Matte, and Exposed Carbon Fiber.
- **Wheels & Calipers**: Forged Bronze, Diamond Cut Titanium, Gloss Nero, and Argento Silver rims with customizable Brembo calipers (Yellow, Red, Green, Orange, Silver).

### 3. 📷 Real 4K Cinema Photography Gallery
- Dedicated **Real 4K Gallery** modal featuring authentic high-resolution photography of real Lamborghinis in Santa’Agata Bolognese, Monaco, and European circuits:
  - *Aventador SVJ Giallo Studio Portrait*
  - *Aerodynamic Rear Diffuser & Beast Titanium Exhaust*
  - *Verde Mantis Monza Track Attack*
  - *Arancio Argos Golden Hour Stance*
  - *Fighter Jet Cockpit Interior, Carbon Steering Wheel & Start Cover*
  - *Nürburgring Apex Cornering*
  - *Signature Scissor Doors Deployed in Atelier*
- Interactive category filtering, full-screen view, and technical dossier breakdowns.

### 4. 🔊 Procedural 6.5L Naturally Aspirated V12 Sound Synthesizer
- **Zero External Audio Downloads**: Synthesized in real time purely via the **Web Audio API**.
- **Fighter Jet Start/Stop Button**: Starter motor crank sequence transitions into deep V12 rhythmic idle rumble (850 RPM).
- **Interactive Gas Pedal / Rev Button**: Modulates RPM up to screaming 9,500 RPM redline with harmonic overtone shrieks, exhaust backfire crackles, and physical flame particles shooting from the hexagonal exhausts!

### 5. 🕹️ Interactive Race Drive Simulation Mode
- Seamlessly switch between **Studio Showroom** and **Race Drive Mode**:
  - `W` / `↑` : Throttle / Accelerate
  - `S` / `↓` : Brake / Reverse
  - `A` / `D` or `←` / `→` : Steer (with real-time front wheel turning angle)
  - `SPACE` : Handbrake & Burnout Drift (triggers rear tire smoke particles)
- Dynamic third-person chase camera with velocity-based inertia and spring tracking.
- Digital cockpit telemetry HUD: Speedometer (0–350+ km/h), 8-speed DCT gear readout, RPM gauge, and drift alerts.

### 6. ⏱️ 0-100 km/h Launch Control Benchmark Test
- Launch control simulation with 3-2-1 countdown, camera shake, all-wheel-drive torque bite, timer clocking down to 2.50 seconds, and celebratory confetti!

### 7. 🎬 Director Camera Presets & 3D Hotspots
- 6 Cinematic Director Angles: *Hero 3/4*, *Front Fascia*, *Side Aero*, *Beast Rear*, *Cockpit POV*, and *Top Drone*.
- 4 Interactive 3D Hotspots on the car body:
  1. *Monofuselage Carbon Chassis*
  2. *6.5L Naturally Aspirated V12 Hybrid Powertrain*
  3. *Active Aerodynamics & Aero Wing*
  4. *CCMR Plus Carbon-Ceramic Brakes*

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or later)
- `npm` or `pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/saikat111/car-3d.git
cd car-3d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19 + TypeScript
- **3D Graphics & WebGL**: Three.js + OrbitControls + GLTFLoader
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 + Glassmorphism UI
- **Icons**: Lucide React
- **Audio**: Web Audio API (Procedural V12 synthesis)
- **Effects**: Canvas Confetti + Custom Particle Systems (Exhaust Flames, Tire Smoke, CFD Streamlines)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Lamborghini, Aventador, Revuelto, and associated marks are trademarks of Automobili Lamborghini S.p.A. This project is created for educational and design showcase purposes.
