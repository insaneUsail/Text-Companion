import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCBqfn5rqcCGXoRmgMb_KupAtgcFMhBykI",
  authDomain: "textcompanion-7e54b.firebaseapp.com",
  projectId: "textcompanion-7e54b",
  storageBucket: "textcompanion-7e54b.firebasestorage.app",
  messagingSenderId: "242919754906",
  appId: "1:242919754906:web:2ac577bd37dcd103e2e323",
  measurementId: "G-BZCZBC56YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);