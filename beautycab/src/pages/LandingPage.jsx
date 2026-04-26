import React from 'react';
import { Sparkles, ChevronRight, Star, ShieldCheck, Wallet, CalendarDays, IndianRupee, Users, Headphones, Gem, Search, Navigation, CheckCircle2, Bell, MapPin } from 'lucide-react';
import { BrandBlock, LandingStep, Metric } from '../components/common/UIComponents';

export function LandingPage({ services, artists, setActiveTab }) {
  const featuredArtists = artists.slice(0, 3);
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <BrandBlock />
        <nav aria-label="Landing">
          <a href="#services">Services</a>
          <a href="#artists">Artists</a>
          <a href="#trust">Trust</a>
          <button onClick={() => setActiveTab('customer-login')}>Book now</button>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <p className="landing-kicker"><Sparkles size={16} /> Certified elite artists for your most cherished moments</p>
            <h1>BeautyOnCall</h1>
            <span>The premier marketplace for luxury makeup artists and expert stylists. Experience salon-grade excellence in the comfort of your home.</span>
            <div className="landing-actions">
              <button className="landing-primary" onClick={() => setActiveTab('customer-login')}>
                Secure a beauty specialist <ChevronRight size={19} />
              </button>
              <button className="landing-secondary" onClick={() => setActiveTab('artist-login')}>
                Partner as a certified professional
              </button>
            </div>
            <div className="landing-proof">
              <span><Star size={16} /> 4.9 Average rating</span>
              <span><ShieldCheck size={16} /> Identity-verified artists</span>
              <span><Wallet size={16} /> Transparent, set pricing</span>
            </div>
          </div>
        </section>

        <section className="landing-band" id="trust">
          <div className="landing-stat">
            <strong>15 min</strong>
            <span>average response time</span>
          </div>
          <div className="landing-stat">
            <strong>Elite Only</strong>
            <span>vetted & certified professionals</span>
          </div>
          <div className="landing-stat">
            <strong>Live Flow</strong>
            <span>real-time service coordination</span>
          </div>
          <div className="landing-stat">
            <strong>Secure</strong>
            <span>encrypted data & private bookings</span>
          </div>
        </section>

        <section className="landing-section" id="services">
          <div className="landing-section-head">
            <p>Curated Portfolio</p>
            <h2>Exceptional Artistry for Every Occasion</h2>
            <span>Our bespoke service range features transparent pricing and meticulous specialist selection for your absolute peace of mind.</span>
          </div>
          <div className="landing-service-grid">
            {services.map((service) => (
              <article className="landing-service-card" key={service.id}>
                <span>{service.icon}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <strong>₹{service.price} · {service.duration}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-split">
          <div>
            <p className="landing-label">The Experience</p>
            <h2>Seamless Reservations, Unparalleled Results</h2>
            <span className="landing-copy">A streamlined four-step process designed for the modern lifestyle. Select your artistry, confirm your schedule, and relax as excellence comes to you.</span>
            <div className="landing-steps">
              <LandingStep icon={Search} title="Select Your Occasion" text="Browse our elite catalog across bridal, editorial, and essential beauty services." />
              <LandingStep icon={Navigation} title="Consult Specialist Profiles" text="Review verified certifications, portfolios, and real customer testimonials before booking." />
              <LandingStep icon={CheckCircle2} title="Monitor Progress" text="Track your specialist's arrival and service milestones through our integrated live dashboard." />
            </div>
          </div>
          <div className="landing-phone-preview">
            <div className="phone-top">
              <span></span>
              <strong>BeautyOnCall</strong>
              <Bell size={17} />
            </div>
            <div className="phone-card hot">
              <p>Elite Bridal Couture</p>
              <h3>Meena Kapoor Artistry</h3>
              <span>Confirmed · Arrival at 5:20 PM</span>
            </div>
            <div className="phone-route">
              <div><MapPin size={16} /> Civil Lines Residency</div>
              <div><Sparkles size={16} /> Specialist en route</div>
              <div><Wallet size={16} /> Post-service payment</div>
            </div>
            <button>Contact Specialist</button>
          </div>
        </section>

        <section className="landing-section tinted" id="artists">
          <div className="landing-section-head">
            <p>Certified Talent</p>
            <h2>Expertise You Can Trust</h2>
            <span>Every specialist on BeautyOnCall undergoes rigorous identity verification and portfolio review to ensure consistent, high-end results.</span>
          </div>
          <div className="landing-artist-grid">
            {featuredArtists.map((artist) => (
              <article className="landing-artist-card" key={artist.id}>
                <img src={artist.photo} alt={artist.name} />
                <div>
                  <h3>{artist.name}</h3>
                  <p>{artist.skills.join(' · ')}</p>
                  <span><Star size={15} /> {artist.rating} · {artist.experience}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-admin">
          <div>
            <p className="landing-label">Operational Excellence</p>
            <h2>Enterprise-Grade Marketplace Management</h2>
            <span className="landing-copy">Our dedicated command center oversees quality control, specialist vetting, and urban performance metrics to maintain our gold-standard service.</span>
          </div>
          <div className="admin-preview">
            <Metric icon={CalendarDays} label="Operations" value="Live" />
            <Metric icon={IndianRupee} label="Performance" value="Tracked" />
            <Metric icon={Users} label="Verification" value="KYC" />
            <Metric icon={Headphones} label="Concierge" value="Ready" />
          </div>
        </section>

        <section className="landing-cta">
          <Gem size={34} />
          <h2>Experience BeautyOnCall</h2>
          <p>Begin as a customer or partner as a beauty professional. Administrative tools remain protected from public users.</p>
          <button onClick={() => setActiveTab('customer-login')}>Start booking</button>
        </section>
      </main>
    </div>
  );
}
