// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgMiBgI52dN8_C9ijcL0qN6Y4Pv5azzRw",
  authDomain: "sentinel-fuel-195f0.firebaseapp.com",
  projectId: "sentinel-fuel-195f0",
  storageBucket: "sentinel-fuel-195f0.appspot.com",
  messagingSenderId: "554038089279",
  appId: "1:554038089279:web:c47e82a80020c44d1d8a8a",
  measurementId: "G-2VRRKG18V3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

export { db, storage };

// Initialize auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
});
