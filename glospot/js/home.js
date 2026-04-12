/* ============================================================
   GLOSPOT — Home Page Logic
   ============================================================ */

/* ── Sample data ── */
const FEATURED_PROPERTIES = [
  {
    id: 1, name: 'Riviera Palace Hotel', location: 'Sarandë, Albania',
    type: 'Hotel', imgClass: 'beach', emoji: '🏖️',
    rating: 5, reviews: 128, price: 85, currency: 'EUR',
  },
  {
    id: 2, name: 'Blloku Luxury Flat', location: 'Tirana, Albania',
    type: 'Apartment', imgClass: 'city', emoji: '🏙️',
    rating: 4, reviews: 74, price: 55, currency: 'EUR',
  },
  {
    id: 3, name: 'Valbona Alpine Resort', location: 'Valbonë, Albania',
    type: 'Hotel', imgClass: 'mountain', emoji: '🏔️',
    rating: 5, reviews: 52, price: 110, currency: 'EUR',
  },
];

const REVIEWS = [
  {
    initials: 'MK', name: 'Maria K.', meta: 'Tirana · Jul 2024',
    rating: 5, avatarColor: '#0B1F3A',
    text: 'Booking was so easy and the hotel was exactly as described. The cancellation policy was clear from the start. Will definitely use Glospot again!',
  },
  {
    initials: 'AR', name: 'Alex R.', meta: 'London · Aug 2024',
    rating: 5, avatarColor: '#1a3a5c',
    text: 'Loved the pay-on-arrival option. Found a great apartment in Sarandë at a fantastic price. The reviews are genuine — no fake ratings here.',
  },
  {
    initials: 'SF', name: 'Sofia F.', meta: 'Rome · Jun 2024',
    rating: 4, avatarColor: '#2d5016',
    text: 'The Italian interface made navigation simple. All my booking history is visible in my account — super convenient for managing multiple trips.',
  },
];

const CITY_SUGGESTIONS = ['Tirana', 'Sarandë', 'Vlorë', 'Berat', 'Shkodër', 'Durrës', 'Gjirokastër', 'Korçë'];

/* ── Render featured property cards ── */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  grid.innerHTML = FEATURED_PROPERTIES.map(p => `
    <div class="prop-card" onclick="goToProperty(${p.id})">
      <div class="prop-card__img prop-card__img--${p.imgClass}">
        <span class="prop-card__type">${p.type}</span>
        <button class="prop-card__fav" onclick="toggleFav(event, ${p.id})" id="fav-${p.id}" title="Save">♡</button>
        <span>${p.emoji}</span>
      </div>
      <div class="prop-card__body">
        <div class="prop-card__name">${p.name}</div>
        <div class="prop-card__loc">📍 ${p.location}</div>
        <div class="prop-card__footer">
          <div class="prop-card__rating">
            <span class="stars">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</span>
            <span class="prop-card__review-count">(${p.reviews})</span>
          </div>
          <div class="prop-card__price">
            <span data-price="${p.price}">€${p.price}</span>
            <span> / night</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Render reviews ── */
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  grid.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-card__head">
        <div class="review-card__avatar" style="background:${r.avatarColor}">${r.initials}</div>
        <div>
          <div class="review-card__name">${r.name}</div>
          <div class="review-card__meta">${r.meta}</div>
        </div>
      </div>
      <div class="review-card__stars">
        <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <p class="review-card__text">${r.text}</p>
    </div>
  `).join('');
}

/* ── Autocomplete ── */
function showSuggestions(value) {
  const box = document.getElementById('autocomplete-box');
  if (!value || value.length < 1) { box.classList.remove('open'); return; }

  const matches = CITY_SUGGESTIONS.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));
  if (!matches.length) { box.classList.remove('open'); return; }

  box.innerHTML = matches.map(m =>
    `<div class="autocomplete-item" onclick="setSuggestion('${m}')">${m}</div>`
  ).join('');
  box.classList.add('open');
}

function setSuggestion(city) {
  const input = document.getElementById('dest-input');
  if (input) input.value = city;
  const box = document.getElementById('autocomplete-box');
  if (box) box.classList.remove('open');
}

/* ── Search ── */
function doSearch() {
  const dest = document.getElementById('dest-input')?.value || '';
  const checkin  = document.getElementById('checkin')?.value || '';
  const checkout = document.getElementById('checkout')?.value || '';
  const guests   = document.getElementById('guests')?.value || '2';

  const params = new URLSearchParams({ dest, checkin, checkout, guests });
  window.location.href = `pages/properties.html?${params.toString()}`;
}

/* ── Favourites ── */
let savedFavs = JSON.parse(localStorage.getItem('glospot_favs') || '[]');

function toggleFav(event, id) {
  event.stopPropagation();
  const btn = document.getElementById(`fav-${id}`);
  if (!btn) return;

  if (savedFavs.includes(id)) {
    savedFavs = savedFavs.filter(f => f !== id);
    btn.textContent = '♡';
    btn.classList.remove('saved');
    showToast('Removed from favourites');
  } else {
    savedFavs.push(id);
    btn.textContent = '♥';
    btn.classList.add('saved');
    showToast('Saved to favourites ♥', 'success');
  }
  localStorage.setItem('glospot_favs', JSON.stringify(savedFavs));
}

function goToProperty(id) {
  window.location.href = `pages/properties.html?id=${id}`;
}

/* ── Set default dates (today + 3 days) ── */
function setDefaultDates() {
  const today = new Date();
  const checkout = new Date(today);
  checkout.setDate(checkout.getDate() + 3);

  const fmt = d => d.toISOString().split('T')[0];
  const ci = document.getElementById('checkin');
  const co = document.getElementById('checkout');
  if (ci) { ci.value = fmt(today); ci.min = fmt(today); }
  if (co) { co.value = fmt(checkout); co.min = fmt(today); }
}

/* ── Close autocomplete on outside click ── */
document.addEventListener('click', e => {
  const box = document.getElementById('autocomplete-box');
  if (box && !box.closest('.search-card__dest-wrap')?.contains(e.target)) {
    box.classList.remove('open');
  }
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderReviews();
  setDefaultDates();

  // Restore fav states
  savedFavs.forEach(id => {
    const btn = document.getElementById(`fav-${id}`);
    if (btn) { btn.textContent = '♥'; btn.classList.add('saved'); }
  });
});
