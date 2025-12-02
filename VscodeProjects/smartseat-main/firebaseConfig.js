import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_l-jHpz0wbQLxZwLArF2ja4OOJ8W8yNM",
  //authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "dbtest-1c893",
  //storageBucket: "dbtest-1c893.firebasestorage.app",
  //messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:558657031819:android:d42be9fe340ec6c7c8ce8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
