// Metronom – klasyczny, z wahadłem zaczepionym na dole.
// Niezależny od stroika: własny stan, własny kontekst audio, własny zapis.
// Dźwięk planowany z wyprzedzeniem w Web Audio (dokładny rytm),
// a wahadło rysowane według zegara audio, więc zawsze trafia w kliknięcie.
(() => {
  'use strict';
  const M = window.Metronome;
  const $ = (id) => document.getElementById(id);
  const SVG = 'http://www.w3.org/2000/svg';

  // ---------- stan (zapisywany w localStorage) ----------
  const STORE = 'tune-stroik-metronom';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })();
  const intIn = (v, lo, hi, def) => (Number.isInteger(v) && v >= lo && v <= hi ? v : def);
  const st = {
    mode: saved.mode === 'metro' ? 'metro' : 'tuner',
    bpm: intIn(saved.bpm, M.MIN_BPM, M.MAX_BPM, 120),
    // nazwa wybrana z listy – pokazywana zamiast wyliczonej, aż do ręcznej zmiany tempa
    picked: M.TEMPOS.some((t) => t.name === saved.picked) ? saved.picked : null,
    accent: intIn(saved.accent, 1, 8, 4),
    sub: intIn(saved.sub, 1, 16, 1),
  };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* trudno */ } };

  // ---------- przełącznik Strojenie / Metronom ----------
  const modeSwitch = $('mode-switch');
  function setMode(mode) {
    st.mode = mode;
    document.body.classList.toggle('metro', mode === 'metro');
    modeSwitch.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));
    if (mode === 'metro') {
      // mikrofon stroika nie jest potrzebny – wyłączamy go jego własnym przyciskiem
      const mic = $('btn-mic');
      if (mic?.classList.contains('on')) mic.click();
      scrollChipIntoView();
    } else {
      stop();
    }
    save();
  }
  modeSwitch.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mode]');
    if (b && b.dataset.mode !== st.mode) setMode(b.dataset.mode);
  });

  // ---------- rysunek metronomu ----------
  const PIVOT = { x: 150, y: 300 };
  const AMP = 30; // wychylenie wahadła w stopniach
  // pozycja ciężarka: wolno = wysoko, szybko = nisko (jak w prawdziwym metronomie)
  const weightY = (bpm) => {
    const f = (Math.log(bpm) - Math.log(M.MIN_BPM)) / (Math.log(M.MAX_BPM) - Math.log(M.MIN_BPM));
    return 92 + f * 158;
  };
  const scaleMarks = [20, 30, 40, 60, 80, 100, 120, 160, 200, 300];
  const stage = $('metro-stage');
  stage.innerHTML = `
    <svg class="metro-svg" viewBox="0 0 300 370" role="img" aria-label="Metronom">
      <defs>
        <linearGradient id="m-wood" x1="0" x2="1">
          <stop offset="0" stop-color="#2a0a13"/><stop offset=".45" stop-color="#6a1f33"/><stop offset="1" stop-color="#2a0a13"/>
        </linearGradient>
        <linearGradient id="m-face" x1="0" x2="1">
          <stop offset="0" stop-color="#d9c39a"/><stop offset=".5" stop-color="#f6ead0"/><stop offset="1" stop-color="#d9c39a"/>
        </linearGradient>
        <linearGradient id="m-gold" x1="0" x2="1">
          <stop offset="0" stop-color="#a87b2e"/><stop offset=".5" stop-color="#f3d88f"/><stop offset="1" stop-color="#a87b2e"/>
        </linearGradient>
      </defs>
      <rect class="m-base" x="26" y="326" width="248" height="24" rx="6"/>
      <path class="m-body" d="M40 330 L111 50 Q115 36 129 36 L171 36 Q185 36 189 50 L260 330 Z"/>
      <path class="m-face" d="M86 300 L128 62 L172 62 L214 300 Z"/>
      <g class="m-scale">${scaleMarks.map((b) => {
        const y = weightY(b).toFixed(1);
        return `<line x1="142" x2="158" y1="${y}" y2="${y}"/><text x="139" y="${y}">${b}</text>`;
      }).join('')}</g>
      <g class="m-pendulum" id="m-pendulum">
        <line class="m-rod" x1="150" y1="${PIVOT.y}" x2="150" y2="22"/>
        <path class="m-weight" id="m-weight" d=""/>
      </g>
      <circle class="m-pivot" cx="${PIVOT.x}" cy="${PIVOT.y}" r="9"/>
    </svg>`;
  const pendulum = $('m-pendulum');
  const weight = $('m-weight');
  const setAngle = (deg) => pendulum.setAttribute('transform', `rotate(${deg.toFixed(2)} ${PIVOT.x} ${PIVOT.y})`);

  // ---------- lista temp ----------
  const chips = $('tempo-chips');
  chips.innerHTML = M.TEMPOS.map((t) =>
    `<button class="chip" data-name="${t.name}" title="${t.meaning}: ${t.from}–${Math.min(t.to - 1, M.MAX_BPM)} BPM">${t.name}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const t = M.TEMPOS.find((x) => x.name === b.dataset.name);
    setBpm(t.mid, t.name);
  });
  function scrollChipIntoView() {
    const on = chips.querySelector('.chip.on');
    if (!on || !chips.clientWidth) return;
    chips.scrollTo({ left: on.offsetLeft - (chips.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
  }

  // ---------- akcent i podział ----------
  const accentSeg = $('accent-seg');
  accentSeg.innerHTML = Array.from({ length: 8 }, (_, i) =>
    `<button role="radio" data-n="${i + 1}" aria-label="Akcent co ${i + 1}">${i + 1}</button>`).join('');
  accentSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    st.accent = +b.dataset.n;
    save(); render();
  });
  const setSub = (n) => { st.sub = Math.min(16, Math.max(1, n)); save(); render(); };

  // ---------- tempo ----------
  const bpmRange = $('bpm-range');
  function setBpm(bpm, picked = null) {
    st.bpm = M.clampBpm(bpm);
    st.picked = picked;
    save(); render();
    if (picked) scrollChipIntoView();
  }
  bpmRange.addEventListener('input', () => setBpm(+bpmRange.value));

  // przyciski −/+: stuknięcie = 1, przytrzymanie = szybkie powtarzanie
  function holdRepeat(btn, fn) {
    let t1 = 0, t2 = 0;
    const end = () => { clearTimeout(t1); clearInterval(t2); };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      fn();
      t1 = setTimeout(() => { t2 = setInterval(fn, 70); }, 400);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, end));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }
  holdRepeat($('bpm-minus'), () => setBpm(st.bpm - 1));
  holdRepeat($('bpm-plus'), () => setBpm(st.bpm + 1));
  holdRepeat($('sub-minus'), () => setSub(st.sub - 1));
  holdRepeat($('sub-plus'), () => setSub(st.sub + 1));

  // ---------- widok ----------
  const dots = $('beat-dots');
  function render() {
    const names = st.picked ? [st.picked] : M.temposFor(st.bpm).map((t) => t.name);
    $('tempo-name').textContent = names.join('/');
    $('bpm-val').textContent = st.bpm;
    bpmRange.value = st.bpm;
    chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', names.includes(c.dataset.name)));
    accentSeg.querySelectorAll('button').forEach((b) => {
      const on = +b.dataset.n === st.accent;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
    });
    $('sub-val').textContent = st.sub;
    $('sub-note').textContent = st.sub === 1 ? 'bez podziału' : `${st.sub} ${plural(st.sub)}`;
    $('sub-minus').disabled = st.sub <= 1;
    $('sub-plus').disabled = st.sub >= 16;
    if (dots.childElementCount !== st.accent) {
      dots.innerHTML = Array.from({ length: st.accent }, (_, i) => `<i class="${i === 0 ? 'acc' : ''}"></i>`).join('');
    }
    const y = weightY(st.bpm);
    weight.setAttribute('d', `M133 ${y} L167 ${y} L172 ${y + 28} L128 ${y + 28} Z`);
  }
  const plural = (n) => (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'kliknięcia' : 'kliknięć') + ' na uderzenie';

  // ---------- dźwięk ----------
  let ctx = null;
  let playing = false;
  let timer = 0;
  let nextTime = 0;   // czas następnego kliknięcia (zegar audio)
  let beat = 0;       // numer uderzenia
  let subIdx = 0;     // numer kliknięcia w obrębie uderzenia
  let startTime = 0;
  let beats = [];     // zaplanowane uderzenia: { time, n, dur }
  let wakeLock = null;

  const SOUNDS = {
    accent: { f: 1750, g: 0.9 },
    beat: { f: 1150, g: 0.6 },
    sub: { f: 820, g: 0.28 },
  };
  function click(time, kind) {
    const s = SOUNDS[kind];
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = s.f;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(s.g, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    o.connect(g).connect(ctx.destination);
    o.start(time);
    o.stop(time + 0.06);
  }

  function schedule() {
    const ahead = ctx.currentTime + 0.12;
    while (nextTime < ahead) {
      const dur = 60 / st.bpm;
      if (subIdx === 0) {
        click(nextTime, beat % st.accent === 0 ? 'accent' : 'beat');
        beats.push({ time: nextTime, n: beat, dur });
        if (beats.length > 8) beats.shift();
      } else {
        click(nextTime, 'sub');
      }
      nextTime += dur / st.sub;
      if (++subIdx >= st.sub) { subIdx = 0; beat++; }
    }
  }

  const LEAD = 0.25; // rozbieg wahadła ze środka do pierwszego wychylenia
  async function start() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state !== 'running') await ctx.resume();
    playing = true;
    beat = 0; subIdx = 0; beats = [];
    startTime = ctx.currentTime;
    nextTime = startTime + LEAD;
    schedule();
    timer = setInterval(schedule, 25);
    pendulum.classList.remove('rest');
    btn.classList.add('on');
    btn.querySelector('span').textContent = 'Stop';
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) { /* brak */ }
    requestAnimationFrame(frame);
  }
  function stop() {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    try { wakeLock?.release(); } catch (e) { /* brak */ }
    wakeLock = null;
    btn.classList.remove('on');
    btn.querySelector('span').textContent = 'Start';
    pendulum.classList.add('rest');
    setAngle(0);
    dots.querySelectorAll('i').forEach((d) => d.classList.remove('on'));
  }

  // ---------- animacja wahadła ----------
  function frame() {
    if (!playing) return;
    const now = ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0);
    let b = null;
    for (const x of beats) if (x.time <= now) b = x;
    if (!b) {
      // rozbieg: ze środka w prawo, do pierwszego uderzenia
      const q = Math.min(1, Math.max(0, (now - startTime) / LEAD));
      setAngle(AMP * Math.sin((q * Math.PI) / 2));
    } else {
      // uderzenie = skrajne wychylenie; parzyste w prawo, nieparzyste w lewo
      const p = Math.min(1, (now - b.time) / b.dur);
      setAngle((b.n % 2 === 0 ? 1 : -1) * AMP * Math.cos(Math.PI * p));
      const pos = b.n % st.accent;
      const flash = now - b.time < 0.12;
      dots.querySelectorAll('i').forEach((d, i) => {
        d.classList.toggle('on', i === pos);
        d.classList.toggle('hit', i === pos && flash);
      });
    }
    requestAnimationFrame(frame);
  }

  const btn = $('btn-metro');
  btn.addEventListener('click', () => (playing ? stop() : start()));
  // spacja = start/stop (na komputerze)
  document.addEventListener('keydown', (e) => {
    if (st.mode !== 'metro' || e.code !== 'Space' || e.target.closest('button, input')) return;
    e.preventDefault();
    playing ? stop() : start();
  });
  // w tle przeglądarka gubi rytm – zatrzymujemy
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { stop(); save(); }
  });

  pendulum.classList.add('rest');
  render();
  setMode(st.mode);
})();
