import React from 'react';
import { ChevronRight, ShieldCheck, Star, Wallet, Phone, Banknote, CreditCard, LocateFixed, MapPin, BadgeCheck, MessageCircle, IndianRupee, Clock, UserRound, Check } from 'lucide-react';
import { PageIntro, TrustItem, SectionTitle, MiniBooking, EmptyState } from '../../components/common/UIComponents';

export function CustomerHome({ services, selectedServiceId, setSelectedServiceId, setActiveTab, bookingDraft, setBookingDraft, recentBooking, phone, setPhone, otpSent, handleSendOtp }) {
  const selected = services.find((service) => service.id === selectedServiceId) ?? services[0];
  return (
    <>
      <PageIntro
        eyebrow="Specialist Reservation"
        title="Secure an Elite Beauty Specialist in Minutes"
        text="A refined, effortless booking journey featuring guaranteed pricing, certified talent, and real-time service coordination."
      />
      <section className="hero">
        <div>
          <p>Verified professionals near you</p>
          <h2>Occasion-ready beauty services at your doorstep</h2>
        </div>
        <button onClick={() => setActiveTab('artists')}>
          Browse professionals <ChevronRight size={18} />
        </button>
      </section>

      <section className="trust-strip">
        <TrustItem icon={ShieldCheck} title="Verified" text="KYC and portfolio review" />
        <TrustItem icon={Star} title="Reviewed" text="Customer rating signals" />
        <TrustItem icon={Wallet} title="Flexible payment" text="Online or cash options" />
      </section>

      <section className="login-card app-panel">
        <span className="round-icon"><Phone size={18} /></span>
        <div className="login-content">
          <div>
            <h3>Secure mobile access</h3>
            <p>Use phone-based authentication to protect bookings, addresses, and payment history.</p>
          </div>
          <div className="otp-row">
            <input aria-label="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <button className="secondary-button" onClick={handleSendOtp}>{otpSent ? 'OTP sent' : 'Send OTP'}</button>
          </div>
        </div>
      </section>

      <SectionTitle title="Service menu" action="Transparent local pricing" />
      <div className="service-grid">
        {services.map((service) => (
          <button
            key={service.id}
            className={`service-card ${selectedServiceId === service.id ? 'selected' : ''}`}
            onClick={() => setSelectedServiceId(service.id)}
          >
            <span>{service.icon}</span>
            <strong>{service.name}</strong>
            <small>₹{service.price} · {service.duration}</small>
          </button>
        ))}
      </div>

      <section className="booking-form">
        <div className="form-head">
          <SectionTitle title="Booking details" action="Date, time, address" />
          <div className="selected-package">
            <strong>{selected.name}</strong>
            <span>₹{selected.price} · {selected.duration}</span>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Date
            <input type="date" value={bookingDraft.date} onChange={(event) => setBookingDraft({ ...bookingDraft, date: event.target.value })} />
          </label>
          <label>
            Time
            <input type="time" value={bookingDraft.time} onChange={(event) => setBookingDraft({ ...bookingDraft, time: event.target.value })} />
          </label>
          <label className="wide-field">
            Home address
            <textarea value={bookingDraft.address} onChange={(event) => setBookingDraft({ ...bookingDraft, address: event.target.value })} />
          </label>
        </div>
        <div className="map-preview">
          <LocateFixed size={19} />
          <div>
            <strong>Service location</strong>
            <p>Pin the home address and validate city service areas before sending the request.</p>
          </div>
        </div>
        <div className="payment-choice">
          <button className={bookingDraft.paymentMode === 'cash' ? 'selected' : ''} onClick={() => setBookingDraft({ ...bookingDraft, paymentMode: 'cash' })}>
            <Banknote size={18} /> Cash after service
          </button>
          <button className={bookingDraft.paymentMode === 'online' ? 'selected' : ''} onClick={() => setBookingDraft({ ...bookingDraft, paymentMode: 'online' })}>
            <CreditCard size={18} /> Pay online
          </button>
        </div>
        <button className="primary-button" onClick={() => setActiveTab('artists')}>View available professionals</button>
      </section>

      {recentBooking && <MiniBooking booking={recentBooking} onClick={() => setActiveTab('track')} />}
    </>
  );
}

export function ArtistListing({ service, artists, bookingDraft, onBook }) {
  return (
    <>
      <PageIntro
        eyebrow="Professional matching"
        title="Choose from verified nearby beauty experts"
        text="Review distance, availability, rating, experience, skills, and starting price before sending a booking request."
      />
      <SectionTitle title="Available professionals" action={`${service.name} · ${bookingDraft.time}`} />
      <section className="map-card">
        <MapPin size={24} />
        <div>
          <h3>Service address selected</h3>
          <p>{bookingDraft.address}</p>
        </div>
      </section>
      <div className="artist-list">
        {artists.map((artist) => (
          <article className="artist-card" key={artist.id}>
            <img src={artist.photo} alt={artist.name} />
            <div className="artist-body">
              <div className="artist-head">
                <div>
                  <h3>{artist.name}</h3>
                  <p>{artist.experience} exp · {artist.distance} km</p>
                </div>
                <span className="verified"><BadgeCheck size={16} /> Verified</span>
              </div>
              <p className="skills">{artist.skills?.join(' · ')}</p>
              <div className="artist-meta">
                <span><Star size={16} /> {artist.rating}</span>
                <span><IndianRupee size={16} /> From {artist.basePrice}</span>
                <span className={artist.online ? 'online' : 'offline'}>{artist.online ? 'Online' : 'Offline'}</span>
              </div>
              <div className="card-actions">
                <button className="secondary-button" onClick={() => alert('Consultation feature coming soon!')}><MessageCircle size={17} /> Consultation</button>
                <button className="primary-button" disabled={!artist.online} onClick={() => onBook(artist.id)}>
                  {artist.online ? 'Request Boutique' : 'Unavailable'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function BookingTracking({ booking, artist, onPay, statusSteps, statusCopy }) {
  if (!booking) return <EmptyState title="No active booking" text="Select a service and professional to begin your reservation." />;
  const currentStep = Math.max(0, statusSteps.indexOf(booking.status));
  return (
    <>
      <PageIntro
        eyebrow="Live booking status"
        title="Track each stage from request to completion"
        text="Customers and professionals share one booking timeline, including confirmation, travel, service start, completion, payment, and review."
      />
      <section className="tracking-card">
        <div className="status-badge">
           <div className={`status-pill ${booking.status}`}>{statusCopy[booking.status] ?? booking.status}</div>
           <div className="payment-pill">{booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Awaiting'}</div>
        </div>
        <h2>{booking.serviceName}</h2>
        <p>{booking.date} at {booking.time} · {booking.address}</p>
        <div className="track-line">
          {statusSteps.map((step, index) => (
            <div key={step} className={index <= currentStep ? 'done' : ''}>
              <span>{index < currentStep ? <Check size={14} /> : (index === currentStep ? <Clock size={14} className="pulse" /> : index + 1)}</span>
              <small>{statusCopy[step]}</small>
            </div>
          ))}
        </div>
      </section>

      {artist && (
        <section className="pro-card">
          <img src={artist.photo} alt={artist.name} />
          <div>
            <h3>{artist.name}</h3>
            <p><Star size={15} /> {artist.rating} · {artist.experience} experience</p>
            <div className="card-actions">
              <button className="secondary-button"><Phone size={17} /> Call</button>
              <button className="secondary-button"><MessageCircle size={17} /> Message</button>
            </div>
          </div>
        </section>
      )}

      <section className="booking-form">
        <SectionTitle title="Payment summary" action={booking.paymentStatus} />
        <div className="payment-row">
          <span><Wallet size={18} /> {booking.paymentMode === 'cash' ? 'Cash after service' : 'Online payment'}</span>
          <strong>₹{booking.price}</strong>
        </div>
        <button className="primary-button" disabled={booking.paymentStatus === 'paid'} onClick={() => onPay(booking.id)}>
          Confirm payment
        </button>
      </section>
    </>
  );
}

export function CustomerProfile({ user, bookings, reviews, statusCopy }) {
  const userBookings = bookings.filter(b => b.customerId === user?.id);
  const userReviews = reviews.filter(r => r.customerId === user?.id);
  
  return (
    <>
      <PageIntro
        eyebrow="Client Profile"
        title="Your profile, booking history, and reviews"
        text="Keep repeat bookings simple with saved customer details, service history, ratings, and post-service feedback."
      />
      <section className="profile-head">
        <span className="avatar"><UserRound size={34} /></span>
        <div>
          <h2>{user?.name || 'Client'}</h2>
          <p>{user?.phone} · {user?.city || 'Rewa'}</p>
        </div>
      </section>
      <SectionTitle title="Booking history" action={`${userBookings.length} reservations`} />
      {userBookings.map((booking) => <MiniBooking key={booking.id} booking={booking} statusCopy={statusCopy} />)}
      <SectionTitle title="Reviews" action="Service feedback" />
      {userReviews.map((review) => (
        <section className="review-card" key={review.id}>
          <strong>{review.artistName}</strong>
          <span><Star size={15} /> {review.rating}</span>
          <p>{review.comment}</p>
        </section>
      ))}
    </>
  );
}
