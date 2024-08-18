import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config/firebase_config";
import { getStorage } from "firebase/storage";
import { connectAuthEmulator, getAuth } from "firebase/auth";

// Firebase 애플리케이션 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(firebaseApp);

// Firebase Storage 초기화
const storage = getStorage(firebaseApp);

// Firebase Authentication 초기화
const auth = getAuth(firebaseApp);

console.log(db, storage, auth);
export { db, storage, auth };