import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these values with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAp7qUdeOeTYeGq9dh5jLYz9n4yL6iC4Gc",
  authDomain: "credentials-manager-c45ea.firebaseapp.com",
  projectId: "credentials-manager-c45ea",
  storageBucket: "credentials-manager-c45ea.firebasestorage.app",
  messagingSenderId: "399815943434",
  appId: "1:399815943434:web:4ed2164c280da1ead9c6f3",
  measurementId: "G-DDKJ0Q7GVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
