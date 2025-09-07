
console.log("✅ addbook.js loaded");
// addbook.js
import { db,rtdb } from './firebase.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js"; // import realtime
window.submitAddBookForm = async function (event) {
  event.preventDefault();

  const name  = document.getElementById('bookName').value.trim();
  const id    = document.getElementById('bookIdAdd').value.trim();
  const author= document.getElementById('bookAuthor').value.trim();
  const genre = document.getElementById('bookGenre').value.trim();
  const shelf = document.getElementById('bookShelf').value.trim();

  try {
   await setDoc(doc(db, "books", id), {
    id: id,
    title: name,
    author: author,
    genre: genre,
    shelfLocation: shelf,
    status: "Còn",
    createdAt: new Date().toISOString()
});
 // 2️⃣ Lưu vào Realtime Database
    await set(ref(rtdb, "books/" + id), {
      id: id,
      title: name,
      author: author,
      genre: genre,
      shelfLocation: shelf,
      status: "Còn",
      createdAt: new Date().toISOString()
    });

    alert("✅ Thêm sách thành công!");
    document.getElementById("addBookForm").reset();
    if (window.closeAddBookForm) closeAddBookForm();
  } catch (error) {
    console.error("❌ Lỗi khi thêm sách: ", error);
    alert("Không thể thêm sách: " + error.message);
  }
}
