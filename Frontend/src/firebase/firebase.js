// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add this import
import { getStorage } from "firebase/storage"; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSgU_2fPJR-GH4S-32RsjQRls-QnNC1fM",
  authDomain: "hackoverflow-eduai.firebaseapp.com",
  projectId: "hackoverflow-eduai",
  storageBucket: "hackoverflow-eduai.firebasestorage.app",
  messagingSenderId: "246192601155",
  appId: "1:246192601155:web:5d910552a737bad5ad3cf6",
  measurementId: "G-GB1W8BD55N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Fix: Use GoogleAuthProvider instead of googleProvider

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, googleProvider, storage, analytics };
