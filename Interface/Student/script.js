// Student Interface JavaScript
// Xử lý các chức năng chính của giao diện Student

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student interface loaded');
    initializeStudentInterface();
});

// Khởi tạo giao diện Student
function initializeStudentInterface() {
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
        'homeSection', 'profileSection', 'helpSection', 
        'favoriteSection', 'passwordSection', 'signoutSection'
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
        case 'Proflie':
            targetSectionId = 'profileSection';
            loadProfile();
            break;
        case 'Help':
            targetSectionId = 'helpSection';
            break;
        case 'Favorite':
            targetSectionId = 'favoriteSection';
            loadFavorites();
            break;
        case 'Password':
            targetSectionId = 'passwordSection';
            break;
        case 'Sign out':
            targetSectionId = 'signoutSection';
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
    // Event listeners cho search
    setupSearchListeners();
    
    // Event listeners cho forms
    setupFormListeners();
    
    // Event listeners cho buttons
    setupButtonListeners();
    
    // Event listeners cho FAQ
    setupFAQListeners();
}

// Thiết lập search listeners
function setupSearchListeners() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
        if (input.placeholder.includes('Tìm kiếm')) {
            input.addEventListener('input', handleSearch);
        }
    });
}

// Thiết lập form listeners
function setupFormListeners() {
    // Form đổi mật khẩu
    const passwordForm = document.querySelector('#passwordSection form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Form tìm kiếm sách
    const searchForm = document.querySelector('#favoriteSection input[type="text"]');
    if (searchForm) {
        searchForm.addEventListener('input', handleBookSearch);
    }
}

// Thiết lập button listeners
function setupButtonListeners() {
    // Nút like sách
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', toggleBookLike);
    }
    
    // Nút toggle password visibility
    const passwordToggles = document.querySelectorAll('[onclick^="togglePassword"]');
    passwordToggles.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            togglePassword(inputId);
        });
    });
}

// Thiết lập FAQ listeners
function setupFAQListeners() {
    const faqItems = document.querySelectorAll('[onclick^="toggleFAQ"]');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

// Load dữ liệu ban đầu
function loadInitialData() {
    // Load profile information
    loadProfile();
    
    // Load borrowed books
    loadBorrowedBooks();
    
    // Load favorite books
    loadFavorites();
}

// Load thông tin profile
function loadProfile() {
    // Lấy ID user từ localStorage
    const userId = localStorage.getItem('iduser');
    if (!userId) {
        console.error('User ID not found');
        return;
    }
    
    // Load profile từ Firebase (sẽ được implement sau)
    console.log('Loading profile for user:', userId);
    
    // Mock data for now
    const mockProfile = {
        name: 'Nguyễn Văn A',
        studentId: '2021001',
        className: 'CNTT01',
        status: 'Hoạt động'
    };
    
    updateProfileDisplay(mockProfile);
}

// Cập nhật hiển thị profile
function updateProfileDisplay(profile) {
    const nameElement = document.getElementById('studentName');
    const idElement = document.getElementById('studentId');
    const classElement = document.getElementById('studentClass');
    const statusElement = document.getElementById('studentStatus');
    
    if (nameElement) nameElement.textContent = profile.name;
    if (idElement) idElement.textContent = profile.studentId;
    if (classElement) classElement.textContent = profile.className;
    if (statusElement) statusElement.textContent = profile.status;
}

// Load sách đã mượn
function loadBorrowedBooks() {
    const tableBody = document.getElementById('borrowedBooksTableBody');
    if (!tableBody) return;
    
    // Mock data for now
    const mockBooks = [
        {
            title: 'Tôi thấy hoa vàng trên cỏ xanh',
            borrowDate: '2024-12-01',
            returnDate: '2024-12-15',
            status: 'Đang mượn'
        },
        {
            title: 'Những người khốn khổ',
            borrowDate: '2024-11-20',
            returnDate: '2024-12-04',
            status: 'Đã trả'
        }
    ];
    
    updateBorrowedBooksTable(mockBooks);
}

// Cập nhật bảng sách đã mượn
function updateBorrowedBooksTable(books) {
    const tableBody = document.getElementById('borrowedBooksTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 16px 20px; color: #374151; font-weight: 500;">${book.title}</td>
            <td style="padding: 16px 20px; color: #6b7280;">${formatDate(book.borrowDate)}</td>
            <td style="padding: 16px 20px; color: #6b7280;">${formatDate(book.returnDate)}</td>
            <td style="padding: 16px 20px;">
                <span style="
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    ${book.status === 'Đang mượn' ? 
                        'background: #fef3c7; color: #92400e;' : 
                        'background: #d1fae5; color: #065f46;'
                    }
                ">
                    ${book.status}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load sách yêu thích
function loadFavorites() {
    console.log('Loading favorite books...');
    // Implement load favorites from Firebase
}

// Xử lý tìm kiếm
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    // Implement search functionality
    if (searchTerm.length >= 2) {
        performSearch(searchTerm);
    }
}

// Xử lý tìm kiếm sách
function handleBookSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Searching books for:', searchTerm);
    
    // Implement book search
    if (searchTerm.length >= 2) {
        searchBooks(searchTerm);
    }
}

// Thực hiện tìm kiếm
function performSearch(term) {
    // Implement search logic
    console.log('Performing search for:', term);
}

// Tìm kiếm sách
function searchBooks(term) {
    // Implement book search logic
    console.log('Searching books for:', term);
}

// Toggle like sách
function toggleBookLike() {
    const likeBtn = document.getElementById('likeBtn');
    const icon = likeBtn.querySelector('ion-icon');
    
    if (icon.name === 'heart') {
        icon.name = 'heart-dislike';
        icon.style.color = '#9ca3af';
        showAlert('Đã bỏ yêu thích sách này', 'info');
    } else {
        icon.name = 'heart';
        icon.style.color = '#ef4444';
        showAlert('Đã thêm vào danh sách yêu thích', 'success');
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('ion-icon');
    
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
    
    // Cập nhật mật khẩu
    updatePassword(newPassword);
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
    
    if (!/[A-Z]/.test(newPass)) {
        showAlert('Mật khẩu mới phải có ít nhất 1 chữ hoa!', 'error');
        return false;
    }
    
    if (!/\d/.test(newPass)) {
        showAlert('Mật khẩu mới phải có ít nhất 1 số!', 'error');
        return false;
    }
    
    return true;
}

// Cập nhật mật khẩu
function updatePassword(newPassword) {
    // Implement password update in Firebase
    console.log('Updating password...');
    showAlert('Đã cập nhật mật khẩu thành công!', 'success');
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Reset password strength indicators
    resetPasswordIndicators();
}

// Reset password strength indicators
function resetPasswordIndicators() {
    const indicators = ['lengthCheck', 'uppercaseCheck', 'numberCheck'];
    indicators.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.background = '#e5e7eb';
        }
    });
}

// Toggle FAQ
function toggleFAQ(element) {
    const content = element.querySelector('div:last-child');
    const icon = element.querySelector('span:last-child');
    
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = '0px';
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
    }
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
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;
    
    switch(type) {
        case 'success':
            alertDiv.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            break;
        case 'error':
            alertDiv.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
            break;
        case 'info':
            alertDiv.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
            break;
        default:
            alertDiv.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(alertDiv)) {
                document.body.removeChild(alertDiv);
            }
        }, 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Xác nhận đăng xuất
function confirmSignout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        showAlert('Đăng xuất thành công!', 'success');
        
        // Clear localStorage
        localStorage.removeItem('iduser');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = '../../Web/index.html';
        }, 1500);
    }
}

// Hủy đăng xuất
function cancelSignout() {
    const signoutSection = document.getElementById('signoutSection');
    if (signoutSection) {
        signoutSection.style.display = 'none';
    }
}

// Export functions for global access
window.showSection = showSection;
window.togglePassword = togglePassword;
window.toggleFAQ = toggleFAQ;
window.confirmSignout = confirmSignout;
window.cancelSignout = cancelSignout;

