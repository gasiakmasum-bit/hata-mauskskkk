// =============================================================
// FIREBASE — спільна база даних для товарів і коментарів (Firestore)
// та сховище для фото товарів (Storage)
// =============================================================
// 1. Зайдіть на https://console.firebase.google.com
// 2. Створіть новий проєкт (безкоштовно, кредитна картка не потрібна)
// 3. У меню зліва: Build → Firestore Database → Create database
//    (оберіть режим "Start in test mode" для початку)
// 4. У меню зліва: Build → Storage → Get started
//    (теж "Start in test mode", щоб фото можна було завантажувати без входу)
// 5. У налаштуваннях проєкту (⚙ Project settings → General → Your apps)
//    натисніть "</>" (Web app), зареєструйте застосунок і скопіюйте
//    об'єкт firebaseConfig, який вам покажуть — вставте його значення нижче.
// =============================================================

import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Вмикаємо локальне (офлайн) кешування Firestore в IndexedDB.
// Завдяки цьому при повторному відкритті сайту дані спершу
// показуються миттєво з кешу браузера, а потім тихо оновлюються
// з сервера — без "довгого білого екрану" при кожному F5.
// Якщо браузер не підтримує IndexedDB (приватний режим тощо),
// падаємо назад на звичайний getFirestore, щоб сайт не зламався.
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (error) {
  console.warn("Офлайн-кеш Firestore недоступний, працюємо без нього:", error);
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

// Firebase Storage — сюди тепер завантажуються фото товарів
// (замість того, щоб зберігати їх як base64 прямо в документі Firestore).
export const storage = getStorage(app);
