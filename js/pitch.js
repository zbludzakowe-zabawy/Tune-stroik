// Wykrywanie wysokości dźwięku – algorytm YIN (de Cheveigné & Kawahara, 2002).
(() => {
  'use strict';
  let d = new Float32Array(0);

  /**
   * @param {Float32Array} buf  próbki z mikrofonu
   * @param {number} sr         częstotliwość próbkowania
   * @param {number} minF       najniższa szukana częstotliwość
   * @param {number} maxF       najwyższa szukana częstotliwość
   * @returns {{freq:number, clarity:number, rms:number}|null}
   */
  function detectPitch(buf, sr, minF, maxF) {
    const maxLag = Math.min(Math.floor(sr / minF), Math.floor(buf.length / 2));
    const minLag = Math.max(2, Math.floor(sr / maxF));
    const W = Math.min(buf.length - maxLag, 2048);
    if (W < 256) return null;

    let rms = 0;
    for (let i = 0; i < W; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / W);
    if (rms < 0.006) return null; // cisza

    if (d.length < maxLag + 2) d = new Float32Array(maxLag + 2);
    // funkcja różnicowa
    for (let tau = 1; tau <= maxLag + 1; tau++) {
      let sum = 0;
      for (let j = 0; j < W; j++) {
        const diff = buf[j] - buf[j + tau];
        sum += diff * diff;
      }
      d[tau] = sum;
    }
    // skumulowana znormalizowana różnica
    d[0] = 1;
    let running = 0;
    for (let tau = 1; tau <= maxLag + 1; tau++) {
      running += d[tau];
      d[tau] = running > 0 ? (d[tau] * tau) / running : 1;
    }
    // pierwsze minimum poniżej progu
    const TH = 0.15;
    let tau = -1;
    for (let t = minLag; t <= maxLag; t++) {
      if (d[t] < TH) {
        while (t + 1 <= maxLag && d[t + 1] < d[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau < 0) {
      // brak wyraźnego minimum – weź globalne, jeśli wystarczająco dobre
      let best = minLag;
      for (let t = minLag + 1; t <= maxLag; t++) if (d[t] < d[best]) best = t;
      if (d[best] > 0.3) return null;
      tau = best;
    }
    // interpolacja paraboliczna
    let better = tau;
    if (tau > 1 && tau < maxLag + 1) {
      const a = d[tau - 1];
      const b = d[tau];
      const c = d[tau + 1];
      const den = a + c - 2 * b;
      if (den !== 0) better = tau + (a - c) / (2 * den);
    }
    return { freq: sr / better, clarity: 1 - d[tau], rms };
  }

  window.Tuner.detectPitch = detectPitch;
})();
