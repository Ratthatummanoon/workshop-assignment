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
            'Application-Key': 'TU742d33be69252833b3c8466bbdf9d39ff8edd625ed8d67e91b89ca21a88f36aabe014572045c25cb2d73275a9d3ff0a3'
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

            // Display user details
            displayUserDetails(data);

            // Save the user to the students table in the database
            saveUserToDatabase(data);
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

// Function to display the user details after successful login
function displayUserDetails(data) {
    const userDetails = `
        <h3>User Details</h3>
        <p><strong>Full Name:</strong> ${data.displayname_en}</p>
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Role:</strong> ${data.type}</p>
        <p><strong>Faculty:</strong> ${data.faculty}</p>
    `;
    document.getElementById('userDetails').innerHTML = userDetails;
}


// Function to save the user data to the database (students table)
function saveUserToDatabase(data) {
    fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            eng_name: data.displayname_en,
            email: data.email,
            faculty: data.faculty,
            type: data.type,
            user_name: data.username
        })
    })
    .then(response => {
        console.log('Response Status:', response.status);  // Log the status
        return response.json().then(responseData => {
            if (!response.ok) {
                console.error('Error response:', responseData);  // Log the error message from the backend
                throw new Error(responseData.message || 'Failed to save user');
            }
            return responseData;
        });
    })
    .then(responseData => {
        if (responseData.success) {
            console.log('User saved to database successfully!');
        } else {
            console.error('Failed to save user to database');
        }
    })
    .catch(error => {
        console.error('Error while saving user:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้');
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

