# Stroik

Stroik do instrumentów na telefon (PWA): **gitara, skrzypce, ukulele, flet poprzeczny, fortepian**.

## Jak działa

- Na ekranie widać fragment instrumentu (główkę z kołkami, ślimak skrzypiec, pionową główkę fletu z ustnikiem, klawiaturę fortepianu).
- Po włączeniu mikrofonu aplikacja **sama rozpoznaje strojoną strunę** – jej kołek i struna są podświetlone.
- Wskaźnik nad instrumentem przesuwa się w lewo (za nisko) lub w prawo (za wysoko); zielone pole = ±5 centów.
- Gdy dźwięk utrzyma się w stroju ~0,6 s: kołek robi się **zielony** i słychać krótki akord („dźwięk zgody”). Pozostałe struny zostają neutralne.
- **Stuknięcie kołka** (lub klawisza, przycisku a¹/a² fletu) odtwarza dźwięk wzorcowy; ponowne stuknięcie go zatrzymuje.
- **Ustawienia** (⚙): częstotliwość a¹ (415–466 Hz, domyślnie 440), automatyczne rozpoznawanie struny, dźwięk po nastrojeniu, kasowanie zielonych oznaczeń.

| Instrument | Dźwięki (notacja polska) |
|---|---|
| Gitara | E A d g h e¹ |
| Skrzypce | g d¹ a¹ e² |
| Ukulele | g¹ c¹ e¹ a¹ |
| Flet poprzeczny | a¹, a² |
| Fortepian | wszystkie dźwięki od A do c² (z półtonami, np. cis/des) |

Listę instrumentów i dźwięków zmienia się w `js/instruments.js` (np. zakres fortepianu: `range(45, 72)`; numery MIDI, 69 = a¹).

## Aplikacja na telefon

- **Android (Chrome):** otwórz stronę, stuknij baner **Zainstaluj** (albo ⋮ → *Zainstaluj aplikację*).
- **iPhone / iPad:** w Safari stuknij **Udostępnij** → **Do ekranu początkowego**.
- **Komputer (Chrome/Edge):** ikona instalacji w pasku adresu.

Po instalacji działa **bez internetu**. Wybrany instrument i ustawienia są zapamiętywane.
Gdy pojawi się baner **„Dostępna nowa wersja”**, stuknij *Odśwież* – ustawienia zostaną zachowane.
Mikrofon jest wyłączany, gdy aplikacja schodzi w tło.

## Struktura

- `index.html`, `style.css` – strona i wygląd (kolorystyka bordowa)
- `js/instruments.js` – instrumenty i nazwy dźwięków
- `js/drawings.js` – rysunki instrumentów (SVG) i wskaźnik
- `js/pitch.js` – wykrywanie wysokości dźwięku (algorytm YIN)
- `js/app.js` – mikrofon, rozpoznawanie struny, dźwięki, ustawienia
- `js/pwa.js`, `sw.js`, `manifest.webmanifest`, `icons/` – aplikacja na telefon (instalacja, offline, aktualizacje)
- `tools/build-sw.mjs` – wersjonowanie service workera przy publikacji
- `scripts/make-icons.js` – generowanie ikon z `icons/icon.svg`
- `.github/workflows/pages.yml` – publikacja na GitHub Pages (Settings → Pages → Source: *GitHub Actions*)
