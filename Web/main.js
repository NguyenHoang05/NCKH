const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})
       // Lấy form đăng nhập
const loginForm = document.querySelector('.form-box.login form');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn reload trang
        // Nếu đăng nhập thành công, chuyển hướng:
        window.location.href = '/index.html'; 
    });
}