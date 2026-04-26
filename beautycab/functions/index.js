import admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';

admin.initializeApp();
setGlobalOptions({ region: 'asia-south1' });

export const notifyArtistOnBookingRequest = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const booking = event.data?.data();
  if (!booking?.requestedArtistId) return;

  await admin.firestore().collection('notifications').add({
    userId: booking.requestedArtistId,
    type: 'booking_request',
    title: 'New BeautyOnCall request',
    body: `${booking.serviceName} at ${booking.time}, ${booking.city}`,
    bookingId: event.params.bookingId,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

export const notifyCustomerOnStatusChange = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === after.status) return;

  await admin.firestore().collection('notifications').add({
    userId: after.customerId,
    type: 'booking_status',
    title: 'Booking update',
    body: `${after.serviceName} is now ${after.status}`,
    bookingId: event.params.bookingId,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
