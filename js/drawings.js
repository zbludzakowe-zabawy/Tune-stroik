// Rysunki instrumentów (SVG) w stylu dawnych instrumentów i wskaźnik stroju.
// Każdy rysunek zawiera kołki/klawisze <g class="peg" data-i="…"> (stuknięcie = dźwięk wzorcowy)
// oraz (gdzie widać) struny <… class="str" data-i="…">.
(() => {
  'use strict';
  const { noteName, fullName, isBlack } = window.Tuner;

  const W = 360;
  const H = 470;

  const defs = `
  <defs>
    <linearGradient id="rosewood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1e0d07"/><stop offset=".25" stop-color="#3f1f10"/><stop offset=".5" stop-color="#5a2e17"/><stop offset=".75" stop-color="#3f1f10"/><stop offset="1" stop-color="#1e0d07"/>
    </linearGradient>
    <linearGradient id="mahogany" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a1206"/><stop offset=".3" stop-color="#7a2e12"/><stop offset=".55" stop-color="#9c4119"/><stop offset=".8" stop-color="#6e270d"/><stop offset="1" stop-color="#360f05"/>
    </linearGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4a1a05"/><stop offset=".25" stop-color="#9a4a12"/><stop offset=".5" stop-color="#d4802c"/><stop offset=".7" stop-color="#b0601a"/><stop offset="1" stop-color="#4a1a05"/>
    </linearGradient>
    <radialGradient id="amberR" cx=".38" cy=".32" r=".8">
      <stop offset="0" stop-color="#f0a04a"/><stop offset=".45" stop-color="#b8601a"/><stop offset="1" stop-color="#4a1a05"/>
    </radialGradient>
    <linearGradient id="boxwood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6a3a10"/><stop offset=".2" stop-color="#b98035"/><stop offset=".42" stop-color="#ecc57a"/><stop offset=".55" stop-color="#d9a85a"/><stop offset=".85" stop-color="#8a5418"/><stop offset="1" stop-color="#5a300a"/>
    </linearGradient>
    <linearGradient id="ebony" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0a0706"/><stop offset=".45" stop-color="#2a201d"/><stop offset=".55" stop-color="#1c1513"/><stop offset="1" stop-color="#0a0706"/>
    </linearGradient>
    <radialGradient id="ebonyR" cx=".38" cy=".3" r=".8">
      <stop offset="0" stop-color="#6a5a52"/><stop offset=".3" stop-color="#2a201c"/><stop offset="1" stop-color="#060404"/>
    </radialGradient>
    <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffaf0"/><stop offset=".5" stop-color="#efe3c8"/><stop offset="1" stop-color="#c6b28a"/>
    </linearGradient>
    <linearGradient id="boneV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b9a47a"/><stop offset=".35" stop-color="#fbf4e2"/><stop offset=".6" stop-color="#efe3c8"/><stop offset="1" stop-color="#a8935f"/>
    </linearGradient>
    <radialGradient id="ivory" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#fffcf2"/><stop offset=".5" stop-color="#f0e2c2"/><stop offset="1" stop-color="#b39a68"/>
    </radialGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff2c0"/><stop offset=".35" stop-color="#e0b450"/><stop offset=".6" stop-color="#9a6e1c"/><stop offset="1" stop-color="#e8c463"/>
    </linearGradient>
    <linearGradient id="brassV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8a6018"/><stop offset=".4" stop-color="#fff0b8"/><stop offset=".7" stop-color="#c99a38"/><stop offset="1" stop-color="#7a5212"/>
    </linearGradient>
    <linearGradient id="pearl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbe8f2"/><stop offset=".3" stop-color="#d8f2f2"/><stop offset=".55" stop-color="#ffffff"/><stop offset=".8" stop-color="#e2dcf8"/><stop offset="1" stop-color="#f6e6c8"/>
    </linearGradient>
    <radialGradient id="slot" cx=".5" cy=".5" r=".7">
      <stop offset="0" stop-color="#0c0503"/><stop offset=".8" stop-color="#1e0c05"/><stop offset="1" stop-color="#3b1a0a"/>
    </radialGradient>
    <radialGradient id="medal" cx=".4" cy=".3" r=".8">
      <stop offset="0" stop-color="#fffaf0"/><stop offset=".7" stop-color="#f1e2bd"/><stop offset="1" stop-color="#d8c08a"/>
    </radialGradient>
    <linearGradient id="silverV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7a7f86"/><stop offset=".35" stop-color="#f4f4f4"/><stop offset=".6" stop-color="#b8bcc2"/><stop offset="1" stop-color="#6a6f76"/>
    </linearGradient>
    <linearGradient id="ivoryKey" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4f1ea"/><stop offset=".85" stop-color="#fffdf8"/><stop offset="1" stop-color="#e2dccf"/>
    </linearGradient>
    <linearGradient id="blackKey" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#050505"/><stop offset=".5" stop-color="#2c2c2e"/><stop offset="1" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="lacquer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3a3e"/><stop offset=".25" stop-color="#121214"/><stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <filter id="grainV" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.5 0.008" numOctaves="3" seed="4" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0 0.02  2.6 0 0 0 -1.1"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="flame" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.11" numOctaves="2" seed="11" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.07  0 0 0 0 0.01  3.2 0 0 0 -1.45"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".6"/>
    </filter>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".55"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  const svg = (body) =>
    `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="instr-svg">${defs}${body}</svg>`;

  // medalion z nazwą dźwięku
  const tag = (midi, x, y, r = 17) => `
    <g class="tag"><circle class="tag-bg" cx="${x}" cy="${y}" r="${r}"/>
    <circle class="tag-ring" cx="${x}" cy="${y}" r="${r - 3.5}"/>
    <text class="tag-txt" x="${x}" y="${y + 1}" font-size="${r > 20 ? 19 : 15}">${noteName(midi)}</text></g>`;

  const peg = (i, midi, body, hit, extra = '') => `
    <g class="peg${extra}" data-i="${i}" role="button" tabindex="0" aria-label="Dźwięk ${fullName(midi)} – stuknij, aby usłyszeć">
      <rect class="hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}" rx="8"/>
      ${body}
    </g>`;

  // struna: owijana (z fakturą) albo gładka (nylon/jelito)
  const COL = { silver: '#dcdde0', nylon: '#efe6d0', gut: '#e6d3a6' };
  const string = (i, d, w, kind) => `<g class="str" data-i="${i}">
      <path d="${d}" stroke="#000" stroke-opacity=".4" stroke-width="${w + 1.2}" fill="none" transform="translate(1.5 2)"/>
      <path class="str-line" d="${d}" stroke="${COL[kind]}" stroke-width="${w}" fill="none"/>
      ${kind === 'silver' ? `<path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width="${w}" stroke-dasharray=".7 1" fill="none"/>` : ''}
      <path d="${d}" stroke="#fff" stroke-opacity=".5" stroke-width="${Math.max(0.4, w / 3)}" fill="none" transform="translate(-${w / 4} 0)"/>
    </g>`;

  // dawny mechanizm: mosiężna oś z kołnierzem i kościany guzik („lira”), lokalnie (0,0) = krawędź główki, w lewo
  const tuner = `
      <rect x="-16" y="-3.5" width="18" height="7" fill="url(#brass)" stroke="#6a4810" stroke-width=".6"/>
      <rect x="-21" y="-7" width="7" height="14" rx="2" fill="url(#brass)" stroke="#6a4810" stroke-width=".6"/>
      <path class="peg-body" d="M-20 0 C -22 -11, -32 -15, -44 -14 C -54 -13, -58 -8, -58 0 C -58 8, -54 13, -44 14 C -32 15, -22 11, -20 0 Z"
        fill="url(#ivory)" stroke="#7a6038" stroke-width="1"/>
      <path d="M-26 -6 C -32 -10, -44 -11, -52 -6" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>
`;

  // ozdobny ornament z masy perłowej (rozeta z płatków)
  const rosette = (x, y, r) => {
    let p = '';
    for (let k = 0; k < 6; k++) {
      p += `<ellipse cx="${x}" cy="${y - r * 0.55}" rx="${r * 0.22}" ry="${r * 0.5}" transform="rotate(${k * 60} ${x} ${y})" fill="url(#pearl)" stroke="#c9a24c" stroke-width=".6"/>`;
    }
    return `${p}<circle cx="${x}" cy="${y}" r="${r * 0.18}" fill="#c9a24c"/>`;
  };

  // ---------------- Gitara: romantyczna gitara klasyczna, główka z wycięciami ----------------
  function guitar(inst) {
    const s = inst.strings; // E A d g h e¹
    const nutY = 404;
    const head = `M143 ${nutY} L138 100 C 136 80, 128 66, 140 58 C 152 50, 164 58, 170 44 C 174 32, 178 24, 180 22 C 182 24, 186 32, 190 44 C 196 58, 208 50, 220 58 C 232 66, 224 80, 222 100 L217 ${nutY} Z`;
    const inlay = `M149 ${nutY - 8} L145 106 C 143 88, 138 74, 146 68 C 156 62, 166 68, 173 54 C 176 46, 178 40, 180 38 C 182 40, 184 46, 187 54 C 194 68, 204 62, 214 68 C 222 74, 217 88, 215 106 L211 ${nutY - 8}`;
    const rollersY = [152, 222, 292];
    // [indeks struny, strona, y wałka]
    const map = [[0, -1, 0], [1, -1, 1], [2, -1, 2], [5, 1, 0], [4, 1, 1], [3, 1, 2]];
    const nutX = [150.5, 162.1, 173.7, 186.3, 197.9, 209.5];
    const widths = [2.6, 2.2, 1.9, 1.9, 1.6, 1.3];
    const kinds = ['silver', 'silver', 'silver', 'nylon', 'nylon', 'nylon'];
    const slots = [[150, 116], [194, 116]];
    let pegs = '';
    let rollers = '';
    let strs = '';
    for (const [i, dir, r] of map) {
      const y = rollersY[r];
      const ex = dir < 0 ? 138 + (5 * (y - 100)) / (nutY - 100) : 222 - (5 * (y - 100)) / (nutY - 100);
      const body = `<g transform="translate(${ex} ${y}) scale(${dir < 0 ? 1 : -1} 1)">${tuner}</g>${tag(s[i], dir < 0 ? ex - 82 : ex + 82, y)}`;
      const hx = dir < 0 ? 4 : ex;
      pegs += peg(i, s[i], body, [hx, y - 28, dir < 0 ? ex - 4 : W - 4 - ex, 56]);
      const sx = dir < 0 ? 158 : 202;
      strs += string(i, `M${nutX[i]} ${H} L${nutX[i]} ${nutY} L${sx} ${y + 6}`, widths[i], kinds[i]);
      rollers += `
        <rect x="${sx - 10}" y="${y - 5}" width="20" height="11" rx="5" fill="url(#bone)" stroke="#8a7650" stroke-width=".6"/>
        <path d="M${sx - 5} ${y - 4} l3 9 M${sx - 1} ${y - 4} l3 9 M${sx + 3} ${y - 4} l3 9" stroke="${COL[kinds[i]]}" stroke-width="${widths[i]}" opacity=".95"/>
        <path d="M${sx - 5} ${y - 4} l3 9 M${sx - 1} ${y - 4} l3 9 M${sx + 3} ${y - 4} l3 9" stroke="#000" stroke-opacity=".25" stroke-width=".6" transform="translate(.8 0)"/>`;
    }
    return svg(`
      ${pegs}
      <path d="${head}" fill="url(#rosewood)" filter="url(#shadow)"/>
      <path d="${head}" fill="#000" filter="url(#grainV)" opacity=".75"/>
      <path d="${head}" fill="none" stroke="#e9d6a8" stroke-width="2.5"/>
      <path d="${head}" fill="none" stroke="#2a1206" stroke-width="1" transform="translate(0 1)" opacity=".5"/>
      <path d="${inlay}" fill="none" stroke="#d9b25a" stroke-width="1.4"/>
      <path d="${inlay}" fill="none" stroke="#2a1206" stroke-width=".6" transform="translate(2.5 0)" opacity=".7"/>
      ${rosette(180, 82, 18)}
      <path d="M180 352 l8 14 l-8 14 l-8 -14 Z" fill="url(#pearl)" stroke="#c9a24c" stroke-width=".8"/>
      <circle cx="180" cy="342" r="2.2" fill="url(#pearl)"/><circle cx="180" cy="390" r="2.2" fill="url(#pearl)"/>
      ${slots.map(([x, y]) => `
        <rect x="${x}" y="${y}" width="16" height="214" rx="8" fill="url(#slot)"/>
        <rect x="${x}" y="${y}" width="16" height="214" rx="8" fill="none" stroke="#e9d6a8" stroke-width="1.2" opacity=".85"/>`).join('')}
      ${rollers}
      <rect x="143" y="${nutY}" width="74" height="${H - nutY}" fill="url(#ebony)"/>
      <rect x="141" y="456" width="78" height="4" rx="1.5" fill="url(#brass)"/>
      <rect x="140" y="${nutY - 4}" width="80" height="10" rx="2.5" fill="url(#bone)" stroke="#8a7650" stroke-width=".6"/>
      ${strs}
    `);
  }

  // ---------------- Ukulele: w stylu lat 20., główka z koroną ----------------
  function ukulele(inst) {
    const s = inst.strings; // g¹ c¹ e¹ a¹
    const nutY = 404;
    const edge = (y) => 152 - (8 * (nutY - y)) / 284;
    const head = `M152 ${nutY} L145 132 C 140 116, 132 104, 134 88 C 136 70, 150 64, 158 70 C 160 52, 170 44, 180 44 C 190 44, 200 52, 202 70 C 210 64, 224 70, 226 88 C 228 104, 220 116, 215 132 L208 ${nutY} Z`;
    const inlay = `M157 ${nutY - 8} L151 136 C 146 120, 139 108, 141 92 C 143 80, 152 76, 160 82 C 163 64, 171 52, 180 52 C 189 52, 197 64, 200 82 C 208 76, 217 80, 219 92 C 221 108, 214 120, 209 136 L203 ${nutY - 8}`;
    const star = (x, y, r) => `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z" fill="url(#pearl)" stroke="#c9a24c" stroke-width=".7"/>`;
    const posts = [[0, -1, 190], [1, -1, 290], [3, 1, 190], [2, 1, 290]];
    const nutX = [161, 173.5, 186.5, 199];
    const widths = [2, 2.6, 2.3, 1.9];
    let pegs = '';
    let tops = '';
    let strs = '';
    for (const [i, dir, y] of posts) {
      const ex = dir < 0 ? edge(y) : W - edge(y);
      const px = dir < 0 ? ex + 17 : ex - 17;
      const body = `<g transform="translate(${ex} ${y}) scale(${dir < 0 ? 1 : -1} 1)">${tuner}</g>${tag(s[i], dir < 0 ? ex - 82 : ex + 82, y)}`;
      const hx = dir < 0 ? 18 : ex;
      pegs += peg(i, s[i], body, [hx, y - 30, dir < 0 ? ex - 18 : W - 18 - ex, 60]);
      tops += `
        <circle cx="${px}" cy="${y}" r="9" fill="url(#brass)" stroke="#6a4810" stroke-width=".6" filter="url(#soft)"/>
        <circle cx="${px}" cy="${y}" r="5.5" fill="url(#ivory)" stroke="#7a6038" stroke-width=".6"/>
        <circle cx="${px}" cy="${y}" r="6.5" fill="none" stroke="${COL.gut}" stroke-width="${widths[i] + 0.6}" stroke-dasharray="12 30" transform="rotate(${dir < 0 ? 40 : 120} ${px} ${y})"/>`;
      strs += string(i, `M${nutX[i]} ${H} L${nutX[i]} ${nutY} L${px + (nutX[i] < px ? -5 : 5)} ${y + 2}`, widths[i], 'gut');
    }
    return svg(`
      ${pegs}
      <path d="${head}" fill="url(#mahogany)" filter="url(#shadow)"/>
      <path d="${head}" fill="#000" filter="url(#grainV)" opacity=".55"/>
      <path d="${head}" fill="none" stroke="#e9d6a8" stroke-width="2.5"/>
      <path d="${inlay}" fill="none" stroke="#d9b25a" stroke-width="1.3"/>
      ${star(180, 92, 17)}
      <circle cx="148" cy="92" r="2.5" fill="url(#pearl)"/><circle cx="212" cy="92" r="2.5" fill="url(#pearl)"/>
      <circle cx="180" cy="128" r="3" fill="url(#pearl)"/><circle cx="180" cy="236" r="2.5" fill="url(#pearl)"/><circle cx="180" cy="346" r="2.5" fill="url(#pearl)"/>
      <rect x="152" y="${nutY}" width="56" height="${H - nutY}" fill="url(#rosewood)"/>
      <rect x="150" y="452" width="60" height="4" rx="1.5" fill="url(#brass)"/>
      <rect x="149" y="${nutY - 4}" width="62" height="10" rx="2.5" fill="url(#bone)" stroke="#8a7650" stroke-width=".6"/>
      ${tops}
      ${strs}
    `);
  }

  // ---------------- Skrzypce: ślimak z profilu, 4 kołki ----------------
  function violin(inst) {
    const s = inst.strings; // g d¹ a¹ e²
    const cx = 180;
    const cy = 98;
    // spirala ślimaka (2,6 zwoju do „oczka”)
    const spiral = (r0, r1, a0, turns) => {
      const pts = [];
      const steps = Math.round(turns * 48);
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const a = ((a0 - t * turns * 360) * Math.PI) / 180;
        const r = r0 + (r1 - r0) * t;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
      }
      return 'M' + pts.join(' L');
    };
    const head = `M150 ${H} L150 168 C 136 154, 126 128, 128 100 C 130 66, 154 46, 182 46 C 212 46, 234 70, 234 100 C 234 126, 220 144, 208 156 C 203 162, 202 170, 202 182 C 200 260, 198 330, 198 ${H} Z`;
    // [indeks, bliższy?, y, kąt]
    const pegsPos = [[1, true, 194, -28], [2, false, 236, 0], [0, true, 278, 22], [3, false, 320, 0]];
    let pegs = '';
    for (const [i, near, y, ang] of pegsPos) {
      const x = 176;
      const lx = 312;
      let body;
      if (near) {
        body = `
          <g transform="translate(${x} ${y}) rotate(${ang})" filter="url(#soft)">
            <path class="peg-body" d="M-38 -9 C -44 -9, -44 9, -38 9 C -24 9, -16 4, 0 4 C 16 4, 24 9, 38 9 C 44 9, 44 -9, 38 -9 C 24 -9, 16 -4, 0 -4 C -16 -4, -24 -9, -38 -9 Z" fill="url(#ebonyR)" stroke="#000" stroke-width="1"/>
            <path d="M-36 -6 C -24 -6, -16 -2, 0 -2 C 16 -2, 24 -6, 36 -6" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" fill="none"/>
          </g>
          <circle cx="${x}" cy="${y}" r="10" fill="url(#ebonyR)" stroke="#000"/>
          <circle cx="${x}" cy="${y}" r="7.5" fill="none" stroke="url(#bone)" stroke-width="2.2"/>
          <circle cx="${x}" cy="${y}" r="3.6" fill="url(#ivory)"/>`;
      } else {
        body = `
          <circle cx="${x}" cy="${y}" r="9" fill="#2a1206" opacity=".6"/>
          <circle class="peg-body" cx="${x}" cy="${y}" r="6.5" fill="url(#ebonyR)" stroke="#000"/>
          <circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity=".35"/>`;
      }
      body += `<path d="M${x + (near ? 30 : 12)} ${y} L${lx - 20} ${y}" class="leader"/>${tag(s[i], lx, y)}`;
      pegs += peg(i, s[i], body, [x - 46, y - 21, lx + 20 - (x - 46), 42]);
    }
    return svg(`
      <path d="${head}" fill="url(#amber)" filter="url(#shadow)"/>
      <path d="${head}" fill="#000" filter="url(#flame)" opacity=".8"/>
      <circle cx="${cx + 1}" cy="${cy}" r="52" fill="url(#amberR)" opacity=".55"/>
      <path d="${spiral(50, 9, 62, 2.6)}" fill="none" stroke="#2e0f02" stroke-width="3.2" stroke-linecap="round"/>
      <path d="${spiral(47, 7, 62, 2.6)}" fill="none" stroke="#ffcf8a" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>
      <path d="${spiral(53, 12, 62, 2.6)}" fill="none" stroke="#5a2408" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="8" fill="url(#amberR)" stroke="#2e0f02" stroke-width="1.5"/>
      <path d="${head}" fill="none" stroke="#2e0f02" stroke-width="1.4"/>
      <path d="M150 168 L150 ${H}" stroke="#2e0f02" stroke-width="3" opacity=".6"/>
      <path d="M134 ${H} L134 380 Q134 372 142 372 L150 372 L150 ${H} Z" fill="url(#ebony)"/>
      <path d="M134 ${H} L134 380 Q134 372 142 372 L150 372" fill="none" stroke="#fff" stroke-opacity=".15"/>
      <path d="M131 384 Q131 376 139 376 L150 376 L150 386 L131 386 Z" fill="url(#ebony)" stroke="#000" stroke-width=".5"/>
      <line x1="132" y1="386" x2="132" y2="${H}" class="str" data-i="-1" stroke="#c9ccd2" stroke-width="1.4"/>
      ${pegs}
    `);
  }

  // ---------------- Flet: dawny flet drewniany (bukszpan, pierścienie z kości), pionowo ----------------
  function flute(inst) {
    const s = inst.strings; // a¹ a²
    const x0 = 164;
    const tw = 32;
    const holeY = 140;
    const jointY = 318;
    const ring = (y, h, extra = 3) =>
      `<rect x="${x0 - extra}" y="${y}" width="${tw + extra * 2}" height="${h}" rx="2" fill="url(#boneV)" stroke="#8a7650" stroke-width=".6"/>
       <rect x="${x0 - extra}" y="${y + 1}" width="${tw + extra * 2}" height="1.2" fill="#fff" opacity=".6"/>`;
    const body = `
      <g filter="url(#shadow)">
        <rect x="${x0}" y="40" width="${tw}" height="${jointY - 40}" fill="url(#boxwood)"/>
        <rect x="${x0 + 1}" y="${jointY + 16}" width="${tw - 2}" height="${H - jointY}" fill="url(#boxwood)"/>
      </g>
      <rect x="${x0}" y="40" width="${tw}" height="${jointY - 40}" fill="#000" filter="url(#grainV)" opacity=".45"/>
      <rect x="${x0 + 1}" y="${jointY + 16}" width="${tw - 2}" height="${H - jointY}" fill="#000" filter="url(#grainV)" opacity=".45"/>
      <path d="M${x0 - 2} 44 L${x0 - 2} 26 Q 180 2 ${x0 + tw + 2} 26 L${x0 + tw + 2} 44 Z" fill="url(#boneV)" stroke="#8a7650" stroke-width=".7"/>
      <circle cx="180" cy="14" r="5" fill="url(#ivory)" stroke="#8a7650" stroke-width=".6"/>
      ${ring(42, 16)}
      ${ring(jointY - 8, 24, 4)}
      <rect x="${x0 - 4}" y="${jointY + 2}" width="${tw + 8}" height="2" fill="#8a7650" opacity=".7"/>
      <ellipse cx="180" cy="${holeY}" rx="10" ry="7.5" fill="#7a4a16"/>
      <ellipse cx="180" cy="${holeY + 0.8}" rx="8" ry="6" fill="#120804"/>
      <path d="M171 ${holeY + 4} Q 180 ${holeY + 9} 189 ${holeY + 4}" stroke="#f3cf88" stroke-width="1.2" fill="none" opacity=".8"/>
      <ellipse cx="180" cy="${jointY + 74}" rx="6.5" ry="5.5" fill="#7a4a16"/>
      <ellipse cx="180" cy="${jointY + 74.6}" rx="5" ry="4.2" fill="#120804"/>
      <ellipse cx="180" cy="${jointY + 128}" rx="6.5" ry="5.5" fill="#7a4a16"/>
      <ellipse cx="180" cy="${jointY + 128.6}" rx="5" ry="4.2" fill="#120804"/>
      ${ring(H - 14, 20, 3)}`;
    const arrows = `
      <g class="flute-hint">
        <path d="M262 ${jointY - 12} v-34 m0 0 l-7 9 m7 -9 l7 9" />
        <path d="M262 ${jointY + 24} v34 m0 0 l-7 -9 m7 9 l7 -9" />
        <text x="276" y="${jointY - 26}">wysuń</text><text x="276" y="${jointY - 10}" class="small">= niżej</text>
        <text x="276" y="${jointY + 44}">wsuń</text><text x="276" y="${jointY + 60}" class="small">= wyżej</text>
      </g>`;
    const spots = [[0, 72, holeY], [1, 288, holeY]];
    let pegs = '';
    let strs = '';
    for (const [i, x, y] of spots) {
      strs += `<path class="str" data-i="${i}" d="M${x + (i ? -36 : 36)} ${y} L${i ? 202 : 158} ${y}" stroke-width="1.6" stroke-dasharray="3 5" fill="none" stroke="#d9b25a"/>`;
      const bodyP = `${tag(s[i], x, y, 32)}<text class="tag-sub" x="${x}" y="${y + 52}">${i === 0 ? 'niższe' : 'wyższe'}</text>`;
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
            <path class="key-face" d="M${wx + 0.5} ${y0} h${kw - 1} v${kh - 6} q0 6 -6 6 h${-(kw - 13)} q-6 0 -6 -6 Z" fill="url(#ivoryKey)" stroke="#8f887c" stroke-width="1"/>
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
