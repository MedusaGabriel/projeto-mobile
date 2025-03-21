import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL_oOLehC3Hg2uGZFGGk1xNmciTXTN2mY",
  authDomain: "mobile-app-4f386.firebaseapp.com",
  projectId: "mobile-app-4f386",
  storageBucket: "mobile-app-4f386.appspot.com",
  messagingSenderId: "398756342819",
  appId: "1:398756342819:web:6dba6fc3ca8f0d3f791596",
  measurementId: "G-M0NQ2EKCM6"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa o Firestore
const firestore = getFirestore(app);

export const db = getFirestore(app);

export { auth, firestore };