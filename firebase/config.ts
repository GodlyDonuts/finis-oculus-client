import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read variables from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyCizoMwr4G4_D2-1xc7QPmUSIr_wEFFkFM",
  authDomain: "finis-oculus.firebaseapp.com",
  projectId: "finis-oculus",
  storageBucket: "finis-oculus.firebasestorage.app",
  messagingSenderId: "682539331216",
  appId: "1:682539331216:web:96ccff82c1f6c1a3a6b215"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);