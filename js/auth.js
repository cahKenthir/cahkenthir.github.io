document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('server/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if(response.ok) {
            localStorage.setItem('telkomsel_token', data.token);
            localStorage.setItem('telkomsel_user_email', data.user.email);
            localStorage.setItem('telkomsel_user_name', data.user.name);
            
            document.getElementById('login-view').style.display = 'none';
            document.getElementById('sales-view').style.display = 'block';
            
            // Load initial data
            loadSalesData();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Terjadi kesalahan saat login');
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('telkomsel_token');
    localStorage.removeItem('telkomsel_user_email');
    localStorage.removeItem('telkomsel_user_name');
    
    document.getElementById('login-view').style.display = 'flex';
    document.getElementById('sales-view').style.display = 'none';
    
    // Reset form
    document.getElementById('loginForm').reset();
});

// Check if user is already logged in
if(localStorage.getItem('telkomsel_token')) {
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('sales-view').style.display = 'block';
    loadSalesData();
}
