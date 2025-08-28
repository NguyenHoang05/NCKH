import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js"; // import realtime
window.onload = function () {
    const loginBtn = document.querySelector('.login .btn');

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = document.getElementById('gmail1').value;
        const password = document.getElementById('pass1').value;
        const roleLogin = document.getElementById('roleSelectlogin').value;

        if (!email || !password || !roleLogin) {
            alert("⚠️ Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            // Đăng nhập bằng Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔎 Query Firestore để tìm user theo email
            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log("User data:", userData);

                // So sánh role
                if (roleLogin === userData.role) {
                    alert("🎉 Đăng nhập thành công!");

                    if (userData.role === "admin") {
    window.location.href = "../Interface/Admin/index.html";
}  else if (userData.role === "student") {
    // Lưu iduser để profile.js truy vấn DB
    localStorage.setItem("iduser", userData.iduser);

    window.location.href = "../Interface/Student/index.html";
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
