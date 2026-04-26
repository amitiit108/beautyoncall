import { initialData } from './mockData.js';

let data = structuredClone(initialData);
let activeTab = 'home';
let role = 'customer';
let selectedServiceId = data.services[0].id;
let activeBookingId = data.bookings[0].id;
let bookingDraft = {
  date: '2026-04-27',
  time: '11:00',
  address: 'Shiv Colony, Near Bus Stand, Rewa',
  paymentMode: 'cash',
};

const root = document.querySelector('#root');
const statusCopy = {
  pending: 'Request bheja gaya',
  accepted: 'Artist accepted',
  on_the_way: 'Artist raaste mein',
  started: 'Service started',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
const statusSteps = ['pending', 'accepted', 'on_the_way', 'started', 'completed'];

function setState(updater) {
  updater();
  render();
}

function selectedService() {
  return data.services.find((service) => service.id === selectedServiceId) ?? data.services[0];
}

function activeBooking() {
  return data.bookings.find((booking) => booking.id === activeBookingId) ?? data.bookings[0];
}

function icon(value) {
  return `<span class="text-icon" aria-hidden="true">${value}</span>`;
}

function layout(content) {
  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">BeautyOnCall</p>
          <h1>Beauty at home, ghar ke paas</h1>
        </div>
        <button class="icon-button" aria-label="Notifications">${icon('🔔')}</button>
      </header>
      <main class="screen">
        ${roleSwitch()}
        <section class="notice">${icon('✓')}<span>Static MVP demo active hai. Firebase config add karte hi live backend se connect hoga.</span></section>
        ${content}
      </main>
      ${bottomNav()}
    </div>
  `;
  bindEvents();
}

function roleSwitch() {
  return `
    <section class="role-switch" aria-label="App mode">
      ${['customer', 'artist', 'admin'].map((item) => `
        <button data-role="${item}" class="${role === item ? 'active' : ''}">
          ${item === 'customer' ? 'Customer' : item === 'artist' ? 'Artist' : 'Admin'}
        </button>
      `).join('')}
    </section>
  `;
}

function bottomNav() {
  const items = [
    ['home', '⌂', 'Home'],
    ['artists', '⌕', 'Artists'],
    ['track', '⌖', 'Track'],
    ['artist', '✦', 'Artist'],
    ['admin', '▦', 'Admin'],
  ];
  return `
    <nav class="bottom-nav" aria-label="Primary">
      ${items.map(([tab, mark, label]) => `
        <button data-tab="${tab}" class="${activeTab === tab ? 'active' : ''}">
          ${icon(mark)}
          <span>${label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function customerHome() {
  const recent = activeBooking();
  return `
    <section class="hero">
      <div>
        <p>Verified makeup artists</p>
        <h2>Shaadi, party, salon service ghar par</h2>
      </div>
      <button data-tab="artists">Book now ›</button>
    </section>
    <section class="login-card">
      <div>
        <span class="round-icon">${icon('☎')}</span>
        <div>
          <h3>Phone OTP login</h3>
          <p>+91 mobile number se secure sign in ready.</p>
        </div>
      </div>
      <button class="secondary-button" data-toast="OTP demo sent">Send OTP</button>
    </section>
    ${sectionTitle('Services', 'Hindi + English pricing')}
    <div class="service-grid">
      ${data.services.map((service) => `
        <button class="service-card ${selectedServiceId === service.id ? 'selected' : ''}" data-service="${service.id}">
          <span>${service.icon}</span>
          <strong>${service.name}</strong>
          <small>₹${service.price} · ${service.duration}</small>
        </button>
      `).join('')}
    </div>
    <section class="booking-form">
      ${sectionTitle('Quick booking', '3 simple steps')}
      <label>Date<input type="date" id="date" value="${bookingDraft.date}"></label>
      <label>Time<input type="time" id="time" value="${bookingDraft.time}"></label>
      <label>Home address<textarea id="address">${bookingDraft.address}</textarea></label>
      <div class="payment-choice">
        <button data-payment="cash" class="${bookingDraft.paymentMode === 'cash' ? 'selected' : ''}">${icon('₹')} Cash</button>
        <button data-payment="online" class="${bookingDraft.paymentMode === 'online' ? 'selected' : ''}">${icon('▣')} Online</button>
      </div>
      <button class="primary-button" data-tab="artists">See nearby artists</button>
    </section>
    ${miniBooking(recent)}
  `;
}

function artistListing() {
  const service = selectedService();
  return `
    ${sectionTitle('Nearby artists', `${service.name} · ${bookingDraft.time}`)}
    <section class="map-card">
      ${icon('⌖')}
      <div><h3>Location pinned</h3><p>${bookingDraft.address}</p></div>
    </section>
    <div class="artist-list">
      ${data.artists.map((artist) => `
        <article class="artist-card">
          <img src="${artist.photo}" alt="${artist.name}">
          <div class="artist-body">
            <div class="artist-head">
              <div><h3>${artist.name}</h3><p>${artist.experience} exp · ${artist.distance} km</p></div>
              <span class="verified">✓ Verified</span>
            </div>
            <p class="skills">${artist.skills.join(' · ')}</p>
            <div class="artist-meta">
              <span>★ ${artist.rating}</span>
              <span>₹ From ${artist.basePrice}</span>
              <span class="${artist.online ? 'online' : 'offline'}">${artist.online ? 'Online' : 'Offline'}</span>
            </div>
            <div class="card-actions">
              <button class="secondary-button" data-toast="Chat demo opened">${icon('✉')} Chat</button>
              <button class="primary-button" ${artist.online ? '' : 'disabled'} data-book="${artist.id}">Request booking</button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function bookingTracking() {
  const booking = activeBooking();
  if (!booking) return emptyState('No booking yet', 'Pehle service aur artist choose karein.');
  const artist = data.artists.find((item) => item.id === booking.artistId || item.id === booking.requestedArtistId);
  const currentStep = Math.max(0, statusSteps.indexOf(booking.status));
  return `
    <section class="tracking-card">
      <div class="status-pill">${statusCopy[booking.status] ?? booking.status}</div>
      <h2>${booking.serviceName}</h2>
      <p>${booking.date} at ${booking.time} · ₹${booking.price}</p>
      <div class="track-line">
        ${statusSteps.map((step, index) => `
          <div class="${index <= currentStep ? 'done' : ''}">
            <span>${index < currentStep ? '✓' : index + 1}</span>
            <small>${statusCopy[step]}</small>
          </div>
        `).join('')}
      </div>
    </section>
    ${artist ? `
      <section class="pro-card">
        <img src="${artist.photo}" alt="${artist.name}">
        <div>
          <h3>${artist.name}</h3>
          <p>★ ${artist.rating} · ${artist.experience} experience</p>
          <div class="card-actions">
            <button class="secondary-button" data-toast="Calling artist demo">${icon('☎')} Call</button>
            <button class="secondary-button" data-toast="Chat demo opened">${icon('✉')} Chat</button>
          </div>
        </div>
      </section>
    ` : ''}
    <section class="booking-form">
      ${sectionTitle('Payment', booking.paymentStatus)}
      <div class="payment-row"><span>${icon('₹')} ${booking.paymentMode === 'cash' ? 'Cash after service' : 'Online payment'}</span><strong>₹${booking.price}</strong></div>
      <button class="primary-button" ${booking.paymentStatus === 'paid' ? 'disabled' : ''} data-pay="${booking.id}">Mark paid</button>
    </section>
  `;
}

function customerProfile() {
  return `
    <section class="profile-head">
      <span class="avatar">${icon('◉')}</span>
      <div><h2>Priya Sharma</h2><p>+91 98765 43210 · Rewa</p></div>
    </section>
    ${sectionTitle('Booking history', `${data.bookings.length} bookings`)}
    ${data.bookings.map(miniBooking).join('')}
    ${sectionTitle('Reviews', 'Trust score')}
    ${data.reviews.map((review) => `
      <section class="review-card"><strong>${review.artistName}</strong><span>★ ${review.rating}</span><p>${review.comment}</p></section>
    `).join('')}
  `;
}

function artistDashboard() {
  const artist = data.artists[0];
  const requests = data.bookings.filter((booking) => booking.status === 'pending' && booking.requestedArtistId === 'artist-1');
  const bookings = data.bookings.filter((booking) => booking.artistId === 'artist-1');
  const earnings = bookings.filter((booking) => booking.status === 'completed').reduce((sum, booking) => sum + booking.price, 0);
  return `
    <section class="artist-profile">
      <img src="${artist.photo}" alt="${artist.name}">
      <div>
        <h2>${artist.name}</h2>
        <p>${artist.skills.join(' · ')}</p>
        <button class="online-toggle ${artist.online ? 'active' : ''}" data-online>${artist.online ? 'Online' : 'Go online'}</button>
      </div>
    </section>
    <div class="metric-grid">
      ${metric('₹', 'Earnings', `₹${earnings}`)}
      ${metric('✓', 'Completed', bookings.filter((booking) => booking.status === 'completed').length)}
    </div>
    ${sectionTitle('New requests', `${requests.length} waiting`)}
    ${requests.length ? requests.map((booking) => `
      <section class="request-card">
        <div><h3>${booking.serviceName}</h3><p>${booking.customerName} · ${booking.address}</p><strong>₹${booking.price}</strong></div>
        <button class="primary-button" data-accept="${booking.id}">Accept</button>
      </section>
    `).join('') : emptyState('No fresh request', 'Online rahiyega, booking yahin dikhegi.')}
    ${sectionTitle('My bookings', 'Update status')}
    ${bookings.map((booking) => `
      <section class="status-card">
        <h3>${booking.serviceName}</h3>
        <p>${booking.date} · ${booking.address}</p>
        <div class="status-actions">
          ${['on_the_way', 'started', 'completed'].map((status) => `<button data-status="${booking.id}:${status}">${statusCopy[status]}</button>`).join('')}
        </div>
      </section>
    `).join('')}
  `;
}

function adminDashboard() {
  const completed = data.bookings.filter((booking) => booking.status === 'completed');
  const metrics = {
    bookings: data.bookings.length,
    revenue: completed.reduce((sum, booking) => sum + booking.price, 0),
    artists: data.artists.length,
    customers: data.users.filter((user) => user.role === 'customer').length,
  };
  return `
    <div class="metric-grid admin">
      ${metric('◷', 'Bookings', metrics.bookings)}
      ${metric('₹', 'Revenue', `₹${metrics.revenue}`)}
      ${metric('✦', 'Artists', metrics.artists)}
      ${metric('◉', 'Customers', metrics.customers)}
    </div>
    ${sectionTitle('Approvals', 'Artist KYC')}
    ${data.artists.map((artist) => `
      <section class="admin-row">
        <img src="${artist.photo}" alt="${artist.name}">
        <div><strong>${artist.name}</strong><p>${artist.city} · ${artist.skills.join(', ')}</p></div>
        <button class="secondary-button" data-toast="Artist approved">Approve</button>
      </section>
    `).join('')}
    ${sectionTitle('Bookings', 'Manual control')}
    ${data.bookings.map((booking) => `
      <section class="admin-booking">
        <div><strong>${booking.serviceName}</strong><p>${booking.status} · ${booking.customerName} · ₹${booking.price}</p></div>
        <div class="admin-actions">
          <button data-accept="${booking.id}">Assign</button>
          <button data-status="${booking.id}:cancelled">Cancel</button>
        </div>
      </section>
    `).join('')}
    ${sectionTitle('Services & offers', `${data.services.length} categories`)}
    <section class="coupon-card">${icon('☎')}<div><h3>Complaint desk</h3><p>Refunds, artist delay, and customer disputes queue ready.</p></div></section>
  `;
}

function sectionTitle(title, action) {
  return `<div class="section-title"><h2>${title}</h2><span>${action}</span></div>`;
}

function metric(mark, label, value) {
  return `<section class="metric-card">${icon(mark)}<strong>${value}</strong><span>${label}</span></section>`;
}

function miniBooking(booking) {
  if (!booking) return '';
  return `
    <button class="mini-booking" data-open-booking="${booking.id}">
      <span>${icon('◷')}</span>
      <div><strong>${booking.serviceName}</strong><p>${statusCopy[booking.status]} · ${booking.date} ${booking.time}</p></div>
      <span>›</span>
    </button>
  `;
}

function emptyState(title, text) {
  return `<section class="empty-state">${icon('♡')}<h3>${title}</h3><p>${text}</p></section>`;
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => setState(() => { activeTab = button.dataset.tab; }));
  });
  document.querySelectorAll('[data-role]').forEach((button) => {
    button.addEventListener('click', () => setState(() => {
      role = button.dataset.role;
      activeTab = role === 'customer' ? 'home' : role;
    }));
  });
  document.querySelectorAll('[data-service]').forEach((button) => {
    button.addEventListener('click', () => setState(() => { selectedServiceId = button.dataset.service; }));
  });
  document.querySelectorAll('[data-payment]').forEach((button) => {
    button.addEventListener('click', () => setState(() => { bookingDraft.paymentMode = button.dataset.payment; }));
  });
  document.querySelectorAll('[data-book]').forEach((button) => {
    button.addEventListener('click', () => createBooking(button.dataset.book));
  });
  document.querySelectorAll('[data-accept]').forEach((button) => {
    button.addEventListener('click', () => acceptBooking(button.dataset.accept));
  });
  document.querySelectorAll('[data-status]').forEach((button) => {
    button.addEventListener('click', () => {
      const [id, status] = button.dataset.status.split(':');
      setStatus(id, status);
    });
  });
  document.querySelectorAll('[data-pay]').forEach((button) => {
    button.addEventListener('click', () => setState(() => {
      data.bookings = data.bookings.map((booking) => booking.id === button.dataset.pay ? { ...booking, paymentStatus: 'paid' } : booking);
    }));
  });
  document.querySelectorAll('[data-open-booking]').forEach((button) => {
    button.addEventListener('click', () => setState(() => {
      activeBookingId = button.dataset.openBooking;
      activeTab = 'track';
    }));
  });
  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => alert(button.dataset.toast));
  });
  const online = document.querySelector('[data-online]');
  if (online) {
    online.addEventListener('click', () => setState(() => {
      data.artists[0] = { ...data.artists[0], online: !data.artists[0].online };
    }));
  }
  const date = document.querySelector('#date');
  const time = document.querySelector('#time');
  const address = document.querySelector('#address');
  if (date) date.addEventListener('input', () => { bookingDraft.date = date.value; });
  if (time) time.addEventListener('input', () => { bookingDraft.time = time.value; });
  if (address) address.addEventListener('input', () => { bookingDraft.address = address.value; });
}

function createBooking(artistId) {
  const artist = data.artists.find((item) => item.id === artistId);
  const service = selectedService();
  const booking = {
    id: `booking-${Date.now()}`,
    serviceId: service.id,
    serviceName: service.name,
    customerId: 'customer-1',
    customerName: 'Priya Sharma',
    artistId: null,
    requestedArtistId: artistId,
    artistName: artist?.name ?? 'Nearby artist',
    city: artist?.city ?? 'Rewa',
    date: bookingDraft.date,
    time: bookingDraft.time,
    address: bookingDraft.address,
    location: { lat: 24.5362, lng: 81.3037 },
    price: service.price,
    duration: service.duration,
    paymentMode: bookingDraft.paymentMode,
    paymentStatus: bookingDraft.paymentMode === 'cash' ? 'cash_pending' : 'online_pending',
    status: 'pending',
    createdAt: Date.now(),
  };
  setState(() => {
    data.bookings = [booking, ...data.bookings];
    activeBookingId = booking.id;
    activeTab = 'track';
  });
}

function acceptBooking(bookingId) {
  setState(() => {
    data.bookings = data.bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, artistId: 'artist-1', artistName: 'Meena Beauty Studio', status: 'accepted' } : booking
    );
    activeBookingId = bookingId;
  });
}

function setStatus(bookingId, status) {
  setState(() => {
    data.bookings = data.bookings.map((booking) => booking.id === bookingId ? { ...booking, status } : booking);
    activeBookingId = bookingId;
  });
}

function render() {
  const views = {
    home: customerHome,
    artists: artistListing,
    track: bookingTracking,
    profile: customerProfile,
    artist: artistDashboard,
    admin: adminDashboard,
  };
  layout((views[activeTab] ?? customerHome)());
}

render();
