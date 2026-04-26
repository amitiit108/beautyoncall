import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDoc,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../firebase';
import { initialData } from '../mockData';

const collections = ['users', 'artists', 'services', 'bookings', 'reviews', 'payments', 'coupons', 'notifications'];

export function subscribeToAppData(callback) {
  if (!hasFirebaseConfig || !db) return () => {};

  const state = {};
  const unsubscribers = collections.map((name) =>
    onSnapshot(collection(db, name), (snapshot) => {
      state[name] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      callback({ ...initialData, ...state });
    })
  );

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export async function seedServices(services) {
  if (!hasFirebaseConfig || !db) return;
  const existing = await getDocs(query(collection(db, 'services'), limit(1)));
  if (!existing.empty) return;
  await Promise.all(services.map((service) => setDoc(doc(db, 'services', service.id), service)));
}

export async function createBooking(booking) {
  if (!hasFirebaseConfig || !db) return null;
  const ref = await addDoc(collection(db, 'bookings'), {
    ...booking,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await addDoc(collection(db, 'notifications'), {
    userId: booking.requestedArtistId,
    type: 'booking_request',
    title: 'New BeautyOnCall booking',
    body: `${booking.serviceName} request for ${booking.date} ${booking.time}`,
    read: false,
    createdAt: serverTimestamp(),
  });
  return { ...booking, id: ref.id };
}

export async function acceptBooking(bookingId, artistId) {
  if (!hasFirebaseConfig || !db) return;
  const artist = initialData.artists.find((item) => item.id === artistId);
  await updateDoc(doc(db, 'bookings', bookingId), {
    artistId,
    artistName: artist?.name ?? 'Assigned artist',
    status: 'accepted',
    updatedAt: serverTimestamp(),
  });
}

export async function updateBookingStatus(bookingId, status) {
  if (!hasFirebaseConfig || !db) return;
  await updateDoc(doc(db, 'bookings', bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updatePaymentStatus(bookingId, paymentStatus) {
  if (!hasFirebaseConfig || !db) return;
  await updateDoc(doc(db, 'bookings', bookingId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateArtistAvailability(artistId, online) {
  if (!hasFirebaseConfig || !db) return;
  await updateDoc(doc(db, 'artists', artistId), {
    online,
    lastActiveAt: serverTimestamp(),
  });
}

export async function updateUserRole(userId, role) {
  if (!hasFirebaseConfig || !db) return;
  await setDoc(
    doc(db, 'users', userId),
    {
      id: userId,
      role,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function findAvailableArtists(city, serviceId) {
  if (!hasFirebaseConfig || !db) return initialData.artists.filter((artist) => artist.online);
  const snapshot = await getDocs(query(collection(db, 'artists'), where('city', '==', city), where('online', '==', true)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data(), serviceId }));
}
export async function getUserProfile(uid) {
  if (!hasFirebaseConfig || !db) return null;
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function saveUserProfile(uid, userData) {
  if (!hasFirebaseConfig || !db) return;
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getArtistProfile(uid) {
  if (!hasFirebaseConfig || !db) return null;
  const docSnap = await getDoc(doc(db, 'artists', uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function saveArtistProfile(uid, artistData) {
  if (!hasFirebaseConfig || !db) return;
  await setDoc(doc(db, 'artists', uid), {
    ...artistData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
