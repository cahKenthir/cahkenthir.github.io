document.addEventListener('DOMContentLoaded', () => {
    const formPenjualan = document.getElementById('form-penjualan');
    const tabelPenjualanBody = document.querySelector('#tabel-penjualan tbody');
    const btnCetakSemua = document.getElementById('btn-cetak-semua');

    let penjualanData = []; // Ini akan diganti dengan data dari backend

    // Fungsi untuk memuat data penjualan (akan dipanggil dari backend nanti)
    function loadPenjualan() {
        // Contoh data dummy sebelum integrasi backend
        penjualanData = [
            { id: 1, tanggal: '2025-06-20', produk: 'Perdana 5GB', harga: 25000, nomorPelanggan: '081234567890' },
            { id: 2, tanggal: '2025-06-21', produk: 'Voucher 10GB', harga: 40000, nomorPelanggan: '085678901234' }
        ];
        renderPenjualanTable();
    }

    // Fungsi untuk menampilkan data penjualan di tabel
    function renderPenjualanTable() {
        tabelPenjualanBody.innerHTML = '';
        penjualanData.forEach(penjualan => {
            const row = tabelPenjualanBody.insertRow();
            row.insertCell().textContent = penjualan.tanggal;
            row.insertCell().textContent = penjualan.produk;
            row.insertCell().textContent = `Rp ${penjualan.harga.toLocaleString('id-ID')}`;
            row.insertCell().textContent = penjualan.nomorPelanggan;

            const actionCell = row.insertCell();
            actionCell.classList.add('action-buttons');

            const btnCetak = document.createElement('button');
            btnCetak.textContent = 'Cetak Struk';
            btnCetak.addEventListener('click', () => cetakStruk(penjualan));
            actionCell.appendChild(btnCetak);

            const btnHapus = document.createElement('button');
            btnHapus.textContent = 'Hapus';
            btnHapus.classList.add('delete');
            btnHapus.addEventListener('click', () => deletePenjualan(penjualan.id));
            actionCell.appendChild(btnHapus);
        });
    }

    // Fungsi untuk mencatat penjualan (akan dikirim ke backend)
    formPenjualan.addEventListener('submit', (e) => {
        e.preventDefault();
        const produk = document.getElementById('produk').value;
        const harga = parseFloat(document.getElementById('harga').value);
        const nomorPelanggan = document.getElementById('nomor-pelanggan').value;

        const newPenjualan = {
            tanggal: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
            produk,
            harga,
            nomorPelanggan
        };

        // Di sini Anda akan mengirim data ke backend menggunakan fetch API
        // Contoh:
        // fetch('/api/penjualan', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newPenjualan)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Penjualan berhasil dicatat:', data);
        //     loadPenjualan(); // Muat ulang data setelah sukses
        //     formPenjualan.reset();
        // })
        // .catch(error => console.error('Error mencatat penjualan:', error));

        // Untuk demo sementara:
        penjualanData.push({ ...newPenjualan, id: penjualanData.length + 1 });
        renderPenjualanTable();
        formPenjualan.reset();
        alert('Penjualan berhasil dicatat!');
    });

    // Fungsi untuk menghapus penjualan (akan dikirim ke backend)
    function deletePenjualan(id) {
        if (confirm('Anda yakin ingin menghapus penjualan ini?')) {
            // Di sini Anda akan mengirim request DELETE ke backend
            // Contoh:
            // fetch(`/api/penjualan/${id}`, { method: 'DELETE' })
            // .then(response => {
            //     if (response.ok) {
            //         console.log('Penjualan berhasil dihapus');
            //         loadPenjualan(); // Muat ulang data
            //     } else {
            //         console.error('Gagal menghapus penjualan');
            //     }
            // })
            // .catch(error => console.error('Error menghapus penjualan:', error));

            // Untuk demo sementara:
            penjualanData = penjualanData.filter(p => p.id !== id);
            renderPenjualanTable();
            alert('Penjualan berhasil dihapus!');
        }
    }

    // Fungsi untuk mencetak struk per penjualan
    function cetakStruk(penjualan) {
        let printContent = `
            <h2>STRUK PENJUALAN TELKOMSEL</h2>
            <p>-----------------------------------</p>
            <p>Tanggal: ${penjualan.tanggal}</p>
            <p>Produk: ${penjualan.produk}</p>
            <p>Harga: Rp ${penjualan.harga.toLocaleString('id-ID')}</p>
            <p>No. Pelanggan: ${penjualan.nomorPelanggan}</p>
            <p>-----------------------------------</p>
            <p>Terima Kasih!</p>
        `;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Cetak Struk</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; text-align: center; }
            h2 { font-size: 14px; margin-bottom: 10px; }
            p { margin: 2px 0; }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Fungsi untuk mencetak semua struk (dari semua data di tabel)
    btnCetakSemua.addEventListener('click', () => {
        let allPrintContent = `
            <h2>LAPORAN PENJUALAN TELKOMSEL</h2>
            <p>-----------------------------------</p>
        `;
        penjualanData.forEach(penjualan => {
            allPrintContent += `
                <p>Tanggal: ${penjualan.tanggal}</p>
                <p>Produk: ${penjualan.produk}</p>
                <p>Harga: Rp ${penjualan.harga.toLocaleString('id-ID')}</p>
                <p>No. Pelanggan: ${penjualan.nomorPelanggan}</p>
                <p>-----------------------------------</p>
            `;
        });

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Cetak Laporan Penjualan</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; text-align: center; }
            h2 { font-size: 14px; margin-bottom: 10px; }
            p { margin: 2px 0; }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(allPrintContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    // Panggil saat halaman dimuat
    loadPenjualan();
});
