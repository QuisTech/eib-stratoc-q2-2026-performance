import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSO9tYRnxvW9P1N4d0xV9P_eRBrdFxskw",
  authDomain: "eib-lms.firebaseapp.com",
  projectId: "eib-lms",
  storageBucket: "eib-lms.firebasestorage.app",
  messagingSenderId: "998733093643",
  appId: "1:998733093643:web:b741908de91450f746e00e",
  measurementId: "G-QNJSWJ91Q9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
