console.log("✅ returnBook.js loaded");

// Import config firebase
import { db, rtdb } from './firebase.js';
import { ref, update, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Hàm đóng modal
window.closeReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "none";
}

// Hàm mở modal + load danh sách
window.openReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "flex";
  loadReturnBookList();
}

// Load danh sách sách từ history (Realtime DB)
function loadReturnBookList() {
  const tableBody = document.getElementById("returnBookTableBody");
  const historyRef = ref(rtdb, "history");

  onValue(historyRef, (snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach((childSnap) => {
      const history = childSnap.val();
      const historyId = childSnap.key;

      // Render tất cả sách (không lọc trạng thái)
      const row = `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.studentName || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.studentId || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.bookName || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.bookId || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.borrowDate || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">${history.returnDate || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;">
            <span style="background:${history.status === "Đã trả" ? "#4CAF50" : "#ff9800"};
                         color:white;padding:2px 8px;border-radius:4px;">
              ${history.status}
            </span>
          </td>
          <td style="padding:10px 8px;border:1px solid #ddd;text-align:center;">
            ${
              history.status === "Đang mượn" || history.status === "Dang mượn"
                ? `<button onclick="returnBook('${historyId}', '${history.bookId}')" 
                    style="background:linear-gradient(135deg,#B20000,#D32F2F);
                           color:white;border:none;padding:6px 12px;border-radius:6px;
                           font-size:0.8rem;cursor:pointer;">
                    Trả sách
                  </button>`
                : `<span style="color:#4CAF50;font-weight:600;">✔ Đã trả</span>`
            }
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  });
}

// Hàm trả sách
window.returnBook = async function (historyId, bookId) {
  try {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // 1️⃣ Update history -> Đã trả
    await update(ref(rtdb, "history/" + historyId), { 
      status: "Đã trả",
      actualReturnDate: today
    });

    // 2️⃣ Update books -> Còn (Realtime DB)
    await update(ref(rtdb, "books/" + bookId), { status: "Còn" });

    // 3️⃣ Update books -> Còn (Firestore)
    await updateDoc(doc(db, "books", bookId), { status: "Còn" });

    alert("✅ Trả sách thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi trả sách:", error);
    alert("Không thể trả sách: " + error.message);
  }
}

// ⬇️ Auto load nếu modal đang mở sẵn
if (document.getElementById("returnBookModal").style.display === "flex") {
  loadReturnBookList();
}
