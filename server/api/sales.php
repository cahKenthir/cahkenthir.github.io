<?php
header('Content-Type: application/json');
require_once __DIR__.'/../config/db.php';

// Verify token
$token = isset($_SERVER['HTTP_AUTHORIZATION']) ? 
    str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']) : null;

if(!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$tokenData = json_decode(base64_decode($token), true);
if(!$tokenData || $tokenData['exp'] < time()) {
    http_response_code(401);
    echo json_encode(['error' => 'Token invalid or expired']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if($method === 'GET') {
        // Get today's sales
        $stmt = $pdo->prepare("SELECT * FROM sales 
                              WHERE sales_email = :email 
                              AND DATE(sale_date) = CURDATE()");
        $stmt->execute(['email' => $tokenData['email']]);
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($sales);
    } 
    elseif($method === 'POST') {
        // Add new sale
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("INSERT INTO sales 
                             (product_type, product_name, price, customer_name, phone_number, sales_email) 
                             VALUES (:type, :name, :price, :customer, :phone, :email)");
        
        $stmt->execute([
            'type' => $input['productType'],
            'name' => $input['productName'],
            'price' => $input['price'],
            'customer' => $input['customerName'] ?? null,
            'phone' => $input['phoneNumber'] ?? null,
            'email' => $tokenData['email']
        ]);
        
        echo json_encode(['message' => 'Sale recorded successfully']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
