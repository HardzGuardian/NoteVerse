import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPXee3fFi207wL4IK3p4JtwlhBXHi7JRw",
  authDomain: "project-812484800991.firebaseapp.com",
  projectId: "project-812484800991",
  storageBucket: "project-812484800991.appspot.com",
  messagingSenderId: "1015813649631",
  appId: "1:1015813649631:web:f11ee180dcedefaffc656a"
};

// Initialize Firebase
// We check if apps are already initialized to prevent errors during hot-reloads.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
