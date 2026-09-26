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
