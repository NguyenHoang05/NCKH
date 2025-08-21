console.log("✅ register.js loaded");

import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// click nút đăng kí
document.getElementById('registersubmit').addEventListener('click', async (e) => {
  e.preventDefault(); // Ngăn reload trang

  // lấy dữ liệu từ form
  const username = document.getElementById('name2').value;
  const mssv = document.getElementById('mssv2').value;
  const email = document.getElementById('email2').value;
  const iduser = document.getElementById('idname').value;
  const password = document.getElementById('pass2').value;
  const role = document.getElementById('roleSelectregister').value;

  if (!username || !mssv || !email || !iduser || !password || !role) {
    alert("⚠️ Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    // B1: Tạo tài khoản Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // B2: Lưu thông tin vào Firestore (dùng iduser làm id doc)
await setDoc(doc(db, "users", iduser), {
  username: username,
  mssv: mssv,
  email: email,
  iduser: iduser,
  role: role,
  createdAt: new Date(),
  //uid: user.uid   // vẫn lưu thêm uid để sau này tra ngược được
});


    alert("🎉 Đăng ký thành công!");
    console.log("User registered:", user);

  } catch (error) {
    alert("❌ Lỗi đăng ký: " + error.message);
    console.error(error);
  }
});
