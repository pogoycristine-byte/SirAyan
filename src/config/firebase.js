// src/config/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsWcwvR_d_n-pMeq3EI6ripltDCnodJCo",
  authDomain: "attendify-182fc.firebaseapp.com",
  projectId: "attendify-182fc",
  storageBucket: "attendify-182fc.appspot.com",
  messagingSenderId: "578513225739",
  appId: "1:578513225739:web:bd9812d592a8ac779f1f0e",
  measurementId: "G-EHRB60EKF1"
};

// Initialize app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize or reuse Auth with AsyncStorage persistence
export const auth = (() => {
  try {
    // If an auth instance already exists, return it
    return getAuth(app);
  } catch (e) {
    // Otherwise initialize React Native auth with AsyncStorage persistence
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
})();

export const db = getFirestore(app);

export default app;
