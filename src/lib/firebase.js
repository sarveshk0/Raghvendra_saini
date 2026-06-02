/**
 * Firebase Firestore Initializer
 * Raghvendra Saini Campaign Portal
 *
 * - Initializes Firebase App (singleton pattern — safe for Next.js SSR/SSG)
 * - Exports `db` (Firestore instance) for use in API routes
 * - If Firebase env vars are empty, `db` will be null and all API routes
 *   will automatically fall back to reading/writing local JSON files.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize if all required credentials are present
const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.trim() !== "" &&
  firebaseConfig.projectId.trim() !== "";

let db = null;
let auth = null;

if (isConfigured) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase Firestore + Auth connected:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("⚠️ Firebase init failed:", err.message);
    db = null;
    auth = null;
  }
} else {
  console.log(
    "ℹ️ Firebase not configured — using offline local auth fallback. Fill in .env.local to enable real Firebase Auth."
  );
}

export { db, auth };
