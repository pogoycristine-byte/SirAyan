// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "attendify-182fc.firebaseapp.com",
  projectId: "attendify-182fc",
  storageBucket: "attendify-182fc.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// ✅ Initialize Firebase app (reuse if already created)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Firestore safely (prevents double-initialization error)
let db;
if (!getApps().length) {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
} else {
  db = getFirestore(app);
}

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

export { db, auth };
export default app;
