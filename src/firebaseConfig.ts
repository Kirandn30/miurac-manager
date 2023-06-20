// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAaP25K-xy4-rtQRInnH1p-_1p4Y48YfRM",
    authDomain: "xcipher-7716d.firebaseapp.com",
    databaseURL: "https://xcipher-7716d-default-rtdb.firebaseio.com",
    projectId: "xcipher-7716d",
    storageBucket: "xcipher-7716d.appspot.com",
    messagingSenderId: "80142666545",
    appId: "1:80142666545:web:131da375dd9bac00ad7e10",
    measurementId: "G-N279BYY40R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
