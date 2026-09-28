document.getElementById('year').textContent = String(new Date().getFullYear());

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-navigation');
const header = document.querySelector('.site-header');
const mobileViewport = window.matchMedia('(max-width: 760px)');

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  header.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenuOpen(false);
});

header.addEventListener('focusout', (event) => {
  if (!header.contains(event.relatedTarget)) setMenuOpen(false);
});

mobileViewport.addEventListener('change', () => setMenuOpen(false));

// Some YouTube covers disappear or return a tiny placeholder rather than an error.
document.querySelectorAll('img[data-fallback-src]').forEach((img) => {
  const fallback = () => {
    const url = img.dataset.fallbackSrc;
    if (!url) return;
    delete img.dataset.fallbackSrc;
    img.src = url;
  };
  img.addEventListener('error', fallback);
  img.addEventListener('load', () => {
    if (img.naturalWidth <= 120) fallback();
  });
  if (img.complete && img.naturalWidth <= 120) fallback();
});

// Keep real watch links as the no-JavaScript fallback. Load players only on request.
document.querySelectorAll('.video-launch[data-embed]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const player = document.createElement('iframe');
    player.src = link.dataset.embed;
    player.title = link.dataset.videoTitle;
    player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    link.replaceWith(player);
    player.focus();
  });
});
