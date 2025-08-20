// addBook.js
import { db } from './firebase.js';  
// ↑ đường dẫn phải điều chỉnh cho đúng vị trí file HTML

import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Hàm xử lý khi submit form
window.submitAddBookForm = async function (event) {
    event.preventDefault();

    // Lấy giá trị từ form
    const name = document.getElementById('bookName').value.trim();
    const id = document.getElementById('bookIdAdd').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const genre = document.getElementById('bookGenre').value.trim();
    const shelf = document.getElementById('bookShelf').value.trim();
    const type = document.getElementById('bookType').value.trim();

    try {
        // Lưu vào Firestore (document ID = id của sách)
        await setDoc(doc(db, "bookss", id), {
            title: name,
            author: author,
            genre: genre,
            shelfLocation: shelf,
            literatureType: type,
            createdAt: new Date()
        });

        alert("Thêm sách thành công!");
        event.target.reset(); // reset form
    } catch (error) {
        console.error("Lỗi khi thêm sách: ", error);
        alert("Không thể thêm sách: " + error.message);
    }
}
