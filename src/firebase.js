import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: "AIzaSyDUvK5Htpw9UD7FqspeuGC5idU0QEpB5Ek",
  authDomain: "gallery-app-45048.firebaseapp.com",
  databaseURL: "https://gallery-app-45048-default-rtdb.firebaseio.com",
  projectId: "gallery-app-45048",
  storageBucket: "gallery-app-45048.firebasestorage.app",
  messagingSenderId: "749093361442",
  appId: "1:749093361442:web:d56bc01a50f701fb6d777b",
  measurementId: "G-3Z3G602T20"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
