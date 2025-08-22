// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";  // thêm Realtime DB

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCQHfCHYaNsrqF3WxnYXzBupYt1JepSAgE",
    authDomain: "nckh-61911.firebaseapp.com",
    databaseURL: "https://nckh-61911-default-rtdb.firebaseio.com",
    projectId: "nckh-61911",
    storageBucket: "nckh-61911.firebasestorage.app",
    messagingSenderId: "81447288463",
    appId: "1:81447288463:web:5448b1cfd69c5d60c77afa",
    measurementId: "G-S931M5BS81"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Realtime
export const rtdb = getDatabase(app);
  export {auth,db};