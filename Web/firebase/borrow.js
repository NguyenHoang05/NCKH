console.log("✅ borrow.js loaded");

import { db, rtdb } from './firebase.js';
import { doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, set, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Hàm đóng modal
window.closeBorrowForm = function () {
  document.getElementById("borrowModal").style.display = "none";
}

// Hàm mở modal
window.openBorrowForm = function () {
  document.getElementById("borrowModal").style.display = "flex";
}

// Hàm submit form mượn sách
window.submitBorrowForm = async function (event) {
  event.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const bookId = document.getElementById("bookId").value.trim();
  const bookName = document.getElementById("bookNameBorrow").value.trim();
  const borrowDate = document.getElementById("borrowDate").value;
  const returnDate = document.getElementById("returnDate").value;

  if (!studentName || !studentId || !bookId || !bookName || !borrowDate || !returnDate) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    const historyId = `${studentId}_${bookId}`;

    // 1️⃣ Lưu vào Firestore
    await setDoc(doc(db, "history", historyId), {
      studentName,
      studentId,
      bookId,
      bookName,
      borrowDate,
      returnDate,
      status: "Đang mượn",
      createdAt: new Date()
    });
    console.log("✅ Firestore ghi thành công!");

    // 2️⃣ Lưu vào Realtime Database
    await set(ref(rtdb, "history/" + historyId), {
      studentName,
      studentId,
      bookId,
      bookName,
      borrowDate,
      returnDate,
      status: "Đang mượn",
      createdAt: new Date().toISOString()
    });
    console.log("✅ Realtime DB ghi thành công!");

    // 3️⃣ Update trạng thái sách (nếu tồn tại bookId trong books)
    try {
      await updateDoc(doc(db, "books", bookId), { status: "Đã mượn" });
      await update(ref(rtdb, "books/" + bookId), { status: "Đã mượn" });
      console.log("✅ Cập nhật trạng thái sách thành công!");
    } catch (err) {
      console.warn("⚠️ Không tìm thấy sách trong books để update!", err);
    }

    alert("📚 Mượn sách thành công!");
    document.getElementById("borrowForm").reset();
    closeBorrowForm();

  } catch (error) {
    console.error("❌ Lỗi khi mượn sách:", error);
    alert("Không thể mượn sách: " + error.message);
  }
};
