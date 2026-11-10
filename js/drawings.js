// Rysunki instrumentów (SVG) i wskaźnik stroju.
// Każdy rysunek zawiera kołki/klawisze <g class="peg" data-i="…"> (stuknięcie = dźwięk wzorcowy)
// oraz struny <… class="str" data-i="…">.
(() => {
  'use strict';
  const { noteName, fullName, isBlack } = window.Tuner;

  const W = 360;
  const H = 470;

  const defs = `
  <defs>
    <linearGradient id="rosewood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#24120b"/><stop offset=".3" stop-color="#4a2716"/><stop offset=".55" stop-color="#5c321d"/><stop offset="1" stop-color="#2a150c"/>
    </linearGradient>
    <linearGradient id="koa" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6b3a17"/><stop offset=".35" stop-color="#b8732f"/><stop offset=".6" stop-color="#c98a45"/><stop offset="1" stop-color="#6e3c18"/>
    </linearGradient>
    <linearGradient id="maple" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5a2a0c"/><stop offset=".3" stop-color="#a65a1e"/><stop offset=".5" stop-color="#c9772e"/><stop offset=".72" stop-color="#a65a1e"/><stop offset="1" stop-color="#4f240a"/>
    </linearGradient>
    <radialGradient id="mapleR" cx=".42" cy=".38" r=".7">
      <stop offset="0" stop-color="#d98a3e"/><stop offset=".6" stop-color="#9c5219"/><stop offset="1" stop-color="#4f240a"/>
    </radialGradient>
    <linearGradient id="ebony" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0b0807"/><stop offset=".45" stop-color="#2a201d"/><stop offset=".55" stop-color="#1c1513"/><stop offset="1" stop-color="#0b0807"/>
    </linearGradient>
    <radialGradient id="ebonyR" cx=".4" cy=".3" r=".75">
      <stop offset="0" stop-color="#5a4a44"/><stop offset=".35" stop-color="#241b18"/><stop offset="1" stop-color="#070505"/>
    </radialGradient>
    <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#d9ccb0"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#d4d7dc"/><stop offset=".5" stop-color="#8a9099"/><stop offset=".65" stop-color="#c3c7cd"/><stop offset="1" stop-color="#f2f3f5"/>
    </linearGradient>
    <linearGradient id="chromeV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6f7680"/><stop offset=".22" stop-color="#e9ebee"/><stop offset=".38" stop-color="#ffffff"/><stop offset=".6" stop-color="#b4b9c0"/><stop offset=".85" stop-color="#7c838c"/><stop offset="1" stop-color="#a9aeb5"/>
    </linearGradient>
    <radialGradient id="chromeR" cx=".35" cy=".3" r=".75">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c5c9cf"/><stop offset="1" stop-color="#5d636b"/>
    </radialGradient>
    <radialGradient id="pearl" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#fffdf6"/><stop offset=".5" stop-color="#efe5cf"/><stop offset="1" stop-color="#bfae8a"/>
    </radialGradient>
    <radialGradient id="plastic" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#ece9e2"/><stop offset="1" stop-color="#a9a49a"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff0c0"/><stop offset=".5" stop-color="#c9a24c"/><stop offset="1" stop-color="#7d5e1e"/>
    </linearGradient>
    <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4f1ea"/><stop offset=".85" stop-color="#fffdf8"/><stop offset="1" stop-color="#e2dccf"/>
    </linearGradient>
    <linearGradient id="blackKey" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#050505"/><stop offset=".5" stop-color="#2c2c2e"/><stop offset="1" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="lacquer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3a3e"/><stop offset=".25" stop-color="#121214"/><stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <filter id="grainV" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55 0.008" numOctaves="3" seed="4" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0 0.02  2.6 0 0 0 -1.1"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".55"/>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  const svg = (body) =>
    `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="instr-svg">${defs}${body}</svg>`;

  const tag = (midi, x, y, r = 17) => `
    <g class="tag"><circle class="tag-bg" cx="${x}" cy="${y}" r="${r}"/>
    <text class="tag-txt" x="${x}" y="${y}" font-size="${r > 20 ? 18 : 15}">${noteName(midi)}</text></g>`;

  const peg = (i, midi, body, hit, extra = '') => `
    <g class="peg${extra}" data-i="${i}" role="button" tabindex="0" aria-label="Dźwięk ${fullName(midi)} – stuknij, aby usłyszeć">
      <rect class="hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}" rx="8"/>
      ${body}
    </g>`;

  // struna: owijana (z fakturą) albo gładka
  const string = (i, d, w, kind) => {
    const col = { bronze: '#c79a5a', steel: '#e4e6ea', nylon: '#f3eee2', gut: '#cfc6b4', alu: '#c9ccd2' }[kind];
    const wound = kind === 'bronze' || kind === 'alu';
    return `<g class="str" data-i="${i}">
      <path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width="${w + 1.4}" fill="none" transform="translate(1.5 2)"/>
      <path class="str-line" d="${d}" stroke="${col}" stroke-width="${w}" fill="none"/>
      ${wound ? `<path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width="${w}" stroke-dasharray=".7 1.1" fill="none"/>` : ''}
      <path d="${d}" stroke="#fff" stroke-opacity=".45" stroke-width="${Math.max(0.4, w / 3)}" fill="none" transform="translate(-${w / 4} 0)"/>
    </g>`;
  };

  // słupek klucza z nawiniętą struną
  const post = (x, y, w, kind) => {
    const col = { bronze: '#c79a5a', steel: '#e4e6ea', nylon: '#f3eee2' }[kind];
    return `
      <circle cx="${x}" cy="${y}" r="10" fill="url(#chromeR)" stroke="#4c5158" stroke-width=".8" filter="url(#soft)"/>
      <circle cx="${x}" cy="${y}" r="6.5" fill="url(#chrome)" stroke="#5d636b" stroke-width=".8"/>
      <circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${col}" stroke-width="${w + 0.8}" stroke-dasharray="14 30" transform="rotate(30 ${x} ${y})"/>
      <circle cx="${x}" cy="${y}" r="1.8" fill="#222"/>`;
  };

  // mechanizm gitarowy widziany z przodu: obudowa wystająca zza główki, oś, guzik
  // rysowany dla lewej strony w układzie lokalnym (0,0) = krawędź główki
  const machine = (button) => `
      <rect x="-30" y="-14" width="40" height="28" rx="6" fill="url(#chrome)" stroke="#5d636b" stroke-width="1"/>
      <rect x="-30" y="-14" width="40" height="5" rx="2" fill="#fff" opacity=".35"/>
      <rect x="-44" y="-4" width="16" height="8" fill="url(#chrome)" stroke="#5d636b" stroke-width=".8"/>
      <rect x="-48" y="-7" width="6" height="14" rx="2" fill="url(#chrome)" stroke="#5d636b" stroke-width=".8"/>
      <path class="peg-body" d="M-46 0 C -46 -13, -58 -15, -68 -14 C -78 -12, -82 -6, -82 0 C -82 6, -78 12, -68 14 C -58 15, -46 13, -46 0 Z"
        fill="url(#${button})" stroke="#8a7a5a" stroke-width="1.2"/>
      <ellipse cx="-66" cy="-6" rx="9" ry="3" fill="#fff" opacity=".6"/>`;

  // ---------------- Gitara: główka 3+3 ----------------
  function guitar(inst) {
    const s = inst.strings; // E A d g h e¹
    const nutY = 392;
    const edge = (y) => 142 - (20 * (nutY - y)) / 328;
    const head = `M142 ${nutY} C 136 300, 126 160, 122 64 Q 121 28 152 26 L 208 26 Q 239 28 238 64 C 234 160, 224 300, 218 ${nutY} Z`;
    const posts = [[0, -1, 292], [1, -1, 202], [2, -1, 112], [5, 1, 292], [4, 1, 202], [3, 1, 112]];
    const nutX = [149.5, 161.7, 173.9, 186.1, 198.3, 210.5];
    const widths = [2.6, 2.2, 1.8, 1.5, 1.1, 0.85];
    const kinds = ['bronze', 'bronze', 'bronze', 'bronze', 'steel', 'steel'];
    let pegs = '';
    let tops = '';
    let strs = '';
    for (const [i, dir, y] of posts) {
      const ex = dir < 0 ? edge(y) : W - edge(y);
      const px = dir < 0 ? ex + 22 : ex - 22;
      const body = `<g transform="translate(${ex} ${y}) scale(${dir < 0 ? 1 : -1} 1)">${machine('pearl')}</g>${tag(s[i], dir < 0 ? 21 : W - 21, y)}`;
      const hx = dir < 0 ? 2 : ex - 10;
      pegs += peg(i, s[i], body, [hx, y - 30, dir < 0 ? ex + 10 - 2 : W - 2 - hx, 60]);
      tops += post(px, y, widths[i], kinds[i] === 'bronze' ? 'bronze' : 'steel');
      const tx = px + (nutX[i] < px ? -6 : 6);
      strs += string(i, `M${tx} ${y} L${nutX[i]} ${nutY} L${nutX[i]} ${H}`, widths[i], kinds[i]);
    }
    return svg(`
      ${pegs}
      <path d="${head}" fill="url(#rosewood)" filter="url(#shadow)"/>
      <path d="${head}" fill="#000" filter="url(#grainV)" opacity=".7"/>
      <path d="${head}" fill="none" stroke="#efe4c8" stroke-width="3.5"/>
      <path d="${head}" fill="none" stroke="#1a0c06" stroke-width="1" transform="translate(0 0) scale(1)" opacity=".6"/>
      <path d="M152 30 L208 30" stroke="#fff" stroke-opacity=".12" stroke-width="4"/>
      <path d="M168 334 h24 q6 0 7 6 l5 30 q1 6 -6 6 h-36 q-7 0 -6 -6 l5 -30 q1 -6 7 -6 z" fill="url(#lacquer)" stroke="#000" stroke-width=".8"/>
      <circle cx="180" cy="342" r="2" fill="url(#chromeR)"/><circle cx="180" cy="368" r="2" fill="url(#chromeR)"/>
      <rect x="142" y="${nutY}" width="76" height="${H - nutY}" fill="url(#rosewood)"/>
      <rect x="142" y="${nutY}" width="76" height="${H - nutY}" fill="#000" filter="url(#grainV)" opacity=".6"/>
      <rect x="139" y="${nutY}" width="3" height="${H - nutY}" fill="#efe4c8"/><rect x="218" y="${nutY}" width="3" height="${H - nutY}" fill="#efe4c8"/>
      <rect x="140" y="452" width="80" height="4" rx="1.5" fill="url(#chrome)"/>
      <rect x="139" y="${nutY - 4}" width="82" height="10" rx="2" fill="url(#bone)" stroke="#a89878" stroke-width=".6"/>
      ${tops}
      ${strs}
    `);
  }

  // ---------------- Ukulele: główka 2+2 ----------------
  function ukulele(inst) {
    const s = inst.strings; // g¹ c¹ e¹ a¹
    const nutY = 392;
    const edge = (y) => 150 - (18 * (nutY - y)) / 292;
    const head = `M150 ${nutY} C 146 300, 136 180, 132 100 Q 130 60 152 50 Q 180 76 208 50 Q 230 60 228 100 C 224 180, 214 300, 210 ${nutY} Z`;
    const posts = [[0, -1, 170], [1, -1, 285], [3, 1, 170], [2, 1, 285]];
    const nutX = [161, 173.5, 186.5, 199];
    const widths = [1.9, 2.5, 2.2, 1.8];
    let pegs = '';
    let tops = '';
    let strs = '';
    for (const [i, dir, y] of posts) {
      const ex = dir < 0 ? edge(y) : W - edge(y);
      const px = dir < 0 ? ex + 20 : ex - 20;
      const body = `<g transform="translate(${ex} ${y}) scale(${dir < 0 ? 1 : -1} 1)">${machine('plastic')}</g>${tag(s[i], dir < 0 ? 26 : W - 26, y)}`;
      const hx = dir < 0 ? 4 : ex - 10;
      pegs += peg(i, s[i], body, [hx, y - 32, dir < 0 ? ex + 10 - 4 : W - 4 - hx, 64]);
      tops += post(px, y, widths[i], 'nylon');
      const tx = px + (nutX[i] < px ? -6 : 6);
      strs += string(i, `M${tx} ${y} L${nutX[i]} ${nutY} L${nutX[i]} ${H}`, widths[i], 'nylon');
    }
    return svg(`
      ${pegs}
      <path d="${head}" fill="url(#koa)" filter="url(#shadow)"/>
      <path d="${head}" fill="#000" filter="url(#grainV)" opacity=".55"/>
      <path d="${head}" fill="none" stroke="#3a1c08" stroke-width="1.5"/>
      <rect x="150" y="${nutY}" width="60" height="${H - nutY}" fill="url(#rosewood)"/>
      <rect x="150" y="${nutY}" width="60" height="${H - nutY}" fill="#000" filter="url(#grainV)" opacity=".6"/>
      <rect x="148" y="448" width="64" height="4" rx="1.5" fill="url(#chrome)"/>
      <rect x="147" y="${nutY - 4}" width="66" height="10" rx="2" fill="url(#bone)" stroke="#a89878" stroke-width=".6"/>
      ${tops}
      ${strs}
    `);
  }

  // ---------------- Skrzypce: ślimak i 4 kołki (widok z przodu) ----------------
  function violin(inst) {
    const s = inst.strings; // g d¹ a¹ e²
    const nutY = 402;
    const nutX = [167, 176.5, 185.5, 194];
    const widths = [2.2, 1.8, 1.4, 0.9];
    const kinds = ['alu', 'alu', 'alu', 'steel'];
    // [indeks, strona, y]
    const pegsPos = [[1, -1, 205], [2, 1, 250], [0, -1, 295], [3, 1, 340]];
    // kołek skrzypcowy (lewa strona, lokalnie: 0 = ścianka skrzynki)
    const vpeg = `
      <rect x="-4" y="-5" width="40" height="10" fill="url(#ebony)"/>
      <rect x="-14" y="-8" width="12" height="16" rx="3" fill="url(#gold)" stroke="#5c4415" stroke-width=".6"/>
      <circle cx="-14" cy="0" r="8" fill="url(#ebonyR)"/>
      <path class="peg-body" d="M-18 -6 C -30 -7, -36 -24, -54 -24 C -70 -24, -78 -13, -78 0 C -78 13, -70 24, -54 24 C -36 24, -30 7, -18 6 Z"
        fill="url(#ebonyR)" stroke="#000" stroke-width="1"/>
      <path d="M-30 -10 C -38 -20, -56 -21, -66 -12" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="-80" cy="0" r="5" fill="url(#gold)" stroke="#5c4415" stroke-width=".6"/>`;
    let pegs = '';
    let shafts = '';
    let strs = '';
    for (const [i, dir, y] of pegsPos) {
      const ex = dir < 0 ? 151 : 209;
      const body = `<g transform="translate(${ex} ${y}) scale(${dir < 0 ? 1 : -1} 1)">${vpeg}</g>${tag(s[i], dir < 0 ? 24 : W - 24, y)}`;
      pegs += peg(i, s[i], body, [dir < 0 ? 2 : 210, y - 30, 148, 60]);
      shafts += `<rect x="158" y="${y - 4}" width="44" height="8" fill="url(#ebony)"/>
        <ellipse cx="${180 + dir * 4}" cy="${y}" rx="7" ry="5.5" fill="none" stroke="${kinds[i] === 'steel' ? '#e4e6ea' : '#c9ccd2'}" stroke-width="${widths[i] + 2}"/>`;
      strs += string(i, `M${180 + dir * 4} ${y + 4} L${nutX[i]} ${nutY} L${nutX[i]} ${H}`, widths[i], kinds[i]);
    }
    const box = `M151 ${nutY} L153 168 Q154 150 166 146 L194 146 Q206 150 207 168 L209 ${nutY} Z`;
    return svg(`
      <g filter="url(#shadow)">
        <path d="${box}" fill="url(#maple)"/>
        <path d="M180 30 C 140 30, 126 62, 128 96 C 130 128, 150 150, 166 150 L194 150 C 210 150, 230 128, 232 96 C 234 62, 220 30, 180 30 Z" fill="url(#mapleR)"/>
      </g>
      <path d="${box}" fill="#000" filter="url(#grainV)" opacity=".35"/>
      <path d="M180 30 C 140 30, 126 62, 128 96 C 130 128, 150 150, 166 150 L194 150 C 210 150, 230 128, 232 96 C 234 62, 220 30, 180 30 Z" fill="none" stroke="#3b1a06" stroke-width="1.2"/>
      <path d="M180 40 C 152 42, 142 66, 144 94 C 146 118, 160 136, 172 140 L188 140 C 200 136, 214 118, 216 94 C 218 66, 208 42, 180 40 Z" fill="none" stroke="#3b1a06" stroke-opacity=".55" stroke-width="2"/>
      <path d="M180 48 C 162 50, 156 70, 158 92 C 160 112, 170 128, 180 130 C 190 128, 200 112, 202 92 C 204 70, 198 50, 180 48 Z" fill="#7a3a10" opacity=".55"/>
      <path d="M180 52 L180 128" stroke="#f0a35a" stroke-opacity=".5" stroke-width="2"/>
      <g fill="none" stroke="#3b1a06" stroke-linecap="round">
        <path d="M152 142 C 134 124, 132 74, 160 50" stroke-width="2" stroke-opacity=".7"/>
        <path d="M160 136 C 148 118, 148 80, 168 60" stroke-width="1.6" stroke-opacity=".5"/>
        <path d="M208 142 C 226 124, 228 74, 200 50" stroke-width="2" stroke-opacity=".7"/>
        <path d="M200 136 C 212 118, 212 80, 192 60" stroke-width="1.6" stroke-opacity=".5"/>
      </g>
      <path d="M136 80 C 140 54, 160 38, 180 36" stroke="#ffd2a0" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="164" y="166" width="32" height="${nutY - 176}" rx="14" fill="#1b0b03"/>
      <rect x="164" y="166" width="32" height="${nutY - 176}" rx="14" fill="none" stroke="#000" stroke-width="2" opacity=".6"/>
      ${shafts}
      ${pegs}
      <path d="M156 ${nutY} L204 ${nutY} L206 ${H} L154 ${H} Z" fill="url(#ebony)"/>
      <rect x="154" y="${nutY - 4}" width="52" height="8" rx="2" fill="url(#ebony)" stroke="#000" stroke-width=".5"/>
      <rect x="154" y="${nutY - 4}" width="52" height="2" fill="#fff" opacity=".18"/>
      ${strs}
    `);
  }

  // ---------------- Flet poprzeczny: główka z ustnikiem (pionowo) ----------------
  function flute(inst) {
    const s = inst.strings; // a¹ a²
    const x0 = 162;
    const tw = 36;
    const lipY = 132;
    const jointY = 318;
    const body = `
      <g filter="url(#shadow)">
        <rect x="${x0}" y="40" width="${tw}" height="${jointY - 40}" fill="url(#chromeV)"/>
        <rect x="${x0 + 2}" y="${jointY + 14}" width="${tw - 4}" height="${H - jointY}" fill="url(#chromeV)"/>
      </g>
      <rect x="${x0 - 3}" y="16" width="${tw + 6}" height="26" rx="4" fill="url(#chromeV)" stroke="#6f7680" stroke-width=".8"/>
      <path d="M${x0 + 4} 16 Q 180 0 ${x0 + tw - 4} 16 Z" fill="url(#chromeV)" stroke="#6f7680" stroke-width=".8"/>
      <rect x="${x0 - 3}" y="36" width="${tw + 6}" height="4" fill="#6f7680" opacity=".5"/>
      <rect x="${x0 - 2}" y="${jointY - 6}" width="${tw + 4}" height="14" rx="2" fill="url(#chromeV)" stroke="#6f7680" stroke-width=".8"/>
      <rect x="${x0 + 2}" y="${jointY + 8}" width="${tw - 4}" height="8" fill="url(#chromeV)" opacity=".85"/>
      <rect x="${x0 - 1}" y="${jointY + 16}" width="${tw + 2}" height="10" rx="2" fill="url(#chromeV)" stroke="#6f7680" stroke-width=".8"/>
      <path d="M144 ${lipY - 40} C 160 ${lipY - 48}, 200 ${lipY - 48}, 216 ${lipY - 40} L 220 ${lipY + 38} C 200 ${lipY + 48}, 160 ${lipY + 48}, 140 ${lipY + 38} Z"
        fill="url(#chromeV)" stroke="#5d636b" stroke-width="1.2" filter="url(#soft)"/>
      <path d="M150 ${lipY - 34} C 166 ${lipY - 40}, 194 ${lipY - 40}, 210 ${lipY - 34}" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/>
      <ellipse cx="180" cy="${lipY + 4}" rx="17" ry="12" fill="url(#chrome)" stroke="#5d636b"/>
      <ellipse cx="180" cy="${lipY + 4}" rx="13" ry="9" fill="#0d0a0b"/>
      <ellipse cx="177" cy="${lipY + 1}" rx="6" ry="3" fill="#3a3436"/>
      <line x1="${x0 + tw + 6}" y1="${jointY + 40}" x2="${x0 + tw + 6}" y2="${H}" stroke="url(#chrome)" stroke-width="5"/>
      <rect x="${x0 + tw + 1}" y="${jointY + 34}" width="10" height="10" rx="3" fill="url(#chromeR)"/>
      <circle cx="180" cy="${jointY + 92}" r="16" fill="url(#chromeR)" stroke="#5d636b" filter="url(#soft)"/>
      <circle cx="180" cy="${jointY + 92}" r="6" fill="#0d0a0b"/>
      <path d="M196 ${jointY + 92} L${x0 + tw + 6} ${jointY + 92}" stroke="url(#chrome)" stroke-width="5"/>
      <circle cx="180" cy="${H + 8}" r="16" fill="url(#chromeR)" stroke="#5d636b"/>`;
    const arrows = `
      <g class="flute-hint">
        <path d="M262 ${jointY - 12} v-34 m0 0 l-7 9 m7 -9 l7 9" />
        <path d="M262 ${jointY + 24} v34 m0 0 l-7 -9 m7 9 l7 -9" />
        <text x="276" y="${jointY - 26}">wysuń</text><text x="276" y="${jointY - 10}" class="small">= niżej</text>
        <text x="276" y="${jointY + 44}">wsuń</text><text x="276" y="${jointY + 60}" class="small">= wyżej</text>
      </g>`;
    const spots = [[0, 72, lipY], [1, 288, lipY]];
    let pegs = '';
    let strs = '';
    for (const [i, x, y] of spots) {
      strs += `<path class="str" data-i="${i}" d="M${x + (i ? -34 : 34)} ${y} L${i ? 222 : 138} ${y}" stroke-width="2" stroke-dasharray="4 5" fill="none" stroke="#e8c47a"/>`;
      const bodyP = `${tag(s[i], x, y, 32)}<text class="tag-sub" x="${x}" y="${y + 50}">${i === 0 ? 'niższe' : 'wyższe'}</text>`;
      pegs += peg(i, s[i], bodyP, [x - 50, y - 44, 100, 104]);
    }
    return svg(body + arrows + strs + pegs);
  }

  // ---------------- Fortepian: klawiatura od A do c², dwa rzędy ----------------
  function piano(inst) {
    const s = inst.strings;
    // podział na dwa rzędy: do h (mała oktawa) i od c¹
    const rows = [s.filter((m) => m < 60), s.filter((m) => m >= 60)];
    const kw = 38;
    const kh = 160;
    const bw = 24;
    const bh = 100;
    let out = '';
    rows.forEach((row, r) => {
      const whites = row.filter((m) => !isBlack(m));
      const width = whites.length * kw;
      const x0 = (W - width) / 2;
      const y0 = 34 + r * 222;
      // obudowa: listwa z drewna i czerwony filc
      out += `
        <rect x="${x0 - 8}" y="${y0 - 26}" width="${width + 16}" height="${kh + 34}" rx="6" fill="url(#lacquer)" filter="url(#shadow)"/>
        <rect x="${x0 - 8}" y="${y0 - 26}" width="${width + 16}" height="3" rx="1.5" fill="#fff" opacity=".2"/>
        <rect x="${x0}" y="${y0 - 3}" width="${width}" height="3" fill="#8c1c33"/>`;
      let wx = x0;
      let whitesSvg = '';
      let blacksSvg = '';
      for (const m of row) {
        const i = s.indexOf(m);
        if (!isBlack(m)) {
          const body = `
            <path class="key-face" d="M${wx + 0.5} ${y0} h${kw - 1} v${kh - 6} q0 6 -6 6 h${-(kw - 13)} q-6 0 -6 -6 Z" fill="url(#ivory)" stroke="#8f887c" stroke-width="1"/>
            <text class="key-txt" x="${wx + kw / 2}" y="${y0 + kh - 18}">${noteName(m)}</text>`;
          whitesSvg += peg(i, m, body, [wx, y0, kw, kh], ' key white');
          wx += kw;
        } else {
          const bx = wx - bw / 2;
          const body = `
            <rect class="key-face" x="${bx}" y="${y0}" width="${bw}" height="${bh}" rx="3" fill="url(#blackKey)" stroke="#000"/>
            <rect x="${bx + 3}" y="${y0 + 2}" width="${bw - 6}" height="${bh - 14}" rx="2" fill="#fff" opacity=".08"/>
            <text class="key-txt" x="${wx}" y="${y0 + bh - 30}">${noteName(m)}</text>
            <text class="key-txt" x="${wx}" y="${y0 + bh - 16}">${noteName(m, true)}</text>`;
          blacksSvg += peg(i, m, body, [bx, y0, bw, bh], ' key black');
        }
      }
      out += whitesSvg + blacksSvg;
    });
    return svg(out);
  }

  // Wskaźnik (osobny pasek nad instrumentem): igła w zakresie ±50 centów, zielone pole ±5 centów.
  function meter() {
    const w = 360;
    const h = 74;
    const cx = w / 2;
    const half = 150;
    const base = 46;
    let ticks = '';
    for (let c = -50; c <= 50; c += 5) {
      const tx = cx + (c / 50) * half;
      const major = c % 25 === 0;
      ticks += `<line class="tick${major ? ' major' : ''}" x1="${tx}" x2="${tx}" y1="${base}" y2="${base - (major ? 18 : 9)}"/>`;
      if (major && c !== 0) ticks += `<text class="meter-num" x="${tx}" y="${base + 14}">${c > 0 ? '+' : ''}${c}</text>`;
    }
    const ok = (5 / 50) * half;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" class="meter-svg" id="meter" data-half="${half}">
      <defs>
        <linearGradient id="mzone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#7ab8ff" stop-opacity=".35"/><stop offset=".42" stop-color="#7ab8ff" stop-opacity="0"/>
          <stop offset=".58" stop-color="#ff8a7a" stop-opacity="0"/><stop offset="1" stop-color="#ff8a7a" stop-opacity=".35"/>
        </linearGradient>
      </defs>
      <rect class="meter-bg" x="1" y="1" width="${w - 2}" height="${h - 2}" rx="14"/>
      <rect x="${cx - half}" y="12" width="${half * 2}" height="${base - 12}" fill="url(#mzone)"/>
      <rect class="meter-ok" x="${cx - ok}" y="10" width="${ok * 2}" height="${base - 10}" rx="3"/>
      <line class="tick base" x1="${cx - half}" x2="${cx + half}" y1="${base}" y2="${base}"/>
      ${ticks}
      <text class="meter-lbl" x="14" y="${base - 18}" text-anchor="start">♭</text>
      <text class="meter-lbl" x="${w - 14}" y="${base - 18}" text-anchor="end">♯</text>
      <g class="needle" id="needle">
        <path d="M${cx} ${base + 2} L${cx - 3} 14 L${cx} 6 L${cx + 3} 14 Z"/>
        <circle cx="${cx}" cy="${base + 2}" r="5"/>
      </g>
      <text class="meter-cents" id="meter-cents" x="${cx}" y="${h - 4}"></text>
    </svg>`;
  }

  window.Tuner.DRAWINGS = { guitar, violin, ukulele, flute, piano };
  window.Tuner.meterSVG = meter;
})();
