// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Replace these values with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBXCTGzsfdaKUnRMko9vwAyRkO8yyHKsQs",
  authDomain: "quizcraft-a7d3d.firebaseapp.com",
  projectId: "quizcraft-a7d3d",
  storageBucket: "quizcraft-a7d3d.firebasestorage.app",
  messagingSenderId: "3553339082",
  appId: "1:3553339082:web:6d2bf4e9deb300f303b633",
  measurementId: "G-B43T1T4DMT"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export auth instance
export const auth = getAuth(app);
