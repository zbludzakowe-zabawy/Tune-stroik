# Stroik – notatki dla Claude

Aplikacja PWA na telefon do strojenia instrumentów. Czysty HTML/CSS/JS, bez buildu i bez zależności.
Adres: https://zbludzakowe-zabawy.github.io/Tune-stroik/ (GitHub Pages, workflow `.github/workflows/pages.yml`, publikacja z `main`).

## Preferencje użytkowniczki
- Wszystko po polsku: UI, commity, opisy PR, rozmowa.
- Kolorystyka **bordowa** (zmienne w `:root` w `style.css`), podpisy jako kremowe medaliony ze złotą obwódką.
- Rysunki w stylu **dawnych, pięknych instrumentów** (lakier, słoje, masa perłowa, mosiądz, kość). Wersja „realistyczna” (chrom, plastik) została odrzucona jako brzydka.
- Przy zmianach wyglądu: zrób zrzuty ekranu (Playwright, Pixel 7), obejrzyj je i pokaż użytkowniczce (SendUserFile).
- PWA robiona według skilla `pwa-na-telefon`: nowa wersja nie przeładowuje się sama, tylko przez baner „Odśwież”.

## Struktura
- `index.html` – układ: górny pasek → wybór instrumentu (`#chips`) → odczyt (`#note`, `#target-hz`, `#heard-hz`, `#status`) → **pasek wskaźnika `#meter-box` (nad instrumentem)** → `#stage` (rysunek) → przycisk mikrofonu; dialog `#settings`; banery PWA.
- `js/instruments.js` – lista `INSTRUMENTS` (id, name, strings = numery MIDI, komunikaty low/high, what); `noteName(midi, flat)` – notacja polska Helmholtza (A, a, a¹, H zamiast B, b = h obniżone); `fullName` – dla półtonów „cis¹/des¹”; `isBlack`; `freqOf(midi, a4)`.
- `js/drawings.js` – SVG instrumentów, viewBox 360×470, wspólne `defs` (gradienty: rosewood, mahogany, amber, boxwood, ebony, bone, ivory, brass, pearl, medal…; filtry grainV, flame, shadow, soft, glow). `DRAWINGS[id](inst)` zwraca SVG; `meterSVG()` – osobny pasek wskaźnika.
- `js/pitch.js` – `detectPitch` (YIN, próg 0,15, RMS > 0,006, interpolacja paraboliczna).
- `js/app.js` – stan, mikrofon, rozpoznawanie struny, igła, dźwięk wzorcowy, „dźwięk zgody”, ustawienia.
- `js/pwa.js`, `sw.js`, `manifest.webmanifest`, `icons/` (z `icons/icon.svg` przez `scripts/make-icons.js`), `tools/build-sw.mjs` (wersja SW = hash plików; uruchamiany w workflow – lista ASSETS w `sw.js` jest nadpisywana przy publikacji).

## Konwencje rysunków (ważne przy poprawkach)
- Każdy kołek/klawisz: `<g class="peg" data-i="i">` (i = indeks w `inst.strings`), w środku `.hit` (przezroczysty prostokąt dotyku), `.peg-body` (świeci przy aktywnym), `.tag` (`.tag-bg`, `.tag-ring`, `.tag-txt`). Fortepian: `.peg.key.white/.black` z `.key-face`, `.key-txt`.
- Struny: `<g class="str" data-i="i">` z `.str-line` (zmienia kolor). Fortepian i flet: przerywana linia `path.str`.
- Klasy stanu nadaje `paintPegs()` w app.js: `.active` (żółty – strojona), `.tuned` (zielony – nastrojona), `.playing` (gra dźwięk wzorcowy), `.pop` (animacja po nastrojeniu).
- Elementy symetryczne rysowane dla lewej strony i odbijane `scale(-1 1)` (mechanizm `tuner`, kołek skrzypcowy `vpeg`).
- Gitara i ukulele są **poszerzone o 25%**: `WIDE = 1.25`, `X(x)` przelicza współrzędne, `wide()` rozciąga tylko drewno (główka, gryf, siodełko); okrągłe elementy (wałki, słupki, ozdoby) rysuj z `X()`, bez rozciągania.

## Instrumenty (stan obecny)
- Gitara: E A d g h e¹ – romantyczna gitara klasyczna, główka z dwoma wycięciami i kościanymi wałkami, kwiat z masy perłowej. Wałki od góry: E/e¹, A/h, d/g.
- Skrzypce: g d¹ a¹ e² – **widok od przodu** (widok z profilu odrzucony), ślimak z dwoma zwojami po bokach, kołki: d¹ i g po lewej, a¹ i e² po prawej.
- Ukulele: g¹ c¹ e¹ a¹ – lata 20., mahoń, korona, gwiazda z masy perłowej.
- Flet: a¹ i a² – **pionowo**, drewniany (bukszpan) z pierścieniami z kości; strzałki „wysuń = niżej / wsuń = wyżej”; dwa przyciski-medaliony zamiast kołków.
- Fortepian: wszystkie dźwięki A–c² (MIDI 45–72, `range(45, 72)`), dwa rzędy klawiszy. Zastąpił harfę – użytkowniczka zastrzegła, że zakres może się jeszcze zmienić.

## Logika strojenia (app.js)
- Analiza co ~40 ms, bufor 4096, zakres szukania: najniższa struna × 0,7 … najwyższa × 1,45.
- Mediana z 5 odczytów. Automatyczne rozpoznawanie: najbliższa struna w centach, zmiana dopiero po 3 zgodnych odczytach; ignorowane, gdy > 450 ct od każdej struny.
- Nastrojone: |ct| ≤ 5 przez 600 ms → `.tuned` + akord C-E-G. Zdjęcie oznaczenia: |ct| > 20 przez 400 ms.
- Podczas dźwięku wzorcowego i akordu mikrofon jest „wyciszony” (`muteUntil`), żeby aplikacja nie słyszała samej siebie.
- Mikrofon wyłącza się, gdy aplikacja schodzi w tło; Wake Lock podczas słuchania.
- Stan w localStorage `tune-stroik-state`: inst, a4 (415–466), auto, chime, tuned{inst: [i]}.

## Jak dodać/zmienić instrument
1. Wpis w `INSTRUMENTS` (js/instruments.js).
2. Funkcja rysunku w `js/drawings.js` + dopisać do `window.Tuner.DRAWINGS` (klucz = id).
3. Nowe pliki JS dopisać w `index.html` (lista w `sw.js` uzupełnia się przy publikacji).

## Testowanie (Playwright jest w środowisku)
- Serwer: `python3 -m http.server 8765` w katalogu repo.
- Zrzuty: `devices['Pixel 7']`, klik `.chip[data-id=…]`.
- Wykrywanie dźwięku: wygeneruj WAV (np. 110 Hz −25 ct, potem 110 Hz) i uruchom Chromium z `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream --use-file-for-fake-audio-capture=plik.wav`; sprawdzaj `#meter-cents`, `.peg.active`, `.peg.tuned`.
- PWA: zbuduj kopię jak workflow (`_site` + `node tools/build-sw.mjs`), w kopii podmień w `js/pwa.js` warunek `location.protocol !== 'https:'` na `false` (SW tylko przez HTTPS), sprawdź SW, offline, baner aktualizacji, tryb `ios` banera instalacji.
