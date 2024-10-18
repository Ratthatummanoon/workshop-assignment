function submitLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    // Check if any field is empty
    if (username === "" || password === "" || role === "") {
        alert('กรอกข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูลอีกครั้ง');
        return;
    }

    // Send POST request to API
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'Your API Key' 
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => response.json())
    .then(data => {
        // Check if API response status is true and user role matches the type
        if (data.status && data.username === username && data.type === role) {
            console.log(data);
            alert('เข้าสู่ระบบสำเร็จ');
        } else {
            // If any of the conditions are not met, show error message
            alert('คุณกรอกข้อมูลผิด กรุณาลองอีกครั้ง');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง');
    });
}

// Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Toggle the password field type between 'password' and 'text'
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle between fa-eye and fa-eye-slash classes
    if (type === 'password') {
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
    } else {
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
    }
});

