// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ Add storage

const firebaseConfig = {
  apiKey: "AIzaSyCoFuqrbjYrFDAlNUl07NecV4D3RXyaaHw",
  authDomain: "courseworkapp-48ee3.firebaseapp.com",
  projectId: "courseworkapp-48ee3",
  storageBucket: "courseworkapp-48ee3.appspot.com",
  messagingSenderId: "928258207707",
  appId: "1:928258207707:web:191f6d2e795a6b909441fe"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app); // ✅ Export Firestore
export const storage = getStorage(app);     // ✅ Export Storage
