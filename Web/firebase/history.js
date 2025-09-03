import { rtdb } from './firebase.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Hàm load lịch sử mượn trả
window.loadHistory = function () {
  const historyBody = document.getElementById("historyBody");
  const historyRef = ref(rtdb, "history");

  onValue(historyRef, (snapshot) => {
    historyBody.innerHTML = ""; // Clear cũ

    if (!snapshot.exists()) {
      historyBody.innerHTML = `
        <tr><td colspan="7" style="text-align:center;">Chưa có lịch sử nào</td></tr>
      `;
      return;
    }

    snapshot.forEach((childSnap) => {
      const item = childSnap.val();

      const row = `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.studentName || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.studentId || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.bookName || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.bookId || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.borrowDate || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${item.returnDate || ""}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">
            <span style="background:${item.status === "Đã trả" ? "#4caf50" : "#f44336"};color:white;padding:2px 8px;border-radius:4px;font-size:0.8rem;">
              ${item.status}
            </span>
          </td>
        </tr>
      `;
      historyBody.innerHTML += row;
    });
  });
};
