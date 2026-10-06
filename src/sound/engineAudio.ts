/**
 * Procedural Web Audio API Sound Engine for Lamborghini 6.5L V12
 * Zero external audio assets required - synthesized in real-time.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentRpm: number = 850;
  private targetRpm: number = 850;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private oscMain: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private distortion: WaveShaperNode | null = null;

  // Animation frame for smooth RPM audio update
  private animFrameId: number | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create a mild distortion curve for exhaust rasp
  private makeDistortionCurve(amount = 20) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public startEngine() {
    this.initContext();
    if (!this.ctx || this.isRunning) return;

    this.isRunning = true;
    this.currentRpm = 850;
    this.targetRpm = 850;

    const now = this.ctx.currentTime;

    // Play starter motor crank sequence
    this.playStarterSound();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, now);
    this.masterGain.connect(this.ctx.destination);

    // Engine bus
    this.engineGain = this.ctx.createGain();
    // Fade in after starter crank
    this.engineGain.gain.setValueAtTime(0.001, now);
    this.engineGain.gain.exponentialRampToValueAtTime(0.8, now + 0.6);

    // Distortion
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(15);
    this.distortion.oversample = '2x';

    // Resonant Filter simulating exhaust pipe acoustics
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(400, now);
    this.filter.Q.setValueAtTime(4.0, now);

    // V12 fundamental frequency: 6 combustions per revolution
    // 850 RPM / 60 * 6 = 85 Hz
    const baseFreq = (this.currentRpm / 60) * 6;

    // Sub rumble
    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'sine';
    this.oscSub.frequency.setValueAtTime(baseFreq * 0.5, now);

    // Main cylinder roar
    this.oscMain = this.ctx.createOscillator();
    this.oscMain.type = 'sawtooth';
    this.oscMain.frequency.setValueAtTime(baseFreq, now);

    // High harmonic metallic scream
    this.oscHarmonic = this.ctx.createOscillator();
    this.oscHarmonic.type = 'triangle';
    this.oscHarmonic.frequency.setValueAtTime(baseFreq * 2.0, now);

    // Mix oscillators
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.5, now);
    this.oscSub.connect(subGain);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.7, now);
    this.oscMain.connect(mainGain);

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.35, now);
    this.oscHarmonic.connect(harmGain);

    subGain.connect(this.distortion);
    mainGain.connect(this.distortion);
    harmGain.connect(this.distortion);

    this.distortion.connect(this.filter);
    this.filter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.oscSub.start(now);
    this.oscMain.start(now);
    this.oscHarmonic.start(now);

    this.startAudioLoop();
  }

  private playStarterSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Starter motor chirp
    const starterOsc = this.ctx.createOscillator();
    const starterGain = this.ctx.createGain();

    starterOsc.type = 'square';
    starterOsc.frequency.setValueAtTime(140, now);
    starterOsc.frequency.linearRampToValueAtTime(220, now + 0.4);

    starterGain.gain.setValueAtTime(0.12, now);
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    starterOsc.connect(starterGain);
    starterGain.connect(this.ctx.destination);

    starterOsc.start(now);
    starterOsc.stop(now + 0.5);

    // Initial ignition roar
    const ignOsc = this.ctx.createOscillator();
    const ignGain = this.ctx.createGain();
    ignOsc.type = 'sawtooth';
    ignOsc.frequency.setValueAtTime(280, now + 0.4);
    ignOsc.frequency.exponentialRampToValueAtTime(90, now + 0.9);

    ignGain.gain.setValueAtTime(0.001, now);
    ignGain.gain.setValueAtTime(0.3, now + 0.4);
    ignGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    ignOsc.connect(ignGain);
    ignGain.connect(this.ctx.destination);

    ignOsc.start(now + 0.4);
    ignOsc.stop(now + 1.0);
  }

  public stopEngine() {
    if (!this.isRunning || !this.ctx) return;

    const now = this.ctx.currentTime;
    if (this.engineGain) {
      this.engineGain.gain.cancelScheduledValues(now);
      this.engineGain.gain.setValueAtTime(this.engineGain.gain.value, now);
      this.engineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    }

    setTimeout(() => {
      try {
        this.oscSub?.stop();
        this.oscMain?.stop();
        this.oscHarmonic?.stop();
      } catch {
        // already stopped
      }
      this.isRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }, 850);
  }

  public setRpm(rpm: number) {
    this.targetRpm = Math.max(800, Math.min(9500, rpm));
  }

  public revEngine(isPressingGas: boolean) {
    if (!this.isRunning) return;
    if (isPressingGas) {
      this.targetRpm = 8600 + Math.random() * 800; // Scream near redline
    } else {
      this.targetRpm = 850; // Idle
    }
  }

  private startAudioLoop() {
    const update = () => {
      if (!this.isRunning || !this.ctx) return;

      // Smooth RPM lerp with throttle response
      const lerpFactor = this.targetRpm > this.currentRpm ? 0.08 : 0.04;
      this.currentRpm += (this.targetRpm - this.currentRpm) * lerpFactor;

      const now = this.ctx.currentTime;
      const baseFreq = (this.currentRpm / 60) * 6; // 6 combustions per rev

      if (this.oscSub && this.oscMain && this.oscHarmonic && this.filter) {
        this.oscSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.03);
        this.oscMain.frequency.setTargetAtTime(baseFreq, now, 0.03);
        this.oscHarmonic.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.03);

        // Filter opens up as RPM rises (throatier V12 scream)
        const filterFreq = 300 + (this.currentRpm / 9500) * 4200;
        this.filter.frequency.setTargetAtTime(filterFreq, now, 0.05);
      }

      // Occasional exhaust pop/backfire on rapid decel
      if (this.currentRpm > 4000 && this.targetRpm < this.currentRpm && Math.random() < 0.04) {
        this.triggerBackfire();
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  public triggerBackfire() {
    if (!this.ctx || !this.isRunning || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Synthesize noise crackle
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const popFilter = this.ctx.createBiquadFilter();
    popFilter.type = 'bandpass';
    popFilter.frequency.setValueAtTime(1200, now);
    popFilter.Q.setValueAtTime(2.5, now);

    const popGain = this.ctx.createGain();
    popGain.gain.setValueAtTime(0.4, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    whiteNoise.connect(popFilter);
    popFilter.connect(popGain);
    popGain.connect(this.ctx.destination);

    whiteNoise.start(now);
  }

  public playDoorSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Pneumatic whoosh + metallic latch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playSpoilerSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Electric servo whir
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.linearRampToValueAtTime(450, now + 0.4);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playUiClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, now);
    }
    return !this.isMuted;
  }

  public getRpm(): number {
    return Math.round(this.currentRpm);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const soundEngine = new SoundEngine();
