// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "openestate-16f36.firebaseapp.com",
  projectId: "openestate-16f36",
  storageBucket: "openestate-16f36.appspot.com",
  messagingSenderId: "481780499058",
  appId: "1:481780499058:web:af5a725f756fa36fccf8eb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);