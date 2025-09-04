// returnBook.js
console.log("✅ returnBook.js loaded");

// Firebase
import { db, rtdb } from './firebase.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// đóng modal
window.closeReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "none";
};

/* ---------- helpers: tìm doc trong Firestore theo ID, nếu không có thì tìm theo field ---------- */
async function getFSRefOrNull(coll, id, fallbackField) {
  const byIdRef = doc(db, coll, id);
  const byIdSnap = await getDoc(byIdRef);
  if (byIdSnap.exists()) return byIdRef;

  if (fallbackField) {
    const q = query(collection(db, coll), where(fallbackField, "==", id));
    const qs = await getDocs(q);
    if (!qs.empty) return doc(db, coll, qs.docs[0].id);
  }
  return null;
}

/* -------------------------------- LOAD LIST (borrowed + status column) -------------------------------- */
async function loadReturnBookList() {
  const tableBody = document.getElementById("returnBookTableBody");
  tableBody.innerHTML = "";

  try {
    const snapshot = await get(ref(rtdb, "history")); // đọc 1 lần
    if (!snapshot.exists()) return;

    const all = snapshot.val();
    Object.keys(all).forEach((historyId) => {
      const h = all[historyId];

      const tr = document.createElement("tr");
      tr.id = "row-" + historyId;

      // Màu nhãn trạng thái
      let statusColor = "#ff9800"; // mặc định cho "Đang mượn"
      if (h.status === "Đã trả") statusColor = "#4CAF50";

      tr.innerHTML = `
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.studentName || ""}</td>
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.studentId || ""}</td>
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.bookName || ""}</td>
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.bookId || ""}</td>
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.borrowDate || ""}</td>
        <td style="padding:10px 8px;border:1px solid #ddd;">${h.returnDate || ""}</td>

        <!-- Cột Trạng thái -->
        <td style="padding:10px 8px;border:1px solid #ddd;text-align:center;">
          <span style="background:${statusColor};color:white;padding:2px 8px;border-radius:4px;">
            ${h.status}
          </span>
        </td>

        <!-- Cột Thao tác -->
        <td style="padding:10px 8px;border:1px solid #ddd;text-align:center;">
          ${
            h.status === "Đang mượn" || h.status === "Dang mượn"
              ? `<button onclick="returnBook('${historyId}','${(h.bookId||'').trim()}')"
                    style="background:linear-gradient(135deg,#B20000,#D32F2F);
                           color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">
                  Trả sách
                </button>`
              : `<span style="color:#4CAF50;font-weight:600;">✔ Đã trả</span>`
          }
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("❌ loadReturnBookList error:", err);
  }
}

// mở modal + load
window.openReturnBookForm = function () {
  document.getElementById("returnBookModal").style.display = "flex";
  loadReturnBookList();
};

/* ----------------------------------- RETURN BOOK ----------------------------------- */
window.returnBook = async function (historyId, rawBookId) {
  const bookId = (rawBookId || "").trim();
  if (!bookId) {
    alert("Không xác định được ID sách!");
    return;
  }

  try {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // 1) RTDB: history -> Đã trả
    await update(ref(rtdb, `history/${historyId}`), {
      status: "Đã trả",
      actualReturnDate: today
    });

    // 2) Firestore: history -> Đã trả (nếu có)
    try {
      const historyRefFS = await getFSRefOrNull("history", historyId, "historyId");
      if (historyRefFS) {
        await updateDoc(historyRefFS, { status: "Đã trả", actualReturnDate: today });
      } else {
        console.warn("⚠️ Không tìm thấy history trên Firestore với id:", historyId);
      }
    } catch (e) {
      console.warn("⚠️ Update Firestore(history) lỗi:", e.message);
    }

    // 3) RTDB: books -> Còn
    await update(ref(rtdb, `books/${bookId}`), { status: "Còn" });

    // 4) Firestore: books -> Còn (nếu có)
    try {
      const bookRefFS = await getFSRefOrNull("books", bookId, "bookId");
      if (bookRefFS) {
        await updateDoc(bookRefFS, { status: "Còn" });
      } else {
        console.warn("⚠️ Không tìm thấy book trên Firestore với id:", bookId);
      }
    } catch (e) {
      console.warn("⚠️ Update Firestore(books) lỗi:", e.message);
    }

    // 5) Cập nhật UI: xóa dòng
    const row = document.getElementById("row-" + historyId);
    if (row) row.remove();

    alert("✅ Trả sách thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi trả sách:", error);
    alert("Không thể trả sách: " + error.message);
  }
};
