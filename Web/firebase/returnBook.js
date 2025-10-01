// returnBook.js - Xử lý trả sách
console.log("✅ returnBook.js loaded");

import { db, rtdb } from './firebase.js';
import { collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Load danh sách sách đang mượn để trả
window.loadReturnBookList = async function() {
    try {
        console.log("📚 Đang tải danh sách sách cần trả...");
        
        // Load từ Firestore
        const historyRef = collection(db, "history");
        const q = query(historyRef, where("status", "==", "Đang mượn"));
        const querySnapshot = await getDocs(q);
        
        const borrowedBooks = [];
        querySnapshot.forEach((doc) => {
            borrowedBooks.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Đã tải ${borrowedBooks.length} cuốn sách đang mượn từ Firestore`);
        
        // Hiển thị danh sách
        displayReturnBookList(borrowedBooks);
        
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách sách cần trả:", error);
        
        // Fallback: Load từ Realtime Database
        try {
            console.log("🔄 Thử tải từ Realtime Database...");
            const historyRef = ref(rtdb, "history");
            onValue(historyRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const borrowedBooks = Object.keys(data)
                        .map(key => ({ id: key, ...data[key] }))
                        .filter(record => record.status === "Đang mượn");
                    
                    console.log(`✅ Đã tải ${borrowedBooks.length} cuốn sách đang mượn từ Realtime DB`);
                    displayReturnBookList(borrowedBooks);
                } else {
                    console.log("📭 Không có dữ liệu sách đang mượn");
                    displayReturnBookList([]);
                }
            });
        } catch (rtdbError) {
            console.error("❌ Lỗi Realtime Database:", rtdbError);
            displayReturnBookList([]);
        }
    }
};

// Hiển thị danh sách sách cần trả
function displayReturnBookList(books) {
    const tableBody = document.getElementById('returnBookTableBody');
    if (!tableBody) {
        console.warn("⚠️ Không tìm thấy returnBookTableBody element");
        return;
    }
    
    // Xóa nội dung cũ
    tableBody.innerHTML = '';
    
    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    📚 Không có sách nào đang được mượn
                </td>
            </tr>
        `;
        return;
    }
    
    // Hiển thị từng sách
    books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.style.cssText = `
            transition: all 0.3s ease;
        `;
        
        // Kiểm tra có quá hạn không
        const returnDate = new Date(book.returnDate);
        const today = new Date();
        const isOverdue = today > returnDate;
        
        row.innerHTML = `
            <td style="padding: 12px 8px; color: #333; font-weight: 500;">${book.studentName || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${book.studentId || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #333; font-weight: 500;">${book.bookName || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${book.bookId || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${formatDate(book.borrowDate) || 'N/A'}</td>
            <td style="padding: 12px 8px; color: ${isOverdue ? '#dc2626' : '#666'};">${formatDate(book.returnDate) || 'N/A'}</td>
            <td style="padding: 12px 8px;">
                <span style="
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: ${isOverdue ? '#fee2e2' : '#fef3c7'};
                    color: ${isOverdue ? '#991b1b' : '#92400e'};
                ">
                    ${isOverdue ? 'Quá hạn' : book.status || 'Đang mượn'}
                </span>
            </td>
            <td style="padding: 12px 8px; text-align: center;">
                <button onclick="processReturnBook('${book.id}', '${book.studentName}', '${book.bookName}')" 
                        style="
                            background: linear-gradient(135deg, #10b981, #34d399);
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 8px;
                            font-size: 0.85rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.3)'">
                    Trả sách
                </button>
            </td>
        `;
        
        // Thêm hover effect
        row.addEventListener('mouseenter', function() {
            this.style.background = '#f8fafc';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
        
        tableBody.appendChild(row);
    });
    
    console.log(`✅ Đã hiển thị ${books.length} cuốn sách cần trả`);
}

// Xử lý trả sách
window.processReturnBook = async function(historyId, studentName, bookName) {
    if (!confirm(`Xác nhận trả sách?\n\nSinh viên: ${studentName}\nSách: ${bookName}`)) {
        return;
    }
    
    try {
        console.log(`📚 Đang xử lý trả sách: ${historyId}`);
        
        // 1. Cập nhật trạng thái trong history
        const returnDate = new Date().toISOString().split('T')[0];
        
        // Firestore
        const historyDocRef = doc(db, "history", historyId);
        await updateDoc(historyDocRef, {
            status: "Đã trả",
            actualReturnDate: returnDate,
            updatedAt: new Date().toISOString()
        });
        
        // Realtime Database
        await update(ref(rtdb, `history/${historyId}`), {
            status: "Đã trả",
            actualReturnDate: returnDate,
            updatedAt: new Date().toISOString()
        });
        
        // 2. Cập nhật trạng thái sách về "Còn"
        // Cần lấy bookId từ history record
        const historyRef = ref(rtdb, `history/${historyId}`);
        onValue(historyRef, async (snapshot) => {
            if (snapshot.exists()) {
                const historyData = snapshot.val();
                const bookId = historyData.bookId;
                
                if (bookId) {
                    try {
                        // Firestore
                        const bookDocRef = doc(db, "books", bookId);
                        await updateDoc(bookDocRef, {
                            status: "Còn",
                            updatedAt: new Date().toISOString()
                        });
                        
                        // Realtime Database
                        await update(ref(rtdb, `books/${bookId}`), {
                            status: "Còn",
                            updatedAt: new Date().toISOString()
                        });
                        
                        console.log(`✅ Đã cập nhật trạng thái sách ${bookId} thành "Còn"`);
                    } catch (bookError) {
                        console.warn("⚠️ Không thể cập nhật trạng thái sách:", bookError);
                    }
                }
            }
        }, { once: true });
        
        // 3. Xóa khỏi user profile (nếu có)
        // Cần lấy studentId từ history record
        onValue(historyRef, async (snapshot) => {
            if (snapshot.exists()) {
                const historyData = snapshot.val();
                const studentId = historyData.studentId;
                const bookId = historyData.bookId;
                
                if (studentId && bookId) {
                    try {
                        // Xóa khỏi user profile trong Firestore
                        const userBookRef = doc(db, "users", studentId, "books", bookId);
                        await remove(ref(rtdb, `users/${studentId}/books/${bookId}`));
                        
                        console.log(`✅ Đã xóa sách khỏi profile sinh viên ${studentId}`);
                    } catch (userError) {
                        console.warn("⚠️ Không thể xóa sách khỏi profile sinh viên:", userError);
                    }
                }
            }
        }, { once: true });
        
        // Hiển thị thông báo thành công
        const successMessage = `✅ Trả sách thành công!\n\nSinh viên: ${studentName}\nSách: ${bookName}\nNgày trả: ${returnDate}`;
        alert(successMessage);
        
        // Reload danh sách
        loadReturnBookList();
        
        // Reload các danh sách khác nếu cần
        if (window.loadBookList) loadBookList();
        if (window.loadHistory) loadHistory();
        
    } catch (error) {
        console.error("❌ Lỗi khi trả sách:", error);
        alert("Không thể trả sách: " + error.message);
    }
};

// Format date từ string sang định dạng Việt Nam
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return dateString; // Trả về string gốc nếu không parse được
    }
}

// Load danh sách khi modal mở
window.openReturnBookForm = function() {
    const modal = document.getElementById('returnBookModal');
    if (modal) {
        modal.style.display = 'flex';
        loadReturnBookList();
    }
};

// Đóng modal
window.closeReturnBookForm = function() {
    const modal = document.getElementById('returnBookModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Load danh sách khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ load nếu đang ở trang Admin
    if (window.location.pathname.includes('Admin')) {
        console.log("🔍 Đang ở trang Admin, sẵn sàng load danh sách trả sách...");
    }
});

// Export functions
window.loadReturnBookList = loadReturnBookList;
window.processReturnBook = processReturnBook;
window.openReturnBookForm = openReturnBookForm;
window.closeReturnBookForm = closeReturnBookForm;