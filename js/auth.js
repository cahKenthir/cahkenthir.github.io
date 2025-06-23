document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validasi client-side
    if (!email || !password) {
        alert('Email dan password harus diisi');
        return;
    }

    try {
        const response = await fetch('server/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login gagal');
        }

        // Simpan token dan data user
        localStorage.setItem('telkomsel_token', data.token);
        localStorage.setItem('telkomsel_user_email', data.user.email);
        localStorage.setItem('telkomsel_user_name', data.user.name);
        
        // Redirect ke dashboard
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('sales-view').style.display = 'block';
        
        // Load data penjualan
        loadSalesData();
        
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Terjadi kesalahan saat login. Coba lagi.');
    }
});

// Fungsi untuk validasi token
function validateToken(token) {
    try {
        const payload = JSON.parse(atob(token));
        return payload.exp > Date.now() / 1000;
    } catch (e) {
        return false;
    }
}

// Cek status login saat page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('telkomsel_token');
    
    if (token && validateToken(token)) {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('sales-view').style.display = 'block';
        loadSalesData();
    } else {
        // Clear invalid token
        localStorage.removeItem('telkomsel_token');
        document.getElementById('login-view').style.display = 'flex';
    }
});
