// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmPp3uBqmk6zmaIB00za18L6l9ZIpXXs4",
  authDomain: "running-goals-da9e5.firebaseapp.com",
  projectId: "running-goals-da9e5",
  storageBucket: "running-goals-da9e5.appspot.com",
  messagingSenderId: "770918041276",
  appId: "1:770918041276:web:0ce113f315729cebd5f2b9",
  measurementId: "G-TDNRZP3CXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
