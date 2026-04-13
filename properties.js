/* ============================================================
   GLOSPOT — Properties Page Logic
   ============================================================ */

const ALL_PROPERTIES = [
  { id:1, name:'Riviera Palace Hotel',    location:'Sarandë', type:'Hotel',     imgClass:'beach',    emoji:'🏖️', rating:5, reviews:128, price:85,  desc:'Stunning seafront hotel with pool, spa and panoramic sea views.' },
  { id:2, name:'Blloku Luxury Flat',      location:'Tirana',  type:'Apartment', imgClass:'city',     emoji:'🏙️', rating:4, reviews:74,  price:55,  desc:'Modern apartment in the heart of Tirana\'s trendiest neighbourhood.' },
  { id:3, name:'Valbona Alpine Resort',   location:'Valbonë', type:'Hotel',     imgClass:'mountain', emoji:'🏔️', rating:5, reviews:52,  price:110, desc:'Rustic luxury lodge surrounded by the Albanian Alps. Perfect for hiking.' },
  { id:4, name:'Komani Lake Retreat',     location:'Shkodër', type:'Hotel',     imgClass:'forest',   emoji:'🌲', rating:4, reviews:38,  price:70,  desc:'Peaceful retreat on the shores of Komani Lake with boat transfers.' },
  { id:5, name:'Old Bazaar Suite',        location:'Berat',   type:'Apartment', imgClass:'historic', emoji:'🏛️', rating:5, reviews:91,  price:65,  desc:'Charming Ottoman-era apartment inside UNESCO-listed Berat.' },
  { id:6, name:'Porto Romano Boutique',   location:'Durrës',  type:'Hotel',     imgClass:'coast',    emoji:'🌊', rating:4, reviews:63,  price:80,  desc:'Boutique hotel steps from Durrës beach with a rooftop bar.' },
  { id:7, name:'Gjirokastra Stone House', location:'Gjirokastër', type:'Apartment', imgClass:'historic', emoji:'🏰', rating:5, reviews:44, price:60, desc:'Authentic stone house inside the Gjirokastër castle quarter.' },
  { id:8, name:'Vlorë Bay View Rooms',    location:'Vlorë',   type:'Hotel',     imgClass:'coast',    emoji:'⛵', rating:3, reviews:29,  price:45,  desc:'Simple, well-located hotel with superb views of the Vlorë bay.' },
];

let currentFilters = { type: [], maxPrice: 300, minStars: 0, query: '' };
let currentSort = 'recommended';

/* ── Render listings ── */
function renderListings(properties) {
  const grid = document.getElementById('listings-grid');
  const count = document.getElementById('results-count');
  if (!grid) return;

  if (!properties.length) {
    grid.innerHTML = `<div class="no-results"><div style="font-size:40px">🔍</div><p>No properties match your filters.</p></div>`;
    if (count) count.textContent = '0 properties found';
    return;
  }

  if (count) count.textContent = `Showing ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`;

  grid.innerHTML = properties.map(p => `
    <div class="listing-card" onclick="goToBooking(${p.id})">
      <div class="listing-card__img listing-card__img--${p.imgClass}">
        <span class="listing-card__type">${p.type}</span>
        <button class="listing-card__fav" onclick="toggleFav(event,${p.id})" id="lfav-${p.id}">♡</button>
        <span>${p.emoji}</span>
      </div>
      <div class="listing-card__body">
        <div>
          <div class="listing-card__name">${p.name}</div>
          <div class="listing-card__loc">📍 ${p.location}, Albania</div>
          <div class="listing-card__desc">${p.desc}</div>
        </div>
        <div class="listing-card__footer">
          <div class="listing-card__rating">
            <span class="stars">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</span>
            <span>(${p.reviews} reviews)</span>
          </div>
          <div class="listing-card__price">
            <span data-price="${p.price}">€${p.price}</span>
            <span> / night</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Restore saved favs
  const favs = JSON.parse(localStorage.getItem('glospot_favs') || '[]');
  favs.forEach(id => {
    const btn = document.getElementById(`lfav-${id}`);
    if (btn) btn.textContent = '♥';
  });
}

/* ── Filtering ── */
function applyFilters() {
  // Checkboxes
  currentFilters.type = Array.from(document.querySelectorAll('.checkbox-row input:checked')).map(c => c.value);

  // Search query
  const q = document.getElementById('search-dest')?.value?.toLowerCase() || '';
  currentFilters.query = q;

  // Type dropdown (mini search)
  const typeDropdown = document.getElementById('search-type')?.value || '';
  if (typeDropdown && !currentFilters.type.includes(typeDropdown)) {
    currentFilters.type = [typeDropdown];
  }

  let filtered = ALL_PROPERTIES.filter(p => {
    if (currentFilters.type.length && !currentFilters.type.includes(p.type)) return false;
    if (p.price > currentFilters.maxPrice) return false;
    if (p.rating < currentFilters.minStars) return false;
    if (currentFilters.query && !p.name.toLowerCase().includes(currentFilters.query) && !p.location.toLowerCase().includes(currentFilters.query)) return false;
    return true;
  });

  renderListings(sortData(filtered, currentSort));
}

function sortData(data, method) {
  return [...data].sort((a, b) => {
    if (method === 'price-asc')  return a.price - b.price;
    if (method === 'price-desc') return b.price - a.price;
    if (method === 'rating')     return b.rating - a.rating || b.reviews - a.reviews;
    return 0; // recommended
  });
}

function sortListings(method) {
  currentSort = method;
  applyFilters();
}

function clearFilters() {
  document.querySelectorAll('.checkbox-row input').forEach(c => c.checked = false);
  const priceSlider = document.getElementById('price-max');
  if (priceSlider) priceSlider.value = 300;
  document.getElementById('price-max-label').textContent = '300+';
  currentFilters = { type:[], maxPrice:300, minStars:0, query:'' };
  const dest = document.getElementById('search-dest');
  if (dest) dest.value = '';
  renderListings(ALL_PROPERTIES);
}

function updatePriceLabel(input) {
  const val = parseInt(input.value);
  document.getElementById('price-max-label').textContent = val >= 300 ? '300+' : `€${val}`;
  currentFilters.maxPrice = val;
  applyFilters();
}

function setStarFilter(stars, btn) {
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilters.minStars = stars;
  applyFilters();
}

/* ── Favourites ── */
function toggleFav(event, id) {
  event.stopPropagation();
  const btn = document.getElementById(`lfav-${id}`);
  let favs = JSON.parse(localStorage.getItem('glospot_favs') || '[]');
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    if (btn) btn.textContent = '♡';
    showToast('Removed from favourites');
  } else {
    favs.push(id);
    if (btn) btn.textContent = '♥';
    showToast('Saved to favourites ♥', 'success');
  }
  localStorage.setItem('glospot_favs', JSON.stringify(favs));
}

function goToBooking(id) {
  window.location.href = `booking.html?id=${id}`;
}

/* ── Read URL params (from homepage search) ── */
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const dest = params.get('dest');
  if (dest) {
    const input = document.getElementById('search-dest');
    if (input) input.value = dest;
    currentFilters.query = dest.toLowerCase();
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  readURLParams();
  renderListings(ALL_PROPERTIES.filter(p => {
    if (currentFilters.query) {
      return p.name.toLowerCase().includes(currentFilters.query) || p.location.toLowerCase().includes(currentFilters.query);
    }
    return true;
  }));
});
