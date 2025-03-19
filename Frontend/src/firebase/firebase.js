// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI6WjKkaYaslkx6yME-YzX2hu_MG_YTu8",
  authDomain: "planner-e821a.firebaseapp.com",
  projectId: "planner-e821a",
  storageBucket: "planner-e821a.firebasestorage.app",
  messagingSenderId: "617836060013",
  appId: "1:617836060013:web:ec85588e5eecd505c68e64",
  measurementId: "G-5T31WYTMDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new googleProvider();

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, googleProvider, storage ,analytics };
