// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (same as Firebase gave you)
const firebaseConfig = {
  apiKey: "AIzaSyAsWcwvR_d_n-pMeq3EI6ripltDCnodJCo",
  authDomain: "attendify-182fc.firebaseapp.com",
  projectId: "attendify-182fc",
  storageBucket: "attendify-182fc.firebasestorage.app",
  messagingSenderId: "578513225739",
  appId: "1:578513225739:web:bd9812d592a8ac779f1f0e",
  measurementId: "G-EHRB60EKF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
