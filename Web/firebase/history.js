// history.js - Load lịch sử mượn trả từ Firebase
console.log("✅ history.js loaded");

import { db, rtdb } from './firebase.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Load lịch sử mượn trả
window.loadHistory = async function() {
    try {
        console.log("📚 Đang tải lịch sử mượn trả...");
        
        // Load từ Firestore
        const historyRef = collection(db, "history");
        const q = query(historyRef, orderBy("createdAt", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        
        const history = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Đã tải ${history.length} bản ghi lịch sử từ Firestore`);
        
        // Hiển thị lịch sử
        displayHistory(history);
        
    } catch (error) {
        console.error("❌ Lỗi khi tải lịch sử:", error);
        
        // Fallback: Load từ Realtime Database
        try {
            console.log("🔄 Thử tải từ Realtime Database...");
            const historyRef = ref(rtdb, "history");
            onValue(historyRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const history = Object.keys(data)
                        .map(key => ({ id: key, ...data[key] }))
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 100); // Giới hạn 100 bản ghi gần nhất
                    
                    console.log(`✅ Đã tải ${history.length} bản ghi lịch sử từ Realtime DB`);
                    displayHistory(history);
                } else {
                    console.log("📭 Không có dữ liệu lịch sử");
                    displayHistory([]);
                }
            });
        } catch (rtdbError) {
            console.error("❌ Lỗi Realtime Database:", rtdbError);
            displayHistory([]);
        }
    }
};

// Hiển thị lịch sử trong bảng
function displayHistory(history) {
    const tableBody = document.getElementById('historyBody');
    if (!tableBody) {
        console.warn("⚠️ Không tìm thấy historyBody element");
        return;
    }
    
    // Xóa nội dung cũ
    tableBody.innerHTML = '';
    
    if (history.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    📚 Không có lịch sử mượn trả nào
                </td>
            </tr>
        `;
        return;
    }
    
    // Hiển thị từng bản ghi lịch sử
    history.forEach((record, index) => {
        const row = document.createElement('tr');
        row.style.cssText = `
            transition: all 0.3s ease;
        `;
        
        // Xác định màu sắc trạng thái
        let statusColor, statusBg;
        switch(record.status) {
            case 'Đang mượn':
                statusColor = '#92400e';
                statusBg = '#fef3c7';
                break;
            case 'Đã trả':
                statusColor = '#065f46';
                statusBg = '#d1fae5';
                break;
            case 'Quá hạn':
                statusColor = '#991b1b';
                statusBg = '#fee2e2';
                break;
            default:
                statusColor = '#374151';
                statusBg = '#f3f4f6';
        }
        
        row.innerHTML = `
            <td style="padding: 12px 8px; color: #333; font-weight: 500;">${record.studentName || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${record.studentId || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #333; font-weight: 500;">${record.bookName || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${record.bookId || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${formatDate(record.borrowDate) || 'N/A'}</td>
            <td style="padding: 12px 8px; color: #666;">${formatDate(record.returnDate) || 'N/A'}</td>
            <td style="padding: 12px 8px;">
                <span style="
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: ${statusBg};
                    color: ${statusColor};
                ">
                    ${record.status || 'N/A'}
                </span>
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
    
    console.log(`✅ Đã hiển thị ${history.length} bản ghi lịch sử`);
}

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

// Load lịch sử khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ load nếu đang ở trang Admin
    if (window.location.pathname.includes('Admin')) {
        console.log("🔍 Đang ở trang Admin, load lịch sử...");
        // Không tự động load, chỉ load khi user click vào tab History
    }
});

// Export function để các file khác có thể gọi
window.loadHistory = loadHistory;