import React from 'react';
import { Sparkles, BadgeCheck, Send, IndianRupee, Check } from 'lucide-react';
import { BrandBlock } from '../../components/common/UIComponents';

function AuthBenefit({ icon: Icon, title, text }) {
  return (
    <article>
      <Icon size={19} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </article>
  );
}

export function ArtistLoginPage({ phone, setPhone, otpSent, otp, setOtp, onSendOtp, onVerifyOtp, onBack, isLoggingIn }) {
  return (
    <div className="auth-shell artist-auth">
      <header className="auth-header">
        <BrandBlock />
        <button onClick={onBack}>Back to home</button>
      </header>
      <main className="auth-main">
        <section className="auth-story">
          <p className="landing-kicker"><Sparkles size={16} /> Specialist Access</p>
          <h1>A sophisticated workspace for established beauty leaders.</h1>
          <span>Manage luxury bookings, optimize your availability, and showcase your artistry to a discerning clientele through our professional studio.</span>
          <div className="auth-benefits">
            <AuthBenefit icon={BadgeCheck} title="Elite Certification" text="Elevate your professional standing with identity verification and portfolio showcase." />
            <AuthBenefit icon={Send} title="Intelligent Workflow" text="Efficiently review service requests, logistics, and client details before engagement." />
            <AuthBenefit icon={IndianRupee} title="Revenue Transparency" text="Monitor your fiscal performance and payout status with comprehensive reporting." />
          </div>
        </section>
        <section className="auth-card">
          <h3>Specialist sign in</h3>
          <p>Use your registered mobile number to access the artistry studio.</p>
          <label>
            Mobile number
            <input value={phone} placeholder="+91 XXXX XXX XXX" onChange={(event) => setPhone(event.target.value)} />
          </label>
          {otpSent && (
            <label>
              OTP
              <input inputMode="numeric" placeholder="Enter the 6 digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </label>
          )}
          <div className="artist-login-checklist">
            <span><Check size={14} /> Verified profile</span>
            <span><Check size={14} /> Portfolio showcase</span>
            <span><Check size={14} /> Service-area setup</span>
          </div>
          <div className="login-actions-row">
            {!otpSent ? (
               <button className="primary-button" disabled={isLoggingIn} onClick={onSendOtp}>
                 {isLoggingIn ? 'Sending...' : 'Send OTP'}
               </button>
            ) : (
               <>
                 <button className="secondary-button" disabled={isLoggingIn} onClick={onSendOtp}>Resend</button>
                 <button className="primary-button" disabled={isLoggingIn || !otp} onClick={() => onVerifyOtp(otp)}>
                   {isLoggingIn ? 'Verifying...' : 'Verify & Continue'}
                 </button>
               </>
            )}
          </div>
          <small>Verified specialists can manage live reservations after identity authentication.</small>
        </section>
      </main>
    </div>
  );
}
