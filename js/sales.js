// Load sales form
function loadSalesForm() {
    const form = document.getElementById('salesForm');
    form.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Product Type</label>
            <select class="form-select" id="productType" required>
                <option value="">Select Type</option>
                <option value="perdana">Kartu Perdana</option>
                <option value="voucher">Voucher</option>
                <option value="paket">Paket Data</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input type="text" class="form-control" id="productName" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Price (Rp)</label>
            <input type="number" class="form-control" id="price" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Customer Name</label>
            <input type="text" class="form-control" id="customerName">
        </div>
        <div class="mb-3">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="phoneNumber">
        </div>
        <button type="submit" class="btn btn-success w-100">Save Transaction</button>
    `;
    
    form.addEventListener('submit', handleSalesSubmit);
}

async function handleSalesSubmit(e) {
    e.preventDefault();
    
    const saleData = {
        productType: document.getElementById('productType').value,
        productName: document.getElementById('productName').value,
        price: document.getElementById('price').value,
        customerName: document.getElementById('customerName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        salesEmail: localStorage.getItem('telkomsel_user_email')
    };
    
    try {
        const response = await fetch('server/api/sales.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('telkomsel_token')
            },
            body: JSON.stringify(saleData)
        });
        
        if(response.ok) {
            alert('Transaction saved successfully');
            loadSalesData();
            e.target.reset();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to save transaction');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menyimpan transaksi');
    }
}

async function loadSalesData() {
    try {
        const response = await fetch('server/api/sales.php', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('telkomsel_token')
            }
        });
        
        const sales = await response.json();
        displaySalesData(sales);
    } catch (error) {
        console.error('Error loading sales data:', error);
    }
}

function displaySalesData(sales) {
    const container = document.getElementById('sales-list');
    let html = '';
    
    if(sales.length === 0) {
        html = '<p>No transactions today</p>';
    } else {
        let total = 0;
        
        sales.forEach(sale => {
            total += parseFloat(sale.price);
            html += `
                <div class="sale-item">
                    <div class="d-flex justify-content-between">
                        <span>${sale.product_name}</span>
                        <span>Rp ${parseInt(sale.price).toLocaleString('id-ID')}</span>
                    </div>
                    <small class="text-muted">${sale.customer_name || 'No customer name'}</small>
                </div>
            `;
        });
        
        html += `
            <div class="mt-3 pt-2 border-top">
                <div class="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>Rp ${total.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Initialize sales form when page loads
if(localStorage.getItem('telkomsel_token')) {
    loadSalesForm();
}
