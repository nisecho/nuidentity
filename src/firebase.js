import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage from 'firebase/storage'
const cors = require('cors')({origin: true})
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPcAyHgyKJs93ZgP5OYi6T2evLFOm1GbQ",
    authDomain: "nuidentity-e370c.firebaseapp.com",
    projectId: "nuidentity-e370c",
    storageBucket: "nuidentity-e370c.appspot.com",
    messagingSenderId: "121945566678",
    appId: "1:121945566678:web:210dc443d19a1fdf8b4877"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Storage using getStorage

export { app, auth, firestore, storage }; // Export the initialized Storage instance along with other Firebase services
