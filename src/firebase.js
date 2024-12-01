// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVAMahSjdGGbSY5Zq6aY1oy9TCUrxG-PI",
  authDomain: "toukou-b7267.firebaseapp.com",
  projectId: "toukou-b7267",
  storageBucket: "toukou-b7267.firebasestorage.app",
  messagingSenderId: "867127987143",
  appId: "1:867127987143:web:cfca9c22359ddecf7067e2",
  measurementId: "G-HE70Q0FWTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {db, auth}