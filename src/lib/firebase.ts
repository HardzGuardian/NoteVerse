import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace this with your own Firebase project configuration.
//
// To find your Firebase config object:
// 1. Go to your project in the Firebase console: https://console.firebase.google.com/
// 2. In the left-hand menu, click the settings gear icon, then select "Project settings".
// 3. Under the "General" tab, scroll down to the "Your apps" section.
// 4. In the "SDK setup and configuration" section, select the "Config" option.
// 5. Copy the entire 'firebaseConfig' object and paste it here, replacing the placeholder object below.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// We check if apps are already initialized to prevent errors during hot-reloads.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Only initialize auth if the API key is not a placeholder
const auth = firebaseConfig.apiKey !== 'YOUR_API_KEY' ? getAuth(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
