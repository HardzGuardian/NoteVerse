import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAd7zlooTOmIdZHTq7SGbC4EaYLTmZ3Fc8",
  authDomain: "noteverse-giy72.firebaseapp.com",
  projectId: "noteverse-giy72",
  storageBucket: "noteverse-giy72.firebasestorage.app",
  messagingSenderId: "812484800991",
  appId: "1:812484800991:web:797aa704e1468ccf3f146a"
};

// Initialize Firebase
// We check if apps are already initialized to prevent errors during hot-reloads.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Only initialize auth if the API key is not a placeholder
const auth = firebaseConfig.apiKey !== 'YOUR_API_KEY' ? getAuth(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
