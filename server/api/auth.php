<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__.'/../config/db.php';

// Data user default
$defaultUser = [
    'email' => 'imesurya@gmail.com',
    // Password: 969696 (sudah di-hash)
    'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'name' => 'Ime Surya'
];

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($input['email']) || !isset($input['password'])) {
            throw new Exception('Email dan password harus diisi');
        }

        // Validasi email
        if ($input['email'] !== $defaultUser['email']) {
            throw new Exception('Email tidak terdaftar');
        }

        // Validasi password
        if (!password_verify($input['password'], $defaultUser['password'])) {
            throw new Exception('Password salah');
        }

        // Membuat token
        $payload = [
            'email' => $defaultUser['email'],
            'name' => $defaultUser['name'],
            'exp' => time() + (8 * 60 * 60) // 8 jam expiry
        ];

        $token = base64_encode(json_encode($payload));

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'email' => $defaultUser['email'],
                'name' => $defaultUser['name']
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
