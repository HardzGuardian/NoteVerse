import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if the config is valid.
const configIsValid = firebaseConfig.apiKey && firebaseConfig.projectId;

const app = configIsValid
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

if (!configIsValid && process.env.NODE_ENV !== "production") {
  // This warning will appear in the server console during development.
  console.warn(
    "Firebase configuration is missing or invalid. Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env.local file. Firebase-dependent features will be disabled."
  );
}

export { app, auth, db, storage };
