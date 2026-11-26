// Przycisk „Udostępnij” (jak w Światełkach): zaproszenie dla znajomych.
// Zawsze stały adres opublikowanej aplikacji – nie location.href, bo zainstalowana
// aplikacja i wersje testowe działają pod innymi adresami.
// Kolejno: systemowe okno udostępniania (telefon) → kopiowanie do schowka → komunikat z adresem.
(() => {
  'use strict';

  const SHARE_URL = 'https://zbludzakowe-zabawy.github.io/Tune-stroik/';
  const SHARE = {
    title: 'Stroik',
    text: 'Stroik i metronom na telefon – nastrój gitarę, skrzypce, ukulele, flet albo fortepian.',
    url: SHARE_URL,
  };

  // krótki komunikat na dole ekranu (element #toast)
  let timer = 0;
  function toast(msg, ms = 3000) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { el.hidden = true; }, ms);
  }

  // zwraca, co się stało: 'shared', 'cancelled', 'copied' albo 'shown'
  async function share() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(SHARE);
        return 'shared';
      } catch (e) {
        if (e?.name === 'AbortError') return 'cancelled'; // zamknięcie okna to nie błąd
      }
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      toast('Skopiowano link – wklej go w wiadomości', 3500);
      return 'copied';
    } catch (e) {
      toast(`Adres aplikacji: ${SHARE_URL}`, 6000);
      return 'shown';
    }
  }

  document.querySelectorAll('[data-share]').forEach((b) => b.addEventListener('click', share));
})();
