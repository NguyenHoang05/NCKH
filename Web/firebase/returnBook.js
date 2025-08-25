console.log("✅ returnBook.js loaded");

import { db, rtdb } from './firebase.js';
import { ref, update, onValue } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Hàm đóng modal
window.closeReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "none";
}

// Hàm mở modal + load danh sách đang mượn
window.openReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "flex";
  loadReturnBookList();
}

// Load danh sách sách đang mượn từ history (Realtime DB)
function loadReturnBookList() {
  const tableBody = document.getElementById("returnBookTableBody");
  const historyRef = ref(rtdb, "history");

 onValue(historyRef, (snapshot) => {
  tableBody.innerHTML = "";
  let hasData = false;

  snapshot.forEach((childSnap) => {
    const history = childSnap.val();
    const historyId = childSnap.key;

    console.log("📌 historyId:", historyId, "data:", history); // Debug

    if (history.status === "Đang mượn") {
      hasData = true;
      const row = `
        <tr>
          <td>${history.studentName || ""}</td>
          <td>${history.studentId || ""}</td>
          <td>${history.bookName || ""}</td>
          <td>${history.bookId || ""}</td>
          <td>${history.borrowDate || ""}</td>
          <td>${history.returnDate || ""}</td>
          <td>${history.status}</td>
          <td><button onclick="returnBook('${historyId}','${history.bookId}')">Trả sách</button></td>
        </tr>
      `;
      tableBody.innerHTML += row;
    }
  });

  if (!hasData) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center">Không có sách nào đang mượn</td>
      </tr>
    `;
  }
});
}


// Hàm trả sách
window.returnBook = async function (historyId, bookId) {
  try {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // 1️⃣ Update history -> Đã trả + ngày thực trả
    await update(ref(rtdb, "history/" + historyId), { 
      status: "Đã trả",
      actualReturnDate: today
    });

    // 2️⃣ Update books -> Còn
    await update(ref(rtdb, "books/" + bookId), { status: "Còn" });
    await updateDoc(doc(db, "books", bookId), { status: "Còn" });

    alert("✅ Trả sách thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi trả sách:", error);
    alert("Không thể trả sách: " + error.message);
  }
}
