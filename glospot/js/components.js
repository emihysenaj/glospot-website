/* ============================================================
   GLOSPOT — Shared Components (Navbar + Footer)
   Inject with: Components.init()
   ============================================================ */

const Components = (() => {

  /* ── Navbar HTML ── */
  function navbarHTML(activePage = '') {
    const pages = [
      { href: '../index.html',            label: 'Home' },
      { href: 'properties.html',          label: 'Properties' },
      { href: 'account.html',             label: 'My Account' },
      { href: 'business.html',            label: 'For Business' },
    ];
    const links = pages.map(p =>
      `<a href="${p.href}" class="${p.label === activePage ? 'active' : ''}">${p.label}</a>`
    ).join('');

    return `
      <nav class="navbar">
        <div class="container">
          <a href="../index.html" class="navbar__logo">Glo<span>spot</span></a>

          <div class="navbar__links">${links}</div>

          <div class="navbar__right">
            <div class="lang-switcher">
              <button class="active" onclick="setLang('EN',this)">EN</button>
              <button onclick="setLang('IT',this)">IT</button>
              <button onclick="setLang('ES',this)">ES</button>
            </div>
            <a href="pages/account.html" class="btn btn-primary btn-sm">Sign in</a>
          </div>

          <button class="navbar__mobile-toggle" onclick="toggleMobileMenu()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    `;
  }

  /* ── Footer HTML ── */
  function footerHTML() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">

            <div>
              <span class="footer__logo">Glo<span>spot</span></span>
              <p class="footer__desc">
                Discover the best hotels and apartments in Albania and beyond.
                Transparent pricing, real reviews, instant booking.
              </p>
            </div>

            <div>
              <div class="footer__heading">Explore</div>
              <ul class="footer__links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="properties.html">Hotels</a></li>
                <li><a href="properties.html">Apartments</a></li>
                <li><a href="#">Destinations</a></li>
              </ul>
            </div>

            <div>
              <div class="footer__heading">Account</div>
              <ul class="footer__links">
                <li><a href="account.html">My Bookings</a></li>
                <li><a href="account.html">Favourites</a></li>
                <li><a href="account.html">Reviews</a></li>
                <li><a href="account.html">Settings</a></li>
              </ul>
            </div>

            <div>
              <div class="footer__heading">Company</div>
              <ul class="footer__links">
                <li><a href="business.html">For Business</a></li>
                <li><a href="#">Verify Property</a></li>
                <li><a href="terms.html">Terms & Privacy</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>

          </div>

          <div class="footer__bottom">
            <span class="footer__copy">© 2025 Glospot. All rights reserved.</span>
            <div class="footer__legal">
              <a href="terms.html">Privacy Policy</a>
              <a href="terms.html">Terms of Use</a>
              <a href="terms.html">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  /* ── Init ── */
  function init(activePage = '') {
    // Inject navbar before body content
    const navContainer = document.getElementById('navbar-placeholder');
    if (navContainer) navContainer.innerHTML = navbarHTML(activePage);

    // Inject footer
    const footerContainer = document.getElementById('footer-placeholder');
    if (footerContainer) footerContainer.innerHTML = footerHTML();

    // Mark active nav link
    highlightActiveLink();
  }

  function highlightActiveLink() {
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navbar__links a').forEach(a => {
      if (a.getAttribute('href') && a.getAttribute('href').includes(current)) {
        a.classList.add('active');
      }
    });
  }

  return { init };
})();

/* ── Global helpers ── */
function setLang(code, btn) {
  document.querySelectorAll('.lang-switcher button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  console.log('Language switched to:', code); // Hook for i18n
}

function toggleMobileMenu() {
  const links = document.querySelector('.navbar__links');
  if (!links) return;
  const open = links.style.display === 'flex';
  links.style.display = open ? '' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '64px';
  links.style.left = '0';
  links.style.width = '100%';
  links.style.background = 'var(--white)';
  links.style.padding = '16px 24px';
  links.style.borderBottom = '1px solid var(--border)';
  links.style.zIndex = '400';
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('gs-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gs-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Currency helper ── */
const Currency = {
  current: 'EUR',
  symbols: { EUR: '€', USD: '$', GBP: '£', ALL: 'L' },
  rates:   { EUR: 1, USD: 1.08, GBP: 0.86, ALL: 108 },
  set(code) {
    this.current = code;
    document.querySelectorAll('[data-price]').forEach(el => {
      const base = parseFloat(el.dataset.price);
      const converted = (base * this.rates[code]).toFixed(0);
      el.textContent = this.symbols[code] + converted;
    });
  }
};
