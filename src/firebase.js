import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const cors = require('cors')({origin: true})
const firebaseConfig = {
    apiKey: "AIzaSyDPcAyHgyKJs93ZgP5OYi6T2evLFOm1GbQ",
    authDomain: "nuidentity-e370c.firebaseapp.com",
    projectId: "nuidentity-e370c",
    storageBucket: "nuidentity-e370c.appspot.com",
    messagingSenderId: "121945566678",
    appId: "1:121945566678:web:210dc443d19a1fdf8b4877"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage }; ces
