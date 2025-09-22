import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// These values are loaded from environment variables for security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAp7qUdeOeTYeGq9dh5jLYz9n4yL6iC4Gc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "credentials-manager-c45ea.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "credentials-manager-c45ea",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "credentials-manager-c45ea.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "399815943434",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:399815943434:web:4ed2164c280da1ead9c6f3",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-DDKJ0Q7GVV"
};

// Validate that all required config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
