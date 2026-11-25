// Metronom: włoskie oznaczenia tempa i ich zakresy BPM.
// Moduł niezależny od stroika (osobna przestrzeń nazw window.Metronome).
//
// Zakresy są tradycyjne i celowo na siebie zachodzą.
// Zakres to [from, to): górna granica należy już do następnego tempa,
// dzięki czemu dla dowolnego BPM wychodzą najwyżej dwie nazwy (np. „Largo/Lento”).
// `mid` – tempo ustawiane po wyborze oznaczenia z listy (środek zakresu,
// .5 zaokrąglone w górę; dla Larghissimo i Prestissimo liczone od granic metronomu).
(() => {
  'use strict';

  const MIN_BPM = 20;
  const MAX_BPM = 300;

  const TEMPOS = [
    { name: 'Larghissimo', meaning: 'bardzo, bardzo wolno',       from: MIN_BPM, to: 25 },
    { name: 'Grave',       meaning: 'poważnie, ciężko',           from: 25,  to: 45 },
    { name: 'Largo',       meaning: 'szeroko, bardzo wolno',      from: 40,  to: 60 },
    { name: 'Lento',       meaning: 'wolno',                      from: 45,  to: 60 },
    { name: 'Larghetto',   meaning: 'dość szeroko',               from: 60,  to: 66 },
    { name: 'Adagio',      meaning: 'wolno, spokojnie',           from: 66,  to: 76 },
    { name: 'Andante',     meaning: 'w tempie kroku',             from: 76,  to: 108 },
    { name: 'Andantino',   meaning: 'nieco żywiej niż andante',   from: 80,  to: 108 },
    { name: 'Moderato',    meaning: 'umiarkowanie',               from: 108, to: 120 },
    { name: 'Allegretto',  meaning: 'dość żywo',                  from: 112, to: 120 },
    { name: 'Allegro',     meaning: 'szybko, wesoło',             from: 120, to: 156 },
    { name: 'Vivace',      meaning: 'żywo',                       from: 156, to: 176 },
    { name: 'Presto',      meaning: 'bardzo szybko',              from: 168, to: 200 },
    { name: 'Prestissimo', meaning: 'najszybciej, jak się da',    from: 200, to: MAX_BPM + 1 },
  ].map((t) => {
    // górna wartość zakresu „z tabelki” (włącznie) – do liczenia środka
    const top = t.to > MAX_BPM ? MAX_BPM : t.to === 25 ? 24 : t.to;
    return { ...t, mid: Math.round((t.from + top) / 2) };
  });

  const clampBpm = (bpm) => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));

  // Oznaczenia pasujące do danego tempa, od wolniejszego do szybszego.
  const temposFor = (bpm) => {
    const b = clampBpm(bpm);
    return TEMPOS.filter((t) => b >= t.from && b < t.to);
  };

  // Tekst do wyświetlenia, np. „Allegro” albo „Largo/Lento”.
  const tempoLabel = (bpm) => temposFor(bpm).map((t) => t.name).join('/');

  window.Metronome = window.Metronome || {};
  Object.assign(window.Metronome, { MIN_BPM, MAX_BPM, TEMPOS, clampBpm, temposFor, tempoLabel });
})();
