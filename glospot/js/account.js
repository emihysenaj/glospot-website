/* ============================================================
   GLOSPOT — Account Page Logic
   ============================================================ */

/* ── Sample data ── */
const BOOKINGS = [
  { id:'BK001', name:'Riviera Palace Hotel', type:'Hotel',     icon:'hotel',     dates:'12 Aug – 16 Aug 2024', guests:2, nights:4, price:340,  status:'upcoming' },
  { id:'BK002', name:'Blloku Luxury Flat',   type:'Apartment', icon:'apartment', dates:'3 Jul – 7 Jul 2024',   guests:1, nights:4, price:220,  status:'past'     },
  { id:'BK003', name:'Old Bazaar Suite',     type:'Apartment', icon:'apartment', dates:'20 May – 23 May 2024', guests:2, nights:3, price:195,  status:'past'     },
  { id:'BK004', name:'Komani Lake Retreat',  type:'Hotel',     icon:'hotel',     dates:'10 Mar – 12 Mar 2024', guests:2, nights:2, price:140,  status:'cancelled'},
];

const MY_REVIEWS = [
  { hotel:'Riviera Palace Hotel', date:'Jul 2024', rating:5, text:'Absolutely stunning hotel. The pool views are breathtaking and the staff were incredibly helpful. Will definitely return!' },
  { hotel:'Blloku Luxury Flat',   date:'Mar 2024', rating:4, text:'Great apartment in a fantastic location. Very clean and modern. Only minor issue was parking, but overall excellent.' },
];

const NOTIFICATIONS = [
  { title:'Booking confirmed', body:'Your stay at Riviera Palace Hotel (12–16 Aug) is confirmed. Check-in from 14:00.', time:'2 hours ago', read:false },
  { title:'New review reply', body:'Riviera Palace Hotel replied to your review. Tap to read their response.', time:'1 day ago', read:false },
  { title:'Booking reminder', body:'Your stay at Blloku Luxury Flat starts in 3 days. Don\'t forget to check your confirmation.', time:'3 days ago', read:true },
  { title:'Cancellation processed', body:'Your booking BK004 at Komani Lake Retreat has been cancelled. Refund processed within 5 days.', time:'1 week ago', read:true },
];

const FAV_PROPERTIES = [
  { id:1, name:'Riviera Palace Hotel', loc:'Sarandë', imgClass:'beach',   emoji:'🏖️', price:85 },
  { id:5, name:'Old Bazaar Suite',     loc:'Berat',   imgClass:'historic', emoji:'🏛️', price:65 },
];

/* ── Tab switching ── */
function showTab(name, btn) {
  document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.account-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`)?.classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ── Render bookings ── */
let bookingFilter = 'all';

function renderBookings() {
  const list = document.getElementById('bookings-list');
  if (!list) return;
  const filtered = bookingFilter === 'all' ? BOOKINGS : BOOKINGS.filter(b => b.status === bookingFilter);

  if (!filtered.length) {
    list.innerHTML = `<div style="text-align:center;padding:48px;color:var(--text-muted)">No ${bookingFilter} bookings.</div>`;
    return;
  }

  const statusBadge = s => {
    const map = { upcoming:'badge-green', past:'badge-gray', cancelled:'badge-red' };
    return `<span class="badge ${map[s]}">${s.charAt(0).toUpperCase()+s.slice(1)}</span>`;
  };

  list.innerHTML = filtered.map(b => `
    <div class="booking-item">
      <div class="booking-item__icon booking-item__icon--${b.icon}">
        ${b.type === 'Hotel' ? '🏨' : '🏠'}
      </div>
      <div>
        <div class="booking-item__name">${b.name}</div>
        <div class="booking-item__dates">📅 ${b.dates} &nbsp;·&nbsp; ${b.guests} guest${b.guests>1?'s':''} &nbsp;·&nbsp; ${b.nights} nights</div>
        ${statusBadge(b.status)}
      </div>
      <div class="booking-item__right">
        <div class="booking-item__price">€${b.price}</div>
        <div class="booking-item__actions">
          ${b.status === 'upcoming' ? `
            <button class="btn btn-sm btn-outline" onclick="cancelBooking('${b.id}')">Cancel</button>
            <button class="btn btn-sm btn-primary">View details</button>
          ` : `
            <button class="btn btn-sm btn-outline">Receipt</button>
            ${b.status === 'past' ? '<button class="btn btn-sm btn-gold">Write review</button>' : ''}
          `}
        </div>
      </div>
    </div>
  `).join('');
}

function filterBookings(type, btn) {
  bookingFilter = type;
  document.querySelectorAll('.tab-pills .pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBookings();
}

function cancelBooking(id) {
  if (!confirm('Are you sure you want to cancel this booking? Please review the cancellation policy first.')) return;
  const i = BOOKINGS.find(b => b.id === id);
  if (i) i.status = 'cancelled';
  renderBookings();
  showToast('Booking cancelled. Refund will be processed within 5 days.', 'error');
}

/* ── Render favourites ── */
function renderFavourites() {
  const list = document.getElementById('favourites-list');
  if (!list) return;
  if (!FAV_PROPERTIES.length) {
    list.innerHTML = `<div style="text-align:center;padding:48px;color:var(--text-muted)">No saved properties yet.</div>`;
    return;
  }
  list.innerHTML = FAV_PROPERTIES.map(p => `
    <div class="fav-card">
      <div class="fav-card__img fav-card__img--${p.imgClass}">${p.emoji}</div>
      <div class="fav-card__body">
        <div class="fav-card__name">${p.name}</div>
        <div class="fav-card__loc">📍 ${p.loc}</div>
        <div class="fav-card__price">From €${p.price}/night</div>
      </div>
    </div>
  `).join('');
}

/* ── Render reviews ── */
function renderMyReviews() {
  const list = document.getElementById('reviews-list');
  if (!list) return;
  list.innerHTML = MY_REVIEWS.map(r => `
    <div class="review-item">
      <div class="review-item__header">
        <div>
          <div class="review-item__hotel">${r.hotel}</div>
          <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
        </div>
        <div class="review-item__date">${r.date}</div>
      </div>
      <p class="review-item__text">${r.text}</p>
    </div>
  `).join('');
}

/* ── Render notifications ── */
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  if (!list) return;
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-item__dot ${n.read ? 'notif-item__dot--read' : ''}"></div>
      <div>
        <div class="notif-item__title">${n.title}</div>
        <div class="notif-item__body">${n.body}</div>
        <div class="notif-item__time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

/* ── Email change ── */
function requestEmailChange() {
  const email = document.getElementById('email-input')?.value;
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address.', 'error'); return; }
  showToast(`Verification sent to ${email}`, 'success');
}

/* ── Sign out ── */
function signOut() {
  if (confirm('Are you sure you want to sign out?')) {
    showToast('Signed out. See you soon!');
    setTimeout(() => window.location.href = '../index.html', 1200);
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderBookings();
  renderFavourites();
  renderMyReviews();
  renderNotifications();
});
