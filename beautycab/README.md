# BeautyOnCall

Premium mobile-first web app for an on-demand makeup and beauty service marketplace in tier-3 Indian cities.

## Features

- Customer service selection, address/time input, nearby artist list, booking creation, tracking, payment status, history, and reviews.
- Artist dashboard with online/offline toggle, new requests, accept flow, status updates, earnings, and profile basics.
- Admin dashboard with bookings, revenue, artists, customers, artist approvals, manual assignment, cancellations, and dispute placeholder.
- Firebase-ready architecture for Authentication, Firestore, Storage, Cloud Functions, Hosting, and Cloud Messaging notifications.
- Uses local preview data when Firebase environment variables are not configured.

## Run locally

```bash
npm install
npm run dev
```

## Firebase setup

1. Create a Firebase web app and copy `.env.example` to `.env`.
2. Fill in the `VITE_FIREBASE_*` values.
3. Enable Phone Authentication in Firebase Authentication.
4. Create Firestore and Storage.
5. Deploy rules and hosting:

```bash
firebase deploy --only firestore:rules,storage,hosting
```

6. Deploy Cloud Functions after installing dependencies in `functions/`:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## Firestore collections

- `users`
- `artists`
- `services`
- `bookings`
- `reviews`
- `payments`
- `coupons`
- `notifications`
- `admin_settings`
