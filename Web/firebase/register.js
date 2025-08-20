// ✅ Thêm dòng này để kiểm tra file đã thực thi chưa
console.log("✅ register.js loaded");

import {auth,db } from'./firebase.js';
import {  createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

//click đăng kí
document.getElementById('registersubmit').addEventListener('click', async (e) => {
  e.preventDefault(); // Ngăn form reload trang

//khai báo biến 
const username = document.getElementById('name2').value;
 const email = document.getElementById('email2').value;
 const iduser= document.getElementById('idname').value;
 const password = document.getElementById('pass2').value;
 
try {
    // Bước 1: Tạo tài khoản người dùng với email + password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Bước 2: Thêm thông tin người dùng vào Firestore
    await addDoc(collection(db, "users"), {
     // uid: user.uid,
      username: username,
      email: email,
      iduser: iduser,
      createdAt: new Date()
    });

    alert("Đăng ký thành công!");
  } catch (error) {
    alert("Lỗi đăng ký: " + error.message);
    console.error(error);
  }
});

