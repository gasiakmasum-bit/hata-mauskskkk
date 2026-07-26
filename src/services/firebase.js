// =============================================================
// FIREBASE — спільна база даних для коментарів (Firestore)
// =============================================================
// 1. Зайдіть на https://console.firebase.google.com
// 2. Створіть новий проєкт (безкоштовно, кредитна картка не потрібна)
// 3. У меню зліва: Build → Firestore Database → Create database
//    (оберіть режим "Start in test mode" для початку)
// 4. У налаштуваннях проєкту (⚙ Project settings → General → Your apps)
//    натисніть "</>" (Web app), зареєструйте застосунок і скопіюйте
//    об'єкт firebaseConfig, який вам покажуть — вставте його значення нижче.
// =============================================================

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgfQ_7dqTsC1e6hkHTz7EM-IM3JBAGM3k",
  authDomain: "maxim-77f3a.firebaseapp.com",
  projectId: "maxim-77f3a",
  storageBucket: "maxim-77f3a.firebasestorage.app",
  messagingSenderId: "205447195828",
  appId: "1:205447195828:web:b1b789cbb37359ce213be1",
  measurementId: "G-CRP0WG28KG",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
