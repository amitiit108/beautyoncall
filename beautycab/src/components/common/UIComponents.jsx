import React from 'react';
import { 
  Sparkles, 
  Headphones, 
  ShieldCheck, 
  Star, 
  Wallet, 
  Clock, 
  ChevronRight, 
  Heart 
} from 'lucide-react';

export function BrandBlock() {
  return (
    <div className="brand-block">
      <div className="brand-mark"><Sparkles size={24} /></div>
      <div>
        <strong>BeautyOnCall</strong>
        <span>Beauty marketplace</span>
      </div>
    </div>
  );
}

export function SupportCard() {
  return (
    <section className="support-card">
      <Headphones size={20} />
      <div>
        <strong>Trust desk</strong>
        <p>Dedicated assistance for artist verification, service issues, refunds, and urgent bookings.</p>
      </div>
    </section>
  );
}

export function RoleSwitch({ role, onRoleChange }) {
  return (
    <section className="role-switch" aria-label="App mode">
      {['customer', 'artist'].map((item) => (
        <button key={item} className={role === item ? 'active' : ''} onClick={() => onRoleChange(item)}>
          {item === 'customer' ? 'Customer' : 'Artist'}
        </button>
      ))}
    </section>
  );
}

export function OfflineNotice() {
  return (
    <section className="notice">
      <ShieldCheck size={18} />
      <span>Operational Preview Mode: Connect your secure backend to enable live artist coordination and payments.</span>
    </section>
  );
}

export function PageIntro({ eyebrow, title, text }) {
  return (
    <section className="page-intro">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{text}</span>
    </section>
  );
}

export function TrustItem({ icon: Icon, title, text }) {
  return (
    <section>
      <Icon size={20} />
      <strong>{title}</strong>
      <span>{text}</span>
    </section>
  );
}

export function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <span>{action}</span>
    </div>
  );
}

export function Metric({ icon: Icon, label, value }) {
  return (
    <section className="metric-card">
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </section>
  );
}

export function MiniBooking({ booking, onClick, statusCopy }) {
  return (
    <button className="mini-booking" onClick={onClick}>
      <span><Clock size={18} /></span>
      <div>
        <strong>{booking.serviceName}</strong>
        <p>{statusCopy[booking.status]} · {booking.date} {booking.time}</p>
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

export function EmptyState({ title, text }) {
  return (
    <section className="empty-state">
      <Heart size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

export function NavButton({ active, onClick, icon: Icon, label }) {
  return (
    <button className={active ? 'active' : ''} onClick={onClick}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

export function LandingStep({ icon: Icon, title, text }) {
  return (
    <article>
      <Icon size={20} />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
