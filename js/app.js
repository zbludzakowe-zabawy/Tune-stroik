// Stroik – logika aplikacji: mikrofon, rozpoznawanie struny, wskaźnik, dźwięki.
(() => {
  'use strict';
  const { INSTRUMENTS, DRAWINGS, meterSVG, fullName, freqOf, detectPitch } = window.Tuner;
  const $ = (id) => document.getElementById(id);
  const STORE = 'tune-stroik-state';

  // ---------- stan (zapisywany w localStorage) ----------
  const state = Object.assign(
    { inst: 'guitar', a4: 440, auto: true, chime: true, tuned: {} },
    (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })(),
  );
  if (!INSTRUMENTS.some((i) => i.id === state.inst)) state.inst = 'guitar';
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* trudno */ } };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  window.addEventListener('pagehide', save);

  const inst = () => INSTRUMENTS.find((i) => i.id === state.inst);
  const tunedSet = () => (state.tuned[state.inst] = state.tuned[state.inst] || []);

  // ---------- elementy ----------
  const stage = $('stage');
  const noteEl = $('note');
  const targetEl = $('target-hz');
  const heardEl = $('heard-hz');
  const statusEl = $('status');
  const micBtn = $('btn-mic');
  $('meter-box').innerHTML = meterSVG();
  const needle = $('needle');
  const meterCents = $('meter-cents');
  const half = +$('meter').dataset.half;

  // ---------- wybór instrumentu ----------
  const chips = $('chips');
  chips.innerHTML = INSTRUMENTS.map((i) => `<button class="chip" data-id="${i.id}">${i.name}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b || b.dataset.id === state.inst) return;
    state.inst = b.dataset.id;
    save();
    render();
  });

  let current = -1; // indeks strojonej struny
  function render() {
    stopTone();
    current = -1;
    resetDetection();
    for (const c of chips.children) c.classList.toggle('on', c.dataset.id === state.inst);
    chips.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    stage.innerHTML = DRAWINGS[state.inst](inst());
    stage.dataset.inst = state.inst;
    paintPegs();
    showIdle();
  }

  function paintPegs() {
    const tuned = tunedSet();
    stage.querySelectorAll('.peg, .str').forEach((el) => {
      const i = +el.dataset.i;
      el.classList.toggle('active', i === current);
      el.classList.toggle('tuned', tuned.includes(i));
      el.classList.toggle('playing', i === playingIdx);
    });
  }

  function showTarget(i) {
    const m = inst().strings[i];
    noteEl.textContent = fullName(m);
    targetEl.textContent = `cel ${fmtHz(freqOf(m, state.a4))} Hz`;
  }
  const fmtHz = (f) => f.toFixed(1).replace('.', ',');

  function showIdle() {
    heardEl.textContent = '';
    if (current >= 0) showTarget(current);
    else { noteEl.textContent = '–'; targetEl.textContent = `a¹ = ${state.a4} Hz`; }
    statusEl.className = 'status';
    statusEl.textContent = listening ? `Zagraj ${inst().what}…` : 'Włącz mikrofon, żeby stroić';
    targetCents = 0;
    needleVisible = false;
  }

  // stuknięcie kołka: zagraj dźwięk wzorcowy (i wybierz strunę)
  stage.addEventListener('click', (e) => {
    const p = e.target.closest('.peg');
    if (!p) return;
    const i = +p.dataset.i;
    if (playingIdx === i) { stopTone(); return; }
    current = i;
    resetDetection();
    showTarget(i);
    paintPegs();
    playTone(inst().strings[i]);
  });
  stage.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.peg')) { e.preventDefault(); e.target.closest('.peg').dispatchEvent(new Event('click', { bubbles: true })); }
  });

  // ---------- dźwięk ----------
  let ctx = null;
  const ensureCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  let muteUntil = 0; // nie słuchaj mikrofonu, gdy gra głośnik
  let tone = null;
  let playingIdx = -1;
  function playTone(midi) {
    stopTone();
    const c = ensureCtx();
    const f = freqOf(midi, state.a4);
    const osc = c.createOscillator();
    // barwa zbliżona do szarpanej struny / fletu
    const flute = state.inst === 'flute';
    const h = flute ? [0, 1, 0.35, 0.12, 0.05] : [0, 1, 0.55, 0.35, 0.22, 0.14, 0.08, 0.05];
    osc.setPeriodicWave(c.createPeriodicWave(new Float32Array(h.length), new Float32Array(h)));
    osc.frequency.value = f;
    const g = c.createGain();
    const t = c.currentTime;
    const dur = 2.6;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.32, t + (flute ? 0.08 : 0.01));
    if (flute) { g.gain.setValueAtTime(0.28, t + dur - 0.4); g.gain.linearRampToValueAtTime(0, t + dur); }
    else g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
    playingIdx = inst().strings.indexOf(midi);
    tone = { osc, g, timer: setTimeout(() => { tone = null; playingIdx = -1; paintPegs(); }, dur * 1000) };
    muteUntil = performance.now() + dur * 1000 + 350;
    paintPegs();
  }
  function stopTone() {
    if (!tone) return;
    clearTimeout(tone.timer);
    try {
      const t = ctx.currentTime;
      tone.g.gain.cancelScheduledValues(t);
      tone.g.gain.setTargetAtTime(0, t, 0.03);
      tone.osc.stop(t + 0.2);
    } catch (e) { /* już zatrzymany */ }
    tone = null;
    playingIdx = -1;
    muteUntil = performance.now() + 350;
    paintPegs();
  }

  // „dźwięk zgody”: krótki akord durowy jak dzwoneczek
  function chime() {
    if (!state.chime) return;
    const c = ensureCtx();
    const t = c.currentTime;
    [[1046.5, 0], [1318.5, 0.09], [1568, 0.18]].forEach(([f, dt]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + dt);
      g.gain.linearRampToValueAtTime(0.18, t + dt + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.9);
      o.connect(g).connect(c.destination);
      o.start(t + dt);
      o.stop(t + dt + 1);
    });
    muteUntil = Math.max(muteUntil, performance.now() + 1300);
  }

  // ---------- mikrofon ----------
  let listening = false;
  let stream = null;
  let analyser = null;
  let buf = null;
  let wakeLock = null;

  async function startMic() {
    try {
      const c = ensureCtx();
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const src = c.createMediaStreamSource(stream);
      analyser = c.createAnalyser();
      analyser.fftSize = 4096;
      src.connect(analyser);
      buf = new Float32Array(analyser.fftSize);
      listening = true;
      micBtn.classList.add('on');
      micBtn.querySelector('span').textContent = 'Wyłącz mikrofon';
      try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) { /* brak */ }
      showIdle();
    } catch (e) {
      statusEl.className = 'status warn';
      statusEl.textContent = 'Brak dostępu do mikrofonu – zezwól w ustawieniach przeglądarki.';
    }
  }
  function stopMic() {
    listening = false;
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    analyser = null;
    try { wakeLock?.release(); } catch (e) { /* brak */ }
    wakeLock = null;
    micBtn.classList.remove('on');
    micBtn.querySelector('span').textContent = 'Włącz mikrofon';
    resetDetection();
    showIdle();
  }
  micBtn.addEventListener('click', () => (listening ? stopMic() : startMic()));
  // w tle zwalniamy mikrofon (oszczędność baterii, prywatność)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && listening) stopMic();
  });

  // ---------- analiza ----------
  let hist = [];
  let lastHeard = 0;
  let candidate = -1;
  let candidateCount = 0;
  let inTuneSince = 0;
  let outSince = 0;
  let targetCents = 0;
  let shownCents = 0;
  let needleVisible = false;
  let lastAnalysis = 0;

  function resetDetection() {
    hist = [];
    candidate = -1;
    candidateCount = 0;
    inTuneSince = 0;
    outSince = 0;
  }

  const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s[s.length >> 1]; };
  const centsOff = (f, midi) => 1200 * Math.log2(f / freqOf(midi, state.a4));

  function analyse(now) {
    const strings = inst().strings;
    const fs = strings.map((m) => freqOf(m, state.a4));
    const minF = Math.min(...fs) * 0.7;
    const maxF = Math.max(...fs) * 1.45;
    analyser.getFloatTimeDomainData(buf);
    const r = now < muteUntil ? null : detectPitch(buf, ctx.sampleRate, minF, maxF);
    if (!r) {
      if (now - lastHeard > 250) hist = [];
      if (now - lastHeard > 1500 && needleVisible) showIdle();
      inTuneSince = 0;
      return;
    }
    lastHeard = now;
    hist.push(r.freq);
    if (hist.length > 5) hist.shift();
    const f = median(hist);

    // która struna? najbliższa (w centach), zmiana dopiero po 3 zgodnych odczytach
    let best = 0;
    for (let i = 1; i < strings.length; i++) {
      if (Math.abs(centsOff(f, strings[i])) < Math.abs(centsOff(f, strings[best]))) best = i;
    }
    if (state.auto && best !== current) {
      if (Math.abs(centsOff(f, strings[best])) > 450) return; // to nie ten instrument
      if (best === candidate) candidateCount++;
      else { candidate = best; candidateCount = 1; }
      if (current < 0 || candidateCount >= 3) {
        current = best;
        inTuneSince = 0;
        outSince = 0;
        showTarget(current);
        paintPegs();
      } else return;
    }
    if (current < 0) return;

    const cents = centsOff(f, strings[current]);
    targetCents = Math.max(-55, Math.min(55, cents));
    needleVisible = true;
    heardEl.textContent = `słyszę ${fmtHz(f)} Hz`;

    const tuned = tunedSet();
    const isTuned = tuned.includes(current);
    if (Math.abs(cents) <= 5) {
      outSince = 0;
      if (!inTuneSince) inTuneSince = now;
      if (!isTuned && now - inTuneSince > 600) {
        tuned.push(current);
        save();
        paintPegs();
        chime();
        pulse();
      }
      setStatus('ok', tuned.includes(current) ? 'Nastrojone ✓' : 'Trzymaj…');
    } else {
      inTuneSince = 0;
      if (isTuned && Math.abs(cents) > 20) {
        if (!outSince) outSince = now;
        else if (now - outSince > 400) {
          tuned.splice(tuned.indexOf(current), 1);
          save();
          paintPegs();
        }
      }
      setStatus(cents < 0 ? 'low' : 'high', cents < 0 ? inst().low : inst().high);
    }
  }

  function setStatus(kind, text) {
    statusEl.className = 'status ' + kind;
    statusEl.textContent = text;
  }

  function pulse() {
    const p = stage.querySelector(`.peg[data-i="${current}"]`);
    if (!p) return;
    p.classList.remove('pop');
    void p.getBoundingClientRect();
    p.classList.add('pop');
  }

  function frame(now) {
    if (listening && analyser && now - lastAnalysis > 40) {
      lastAnalysis = now;
      analyse(now);
    }
    {
      shownCents += (targetCents - shownCents) * 0.22;
      needle.setAttribute('transform', `translate(${((shownCents / 50) * half).toFixed(1)} 0)`);
      const ok = needleVisible && Math.abs(targetCents) <= 5;
      needle.classList.toggle('ok', ok);
      needle.classList.toggle('dim', !needleVisible);
      meterCents.textContent = needleVisible ? `${targetCents > 0 ? '+' : ''}${Math.round(targetCents)} ct` : '';
    }
    requestAnimationFrame(frame);
  }

  // ---------- ustawienia ----------
  const dlg = $('settings');
  const a4Range = $('a4-range');
  const a4Val = $('a4-val');
  const syncSettings = () => {
    a4Range.value = state.a4;
    a4Val.textContent = state.a4;
    $('opt-auto').checked = state.auto;
    $('opt-chime').checked = state.chime;
    document.querySelectorAll('.preset').forEach((b) => b.classList.toggle('on', +b.dataset.hz === state.a4));
  };
  const setA4 = (v) => {
    state.a4 = Math.max(415, Math.min(466, Math.round(v)));
    save();
    syncSettings();
    resetDetection();
    if (current >= 0) showTarget(current); else showIdle();
  };
  $('btn-settings').addEventListener('click', () => { syncSettings(); dlg.showModal(); });
  $('btn-close-settings').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  a4Range.addEventListener('input', () => setA4(+a4Range.value));
  $('a4-minus').addEventListener('click', () => setA4(state.a4 - 1));
  $('a4-plus').addEventListener('click', () => setA4(state.a4 + 1));
  document.querySelectorAll('.preset').forEach((b) => b.addEventListener('click', () => setA4(+b.dataset.hz)));
  $('opt-auto').addEventListener('change', (e) => { state.auto = e.target.checked; save(); });
  $('opt-chime').addEventListener('change', (e) => { state.chime = e.target.checked; save(); });
  $('btn-reset-tuned').addEventListener('click', () => { state.tuned = {}; save(); paintPegs(); dlg.close(); });
  $('btn-test-chime').addEventListener('click', () => { const was = state.chime; state.chime = true; chime(); state.chime = was; });

  render();
  requestAnimationFrame(frame);
})();
