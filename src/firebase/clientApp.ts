// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYpWstrbTb1feUqnQV0kd5xpUSn3FCFKA",
  authDomain: "iipe-connect.firebaseapp.com",
  projectId: "iipe-connect",
  storageBucket: "iipe-connect.appspot.com",
  messagingSenderId: "534927994588",
  appId: "1:534927994588:web:20a157962fa456213b8e19",
  measurementId: "G-NK3W6TZE3Z"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };