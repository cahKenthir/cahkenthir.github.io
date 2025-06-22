CREATE DATABASE IF NOT EXISTS telkomsel_sales;

USE telkomsel_sales;

CREATE TABLE IF NOT EXISTS penjualan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    produk VARCHAR(255) NOT NULL,
    harga DECIMAL(10, 2) NOT NULL,
    nomor_pelanggan VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
