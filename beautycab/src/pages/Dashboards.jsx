import React from 'react';
import { BadgeCheck, MapPin, Landmark, Wallet, CalendarDays, ListChecks, Star, Sparkles, Settings, Crown, Users, IndianRupee, Headphones } from 'lucide-react';
import { PageIntro, Metric, SectionTitle, EmptyState } from '../components/common/UIComponents';

export function ArtistDashboard({ artist, requests, bookings, onAccept, onStatus, onToggleOnline, statusCopy }) {
  const earnings = bookings.filter((booking) => booking.status === 'completed').reduce((sum, booking) => sum + booking.price, 0);
  return (
    <>
      <PageIntro
        eyebrow="Artistry Dashboard"
        title="Manage Reservations, Performance, and Analytics"
        text="Your central operations boutique for specialist availability, client coordination, and comprehensive fiscal reporting."
      />
      <section className="artist-profile">
        <img src={artist.photo} alt={artist.name} />
        <div>
          <h2>{artist.name}</h2>
          <p>{artist.skills?.join(' · ')}</p>
          <div className="artist-profile-meta">
            <span><BadgeCheck size={15} /> Verified</span>
            <span><MapPin size={15} /> {artist.serviceAreas?.join(', ')}</span>
            <span><Landmark size={15} /> {artist.bankUpi}</span>
          </div>
          <button className={artist.online ? 'online-toggle active' : 'online-toggle'} onClick={onToggleOnline}>
            {artist.online ? 'Online' : 'Go online'}
          </button>
        </div>
      </section>

      <div className="metric-grid">
        <Metric icon={Wallet} label="Earnings" value={`₹${earnings}`} />
        <Metric icon={CalendarDays} label="Completed" value={bookings.filter((booking) => booking.status === 'completed').length} />
        <Metric icon={ListChecks} label="Requests" value={requests.length} />
        <Metric icon={Star} label="Rating" value={artist.rating} />
      </div>

      <SectionTitle title="New requests" action={`${requests.length} awaiting response`} />
      {requests.length === 0 && <EmptyState title="No pending requests" text="Stay online to receive booking opportunities in your service areas." />}
      {requests.map((booking) => (
        <section className="request-card" key={booking.id}>
          <div>
            <h3>{booking.serviceName}</h3>
            <p>{booking.customerName} · {booking.address}</p>
            <strong>₹{booking.price}</strong>
          </div>
          <button className="primary-button" onClick={() => onAccept(booking.id)}>Accept request</button>
        </section>
      ))}

      <SectionTitle title="Assigned bookings" action="Update service milestone" />
      {bookings.map((booking) => (
        <section className="status-card" key={booking.id}>
          <h3>{booking.serviceName}</h3>
          <p>{booking.date} · {booking.address}</p>
          <div className="status-actions">
            {['on_the_way', 'started', 'completed'].map((status) => (
              <button key={status} onClick={() => onStatus(booking.id, status)}>{statusCopy[status]}</button>
            ))}
          </div>
        </section>
      ))}
      <SectionTitle title="Portfolio" action="Before and after showcase" />
      <section className="portfolio-uploader">
        <Sparkles size={22} />
        <div>
          <h3>Showcase approved service photos</h3>
          <p>Use customer-approved before and after images to strengthen the professional profile and future booking trust.</p>
        </div>
        <button className="secondary-button">Add photos</button>
      </section>
    </>
  );
}

export function AdminDashboard({ metrics, artists, bookings, services, onAssign, onCancel }) {
  return (
    <>
      <PageIntro
        eyebrow="Operations Command"
        title="Orchestrate Marketplace Excellence and Urban Quality"
        text="A secure administrative landscape for talent vetting, manual concierge support, fiscal policy, and urban performance optimization."
      />
      <div className="metric-grid admin">
        <Metric icon={CalendarDays} label="Bookings" value={metrics.bookings} />
        <Metric icon={IndianRupee} label="Revenue" value={`₹${metrics.revenue}`} />
        <Metric icon={Sparkles} label="Professionals" value={metrics.artists} />
        <Metric icon={Users} label="Customers" value={metrics.customers} />
      </div>
      <section className="admin-command">
        <div><Settings size={20} /><span>Commission policy: 18%</span></div>
        <div><Crown size={20} /><span>Priority city: Rewa</span></div>
        <div><Users size={20} /><span>Manual assignment enabled</span></div>
      </section>
      <SectionTitle title="Professional approvals" action="KYC and portfolio review" />
      {artists.map((artist) => (
        <section className="admin-row" key={artist.id}>
          <img src={artist.photo} alt={artist.name} />
          <div>
            <strong>{artist.name}</strong>
            <p>{artist.city} · {artist.skills?.join(', ')}</p>
          </div>
          <button className="secondary-button">Approve profile</button>
        </section>
      ))}
      <SectionTitle title="Booking operations" action="Manual support tools" />
      {bookings.map((booking) => (
        <section className="admin-booking" key={booking.id}>
          <div>
            <strong>{booking.serviceName}</strong>
            <p>{booking.status} · {booking.customerName} · ₹{booking.price}</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => onAssign(booking.id)}>Assign</button>
            <button onClick={() => onCancel(booking.id)}>Cancel</button>
          </div>
        </section>
      ))}
      <SectionTitle title="Service catalogue" action={`${services.length} active categories`} />
      <div className="service-admin-grid">
        {services.slice(0, 4).map((service) => (
          <section className="service-admin-card" key={service.id}>
            <span>{service.icon}</span>
            <strong>{service.name}</strong>
            <p>₹{service.price} · {service.duration}</p>
          </section>
        ))}
      </div>
      <section className="coupon-card">
        <Headphones size={22} />
        <div>
          <h3>Support desk</h3>
          <p>Central queue for refunds, delays, service quality reviews, and customer concerns.</p>
        </div>
      </section>
    </>
  );
}
