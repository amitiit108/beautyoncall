import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
export const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
export const functions = firebaseApp ? getFunctions(firebaseApp, 'asia-south1') : null;
export const messagingPromise = firebaseApp ? isSupported().then((supported) => (supported ? getMessaging(firebaseApp) : null)) : Promise.resolve(null);

let confirmationResult = null;
let recaptchaVerifier = null;

export async function sendPhoneOtp(phoneNumber, containerId) {
  console.log('--- Starting OTP Send Flow ---');
  console.log('Phone:', phoneNumber);
  
  if (!auth) {
     console.error('Firebase Auth not initialized. Check your .env file.');
     return null;
  }
  
  const targetId = 'recaptcha-container';
  const container = document.getElementById(targetId);

  if (window.recaptchaVerifier) {
    console.log('Cleaning up existing verifier...');
    try {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    } catch (e) {
      console.warn('Cleanup error (safe to ignore):', e);
    }
  }
  
  if (container) {
    container.innerHTML = '';
    console.log('DOM container cleared.');
  }

  try {
    console.log('Initializing RecaptchaVerifier...');
    window.recaptchaVerifier = new RecaptchaVerifier(auth, targetId, {
      size: 'invisible',
      callback: (response) => {
        console.log('Recaptcha solved successfully.');
      },
      'expired-callback': () => {
        console.warn('Recaptcha expired.');
      }
    });

    console.log('Calling signInWithPhoneNumber...');
    const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    console.log('signInWithPhoneNumber successful.');
    return result;
  } catch (error) {
    console.error('CRITICAL OTP ERROR:', error.code, error.message);
    throw error;
  }
}
