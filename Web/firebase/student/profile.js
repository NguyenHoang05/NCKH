import { rtdb } from '.././firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Hàm load profile sinh viên
async function loadStudentProfile() {
  try {
    // Lấy iduser từ localStorage
    const iduser = localStorage.getItem("iduser");
    if (!iduser) {
      alert("❌ Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại!");
      window.location.href = "../../index.html";
      return;
    }

    // Truy vấn Realtime Database theo iduser
    const studentRef = ref(rtdb, "users/" + iduser);
    const snapshot = await get(studentRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Hiển thị dữ liệu
      document.getElementById("studentName").innerText = data.username || "Chưa có tên";
      document.getElementById("studentId").innerText = data.mssv || "Chưa có MSSV";   // hiển thị mssv
      document.getElementById("studentClass").innerText = data.class || "Chưa có lớp";
      document.getElementById("studentStatus").innerText = "Đang hoạt động";
    } else {
      alert("❌ Không tìm thấy dữ liệu sinh viên!");
    }
  } catch (error) {
    console.error("Lỗi load profile:", error);
    alert("❌ Lỗi khi tải thông tin sinh viên!");
  }
}

// Gọi hàm khi load trang
window.onload = loadStudentProfile;
