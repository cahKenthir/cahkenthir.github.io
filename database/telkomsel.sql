CREATE DATABASE IF NOT EXISTS telkomsel_sales;
USE telkomsel_sales;

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_type VARCHAR(20) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(100),
    phone_number VARCHAR(20),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sales_email VARCHAR(100) NOT NULL
);

-- Sample data
INSERT INTO sales (product_type, product_name, price, customer_name, phone_number, sales_email) VALUES
('perdana', 'Simpati 10GB', 50000, 'Budi Santoso', '08123456789', 'imesurya@gmail.com'),
('voucher', 'Voucher 50k', 50000, NULL, '08198765432', 'imesurya@gmail.com'),
('paket', 'Internet 30 Hari 20GB', 150000, 'Ani Wijaya', '08211223344', 'imesurya@gmail.com');
