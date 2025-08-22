import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Hàm load dữ liệu từ Firestore
async function loadBooks() {
  const tableBody = document.getElementById("booksBody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ

  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((docSnap) => {
      const book = docSnap.data();

      // Nếu chưa có status trong DB thì mặc định là "Còn"
      const status = book.status || "Còn"; 

      // Chọn màu theo status
      let statusColor = "#4caf50"; // mặc định xanh (Còn)
      if (status === "đã mượn") {
        statusColor = "#f44336"; // đỏ
      }

      const row = `
        <tr style="border-bottom:1px solid #ddd;" 
            onmouseover="this.style.backgroundColor='#f8f9fa'" 
            onmouseout="this.style.backgroundColor='white'">
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.title}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${docSnap.id}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.author}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">${book.genre}</td>
          <td style="padding:10px 8px;border:1px solid #ddd;font-size:0.85rem;">
            <span style="background:${statusColor};color:white;padding:2px 8px;border-radius:4px;font-size:0.8rem;">${status}</span>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("❌ Lỗi khi load sách:", error);
  }
}

// ✅ Gọi hàm load khi vào trang
loadBooks();
