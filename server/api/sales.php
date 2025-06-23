<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once __DIR__.'/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    
    if($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM sales ORDER BY sale_date DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("INSERT INTO sales 
                             (product_type, product_name, price, customer_name, phone_number) 
                             VALUES (?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $input['productType'],
            $input['productName'],
            $input['price'],
            $input['customerName'] ?? null,
            $input['phoneNumber'] ?? null
        ]);
        
        echo json_encode(['status' => 'success']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
