// frontend/src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRbAvcVqqDcnMGh8vqYrYSyMZSZZoPIFE",
  authDomain: "dikita-d79ee.firebaseapp.com",
  projectId: "dikita-d79ee",
  storageBucket: "dikita-d79ee.appspot.com",
  messagingSenderId: "1058984043957",
  appId: "1:1058984043957:web:f1e8364b95a5ae553665fc"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
