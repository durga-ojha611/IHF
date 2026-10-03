/**
 * Firebase Configuration and SDK Initialization
 * Project: ihf-website-bb2ef
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDyICd86VlAv1V6BHzF64ydvsbjG98n5YI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ihf-website-bb2ef.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ihf-website-bb2ef",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ihf-website-bb2ef.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "5856570648",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:5856570648:web:9aac6d105f594d81cec26d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XSDMM2WBV8"
};

// Initialize Firebase App singleton safely for SSR & client
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics instance (loaded client-side when supported)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
