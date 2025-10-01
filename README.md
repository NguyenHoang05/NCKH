# 📚 Hệ Thống Quản Lý Thư Viện PTIT

## 🎯 Tổng Quan

Hệ thống quản lý thư viện hiện đại cho Học viện Công nghệ Bưu chính Viễn thông (PTIT), được xây dựng với công nghệ web hiện đại và tích hợp Firebase để quản lý dữ liệu real-time.

## ✨ Tính Năng Chính

### 🔐 Hệ Thống Xác Thực
- **Đăng ký tài khoản** với thông tin sinh viên/admin
- **Đăng nhập** với xác thực Firebase
- **Phân quyền** theo vai trò (Student/Admin)
- **Bảo mật** với mã hóa mật khẩu

### 👨‍💼 Giao Diện Admin
- **Dashboard** tổng quan với thống kê
- **Quản lý sách**: Thêm, sửa, xóa sách
- **Mượn sách**: Xử lý yêu cầu mượn sách
- **Trả sách**: Quản lý việc trả sách
- **Lịch sử**: Theo dõi tất cả giao dịch
- **Phân tích**: Báo cáo thống kê chi tiết

### 👨‍🎓 Giao Diện Student
- **Trang chủ** với tin tức và thông báo
- **Profile** cá nhân
- **Danh sách sách đã mượn**
- **Sách yêu thích**
- **Tìm kiếm sách**
- **Trợ giúp** và FAQ

### 🤖 Chatbot AI
- **Hỗ trợ** 24/7
- **Tư vấn** về thư viện
- **Hướng dẫn** sử dụng hệ thống
- **Giải đáp** câu hỏi thường gặp

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và responsive design
- **JavaScript (ES6+)** - Logic và tương tác
- **Ionicons** - Icon library
- **Lottie** - Animation

### Backend & Database
- **Firebase Authentication** - Xác thực người dùng
- **Firebase Firestore** - Database NoSQL
- **Firebase Realtime Database** - Dữ liệu real-time
- **Firebase Hosting** - Deploy ứng dụng

### Tools & Libraries
- **Boxicons** - Icon set
- **Google Fonts** - Typography
- **CSS Grid & Flexbox** - Layout

## 📁 Cấu Trúc Dự Án

```
NCKH/
├── Web/                          # Trang đăng nhập/đăng ký
│   ├── index.html               # Trang chủ đăng nhập
│   ├── main.js                  # Logic đăng nhập
│   ├── style.css                # Styling trang đăng nhập
│   └── firebase/                # Firebase integration
│       ├── firebase.js          # Cấu hình Firebase
│       ├── login.js             # Logic đăng nhập
│       ├── register.js          # Logic đăng ký
│       ├── addbook.js           # Thêm sách
│       ├── borrow.js            # Mượn sách
│       ├── returnBook.js        # Trả sách
│       ├── listbook.js          # Danh sách sách
│       ├── history.js           # Lịch sử mượn trả
│       └── student/             # Student-specific Firebase
│           ├── profile.js       # Profile sinh viên
│           └── borrowsd.js      # Sách đã mượn
├── Interface/                   # Giao diện chính
│   ├── Admin/                   # Giao diện Admin
│   │   ├── index.html          # Dashboard Admin
│   │   ├── main.js             # Logic Admin
│   │   └── style.css           # Styling Admin
│   └── Student/                # Giao diện Student
│       ├── index.html          # Dashboard Student
│       ├── script.js           # Logic Student
│       ├── link.css            # Styling Student
│       ├── Profile.jpg         # Avatar mặc định
│       ├── PTIT.png           # Logo trường
│       └── hoavang.jpg        # Hình ảnh sách mẫu
├── chatbotAI/                   # Chatbot AI
│   ├── chatbot-popup.html      # Popup chatbot
│   ├── chatbot-icon.svg        # Icon chatbot
│   ├── robot.json             # Animation Lottie
│   ├── firebase-config.js     # Cấu hình Firebase cho chatbot
│   ├── script.js              # Logic chatbot
│   └── style.css              # Styling chatbot
├── NCKH_ESP-master/            # Phần cứng ESP32
│   ├── src/main.cpp           # Code Arduino
│   └── platformio.ini         # Cấu hình PlatformIO
└── README.md                   # Tài liệu dự án
```

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd NCKH
```

### 2. Cấu Hình Firebase
1. Tạo project Firebase mới
2. Bật Authentication (Email/Password)
3. Tạo Firestore Database
4. Tạo Realtime Database
5. Cập nhật cấu hình trong `Web/firebase/firebase.js`

### 3. Chạy Ứng Dụng
```bash
# Sử dụng Live Server hoặc tương tự
# Mở file Web/index.html trong browser
```

### 4. Truy Cập
- **Trang đăng nhập**: `Web/index.html`
- **Admin Dashboard**: Sau khi đăng nhập với role Admin
- **Student Dashboard**: Sau khi đăng nhập với role Student

## 📊 Database Schema

### Collections trong Firestore

#### Users Collection
```javascript
{
  id: "user_id",
  username: "Tên người dùng",
  mssv: "Mã sinh viên",
  class: "Lớp",
  email: "email@domain.com",
  iduser: "ID người dùng",
  role: "student|admin",
  createdAt: "timestamp"
}
```

#### Books Collection
```javascript
{
  id: "book_id",
  title: "Tên sách",
  author: "Tác giả",
  genre: "Thể loại",
  shelfLocation: "Vị trí kệ",
  status: "Còn|Đã mượn",
  createdAt: "timestamp"
}
```

#### History Collection
```javascript
{
  id: "history_id",
  studentName: "Tên sinh viên",
  studentId: "ID sinh viên",
  bookId: "ID sách",
  bookName: "Tên sách",
  borrowDate: "Ngày mượn",
  returnDate: "Ngày trả dự kiến",
  actualReturnDate: "Ngày trả thực tế",
  status: "Đang mượn|Đã trả|Quá hạn",
  createdAt: "timestamp"
}
```

## 🎨 Tính Năng UI/UX

### Responsive Design
- **Mobile-first** approach
- **Tablet** optimization
- **Desktop** enhanced experience

### Modern UI Elements
- **Glassmorphism** effects
- **Gradient** backgrounds
- **Smooth** animations
- **Interactive** hover effects

### Accessibility
- **Keyboard** navigation
- **Screen reader** friendly
- **High contrast** mode
- **Font size** adjustment

## 🔧 Tùy Chỉnh

### Thay Đổi Màu Sắc
Chỉnh sửa CSS variables trong các file style:
```css
:root {
  --primary-color: #4d5bf9;
  --secondary-color: #6a82fb;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### Thêm Tính Năng Mới
1. Tạo component HTML
2. Thêm logic JavaScript
3. Tích hợp Firebase nếu cần
4. Cập nhật CSS styling

## 📱 Tính Năng Mobile

- **Touch-friendly** interface
- **Swipe** gestures
- **Optimized** for small screens
- **Fast loading** on mobile networks

## 🔒 Bảo Mật

- **Firebase Authentication** cho xác thực
- **Role-based** access control
- **Input validation** trên client và server
- **HTTPS** encryption
- **Secure** API endpoints

## 📈 Performance

- **Lazy loading** cho images
- **Code splitting** cho JavaScript
- **Caching** strategies
- **Optimized** database queries
- **CDN** cho static assets

## 🐛 Debugging

### Console Logs
```javascript
console.log("✅ Feature loaded");
console.error("❌ Error occurred");
console.warn("⚠️ Warning message");
```

### Firebase Debug
- Kiểm tra Firebase Console
- Xem Network tab trong DevTools
- Kiểm tra Authentication logs

## 📞 Hỗ Trợ

### Liên Hệ
- **Email**: support@ptit.edu.vn
- **Hotline**: 1900-xxxx
- **Documentation**: Xem README này

### FAQ
1. **Làm sao để reset mật khẩu?**
   - Sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập

2. **Tại sao không thể mượn sách?**
   - Kiểm tra trạng thái tài khoản
   - Đảm bảo không có sách quá hạn

3. **Làm sao để liên hệ admin?**
   - Sử dụng chatbot hoặc email support

## 🚀 Roadmap

### Version 2.0
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Analytics**
- [ ] **QR Code** scanning
- [ ] **Email** notifications
- [ ] **Multi-language** support

### Version 3.0
- [ ] **AI-powered** book recommendations
- [ ] **Social features** (reviews, ratings)
- [ ] **Integration** with external libraries
- [ ] **Advanced reporting**

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu tại PTIT.

## 👥 Contributors

- **Developer**: [Tên Developer]
- **Designer**: [Tên Designer]
- **Mentor**: [Tên Mentor]

---

**© 2024 PTIT Library Management System. All rights reserved.**