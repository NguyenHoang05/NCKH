import { rtdb } from './firebase.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// ✅ Hàm load dữ liệu từ Realtime DB (Realtime update)
function loadBooks() {
  const tableBody = document.getElementById("booksBody");
  const booksRef = ref(rtdb, "books"); // Nhánh "books"

  // Lắng nghe thay đổi dữ liệu realtime
  onValue(booksRef, (snapshot) => {
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    if (snapshot.exists()) {
      const books = snapshot.val();

      Object.keys(books).forEach((bookId) => {
        const book = books[bookId];

        // Nếu chưa có status trong DB thì mặc định là "Còn"
        const status = book.status || "Còn";

        // Chọn màu theo status
        let statusColor = "#4caf50"; // xanh (Còn)
        if (status === "Đã mượn") {
          statusColor = "#f44336"; // đỏ
        }

        const row = `
          <tr style="border-bottom:1px solid #ddd;" 
              onmouseover="this.style.backgroundColor='#f8f9fa'" 
              onmouseout="this.style.backgroundColor='white'">
            <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.title}</td>
            <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${bookId}</td>
            <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.author}</td>
            <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.genre}</td>
            <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">
              <span style="background:${statusColor};color:white;padding:2px 8px;border-radius:4px;font-size:0.8rem;">${status}</span>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } else {
      tableBody.innerHTML = "<tr><td colspan='5'>Không có dữ liệu sách</td></tr>";
    }
  });
}

// ✅ Gọi hàm load khi vào trang
loadBooks();
