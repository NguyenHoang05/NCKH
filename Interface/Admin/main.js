// Admin Interface Main JavaScript
// Xử lý các chức năng chính của giao diện Admin

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin interface loaded');
    initializeAdminInterface();
});

// Khởi tạo giao diện Admin
function initializeAdminInterface() {
    // Thiết lập navigation
    setupNavigation();
    
    // Load dữ liệu ban đầu
    loadInitialData();
    
    // Thiết lập event listeners
    setupEventListeners();
}

// Thiết lập navigation
function setupNavigation() {
    const listItems = document.querySelectorAll('.list');
    
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Xóa active class từ tất cả items
            listItems.forEach(li => li.classList.remove('active'));
            
            // Thêm active class cho item được click
            this.classList.add('active');
            
            // Hiển thị section tương ứng
            const title = this.querySelector('.title').textContent.trim();
            showSection(title);
        });
    });
    
    // Mặc định kích hoạt Home
    if (listItems.length > 0) {
        listItems[0].classList.add('active');
        showSection('Home');
    }
}

// Hiển thị section tương ứng
function showSection(sectionName) {
    // Ẩn tất cả sections
    const sections = [
        'homeSection', 'historySection', 'listSection', 
        'analysisSection', 'helpSection', 'passwordSection', 'signoutSection'
    ];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Hiển thị section được chọn
    let targetSectionId = '';
    switch(sectionName) {
        case 'Home':
            targetSectionId = 'homeSection';
            break;
        case 'History':
            targetSectionId = 'historySection';
            loadHistory();
            break;
        case 'List':
            targetSectionId = 'listSection';
            loadBookList();
            break;
        case 'Analysis':
            targetSectionId = 'analysisSection';
            loadAnalysis();
            break;
        case 'Help':
            targetSectionId = 'helpSection';
            break;
        case 'Password':
            targetSectionId = 'passwordSection';
            break;
        case 'Sign out':
            targetSectionId = 'signoutSection';
            updateCurrentTime();
            break;
        default:
            targetSectionId = 'homeSection';
    }
    
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Thiết lập event listeners
function setupEventListeners() {
    // Event listeners cho các form
    setupFormListeners();
    
    // Event listeners cho các modal
    setupModalListeners();
    
    // Event listeners cho các nút
    setupButtonListeners();
}

// Thiết lập form listeners
function setupFormListeners() {
    // Form mượn sách
    const borrowForm = document.getElementById('borrowForm');
    if (borrowForm) {
        borrowForm.addEventListener('submit', handleBorrowSubmit);
    }
    
    // Form thêm sách
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleAddBookSubmit);
    }
    
    // Form đổi mật khẩu
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Thiết lập modal listeners
function setupModalListeners() {
    // Modal mượn sách
    const borrowModal = document.getElementById('borrowModal');
    if (borrowModal) {
        borrowModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBorrowForm();
            }
        });
    }
    
    // Modal thêm sách
    const addBookModal = document.getElementById('addBookModal');
    if (addBookModal) {
        addBookModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddBookForm();
            }
        });
    }
    
    // Modal trả sách
    const returnBookModal = document.getElementById('returnBookModal');
    if (returnBookModal) {
        returnBookModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeReturnBookForm();
            }
        });
    }
}

// Thiết lập button listeners
function setupButtonListeners() {
    // Nút toggle password visibility
    const passwordToggles = document.querySelectorAll('[onclick^="togglePasswordVisibility"]');
    passwordToggles.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            togglePasswordVisibility(inputId);
        });
    });
}

// Xử lý submit form mượn sách
function handleBorrowSubmit(event) {
    event.preventDefault();
    
    // Lấy thông tin sinh viên
    const studentInfo = {
        studentName: document.getElementById('studentName').value,
        studentId: document.getElementById('studentId').value,
        borrowDate: document.getElementById('borrowDate').value,
        returnDate: document.getElementById('returnDate').value
    };
    
    // Lấy danh sách sách
    const books = getBooksFromForm();
    
    const formData = {
        ...studentInfo,
        books: books
    };
    
    // Validate form data
    if (!validateBorrowForm(formData)) {
        return;
    }
    
    // Gửi dữ liệu lên Firebase
    submitBorrowToFirebase(formData);
}

// Lấy danh sách sách từ form
function getBooksFromForm() {
    const bookRows = document.querySelectorAll('.book-row');
    const books = [];
    
    bookRows.forEach(row => {
        const bookId = row.querySelector('input[name="bookId"]').value.trim();
        const bookName = row.querySelector('input[name="bookName"]').value.trim();
        
        if (bookId && bookName) {
            books.push({
                bookId: bookId,
                bookName: bookName
            });
        }
    });
    
    return books;
}

// Xử lý submit form thêm sách
function handleAddBookSubmit(event) {
    event.preventDefault();
    
    const formData = {
        bookName: document.getElementById('bookName').value,
        bookId: document.getElementById('bookIdAdd').value,
        bookAuthor: document.getElementById('bookAuthor').value,
        bookGenre: document.getElementById('bookGenre').value,
        bookShelf: document.getElementById('bookShelf').value
    };
    
    // Validate form data
    if (!validateAddBookForm(formData)) {
        return;
    }
    
    // Gửi dữ liệu lên Firebase (sẽ được implement sau)
    submitAddBookToFirebase(formData);
}

// Xử lý đổi mật khẩu
function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password change
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
        return;
    }
    
    // Cập nhật mật khẩu (sẽ được implement sau)
    updatePasswordInFirebase(currentPassword, newPassword);
}

// Validate form mượn sách
function validateBorrowForm(data) {
    // Kiểm tra thông tin sinh viên
    if (!data.studentName || !data.studentId) {
        showAlert('Vui lòng điền đầy đủ thông tin sinh viên!', 'error');
        return false;
    }
    
    // Kiểm tra ngày tháng
    if (data.borrowDate >= data.returnDate) {
        showAlert('Ngày trả phải sau ngày mượn!', 'error');
        return false;
    }
    
    // Kiểm tra danh sách sách
    if (!data.books || data.books.length === 0) {
        showAlert('Vui lòng thêm ít nhất một cuốn sách!', 'error');
        return false;
    }
    
    // Kiểm tra từng cuốn sách
    for (let i = 0; i < data.books.length; i++) {
        const book = data.books[i];
        if (!book.bookId || !book.bookName) {
            showAlert(`Vui lòng điền đầy đủ thông tin cho sách thứ ${i + 1}!`, 'error');
            return false;
        }
    }
    
    // Kiểm tra trùng lặp ID sách
    const bookIds = data.books.map(book => book.bookId);
    const uniqueBookIds = [...new Set(bookIds)];
    if (bookIds.length !== uniqueBookIds.length) {
        showAlert('Không được mượn cùng một cuốn sách nhiều lần!', 'error');
        return false;
    }
    
    return true;
}

// Validate form thêm sách
function validateAddBookForm(data) {
    if (!data.bookName || !data.bookId || !data.bookAuthor || !data.bookGenre || !data.bookShelf) {
        showAlert('Vui lòng điền đầy đủ thông tin!', 'error');
        return false;
    }
    
    return true;
}

// Validate đổi mật khẩu
function validatePasswordChange(current, newPass, confirm) {
    if (!current || !newPass || !confirm) {
        showAlert('Vui lòng điền đầy đủ thông tin!', 'error');
        return false;
    }
    
    if (newPass !== confirm) {
        showAlert('Mật khẩu xác nhận không khớp!', 'error');
        return false;
    }
    
    if (newPass.length < 8) {
        showAlert('Mật khẩu mới phải có ít nhất 8 ký tự!', 'error');
        return false;
    }
    
    return true;
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'Icon');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.name = 'eye-off-outline';
        } else {
            input.type = 'password';
            icon.name = 'eye-outline';
        }
    }
}

// Load dữ liệu ban đầu
function loadInitialData() {
    // Load thống kê
    loadStatistics();
    
    // Load danh sách sách
    loadBookList();
}

// Load thống kê
function loadStatistics() {
    // Implement load statistics from Firebase
    console.log('Loading statistics...');
}

// Load danh sách sách
function loadBookList() {
    // Implement load book list from Firebase
    console.log('Loading book list...');
}

// Load lịch sử
function loadHistory() {
    // Implement load history from Firebase
    console.log('Loading history...');
}

// Load phân tích
function loadAnalysis() {
    // Implement load analysis from Firebase
    console.log('Loading analysis...');
}

// Submit mượn sách lên Firebase
function submitBorrowToFirebase(data) {
    // Implement Firebase submission
    console.log('Submitting borrow to Firebase:', data);
    showAlert('Đã mượn sách thành công!', 'success');
    closeBorrowForm();
}

// Submit thêm sách lên Firebase
function submitAddBookToFirebase(data) {
    // Implement Firebase submission
    console.log('Submitting add book to Firebase:', data);
    showAlert('Đã thêm sách thành công!', 'success');
    closeAddBookForm();
}

// Cập nhật mật khẩu trong Firebase
function updatePasswordInFirebase(current, newPass) {
    // Implement Firebase password update
    console.log('Updating password in Firebase');
    showAlert('Đã thay đổi mật khẩu thành công!', 'success');
    document.getElementById('changePasswordForm').reset();
}

// Hiển thị thông báo
function showAlert(message, type = 'info') {
    // Tạo thông báo đẹp
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    switch(type) {
        case 'success':
            alertDiv.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
            break;
        case 'error':
            alertDiv.style.background = 'linear-gradient(135deg, #f44336, #e57373)';
            break;
        default:
            alertDiv.style.background = 'linear-gradient(135deg, #2196F3, #64B5F6)';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

// Cập nhật thời gian hiện tại
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateString = now.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        timeElement.textContent = `${timeString} - ${dateString}`;
    }
}

// Hàm đóng form mượn sách
function closeBorrowForm() {
    document.getElementById('borrowModal').style.display = 'none';
    document.getElementById('borrowForm').reset();
    
    // Reset về 1 sách duy nhất
    resetBookRows();
}

// Reset danh sách sách về 1 sách duy nhất
function resetBookRows() {
    const container = document.getElementById('booksContainer');
    const firstRow = container.querySelector('.book-row');
    
    // Xóa tất cả các row trừ row đầu tiên
    const allRows = container.querySelectorAll('.book-row');
    allRows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });
    
    // Reset input của row đầu tiên
    if (firstRow) {
        firstRow.querySelector('input[name="bookId"]').value = '';
        firstRow.querySelector('input[name="bookName"]').value = '';
    }
    
    // Cập nhật số lượng sách
    updateBookCount();
}

// Thêm một row sách mới
function addBookRow() {
    const container = document.getElementById('booksContainer');
    const newRow = document.createElement('div');
    
    newRow.className = 'book-row';
    newRow.style.cssText = 'display:flex;gap:8px;margin-bottom:10px;align-items:end;padding:10px;background:white;border-radius:6px;border:1px solid #e1e5e9;transition:all 0.3s;';
    newRow.onmouseover = function() { this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; };
    newRow.onmouseout = function() { this.style.boxShadow = 'none'; };
    
    newRow.innerHTML = `
        <div style="flex:2;">
            <label style="display:block;margin-bottom:3px;color:#333;font-weight:500;font-size:0.8rem;">ID Sách:</label>
            <input type="text" name="bookId" required style="width:100%;padding:6px 8px;border:1px solid #e1e5e9;border-radius:4px;font-size:0.85rem;transition:all 0.3s;" onfocus="this.style.borderColor='#B20000';this.style.boxShadow='0 0 0 2px rgba(178,0,0,0.1)'" onblur="this.style.borderColor='#e1e5e9';this.style.boxShadow='none'" placeholder="ID sách">
        </div>
        
        <div style="flex:3;">
            <label style="display:block;margin-bottom:3px;color:#333;font-weight:500;font-size:0.8rem;">Tên Sách:</label>
            <input type="text" name="bookName" required style="width:100%;padding:6px 8px;border:1px solid #e1e5e9;border-radius:4px;font-size:0.85rem;transition:all 0.3s;" onfocus="this.style.borderColor='#B20000';this.style.boxShadow='0 0 0 2px rgba(178,0,0,0.1)'" onblur="this.style.borderColor='#e1e5e9';this.style.boxShadow='none'" placeholder="Tên sách">
        </div>
        
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
            <button type="button" onclick="removeBookRow(this)" style="background:linear-gradient(135deg,#f44336,#d32f2f);color:white;border:none;padding:6px 8px;border-radius:4px;font-size:0.8rem;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Xóa sách này">
                <ion-icon name="close-outline" style="font-size:0.9rem;"></ion-icon>
            </button>
        </div>
    `;
    
    container.appendChild(newRow);
    updateBookCount();
    
    // Focus vào input đầu tiên của row mới
    newRow.querySelector('input[name="bookId"]').focus();
}

// Xóa một row sách
function removeBookRow(button) {
    const row = button.closest('.book-row');
    const container = document.getElementById('booksContainer');
    const allRows = container.querySelectorAll('.book-row');
    
    // Chỉ cho phép xóa nếu còn nhiều hơn 1 row
    if (allRows.length > 1) {
        row.remove();
        updateBookCount();
    } else {
        showAlert('Phải có ít nhất một cuốn sách!', 'warning');
    }
}

// Cập nhật số lượng sách
function updateBookCount() {
    const bookCount = document.querySelectorAll('.book-row').length;
    const countElement = document.getElementById('bookCount');
    if (countElement) {
        countElement.textContent = bookCount;
    }
    
    // Cập nhật màu sắc của thông báo
    const countInfo = document.getElementById('bookCountInfo');
    if (countInfo) {
        if (bookCount === 1) {
            countInfo.style.background = 'rgba(33,150,243,0.1)';
            countInfo.style.border = '1px solid rgba(33,150,243,0.3)';
            countInfo.style.color = '#1976d2';
        } else if (bookCount <= 3) {
            countInfo.style.background = 'rgba(76,175,80,0.1)';
            countInfo.style.border = '1px solid rgba(76,175,80,0.3)';
            countInfo.style.color = '#4CAF50';
        } else {
            countInfo.style.background = 'rgba(255,152,0,0.1)';
            countInfo.style.border = '1px solid rgba(255,152,0,0.3)';
            countInfo.style.color = '#FF9800';
        }
    }
}

// Export functions for global access
window.showSection = showSection;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updateCurrentTime = updateCurrentTime;
window.closeBorrowForm = closeBorrowForm;
window.addBookRow = addBookRow;
window.removeBookRow = removeBookRow;
