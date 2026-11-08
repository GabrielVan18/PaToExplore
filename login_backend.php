<?php
// ---------- CORS ----------
$allowedOrigins = [
    'https://patoexplore.vercel.app',
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Preflight request ng browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function reply($status, $message = '', $extra = [], $code = 200) {
    http_response_code($code);
    echo json_encode(array_merge(['status' => $status, 'message' => $message], $extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply('error', 'Method not allowed.', [], 405);
}

// ---------- Session (gumagana kahit cross-site) ----------
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => $isHttps,
    'httponly' => true,
    'samesite' => $isHttps ? 'None' : 'Lax',
]);
session_start();

// ---------- Database ----------
try {
    require __DIR__ . '/api/db.php';
} catch (Throwable $e) {
    reply('error', 'Database connection failed.', [], 500);
}

// ---------- Input ----------
$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$action   = $data['action'] ?? '';
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    reply('error', 'Please fill in all fields!');
}

// ---------- Register ----------
if ($action === 'register') {
    if (strlen($username) > 50) reply('error', 'Username is too long (max 50 characters).');
    if (strlen($password) < 6)  reply('error', 'Password must be at least 6 characters.');

    try {
        $stmt = $pdo->prepare("INSERT INTO players (username, password_hash, role) VALUES (?, ?, 'player')");
        $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
        reply('success', 'Registered');
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) reply('error', 'Username already taken.');
        reply('error', 'Server error.', [], 500);
    }
}

// ---------- Login ----------
if ($action === 'login') {
    try {
        $stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM players WHERE username = ?');
        $stmt->execute([$username]);
        $p = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$p || !password_verify($password, $p['password_hash'])) {
            reply('error', 'Invalid username or password.');
        }

        session_regenerate_id(true);
        $_SESSION['player_id'] = $p['id'];
        $_SESSION['role']      = $p['role'];
        $pdo->prepare('UPDATE players SET last_login = NOW() WHERE id = ?')->execute([$p['id']]);

        reply('success', '', [
            'role' => $p['role'],
            'user' => ['id' => (int)$p['id'], 'username' => $p['username'], 'role' => $p['role']],
        ]);
    } catch (PDOException $e) {
        reply('error', 'Server error.', [], 500);
    }
}

reply('error', 'Invalid request.');