<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__.'/../config/db.php';

// Data user valid (bisa diganti dengan query database)
$validUsers = [
    'imesurya@gmail.com' => [
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 969696
        'name' => 'Ime Surya',
        'role' => 'sales'
    ]
];

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($input['email']) || !isset($input['password'])) {
            throw new Exception('Email dan password harus diisi');
        }

        $email = $input['email'];
        $password = $input['password'];

        // Cek apakah user ada
        if (!array_key_exists($email, $validUsers)) {
            throw new Exception('Email tidak terdaftar');
        }

        $user = $validUsers[$email];

        // Verifikasi password
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Password salah');
        }

        // Buat token
        $tokenPayload = [
            'email' => $email,
            'name' => $user['name'],
            'role' => $user['role'],
            'exp' => time() + (8 * 3600) // 8 jam
        ];

        $token = base64_encode(json_encode($tokenPayload));

        // Response sukses
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'email' => $email,
                'name' => $user['name'],
                'role' => $user['role']
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
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
}
?>
