// src/config/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsWcwvR_d_n-pMeq3EI6ripltDCnodJCo",
  authDomain: "attendify-182fc.firebaseapp.com",
  projectId: "attendify-182fc",
  storageBucket: "attendify-182fc.appspot.com",
  messagingSenderId: "578513225739",
  appId: "1:578513225739:web:bd9812d592a8ac779f1f0e",
  measurementId: "G-EHRB60EKF1"
};

// 👇 FIX: Only initialize if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
