// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeblYSBqarCJuDYzMuEY4v_cjeKSgWy3A",
  authDomain: "inventory-management-5f50a.firebaseapp.com",
  projectId: "inventory-management-5f50a",
  storageBucket: "inventory-management-5f50a.appspot.com",
  messagingSenderId: "175709676360",
  appId: "1:175709676360:web:0b4fdfbda4ebbbead3497d",
  measurementId: "G-PHTYPHLFCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore};