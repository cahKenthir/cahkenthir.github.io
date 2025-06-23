CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_type VARCHAR(20),
    product_name VARCHAR(100),
    price DECIMAL(10,2),
    customer_name VARCHAR(100),
    phone_number VARCHAR(20),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sales VALUES
(NULL, 'perdana', 'Simpati 10GB', 50000, 'Budi', '0812345678', NOW()),
(NULL, 'voucher', 'Voucher 50k', 50000, NULL, NULL, NOW());
