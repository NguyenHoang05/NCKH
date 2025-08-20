// login.js

import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Đảm bảo thực thi sau khi DOM đã sẵn sàng
window.onload = function () {
  const loginBtn = document.querySelector('.login .btn');

  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form đăng nhập
    const emailOrUsername = document.getElementById('name1').value;
    const password = document.getElementById('pass1').value;

    // Kiểm tra rỗng
    if (!emailOrUsername || !password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      // Đăng nhập bằng email (ở đây mặc định là nhập email)
      const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername, password);
      const user = userCredential.user;

      alert("Đăng nhập thành công!");
      console.log("User:", user);

      // Sau này bạn có thể chuyển hướng:
      // window.location.href = "trangchu.html";

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      switch (error.code) {
        case "auth/user-not-found":
          alert("Tài khoản không tồn tại!");
          break;
        case "auth/wrong-password":
          alert("Sai mật khẩu!");
          break;
        case "auth/invalid-email":
          alert("Email không hợp lệ!");
          break;
        default:
          alert("Lỗi đăng nhập: " + error.message);
          break;
      }
    }
  });
};
