document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    // Validasi client-side
    if (!email || !password) {
        showError(errorElement, 'Email dan password harus diisi');
        return;
    }

    try {
        const response = await fetch('server/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email,
                password: password 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login gagal');
        }

        // Simpan token dan redirect
        localStorage.setItem('telkomsel_token', data.token);
        localStorage.setItem('telkomsel_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(errorElement, error.message);
    }
});

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('d-none');
    setTimeout(() => {
        element.classList.add('d-none');
    }, 5000);
}

// Cek jika sudah login
if (localStorage.getItem('telkomsel_token')) {
    window.location.href = 'dashboard.html';
}
