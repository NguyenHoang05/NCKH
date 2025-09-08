console.log("✅ borrow.js loaded");

import { db, rtdb } from './firebase.js';
import { doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, set, update, onValue, remove ,get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Hàm đóng modal
window.closeBorrowForm = function () {
  document.getElementById("borrowModal").style.display = "none";
}

// Hàm mở modal
window.openBorrowForm = function () {
  document.getElementById("borrowModal").style.display = "flex";

  // 🔥 Theo dõi realtime temp → tự điền form khi có thay đổi
  const tempRef = ref(rtdb, "temp");
  onValue(tempRef, (snapshot) => {
    if (snapshot.exists()) {
      const temp = snapshot.val();

      // Lấy dữ liệu student
      if (temp.student) {
        document.getElementById("studentName").value = temp.student.username || "";
        document.getElementById("studentId").value = temp.student.iduser || "";
      }

      // Lấy dữ liệu book
      if (temp.book) {
        document.getElementById("bookId").value = temp.book.id || "";
        document.getElementById("bookNameBorrow").value = temp.book.title || "";
      }
    }
  });
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
    // 🔥 Lấy thêm dữ liệu từ temp (student + book)
    const tempSnap = await get(ref(rtdb, "temp"));
    let extraData = {};
    if (tempSnap.exists()) {
      const temp = tempSnap.val();
      if (temp.student) {
        extraData.mssv = temp.student.mssv || "";
        extraData.email = temp.student.email || "";
      }
      if (temp.book) {
        extraData.statusBook = temp.book.status || "Còn"; 
      }
    }

    const historyId = `${studentId}_${bookId}_${borrowDate}`;

    const historyData = {
      studentName,
      studentId,
      bookId,
      bookName,
      borrowDate,
      returnDate,
      status: "Đang mượn",      // trạng thái mượn
      createdAt: new Date().toISOString(),
      ...extraData              // gộp thêm mssv, email, statusBook
    };

    // 1️⃣ Lưu vào Firestore
    await setDoc(doc(db, "history", historyId), historyData);
    console.log("✅ Firestore ghi thành công!");

    // 2️⃣ Lưu vào Realtime DB
    await set(ref(rtdb, "history/" + historyId), historyData);
    console.log("✅ Realtime DB ghi thành công!");

    // 3️⃣ Update trạng thái sách (books)
    try {
      await updateDoc(doc(db, "books", bookId), { status: "Đã mượn" });
      await update(ref(rtdb, "books/" + bookId), { status: "Đã mượn" });
      console.log("✅ Cập nhật trạng thái sách thành công!");
    } catch (err) {
      console.warn("⚠️ Không tìm thấy sách trong books để update!", err);
    }

    // 🔥 4️⃣ Thêm sách vào nhánh books trong user (Firestore)
try {
  await setDoc(doc(db, "users", studentId, "books", bookId), {
    bookName,
    borrowDate,
    returnDate,
    status: "Đang mượn"
  });
  console.log("✅ Đã lưu sách vào user profile!");
} catch (err) {
  console.error("❌ Lỗi khi lưu vào user profile:", err);
}

    // 4️⃣ Xóa temp để chuẩn bị cho lần quét mới
    await remove(ref(rtdb, "temp"));
    console.log("🗑️ Đã xóa temp sau khi mượn!");

    alert("📚 Mượn sách thành công!");
    document.getElementById("borrowForm").reset();
    closeBorrowForm();

  } catch (error) {
    console.error("❌ Lỗi khi mượn sách:", error);
    alert("Không thể mượn sách: " + error.message);
  }
};

