// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGA76Ts_51KAFItYa-HrwV26gHxbp69Ws",
  authDomain: "mybiglibrary-f9988.firebaseapp.com",
  projectId: "mybiglibrary-f9988",
  storageBucket: "mybiglibrary-f9988.firebasestorage.app",
  messagingSenderId: "841203291050",
  appId: "1:841203291050:web:1e061841630d5b5d63d1d3",
  measurementId: "G-BBKVYTGTWY"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Xuất đối tượng Firestore ra ngoài để file khác dùng
export const db = getFirestore(app);
