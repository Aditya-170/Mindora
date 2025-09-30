import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAEp14I9gC0zg01uAWE02VXbkoOATI624",
  authDomain: "mindora-3e6a7.firebaseapp.com",
  projectId: "mindora-3e6a7",
  storageBucket: "mindora-3e6a7.firebasestorage.app",
  messagingSenderId: "264539332519",
  appId: "1:264539332519:web:f6bf7132ff4e4bc3ebe082",
  measurementId: "G-PPYXW5QRG9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };