import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, sendPhoneOtp } from './firebase';
import {
  updateBookingStatus,
  updatePaymentStatus,
  updateUserRole,
  getUserProfile,
  saveUserProfile,
  getArtistProfile,
  saveArtistProfile,
  acceptBooking,
  createBooking,
  seedServices,
  subscribeToAppData,
  updateArtistAvailability,
} from './services/firebaseService';
import { initialData } from './mockData';

// Layout & Components
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { ArtistLoginPage } from './pages/auth/ArtistLoginPage';
import { CustomerHome, ArtistListing, BookingTracking, CustomerProfile } from './pages/customer/CustomerComponents';
import { ArtistDashboard, AdminDashboard } from './pages/Dashboards';

import './styles.css';

const statusCopy = {
  pending: 'Request received',
  accepted: 'Specialist confirmed',
  on_the_way: 'Specialist en route',
  started: 'Service initiated',
  completed: 'Service completed',
  cancelled: 'Booking cancelled',
};

const statusSteps = ['pending', 'accepted', 'on_the_way', 'started', 'completed'];

function App() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('landing');
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('+91 ');
  const [otpSent, setOtpSent] = useState(false);
  const [artistPhone, setArtistPhone] = useState('+91 ');
  const [isAdminSignedIn] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(initialData.services[0].id);
  const [bookingDraft, setBookingDraft] = useState({
    date: '2026-04-27',
    time: '11:00',
    address: 'Villa 14, Regency Enclave, Civil Lines, Rewa',
    paymentMode: 'cash',
  });
  const [activeBookingId, setActiveBookingId] = useState(initialData.bookings[0].id);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  React.useEffect(() => {
    let unsubAuth = () => {};
    if (auth) {
      unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setRole(profile.role);
            setCurrentUser({ ...user, ...profile });
            setActiveTab(profile.role === 'artist' ? 'artist' : 'home');
          } else {
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
          if (activeTab !== 'landing' && activeTab !== 'customer-login' && activeTab !== 'artist-login') {
            setActiveTab('landing');
          }
        }
      });
    }

    const unsubscribeData = subscribeToAppData((snapshot) => {
      if (snapshot) {
        setData(snapshot);
        setIsFirebaseReady(true);
      }
    });
    seedServices(initialData.services).catch(() => {});
    return () => {
      unsubAuth();
      unsubscribeData();
    };
  }, []);

  const selectedService = data.services.find((service) => service.id === selectedServiceId) ?? data.services[0];
  const activeBooking = data.bookings.find((booking) => booking.id === activeBookingId) ?? data.bookings[0];
  const acceptedBookings = data.bookings.filter((booking) => booking.artistId === currentUser?.id || booking.artistId === 'artist-1');
  const pendingRequests = data.bookings.filter((booking) => booking.status === 'pending' && (booking.requestedArtistId === currentUser?.id || booking.requestedArtistId === 'artist-1'));
  
  const metrics = useMemo(() => {
    const completed = data.bookings.filter((booking) => booking.status === 'completed');
    return {
      bookings: data.bookings.length,
      revenue: completed.reduce((sum, booking) => sum + booking.price, 0),
      artists: data.artists.length,
      customers: data.users.filter((user) => user.role === 'customer').length,
    };
  }, [data]);

  async function handleBookNow(artistId) {
    const artist = data.artists.find((item) => item.id === artistId);
    const booking = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      customerId: currentUser?.id || 'customer-1',
      customerName: currentUser?.name || 'Priya Sharma',
      artistId: null,
      requestedArtistId: artistId,
      artistName: artist?.name ?? 'Nearby artist',
      city: 'Rewa',
      date: bookingDraft.date,
      time: bookingDraft.time,
      address: bookingDraft.address,
      location: { lat: 24.5362, lng: 81.3037 },
      price: selectedService.price,
      duration: selectedService.duration,
      paymentMode: bookingDraft.paymentMode,
      paymentStatus: bookingDraft.paymentMode === 'cash' ? 'cash_pending' : 'online_pending',
      status: 'pending',
    };

    const created = await createBooking(booking);
    const nextBooking = created ?? { ...booking, id: `local-${Date.now()}` };
    setData((current) => ({ ...current, bookings: [nextBooking, ...current.bookings] }));
    setActiveBookingId(nextBooking.id);
    setActiveTab('track');
  }

  async function handleAccept(bookingId) {
    const artistId = currentUser?.id || 'artist-1';
    await acceptBooking(bookingId, artistId);
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, artistId, status: 'accepted' } : booking
      ),
    }));
    setActiveBookingId(bookingId);
  }

  async function handleStatus(bookingId, status) {
    await updateBookingStatus(bookingId, status);
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    }));
  }

  async function handlePayment(bookingId) {
    await updatePaymentStatus(bookingId, 'paid');
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => (booking.id === bookingId ? { ...booking, paymentStatus: 'paid' } : booking)),
    }));
  }

  async function handleSendOtp(phoneNumber) {
    // Sanitize number: Remove all spaces, dashes, and ensure it starts with +
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // DEV BYPASS: Allow instant login for testing
    if (cleanPhone === '+910000000000') {
      setOtpSent(true);
      return;
    }

    setIsLoggingIn(true);
    try {
      const result = await sendPhoneOtp(cleanPhone, 'recaptcha-container');
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      console.error('Firebase Auth Error:', error);
      alert(`OTP Error: ${error.message || 'Please check your configuration or network.'}`);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleVerifyOtp(otpCode, targetRole) {
    setIsLoggingIn(true);
    try {
      let user;
      let profile;

      // DEV BYPASS VERIFICATION
      if (phone === '+91 00000 00000' || artistPhone === '+91 00000 00000') {
        user = { uid: `dev-${targetRole}`, phoneNumber: '+91 00000 00000' };
        profile = { id: user.uid, phone: user.phoneNumber, role: targetRole, name: targetRole === 'customer' ? 'Dev Client' : 'Dev Specialist', city: 'Rewa' };
      } else {
        const result = await confirmationResult.confirm(otpCode);
        user = result.user;
        profile = await getUserProfile(user.uid);
      }

      if (!profile) {
        profile = { id: user.uid, phone: user.phoneNumber, role: targetRole, name: targetRole === 'customer' ? 'New Client' : 'New Specialist', city: 'Rewa' };
        await saveUserProfile(user.uid, profile);
        if (targetRole === 'artist') {
          await saveArtistProfile(user.uid, { ...profile, online: false, experience: 'New', rating: 5.0, skills: [], serviceAreas: [] });
        }
      }
      setCurrentUser({ ...user, ...profile });
      setRole(profile.role);
      setActiveTab(profile.role === 'artist' ? 'artist' : 'home');
    } catch (error) {
      console.error(error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    setOtpSent(false);
    setConfirmationResult(null);
    setOtp('');
  }

  // Route Handling
  if (activeTab === 'landing') return <LandingPage services={data.services} artists={data.artists} setActiveTab={setActiveTab} />;
  
  if (activeTab === 'customer-login') return (
    <CustomerLoginPage
      phone={phone} setPhone={setPhone} otpSent={otpSent} otp={otp} setOtp={setOtp}
      onSendOtp={() => handleSendOtp(phone)} onVerifyOtp={(code) => handleVerifyOtp(code, 'customer')}
      onBack={() => setActiveTab('landing')} isLoggingIn={isLoggingIn}
    />
  );

  if (activeTab === 'artist-login') return (
    <ArtistLoginPage
      phone={artistPhone} setPhone={setArtistPhone} otpSent={otpSent} otp={otp} setOtp={setOtp}
      onSendOtp={() => handleSendOtp(artistPhone)} onVerifyOtp={(code) => handleVerifyOtp(code, 'artist')}
      onBack={() => setActiveTab('landing')} isLoggingIn={isLoggingIn}
    />
  );

  return (
    <AppLayout
      role={role}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentUser={currentUser}
      handleSignOut={handleSignOut}
      isAdminSignedIn={isAdminSignedIn}
      isFirebaseReady={isFirebaseReady}
    >
      {activeTab === 'home' && (
        <CustomerHome
          services={data.services} selectedServiceId={selectedServiceId} setSelectedServiceId={setSelectedServiceId}
          setActiveTab={setActiveTab} bookingDraft={bookingDraft} setBookingDraft={setBookingDraft}
          recentBooking={activeBooking} phone={phone} setPhone={setPhone} otpSent={otpSent} handleSendOtp={() => handleSendOtp(phone)}
        />
      )}

      {activeTab === 'artists' && (
        <ArtistListing
          service={selectedService} artists={data.artists} bookingDraft={bookingDraft} onBook={handleBookNow}
        />
      )}

      {activeTab === 'track' && (
        <BookingTracking
          booking={activeBooking} onPay={handlePayment} statusSteps={statusSteps} statusCopy={statusCopy}
          artist={data.artists.find((artist) => artist.id === activeBooking?.artistId || artist.id === activeBooking?.requestedArtistId)}
        />
      )}

      {activeTab === 'profile' && <CustomerProfile user={currentUser} bookings={data.bookings} reviews={data.reviews} statusCopy={statusCopy} />}

      {activeTab === 'artist' && (
        <ArtistDashboard
          artist={currentUser || data.artists[0]} requests={pendingRequests} bookings={acceptedBookings}
          onAccept={handleAccept} onStatus={handleStatus} statusCopy={statusCopy}
          onToggleOnline={async () => {
            const artistId = currentUser?.id || 'artist-1';
            const next = !data.artists.find(a => a.id === artistId)?.online;
            await updateArtistAvailability(artistId, next);
            setData(curr => ({ ...curr, artists: curr.artists.map(a => a.id === artistId ? { ...a, online: next } : a) }));
          }}
        />
      )}

      {activeTab === 'admin' && isAdminSignedIn && (
        <AdminDashboard
          metrics={metrics} artists={data.artists} bookings={data.bookings} services={data.services}
          onAssign={handleAccept} onCancel={(id) => handleStatus(id, 'cancelled')}
        />
      )}
    </AppLayout>
  );
}

createRoot(document.getElementById('root')).render(<App />);
