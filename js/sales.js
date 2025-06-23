document.addEventListener('DOMContentLoaded', () => {
    loadSales();
    
    document.getElementById('salesForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            productType: document.getElementById('productType').value,
            productName: document.getElementById('productName').value,
            price: document.getElementById('price').value,
            customerName: document.getElementById('customerName').value,
            phoneNumber: document.getElementById('phoneNumber').value
        };
        
        try {
            const response = await fetch('server/api/sales.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if(response.ok) {
                alert('Penjualan tersimpan!');
                loadSales();
                e.target.reset();
            }
        } catch(error) {
            console.error('Error:', error);
        }
    });
});

async function loadSales() {
    try {
        const response = await fetch('server/api/sales.php');
        const sales = await response.json();
        
        let html = '<table class="table"><tr><th>Produk</th><th>Harga</th><th>Pelanggan</th></tr>';
        
        sales.forEach(sale => {
            html += `
                <tr>
                    <td>${sale.product_name}</td>
                    <td>Rp ${sale.price.toLocaleString('id-ID')}</td>
                    <td>${sale.customer_name || '-'}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        document.getElementById('salesList').innerHTML = html;
    } catch(error) {
        console.error('Error loading sales:', error);
    }
}
