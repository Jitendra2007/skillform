import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA9bjMQ2znGofEdkVa31_5gO3gVkIY0uF4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skillform-22ea5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skillform-22ea5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skillform-22ea5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "852537380485",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:852537380485:web:891b8b2105fd4942f9a3ec",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q6T8ET3R2S"
};

let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (running in safe mode):", error);
}

export { auth, db, storage };
export default app;
