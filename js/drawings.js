// Rysunki instrumentów (SVG). Każdy rysunek zawiera:
//  - kołki/znaczniki: <g class="peg" data-i="…"> (stuknięcie = zagranie dźwięku),
//  - struny: <… class="str" data-i="…">,
//  - wskaźnik stroju (meter) z igłą #needle.
(() => {
  'use strict';
  const { noteName } = window.Tuner;

  const W = 360;

  const defs = `
  <defs>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5b2f1a"/><stop offset=".5" stop-color="#8a4b27"/><stop offset="1" stop-color="#5b2f1a"/>
    </linearGradient>
    <linearGradient id="woodLight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8a4a1e"/><stop offset=".5" stop-color="#c47a35"/><stop offset="1" stop-color="#8a4a1e"/>
    </linearGradient>
    <linearGradient id="ebony" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#140c0c"/><stop offset=".5" stop-color="#2b1d1b"/><stop offset="1" stop-color="#140c0c"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fafafa"/><stop offset=".45" stop-color="#c9ccd2"/><stop offset=".55" stop-color="#9aa0a8"/><stop offset="1" stop-color="#e6e8eb"/>
    </linearGradient>
    <linearGradient id="metalV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9aa0a8"/><stop offset=".5" stop-color="#f4f4f4"/><stop offset="1" stop-color="#9aa0a8"/>
    </linearGradient>
    <radialGradient id="pearl" cx=".35" cy=".35" r=".8">
      <stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#d8c9a8"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  const tag = (i, midi, x, y, r = 16) => `
    <g class="tag"><circle class="tag-bg" cx="${x}" cy="${y}" r="${r}"/>
    <text class="tag-txt" x="${x}" y="${y}" font-size="${r > 14 ? 15 : 11}">${noteName(midi)}</text></g>`;

  const peg = (i, midi, body, hit) => `
    <g class="peg" data-i="${i}" role="button" tabindex="0" aria-label="Dźwięk ${noteName(midi)} – stuknij, aby usłyszeć">
      <rect class="hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}" rx="8"/>
      ${body}
    </g>`;

  // Wskaźnik: igła w zakresie ±50 centów, zielone pole ±5 centów.
  function meter(x, y, w, h) {
    const cx = w / 2;
    const half = w / 2 - 26;
    const top = 16;
    const base = h - 30;
    let ticks = '';
    for (let c = -50; c <= 50; c += 5) {
      const tx = cx + (c / 50) * half;
      const major = c % 25 === 0;
      ticks += `<line class="tick${major ? ' major' : ''}" x1="${tx}" x2="${tx}" y1="${base}" y2="${base - (major ? 16 : 8)}"/>`;
    }
    const ok = (5 / 50) * half;
    return `
    <g class="meter" id="meter" data-half="${half}" transform="translate(${x} ${y})">
      <rect class="meter-bg" width="${w}" height="${h}" rx="16"/>
      <rect class="meter-ok" x="${cx - ok}" y="${top}" width="${ok * 2}" height="${base - top}" rx="4"/>
      <line class="tick base" x1="${cx - half}" x2="${cx + half}" y1="${base}" y2="${base}"/>
      ${ticks}
      <text class="meter-lbl" x="${cx - half}" y="${h - 10}">♭ nisko</text>
      <text class="meter-lbl" x="${cx + half}" y="${h - 10}">wysoko ♯</text>
      <text class="meter-cents" id="meter-cents" x="${cx}" y="${h - 10}"></text>
      <g class="needle" id="needle">
        <line x1="${cx}" x2="${cx}" y1="${top - 4}" y2="${base + 2}"/>
        <circle cx="${cx}" cy="${base + 2}" r="6"/>
      </g>
    </g>`;
  }

  const svg = (h, body) =>
    `<svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" class="instr-svg">${defs}${body}</svg>`;

  // ---------------- Gitara: główka 3+3 ----------------
  function guitar(inst) {
    const s = inst.strings; // E A d g h e¹
    const nutY = 340;
    const nutX = [152, 163, 175, 187, 199, 210];
    const widths = [3.2, 2.7, 2.2, 1.8, 1.3, 1];
    // [indeks struny, strona, y]
    const posts = [[0, 'L', 270], [1, 'L', 195], [2, 'L', 120], [5, 'R', 270], [4, 'R', 195], [3, 'R', 120]];
    let out = `
      <rect x="143" y="${nutY}" width="74" height="300" fill="url(#ebony)"/>
      ${[400, 470, 535, 595].map((y) => `<rect x="143" y="${y}" width="74" height="4" fill="url(#metalV)"/>`).join('')}
      <circle cx="180" cy="505" r="5" fill="#efe6d2" opacity=".8"/>
      <path d="M143 ${nutY + 4} C 134 270, 116 160, 112 92 Q 110 46 150 38 Q 180 52 210 38 Q 250 46 248 92 C 244 160, 226 270, 217 ${nutY + 4} Z" fill="url(#wood)" stroke="#2b140b" stroke-width="2"/>
      <path d="M150 38 Q 180 52 210 38" fill="none" stroke="#e8c47a" stroke-width="2" opacity=".6"/>
      <rect x="141" y="${nutY - 5}" width="78" height="9" rx="2" fill="#efe6d2"/>`;
    let pegs = '';
    let strs = '';
    for (const [i, side, y] of posts) {
      const L = side === 'L';
      const px = L ? 140 : 220;
      const bx = L ? 62 : 298;
      const tx = L ? 22 : 338;
      // struna od słupka do siodełka i dalej w dół gryfu
      strs += `<path class="str" data-i="${i}" d="M${px} ${y} L${nutX[i]} ${nutY} L${nutX[i]} 640" stroke-width="${widths[i]}"/>`;
      const body = `
        <rect x="${L ? 92 : 238}" y="${y - 9}" width="30" height="18" rx="4" fill="url(#metal)" stroke="#5b5f66"/>
        <rect x="${L ? 80 : 268}" y="${y - 3}" width="12" height="6" fill="url(#metal)"/>
        <ellipse class="peg-body" cx="${bx}" cy="${y}" rx="20" ry="14" fill="url(#pearl)" stroke="#8d7d5c" stroke-width="1.5"/>
        ${tag(i, s[i], tx, y)}`;
      pegs += peg(i, s[i], body, [L ? 2 : 236, y - 30, 122, 60]);
      out += `<circle cx="${px}" cy="${y}" r="7" fill="url(#metal)" stroke="#5b5f66"/>`;
    }
    return svg(640, out + strs + pegs + meter(16, 440, 328, 120));
  }

  // ---------------- Skrzypce: ślimak i 4 kołki ----------------
  function violin(inst) {
    const s = inst.strings; // g d¹ a¹ e²
    const nutY = 380;
    const nutX = [166, 176, 185, 194];
    const widths = [2.6, 2, 1.5, 1];
    const pegsPos = [[0, 'L', 320], [1, 'L', 230], [2, 'R', 270], [3, 'R', 185]];
    let out = `
      <rect x="152" y="${nutY}" width="58" height="260" fill="url(#ebony)"/>
      <path d="M150 ${nutY} L150 170 Q150 150 158 140 L204 140 Q212 150 212 170 L212 ${nutY} Z" fill="url(#woodLight)" stroke="#4a230d" stroke-width="2"/>
      <rect x="164" y="160" width="34" height="${nutY - 168}" rx="12" fill="#2a1408"/>
      <circle cx="181" cy="98" r="52" fill="url(#woodLight)" stroke="#4a230d" stroke-width="2"/>
      <path d="M181 98 m0 -40 a40 40 0 1 1 -34 22 M181 98 m0 -26 a26 26 0 1 0 22 14 a14 14 0 1 0 -12 -14" fill="none" stroke="#4a230d" stroke-width="3" stroke-linecap="round"/>
      <circle cx="181" cy="98" r="9" fill="#7a3d14" stroke="#4a230d" stroke-width="2"/>
      <rect x="150" y="${nutY - 4}" width="62" height="7" rx="2" fill="#1a1010"/>`;
    let strs = '';
    let pegs = '';
    for (const [i, side, y] of pegsPos) {
      const L = side === 'L';
      strs += `<path class="str" data-i="${i}" d="M${181 + (L ? -6 : 6)} ${y} L${nutX[i]} ${nutY} L${nutX[i]} 640" stroke-width="${widths[i]}"/>`;
      const bx = L ? 92 : 270;
      const tx = L ? 24 : 336;
      const body = `
        <rect x="${L ? 116 : 212}" y="${y - 5}" width="${L ? 82 : 0}" height="10" fill="#1d0f08" opacity="${L ? 1 : 0}"/>
        <rect x="${L ? 120 : 212}" y="${y - 5}" width="30" height="10" fill="#1d0f08"/>
        <circle cx="${L ? 124 : 238}" cy="${y}" r="8" fill="#2b170c" stroke="#e8c47a" stroke-width="1.5"/>
        <path class="peg-body" d="M${L ? 116 : 246} ${y} C ${L ? 104 : 258} ${y - 4}, ${L ? 96 : 266} ${y - 20}, ${bx} ${y - 20} C ${L ? 72 : 290} ${y - 20}, ${L ? 66 : 296} ${y - 10}, ${L ? 66 : 296} ${y} C ${L ? 66 : 296} ${y + 10}, ${L ? 72 : 290} ${y + 20}, ${bx} ${y + 20} C ${L ? 96 : 266} ${y + 20}, ${L ? 104 : 258} ${y + 4}, ${L ? 116 : 246} ${y} Z" fill="#241309" stroke="#e8c47a" stroke-width="1.5"/>
        ${tag(i, s[i], tx, y)}`;
      pegs += peg(i, s[i], body, [L ? 2 : 210, y - 30, 148, 60]);
    }
    return svg(640, out + strs + pegs + meter(16, 470, 328, 120));
  }

  // ---------------- Ukulele: główka 2+2 ----------------
  function ukulele(inst) {
    const s = inst.strings; // g¹ c¹ e¹ a¹
    const nutY = 330;
    const nutX = [160, 173, 187, 200];
    const widths = [1.8, 2.4, 2.1, 1.6];
    const posts = [[0, 'L', 150], [1, 'L', 245], [3, 'R', 150], [2, 'R', 245]];
    let out = `
      <rect x="146" y="${nutY}" width="68" height="310" fill="url(#ebony)"/>
      ${[395, 455, 512, 565].map((y) => `<rect x="146" y="${y}" width="68" height="4" fill="url(#metalV)"/>`).join('')}
      <path d="M146 ${nutY + 4} C 136 280, 120 200, 118 120 Q 116 84 140 70 Q 180 40 220 70 Q 244 84 242 120 C 240 200, 224 280, 214 ${nutY + 4} Z" fill="url(#woodLight)" stroke="#4a230d" stroke-width="2"/>
      <rect x="144" y="${nutY - 5}" width="72" height="9" rx="2" fill="#efe6d2"/>`;
    let strs = '';
    let pegs = '';
    for (const [i, side, y] of posts) {
      const L = side === 'L';
      const px = L ? 148 : 212;
      strs += `<path class="str" data-i="${i}" d="M${px} ${y} L${nutX[i]} ${nutY} L${nutX[i]} 640" stroke-width="${widths[i]}"/>`;
      out += `<circle cx="${px}" cy="${y}" r="7" fill="url(#metal)" stroke="#5b5f66"/>`;
      const bx = L ? 70 : 290;
      const tx = L ? 26 : 334;
      const body = `
        <rect x="${L ? 92 : 244}" y="${y - 4}" width="24" height="8" fill="url(#metal)"/>
        <rect x="${L ? 104 : 236}" y="${y - 10}" width="20" height="20" rx="4" fill="url(#metal)" stroke="#5b5f66"/>
        <ellipse class="peg-body" cx="${bx}" cy="${y}" rx="22" ry="16" fill="url(#pearl)" stroke="#8d7d5c" stroke-width="1.5"/>
        ${tag(i, s[i], tx, y)}`;
      pegs += peg(i, s[i], body, [L ? 4 : 234, y - 32, 122, 64]);
    }
    return svg(640, out + strs + pegs + meter(16, 430, 328, 120));
  }

  // ---------------- Flet poprzeczny: główka z ustnikiem ----------------
  function flute(inst) {
    const s = inst.strings; // a¹ a²
    const y = 250;
    let out = `
      <rect x="40" y="${y - 18}" width="250" height="36" rx="4" fill="url(#metal)" stroke="#7d838c"/>
      <rect x="286" y="${y - 20}" width="10" height="40" rx="2" fill="url(#metal)" stroke="#7d838c"/>
      <rect x="296" y="${y - 16}" width="70" height="32" fill="url(#metal)" stroke="#7d838c"/>
      <rect x="306" y="${y - 22}" width="12" height="10" rx="3" fill="url(#metal)" stroke="#7d838c"/>
      <path d="M40 ${y - 18} L22 ${y - 18} Q12 ${y - 18} 12 ${y - 8} L12 ${y + 8} Q12 ${y + 18} 22 ${y + 18} L40 ${y + 18} Z" fill="url(#metal)" stroke="#7d838c"/>
      <rect x="36" y="${y - 20}" width="8" height="40" rx="2" fill="url(#metal)" stroke="#7d838c"/>
      <path d="M92 ${y - 24} Q 130 ${y - 40} 170 ${y - 24} L170 ${y + 4} Q 130 ${y + 12} 92 ${y + 4} Z" fill="url(#metal)" stroke="#6d737c" stroke-width="1.5"/>
      <ellipse cx="131" cy="${y - 12}" rx="15" ry="9" fill="#1a1416" stroke="#5b5f66"/>
      <path d="M290 ${y + 34} l-16 0 m0 0 l6 -5 m-6 5 l6 5 M310 ${y + 34} l16 0 m0 0 l-6 -5 m6 5 l-6 5" stroke="#e8c47a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text class="draw-note" x="282" y="${y + 62}" style="text-anchor:end">wsuń</text>
      <text class="draw-note" x="318" y="${y + 62}" style="text-anchor:start">wysuń</text>
      <text class="draw-note" x="300" y="${y + 80}">główkę</text>`;
    // „kołki” fletu: dwa przyciski nad ustnikiem
    const spots = [[0, 120, 120], [1, 240, 120]];
    let pegs = '';
    let strs = '';
    for (const [i, x, yy] of spots) {
      strs += `<path class="str" data-i="${i}" d="M${x} ${yy + 30} Q ${(x + 131) / 2} ${yy + 70} 131 ${y - 26}" stroke-width="2" stroke-dasharray="5 6" fill="none"/>`;
      const body = `${tag(i, s[i], x, yy, 30)}
        <text class="tag-sub" x="${x}" y="${yy - 40}">${i === 0 ? 'niższe' : 'wyższe'}</text>`;
      pegs += peg(i, s[i], body, [x - 50, yy - 40, 100, 100]);
    }
    return svg(640, out + strs + pegs + meter(16, 420, 328, 120));
  }

  // ---------------- Harfa: szyja z kołkami, od A do c² ----------------
  function harp(inst) {
    const s = inst.strings;
    const n = s.length;
    const x0 = 34;
    const x1 = 330;
    const pts = s.map((_, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      const x = x0 + (x1 - x0) * t;
      const neck = 175 - 95 * t + 26 * Math.sin(Math.PI * 2 * t); // linia szyi (kołki)
      const board = 600 - 310 * t; // płyta rezonansowa
      return { x, neck, board };
    });
    const neckTop = pts.map((p) => `${p.x} ${p.neck - 30}`).join(' L');
    const neckBot = pts.slice().reverse().map((p) => `${p.x} ${p.neck + 14}`).join(' L');
    let out = `
      <path d="M${x0 - 20} 610 L${x0 - 20} 170 Q ${x0 - 20} 130 ${x0} 140 L${neckTop} Q ${x1 + 26} 40 ${x1 + 22} 110 L${neckBot} L${x0 + 2} 200 L${x0 + 2} 610 Z" fill="url(#woodLight)" stroke="#4a230d" stroke-width="2"/>
      <path d="M${x0 - 6} 618 L${x1 + 18} 280" stroke="#4a230d" stroke-width="26" stroke-linecap="round"/>
      <path d="M${x0 - 6} 618 L${x1 + 18} 280" stroke="url(#woodLight)" stroke-width="20" stroke-linecap="round"/>
      <rect x="${x0 - 30}" y="604" width="${x1 - x0 + 40}" height="22" rx="8" fill="url(#wood)" stroke="#2b140b"/>`;
    let strs = '';
    let pegs = '';
    pts.forEach((p, i) => {
      const pc = s[i] % 12;
      const cls = pc === 0 ? ' str-c' : pc === 5 ? ' str-f' : '';
      strs += `<line class="str${cls}" data-i="${i}" x1="${p.x}" x2="${p.x}" y1="${p.neck}" y2="${p.board}" stroke-width="${2.6 - 1.6 * (i / (n - 1))}"/>`;
      const body = `
        <circle class="peg-body" cx="${p.x}" cy="${p.neck}" r="5" fill="url(#metal)" stroke="#5b5f66"/>
        <g class="tag"><rect class="tag-bg" x="${p.x - 8.5}" y="${p.neck - 30}" width="17" height="19" rx="5"/>
        <text class="tag-txt" x="${p.x}" y="${p.neck - 20}" font-size="${noteName(s[i]).length > 1 ? 9 : 11}">${noteName(s[i])}</text></g>`;
      pegs += peg(i, s[i], body, [p.x - 9, p.neck - 32, 18, 90]);
    });
    return svg(640, out + strs + pegs + meter(126, 500, 228, 110));
  }

  window.Tuner.DRAWINGS = { guitar, violin, ukulele, flute, harp };
})();
