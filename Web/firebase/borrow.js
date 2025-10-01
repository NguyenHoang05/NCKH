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

// Hàm submit form mượn sách (hỗ trợ multiple books)
window.submitBorrowForm = async function (event) {
  event.preventDefault();

  // Lấy thông tin sinh viên
  const studentName = document.getElementById("studentName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const borrowDate = document.getElementById("borrowDate").value;
  const returnDate = document.getElementById("returnDate").value;

  // Lấy danh sách sách từ form
  const bookRows = document.querySelectorAll('.book-row');
  const books = [];
  
  bookRows.forEach((row, index) => {
    const bookId = row.querySelector('input[name="bookId"]').value.trim();
    const bookName = row.querySelector('input[name="bookName"]').value.trim();
    
    if (bookId && bookName) {
      books.push({
        bookId: bookId,
        bookName: bookName
      });
    }
  });

  // Validation
  if (!studentName || !studentId || !borrowDate || !returnDate) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin sinh viên!");
    return;
  }

  if (books.length === 0) {
    alert("⚠️ Vui lòng thêm ít nhất một cuốn sách!");
    return;
  }

  // Kiểm tra trùng lặp ID sách
  const bookIds = books.map(book => book.bookId);
  const uniqueBookIds = [...new Set(bookIds)];
  if (bookIds.length !== uniqueBookIds.length) {
    alert("⚠️ Không được mượn cùng một cuốn sách nhiều lần!");
    return;
  }

  try {
    // 🔥 Lấy thêm dữ liệu từ temp (student)
    const tempSnap = await get(ref(rtdb, "temp"));
    let extraData = {};
    if (tempSnap.exists()) {
      const temp = tempSnap.val();
      if (temp.student) {
        extraData.mssv = temp.student.mssv || "";
        extraData.email = temp.student.email || "";
      }
    }

    const results = [];
    const errors = [];

    // Xử lý từng cuốn sách
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      
      try {
        const historyId = `${studentId}_${book.bookId}_${borrowDate}_${i}`;
        
        const historyData = {
          studentName,
          studentId,
          bookId: book.bookId,
          bookName: book.bookName,
          borrowDate,
          returnDate,
          status: "Đang mượn",
          createdAt: new Date().toISOString(),
          borrowOrder: i + 1, // Thứ tự mượn sách
          totalBooks: books.length, // Tổng số sách mượn
          ...extraData
        };

        // 1️⃣ Lưu vào Firestore
        await setDoc(doc(db, "history", historyId), historyData);
        console.log(`✅ Firestore ghi thành công cho sách ${i + 1}!`);

        // 2️⃣ Lưu vào Realtime DB
        await set(ref(rtdb, "history/" + historyId), historyData);
        console.log(`✅ Realtime DB ghi thành công cho sách ${i + 1}!`);

        // 3️⃣ Update trạng thái sách
        try {
          await updateDoc(doc(db, "books", book.bookId), { status: "Đã mượn" });
          await update(ref(rtdb, "books/" + book.bookId), { status: "Đã mượn" });
          console.log(`✅ Cập nhật trạng thái sách ${book.bookId} thành công!`);
        } catch (err) {
          console.warn(`⚠️ Không tìm thấy sách ${book.bookId} trong books để update!`, err);
        }

        // 4️⃣ Thêm sách vào user profile
        try {
          await setDoc(doc(db, "users", studentId, "books", book.bookId), {
            bookName: book.bookName,
            borrowDate,
            returnDate,
            status: "Đang mượn",
            borrowOrder: i + 1
          });
          console.log(`✅ Đã lưu sách ${book.bookId} vào user profile!`);
        } catch (err) {
          console.error(`❌ Lỗi khi lưu sách ${book.bookId} vào user profile:`, err);
        }

        results.push({
          bookId: book.bookId,
          bookName: book.bookName,
          success: true
        });

      } catch (error) {
        console.error(`❌ Lỗi khi xử lý sách ${book.bookId}:`, error);
        errors.push({
          bookId: book.bookId,
          bookName: book.bookName,
          error: error.message
        });
      }
    }

    // 5️⃣ Xóa temp sau khi hoàn thành
    await remove(ref(rtdb, "temp"));
    console.log("🗑️ Đã xóa temp sau khi mượn!");

    // Hiển thị kết quả
    let successMessage = `📚 Mượn sách thành công!\n\nThông tin sinh viên:\n- Tên: ${studentName}\n- ID Sinh Viên: ${studentId}\n- Ngày mượn: ${borrowDate}\n- Ngày trả: ${returnDate}\n\nSách đã mượn (${results.length}/${books.length}):\n`;
    
    results.forEach((result, index) => {
      successMessage += `${index + 1}. ${result.bookName} (ID: ${result.bookId})\n`;
    });

    if (errors.length > 0) {
      successMessage += `\n⚠️ Lỗi khi mượn:\n`;
      errors.forEach((error, index) => {
        successMessage += `${index + 1}. ${error.bookName} (ID: ${error.bookId}): ${error.error}\n`;
      });
    }

    alert(successMessage);
    
    // Reset form và đóng modal
    document.getElementById("borrowForm").reset();
    if (window.closeBorrowForm) {
      closeBorrowForm();
    }
    
    // Reload danh sách sách nếu đang ở trang List
    if (window.loadBookList) {
        loadBookList();
    }

  } catch (error) {
    console.error("❌ Lỗi tổng thể khi mượn sách:", error);
    alert("Không thể mượn sách: " + error.message);
  }
};

