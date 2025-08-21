import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

window.onload = function () {
    const loginBtn = document.querySelector('.login .btn');

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Lấy dữ liệu từ form đăng nhập
        const email = document.getElementById('gmail1').value;  
        const password = document.getElementById('pass1').value;
        const roleLogin = document.getElementById('roleSelectlogin').value;

        if (!email || !password || !roleLogin) {
            alert("⚠️ Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            // Đăng nhập bằng email + password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Lấy dữ liệu từ Firestore (dùng uid làm document ID)
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log("User data:", userData);

                // So sánh vai trò đăng nhập và vai trò trong Firestore
                if (roleLogin === userData.role) {
                    alert("🎉 Đăng nhập thành công!");
                    // Điều hướng dựa theo vai trò
                    if (userData.role === "admin") {
                        window.location.href = "./Interface/Admin/index.html";
                    } else if (userData.role === "student") {
                        window.location.href = "./Interface/Student/index.html";
                    }
                } else {
                    alert("❌ Vai trò bạn chọn không khớp với tài khoản đã đăng ký!");
                }
            } else {
                alert("❌ Không tìm thấy dữ liệu người dùng trong Firestore!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            switch (error.code) {
                case "auth/user-not-found":
                    alert("❌ Tài khoản không tồn tại!");
                    break;
                case "auth/wrong-password":
                    alert("❌ Sai mật khẩu!");
                    break;
                case "auth/invalid-email":
                    alert("⚠️ Email không hợp lệ!");
                    break;
                default:
                    alert("❌ Lỗi đăng nhập: " + error.message);
                    break;
            }
        }
    });
};