/* ============================================================
   GLOSPOT — Shared JavaScript (main.js)
   Flat file structure — all files in root
   ============================================================ */

/* ── Build Navigation ── */
function renderNav(activePage) {
  var pages = [
    { href: 'index.html',      label: 'Home' },
    { href: 'properties.html', label: 'Properties' },
    { href: 'account.html',    label: 'My Account' },
    { href: 'business.html',   label: 'For Business' }
  ];
  var links = pages.map(function(p) {
    var active = (p.label === activePage) ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + active + '>' + p.label + '</a>';
  }).join('');

  return '<nav class="nav" id="main-nav">' +
    '<div class="nav-inner">' +
      '<a href="index.html" class="nav-logo">Glo<span>spot</span></a>' +
      '<div class="nav-links" id="nav-links">' + links + '</div>' +
      '<div class="nav-right">' +
        '<div class="lang-switcher">' +
          '<button class="active" onclick="setLang(\'EN\',this)">EN</button>' +
          '<button onclick="setLang(\'IT\',this)">IT</button>' +
          '<button onclick="setLang(\'ES\',this)">ES</button>' +
        '</div>' +
        '<a href="account.html" class="btn btn-navy btn-sm">Sign in</a>' +
        '<button class="nav-mobile-btn" onclick="toggleMobileMenu()" aria-label="Menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</nav>';
}

/* ── Build Footer ── */
function renderFooter() {
  var year = new Date().getFullYear();
  return '<footer class="footer">' +
    '<div class="footer-inner">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<span class="footer-logo">Glo<span>spot</span></span>' +
          '<p class="footer-desc">Discover the best hotels and apartments in Albania and beyond. Transparent pricing, real reviews, instant booking.</p>' +
        '</div>' +
        '<div class="footer-col"><h4>Explore</h4>' +
          '<a href="index.html">Home</a>' +
          '<a href="properties.html">Hotels</a>' +
          '<a href="properties.html">Apartments</a>' +
          '<a href="properties.html">Deals</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Account</h4>' +
          '<a href="account.html">Sign In</a>' +
          '<a href="account.html">My Bookings</a>' +
          '<a href="account.html">Favourites</a>' +
          '<a href="account.html">Reviews</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Company</h4>' +
          '<a href="business.html">For Business</a>' +
          '<a href="terms.html">Terms &amp; Privacy</a>' +
          '<a href="terms.html">Cookie Policy</a>' +
          '<a href="#">Contact Us</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span class="footer-copy">&copy; ' + year + ' Glospot. All rights reserved.</span>' +
        '<div class="footer-legal">' +
          '<a href="terms.html">Privacy Policy</a>' +
          '<a href="terms.html">Terms of Use</a>' +
          '<a href="terms.html">Cookie Policy</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';
}

/* ── Mobile menu ── */
function toggleMobileMenu() {
  var links = document.getElementById('nav-links');
  if (!links) return;
  links.classList.toggle('mobile-open');
}

/* ── Language switcher ── */
function setLang(lang, btn) {
  document.querySelectorAll('.lang-switcher button').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  showToast('Language set to ' + lang);
}

/* ── Currency converter ── */
var CURRENCIES = { EUR: '€', USD: '$', GBP: '£', ALL: 'L' };
var RATES      = { EUR: 1,   USD: 1.08, GBP: 0.86, ALL: 110 };

function setCurrency(code) {
  if (!CURRENCIES[code]) return;
  document.querySelectorAll('[data-price]').forEach(function(el) {
    var base = parseFloat(el.dataset.price);
    if (!isNaN(base)) {
      el.textContent = CURRENCIES[code] + Math.round(base * RATES[code]);
    }
  });
}

/* ── Toast notification ── */
function showToast(message, type) {
  type = type || 'success';
  var existing = document.getElementById('gs-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'gs-toast';
  toast.className = 'toast ' + type;
  var icon = (type === 'error') ? '✕' : '✓';
  toast.innerHTML = '<span style="font-size:16px;">' + icon + '</span><span>' + message + '</span>';
  document.body.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('show'); });
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 400);
  }, 3200);
}

/* ── Favourites ── */
function getFavourites() {
  try { return JSON.parse(localStorage.getItem('glospot_favs') || '[]'); }
  catch(e) { return []; }
}

function toggleFavourite(id, name) {
  var favs = getFavourites();
  var idx  = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
    showToast((name || 'Property') + ' saved to favourites ♥', 'success');
  } else {
    favs.splice(idx, 1);
    showToast((name || 'Property') + ' removed from favourites');
  }
  localStorage.setItem('glospot_favs', JSON.stringify(favs));
  document.querySelectorAll('[data-fav="' + id + '"]').forEach(function(el) {
    el.textContent = favs.indexOf(id) !== -1 ? '♥' : '♡';
    el.classList.toggle('saved', favs.indexOf(id) !== -1);
  });
}

function initFavButtons() {
  var favs = getFavourites();
  document.querySelectorAll('[data-fav]').forEach(function(btn) {
    var saved = favs.indexOf(btn.dataset.fav) !== -1;
    btn.textContent = saved ? '♥' : '♡';
    btn.classList.toggle('saved', saved);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  var navEl    = document.getElementById('nav-placeholder');
  var footerEl = document.getElementById('footer-placeholder');
  var page     = document.body.dataset.page || '';

  if (navEl)    navEl.outerHTML    = renderNav(page);
  if (footerEl) footerEl.outerHTML = renderFooter();

  initFavButtons();

  document.addEventListener('click', function(e) {
    var links = document.getElementById('nav-links');
    var btn   = document.querySelector('.nav-mobile-btn');
    if (links && btn && !links.contains(e.target) && !btn.contains(e.target)) {
      links.classList.remove('mobile-open');
    }
  });
});
