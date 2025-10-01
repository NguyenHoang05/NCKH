console.log("✅ borrowed.js loaded");

import { db, rtdb } from '../../Web/firebase/firebase.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Load danh sách sách đã mượn
async function loadBorrowedBooks() {
    try {
        // Lấy ID user từ localStorage
        const userId = localStorage.getItem('iduser');
        if (!userId) {
            console.warn('Không tìm thấy ID user');
            return;
        }

        console.log('Loading borrowed books for user:', userId);

        // Load từ Firestore
        const borrowedBooks = await loadFromFirestore(userId);
        
        // Hiển thị dữ liệu
        displayBorrowedBooks(borrowedBooks);

    } catch (error) {
        console.error('Lỗi khi load sách đã mượn:', error);
    }
}

// Load từ Firestore
async function loadFromFirestore(userId) {
    try {
        const q = query(
            collection(db, "history"),
            where("studentId", "==", userId),
            where("status", "==", "Đang mượn"),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const books = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            books.push({
                id: doc.id,
                ...data
            });
        });
        
        console.log('Loaded books from Firestore:', books.length);
        return books;
        
    } catch (error) {
        console.error('Lỗi khi load từ Firestore:', error);
        return [];
    }
}

// Hiển thị danh sách sách đã mượn
function displayBorrowedBooks(books) {
    const tbody = document.getElementById('borrowedBooksTableBody');
    if (!tbody) {
        console.warn('Không tìm thấy tbody để hiển thị sách');
        return;
    }

    // Xóa nội dung cũ
    tbody.innerHTML = '';

    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                        <div style="font-size: 3rem;">📚</div>
                        <div style="font-size: 1.1rem;">Chưa có sách nào được mượn</div>
                        <div style="font-size: 0.9rem; color: #888;">
                            Sách đã mượn sẽ hiển thị ở đây
                        </div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    // Sắp xếp theo thứ tự mượn và ngày tạo
    books.sort((a, b) => {
        // Ưu tiên theo borrowOrder nếu có
        if (a.borrowOrder && b.borrowOrder) {
            return a.borrowOrder - b.borrowOrder;
        }
        // Nếu không có borrowOrder, sắp xếp theo createdAt
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Nhóm sách theo đợt mượn (cùng borrowDate)
    const groupedBooks = groupBooksByBorrowDate(books);

    groupedBooks.forEach((group, groupIndex) => {
        group.books.forEach((book, bookIndex) => {
            const row = createBookRow(book, groupIndex, bookIndex, group.books.length);
            tbody.appendChild(row);
        });
    });
}

// Nhóm sách theo ngày mượn
function groupBooksByBorrowDate(books) {
    const groups = {};
    
    books.forEach(book => {
        const borrowDate = book.borrowDate;
        if (!groups[borrowDate]) {
            groups[borrowDate] = {
                borrowDate: borrowDate,
                books: []
            };
        }
        groups[borrowDate].books.push(book);
    });
    
    // Chuyển thành array và sắp xếp theo ngày
    return Object.values(groups).sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
}

// Tạo row cho mỗi cuốn sách
function createBookRow(book, groupIndex, bookIndex, totalBooks) {
    const row = document.createElement('tr');
    
    // Màu sắc xen kẽ
    const isEven = (groupIndex + bookIndex) % 2 === 0;
    const rowStyle = isEven ? 'background: rgba(255,255,255,0.8)' : 'background: rgba(248,249,250,0.8)';
    
    // Tính toán số thứ tự
    const orderNumber = book.borrowOrder || (bookIndex + 1);
    
    // Kiểm tra trạng thái hết hạn
    const today = new Date();
    const returnDate = new Date(book.returnDate);
    const isOverdue = today > returnDate;
    
    // Màu trạng thái
    let statusColor = '#4CAF50'; // Màu xanh cho "Đang mượn"
    let statusText = 'Đang mượn';
    let statusIcon = '📖';
    
    if (isOverdue) {
        statusColor = '#f44336';
        statusText = 'Quá hạn';
        statusIcon = '⚠️';
    } else if (book.status === 'Đã trả') {
        statusColor = '#2196F3';
        statusText = 'Đã trả';
        statusIcon = '✅';
    }

    row.style.cssText = rowStyle;
    row.innerHTML = `
        <td style="padding: 16px 22px; text-align: center; font-weight: 600; color: #666; border-right: 1px solid rgba(0,0,0,0.1);">
            <div style="
                width: 32px; 
                height: 32px; 
                background: linear-gradient(135deg, #4d5bf9, #6a82fb); 
                color: white; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 0 auto;
                font-size: 0.9rem;
                font-weight: 600;
            ">
                ${orderNumber}
            </div>
        </td>
        <td style="padding: 16px 22px; text-align: left; color: #333; font-family: 'Courier New', monospace; font-weight: 500; border-right: 1px solid rgba(0,0,0,0.1);">
            ${book.bookId || 'N/A'}
        </td>
        <td style="padding: 16px 22px; text-align: left; color: #333; font-weight: 500; border-right: 1px solid rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">📚</span>
                <span>${book.bookName || 'N/A'}</span>
            </div>
        </td>
        <td style="padding: 16px 22px; text-align: center; color: #666; font-weight: 500; border-right: 1px solid rgba(0,0,0,0.1);">
            ${formatDate(book.borrowDate)}
        </td>
        <td style="padding: 16px 22px; text-align: center; color: #666; font-weight: 500; border-right: 1px solid rgba(0,0,0,0.1);">
            ${formatDate(book.returnDate)}
        </td>
        <td style="padding: 16px 22px; text-align: center; border-right: 1px solid rgba(0,0,0,0.1);">
            <span style="
                display: inline-flex; 
                align-items: center; 
                gap: 6px; 
                padding: 6px 12px; 
                border-radius: 20px; 
                background: ${statusColor}20; 
                color: ${statusColor}; 
                font-weight: 600; 
                font-size: 0.9rem;
                border: 1px solid ${statusColor}40;
            ">
                <span>${statusIcon}</span>
                <span>${statusText}</span>
            </span>
        </td>
    `;

    // Thêm hiệu ứng hover
    row.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(77, 91, 249, 0.1)';
        this.style.transform = 'translateX(4px)';
        this.style.transition = 'all 0.3s ease';
    });

    row.addEventListener('mouseleave', function() {
        this.style.background = rowStyle;
        this.style.transform = 'translateX(0)';
    });

    return row;
}

// Format ngày tháng
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
        return dateString;
    }
}

// Auto refresh mỗi 30 giây
function startAutoRefresh() {
    setInterval(() => {
        console.log('Auto refreshing borrowed books...');
        loadBorrowedBooks();
    }, 30000); // 30 giây
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing borrowed books...');
    
    // Load dữ liệu ban đầu
    loadBorrowedBooks();
    
    // Bắt đầu auto refresh
    startAutoRefresh();
});

// Export functions
window.loadBorrowedBooks = loadBorrowedBooks;
