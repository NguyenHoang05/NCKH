// listbook.js - Load danh sách sách từ Firebase
console.log("✅ listbook.js loaded");

import { db, rtdb } from './firebase.js';
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Load danh sách sách còn (available books)
window.loadBookList = async function() {
    try {
        console.log("📚 Đang tải danh sách sách...");
        
        // Load từ Firestore
        const booksRef = collection(db, "books");
        const q = query(booksRef, where("status", "==", "Còn"), orderBy("title"));
        const querySnapshot = await getDocs(q);
        
        const books = [];
        querySnapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Đã tải ${books.length} cuốn sách từ Firestore`);
        
        // Hiển thị danh sách sách
        displayBooks(books);
        
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách sách:", error);
        
        // Fallback: Load từ Realtime Database
        try {
            console.log("🔄 Thử tải từ Realtime Database...");
            const booksRef = ref(rtdb, "books");
            onValue(booksRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const books = Object.keys(data)
                        .map(key => ({ id: key, ...data[key] }))
                        .filter(book => book.status === "Còn");
                    
                    console.log(`✅ Đã tải ${books.length} cuốn sách từ Realtime DB`);
                    displayBooks(books);
                } else {
                    console.log("📭 Không có dữ liệu sách");
                    displayBooks([]);
                }
            });
        } catch (rtdbError) {
            console.error("❌ Lỗi Realtime Database:", rtdbError);
            displayBooks([]);
        }
    }
};

// Hiển thị danh sách sách trong bảng
function displayBooks(books) {
    const tableBody = document.getElementById('booksBody');
    if (!tableBody) {
        console.warn("⚠️ Không tìm thấy booksBody element");
        return;
    }
    
    // Xóa nội dung cũ
    tableBody.innerHTML = '';
    
    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    📚 Không có sách nào trong thư viện
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
            cursor: pointer;
        `;
        
        row.innerHTML = `
            <td style="padding: 12px 8px; color: #333; font-weight: 500;">${book.title || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${book.id || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${book.author || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${book.genre || 'N/A'}</td>
            <td style="padding: 12px 8px;">
                <span style="
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: #d1fae5;
                    color: #065f46;
                ">
                    ${book.status || 'Còn'}
                </span>
            </td>
        `;
        
        // Thêm hover effect
        row.addEventListener('mouseenter', function() {
            this.style.background = '#f8fafc';
            this.style.transform = 'translateX(5px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.transform = 'translateX(0)';
        });
        
        // Thêm click event để mượn sách nhanh
        row.addEventListener('click', function() {
            quickBorrowBook(book);
        });
        
        tableBody.appendChild(row);
    });
    
    console.log(`✅ Đã hiển thị ${books.length} cuốn sách`);
}

// Mượn sách nhanh khi click vào dòng
function quickBorrowBook(book) {
    if (confirm(`Bạn có muốn mượn sách "${book.title}" không?`)) {
        // Mở modal mượn sách và điền thông tin sách
        if (window.openBorrowForm) {
            openBorrowForm();
            
            // Điền thông tin sách
            setTimeout(() => {
                const bookIdInput = document.getElementById('bookId');
                const bookNameInput = document.getElementById('bookNameBorrow');
                
                if (bookIdInput) bookIdInput.value = book.id;
                if (bookNameInput) bookNameInput.value = book.title;
                
                // Focus vào ô tên sinh viên
                const studentNameInput = document.getElementById('studentName');
                if (studentNameInput) studentNameInput.focus();
            }, 100);
        }
    }
}

// Load danh sách sách khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ load nếu đang ở trang Admin
    if (window.location.pathname.includes('Admin')) {
        console.log("🔍 Đang ở trang Admin, load danh sách sách...");
        loadBookList();
    }
});

// Export function để các file khác có thể gọi
window.loadBookList = loadBookList;