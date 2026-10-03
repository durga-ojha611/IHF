/**
 * Firebase Configuration for Backend Node.js Environment
 * Project: ihf-website-bb2ef
 */

import { initializeApp, getApps, getApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDyICd86VlAv1V6BHzF64ydvsbjG98n5YI",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "ihf-website-bb2ef.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "ihf-website-bb2ef",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "ihf-website-bb2ef.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "5856570648",
  appId: process.env.FIREBASE_APP_ID || "1:5856570648:web:9aac6d105f594d81cec26d",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XSDMM2WBV8"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
