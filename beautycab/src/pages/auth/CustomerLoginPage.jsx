import React from 'react';
import { ShieldCheck, Star, CalendarDays, Wallet } from 'lucide-react';
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

export function CustomerLoginPage({ phone, setPhone, otpSent, otp, setOtp, onSendOtp, onVerifyOtp, onBack, isLoggingIn }) {
  return (
    <div className="auth-shell customer-auth">
      <header className="auth-header">
        <BrandBlock />
        <button onClick={onBack}>Back to home</button>
      </header>
      <main className="auth-main">
        <section className="auth-story">
          <p className="landing-kicker"><ShieldCheck size={16} /> Client Access</p>
          <h1>Beauty reservations made calm, clear, and couture.</h1>
          <span>Access elite specialists for makeup, hair, and bespoke beauty services at your residence with transparent pricing and real-time coordination.</span>
          <div className="auth-benefits">
            <AuthBenefit icon={Star} title="Vetted Specialists" text="Comprehensive profiles featuring verified certifications, experience, and trust metrics." />
            <AuthBenefit icon={CalendarDays} title="Precision Scheduling" text="Effortlessly coordinate your date, time, and service package in a few refined steps." />
            <AuthBenefit icon={Wallet} title="Flexible Settlements" text="Secure online payments or post-service settlement, fully integrated with your booking." />
          </div>
        </section>
        <section className="auth-card">
          <h3>Customer sign in</h3>
          <p>Enter your mobile number to continue to the BeautyOnCall booking experience.</p>
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
          <small>Secure OTP authentication facilitated via Firebase Phone Auth.</small>
        </section>
      </main>
    </div>
  );
}
