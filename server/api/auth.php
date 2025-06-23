<?php
header('Content-Type: application/json');
require_once __DIR__.'/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

// Default user (in production, get from database)
$users = [
    'imesurya@gmail.com' => [
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 969696
        'name' => 'Ime Surya'
    ]
];

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if(isset($users[$email]) {
        if(password_verify($password, $users[$email]['password'])) {
            $token = [
                'email' => $email,
                'name' => $users[$email]['name'],
                'exp' => time() + (8 * 60 * 60) // 8 hours
            ];
            
            echo json_encode([
                'token' => base64_encode(json_encode($token)),
                'user' => [
                    'email' => $email,
                    'name' => $users[$email]['name']
                ]
            ]);
            exit;
        }
    }
    
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email or password']);
}
?>
