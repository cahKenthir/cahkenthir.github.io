<?php
// Konfigurasi Database
$db_host = 'localhost';
$db_name = 'telkomsel_sales';
$db_user = 'root';
$db_pass = '';

// Fungsi koneksi PDO
function getPDOConnection() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Koneksi database gagal: " . $e->getMessage());
    }
}

// Untuk autentikasi dengan database (contoh):
/*
function getUserByEmail($email) {
    $pdo = getPDOConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
*/
?>
