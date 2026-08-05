// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHyZ5GF3S8FthmkZDUxSoNfc-ZCDL3JDE",
  authDomain: "first-age.firebaseapp.com",
  projectId: "first-age",
  storageBucket: "first-age.firebasestorage.app",
  messagingSenderId: "419838242656",
  appId: "1:419838242656:web:fd1a5881651751c464f805"
};

const app = initializeApp(firebaseConfig);

// Подключаем базу данных
const db = getFirestore(app);

// Экспортируем
export { app, db };