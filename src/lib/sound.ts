let audioCtx: AudioContext | null = null;
let muted = false;

export function setArcadeMuted(value: boolean) {
  muted = value;
}

export function isArcadeMuted() {
  return muted;
}

function context() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

function tone(frequency: number, duration: number, type: OscillatorType = "square", gain = 0.04) {
  if (muted) return;
  const ctx = context();
  if (!ctx) return;
  void ctx.resume();
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  amp.gain.value = gain;
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const arcadeSfx = {
  coin() {
    tone(880, 0.08);
    setTimeout(() => tone(1320, 0.12), 80);
  },
  click() {
    tone(520, 0.05, "square", 0.03);
  },
  hit() {
    tone(640, 0.05);
    setTimeout(() => tone(980, 0.08), 40);
  },
  combo() {
    tone(740, 0.06);
    setTimeout(() => tone(980, 0.06), 50);
    setTimeout(() => tone(1240, 0.1), 100);
  },
  win() {
    [523, 659, 784, 1046].forEach((freq, i) => {
      setTimeout(() => tone(freq, 0.12, "square", 0.045), i * 90);
    });
  },
  error() {
    tone(180, 0.18, "sawtooth", 0.03);
  },
  serve() {
    tone(660, 0.06);
    setTimeout(() => tone(880, 0.08), 60);
    setTimeout(() => tone(1180, 0.1), 120);
  },
  cook() {
    tone(300, 0.04, "square", 0.025);
  },
  levelup() {
    [392, 523, 659, 784, 1046].forEach((freq, i) => {
      setTimeout(() => tone(freq, 0.12, "square", 0.045), i * 80);
    });
  },
  buy() {
    tone(520, 0.07);
    setTimeout(() => tone(780, 0.1), 70);
  },
};
