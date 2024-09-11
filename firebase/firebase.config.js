import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
};

initializeApp(firebaseConfig)
export const database = getDatabase()
export const provider = new GoogleAuthProvider()
export const auth = getAuth()