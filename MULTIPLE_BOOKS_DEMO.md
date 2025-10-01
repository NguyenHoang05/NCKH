# 📚 Demo: Chức Năng Mượn Nhiều Sách Cùng Lúc

## 🎯 Tính Năng Mới

Hệ thống quản lý thư viện PTIT đã được cải thiện để cho phép sinh viên **mượn nhiều sách cùng lúc** thay vì chỉ mượn được 1 sách như trước.

## ✨ Các Cải Tiến

### 1. **Giao Diện Form Mượn Sách Mới**
- **Thông tin sinh viên**: Tập trung ở phần trên với background màu đỏ nhạt
- **Danh sách sách**: Dynamic list có thể thêm/xóa sách
- **Nút "Thêm sách"**: Cho phép thêm nhiều sách
- **Nút "Xóa sách"**: Xóa từng sách riêng lẻ
- **Đếm số lượng**: Hiển thị số sách đang mượn với màu sắc thay đổi

### 2. **Validation Nâng Cao**
- Kiểm tra thông tin sinh viên đầy đủ
- Kiểm tra ít nhất 1 cuốn sách
- Kiểm tra không trùng lặp ID sách
- Kiểm tra thông tin từng cuốn sách

### 3. **Firebase Logic Cải Tiến**
- Xử lý multiple books trong một transaction
- Lưu thông tin `borrowOrder` (thứ tự mượn)
- Lưu `totalBooks` (tổng số sách mượn)
- Cập nhật trạng thái từng cuốn sách
- Xử lý lỗi riêng biệt cho từng cuốn sách

### 4. **Student Interface Cải Tiến**
- **Bảng sách đã mượn** với cột mới:
  - **#**: Thứ tự mượn (với icon tròn)
  - **ID Sách**: Mã sách (font monospace)
  - **Tên Sách**: Tên sách (với icon 📚)
  - **Ngày mượn**: Ngày bắt đầu mượn
  - **Hạn trả**: Ngày phải trả
  - **Trạng thái**: Đang mượn/Quá hạn/Đã trả

- **Nhóm theo đợt mượn**: Sách được nhóm theo ngày mượn
- **Màu sắc trạng thái**: 
  - 🟢 Xanh: Đang mượn
  - 🔴 Đỏ: Quá hạn
  - 🔵 Xanh dương: Đã trả

## 🚀 Cách Sử Dụng

### Cho Admin:
1. **Mở form mượn sách** từ trang Home
2. **Nhập thông tin sinh viên**:
   - Tên sinh viên
   - ID sinh viên
   - Ngày mượn
   - Ngày trả

3. **Thêm sách**:
   - Click nút "Thêm sách" để thêm sách mới
   - Nhập ID sách và tên sách cho từng cuốn
   - Click nút "X" để xóa sách không cần

4. **Submit**: Click "Mượn Sách" để hoàn tất

### Cho Student:
1. **Vào trang Profile** để xem sách đã mượn
2. **Xem danh sách** với thông tin chi tiết
3. **Theo dõi trạng thái** và hạn trả

## 📊 Cấu Trúc Dữ Liệu Mới

### Firestore Document Structure:
```javascript
{
  studentName: "Nguyễn Văn A",
  studentId: "SV001",
  bookId: "BK001",
  bookName: "Lập trình Web",
  borrowDate: "2024-12-20",
  returnDate: "2024-12-27",
  status: "Đang mượn",
  borrowOrder: 1,        // Thứ tự mượn (1, 2, 3...)
  totalBooks: 3,         // Tổng số sách mượn
  createdAt: "2024-12-20T10:30:00Z"
}
```

### User Profile Books:
```javascript
{
  bookName: "Lập trình Web",
  borrowDate: "2024-12-20",
  returnDate: "2024-12-27",
  status: "Đang mượn",
  borrowOrder: 1
}
```

## 🎨 Giao Diện Visual

### Form Mượn Sách:
```
┌─────────────────────────────────────┐
│           Mượn Sách                 │
├─────────────────────────────────────┤
│ 👤 Thông tin sinh viên              │
│ ├─ Tên sinh viên: [___________]     │
│ ├─ ID Sinh Viên: [___________]      │
│ ├─ Ngày Mượn: [____] Ngày Trả: [____] │
├─────────────────────────────────────┤
│ 📚 Danh sách sách mượn    [+ Thêm sách] │
│ ┌─────────────────────────────────────┐ │
│ │ # │ ID Sách │ Tên Sách │ [X]       │ │
│ │ 1 │ BK001   │ Web Dev  │ [X]       │ │
│ │ 2 │ BK002   │ Database │ [X]       │ │
│ └─────────────────────────────────────┘ │
│ ℹ️ Số lượng sách: 2 cuốn              │
├─────────────────────────────────────┤
│        [📚 Mượn Sách]               │
└─────────────────────────────────────┘
```

### Bảng Sách Đã Mượn:
```
┌─────────────────────────────────────────────────────┐
│ # │ ID Sách │ Tên Sách     │ Ngày Mượn │ Hạn Trả │ Trạng thái │
├─────────────────────────────────────────────────────┤
│ ① │ BK001   │ 📚 Web Dev   │ 20/12/24  │ 27/12/24│ 🟢 Đang mượn │
│ ② │ BK002   │ 📚 Database  │ 20/12/24  │ 27/12/24│ 🟢 Đang mượn │
│ ③ │ BK003   │ 📚 AI        │ 18/12/24  │ 25/12/24│ 🔴 Quá hạn   │
└─────────────────────────────────────────────────────┘
```

## 🔧 Technical Implementation

### Files Modified:
1. **`Interface/Admin/index.html`**: Updated borrow form UI
2. **`Interface/Admin/main.js`**: Added dynamic book management functions
3. **`Web/firebase/borrow.js`**: Enhanced Firebase logic for multiple books
4. **`Interface/Student/index.html`**: Updated borrowed books table
5. **`Interface/Student/borrowed.js`**: New file for loading borrowed books

### Key Functions:
- `addBookRow()`: Thêm sách mới
- `removeBookRow()`: Xóa sách
- `updateBookCount()`: Cập nhật số lượng
- `validateBorrowForm()`: Validation nâng cao
- `loadBorrowedBooks()`: Load sách đã mượn
- `groupBooksByBorrowDate()`: Nhóm theo ngày mượn

## 🎯 Benefits

1. **Efficiency**: Admin có thể xử lý nhiều sách trong một lần
2. **User Experience**: Giao diện trực quan và dễ sử dụng
3. **Data Integrity**: Validation chặt chẽ, tránh lỗi
4. **Visual Feedback**: Màu sắc và icon rõ ràng
5. **Scalability**: Dễ dàng mở rộng thêm tính năng

## 🚀 Ready to Use!

Hệ thống đã sẵn sàng sử dụng với chức năng mượn nhiều sách cùng lúc. Admin có thể:

- ✅ Mượn 1-10 sách trong một lần
- ✅ Theo dõi thứ tự mượn sách
- ✅ Xem thống kê chi tiết
- ✅ Quản lý trạng thái từng cuốn sách

Student có thể:

- ✅ Xem danh sách sách đã mượn
- ✅ Theo dõi hạn trả
- ✅ Nhận cảnh báo sách quá hạn
- ✅ Xem lịch sử mượn sách

---

**🎉 Chức năng mượn nhiều sách đã được triển khai thành công!**

