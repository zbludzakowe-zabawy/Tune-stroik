// Instrumenty: struny jako numery MIDI (69 = a¹ = A4).
// Żeby dodać instrument albo zmienić zakres harfy – wystarczy zmienić tę listę
// i (dla nowego instrumentu) dopisać rysunek w js/drawings.js.
(() => {
  'use strict';

  // Polskie nazwy dźwięków (H zamiast B, „b” to h obniżone)
  const NAMES = ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'b', 'h'];
  const SUP = ['', '¹', '²', '³', '⁴', '⁵'];

  // Notacja polska (Helmholtz): A = wielka oktawa, a = mała, a¹ = razkreślna (440 Hz)…
  function noteName(midi) {
    const n = NAMES[((midi % 12) + 12) % 12];
    const oct = Math.floor(midi / 12) - 1; // oktawa w notacji naukowej
    if (oct <= 2) {
      const big = n.charAt(0).toUpperCase() + n.slice(1);
      return oct === 2 ? big : big + ['', '₁', '₂'][Math.min(2, 2 - oct)];
    }
    return n + SUP[oct - 3];
  }

  const freqOf = (midi, a4) => a4 * Math.pow(2, (midi - 69) / 12);

  // Harfa: kolejne dźwięki diatoniczne (białe klawisze) od A do c²
  function diatonic(from, to) {
    const white = [0, 2, 4, 5, 7, 9, 11];
    const out = [];
    for (let m = from; m <= to; m++) if (white.includes(m % 12)) out.push(m);
    return out;
  }

  const INSTRUMENTS = [
    {
      id: 'guitar', name: 'Gitara', strings: [40, 45, 50, 55, 59, 64], // E A d g h e¹
      low: 'Za nisko – podkręć kołek', high: 'Za wysoko – poluzuj kołek', what: 'strunę',
    },
    {
      id: 'violin', name: 'Skrzypce', strings: [55, 62, 69, 76], // g d¹ a¹ e²
      low: 'Za nisko – podkręć', high: 'Za wysoko – poluzuj', what: 'strunę',
    },
    {
      id: 'ukulele', name: 'Ukulele', strings: [67, 60, 64, 69], // g¹ c¹ e¹ a¹
      low: 'Za nisko – podkręć kołek', high: 'Za wysoko – poluzuj kołek', what: 'strunę',
    },
    {
      id: 'flute', name: 'Flet', strings: [69, 81], // a¹ a²
      low: 'Za nisko – wsuń główkę', high: 'Za wysoko – wysuń główkę', what: 'dźwięk a¹ lub a²',
    },
    {
      id: 'harp', name: 'Harfa', strings: diatonic(45, 72), // A … c²
      low: 'Za nisko – podkręć kołek', high: 'Za wysoko – poluzuj kołek', what: 'strunę',
    },
  ];

  window.Tuner = window.Tuner || {};
  Object.assign(window.Tuner, { INSTRUMENTS, noteName, freqOf });
})();
