// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// ไม่ต้องใช้ getAnalytics ถ้าใช้ React Native

const firebaseConfig = {
  apiKey: "AIzaSyDyVLGPRBlJsN_VxLsSOJDzj3fo_hUm6Vk",
  authDomain: "lapas-b11ae.firebaseapp.com",
  projectId: "lapas-b11ae",
  storageBucket: "lapas-b11ae.appspot.com", // ✅ แก้ตรงนี้
  messagingSenderId: "59195717358",
  appId: "1:59195717358:web:cf3f759f0079db716ca5ff",
  measurementId: "G-V9GH0LCGVH"
};

const app = initializeApp(firebaseConfig);

// ✅ Export app และ service ที่ต้องใช้
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
