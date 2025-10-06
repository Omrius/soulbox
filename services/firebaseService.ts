// services/firebaseService.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Using the credentials you provided
const firebaseConfig = {
  apiKey: "AIzaSyB5kg-uqG9__ilJ3COVKj_nFxkapzaEUDw",
  authDomain: "soulbox-84566.firebaseapp.com",
  projectId: "soulbox-84566",
  storageBucket: "soulbox-84566.appspot.com",
  messagingSenderId: "931122177989",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance and Google provider for use in other parts of the app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
