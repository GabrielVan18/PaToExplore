<?php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/api/db.php';

function reply($status, $message = '', $extra = []) {
    echo json_encode(array_merge(['status' => $status, 'message' => $message], $extra));
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$action   = $data['action'] ?? '';
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    reply('error', 'Please fill in all fields!');
}

if ($action === 'register') {
    if (strlen($username) > 50)  reply('error', 'Username is too long (max 50 characters).');
    if (strlen($password) < 6)   reply('error', 'Password must be at least 6 characters.');
    try {
        $stmt = $pdo->prepare("INSERT INTO players (username, password_hash, role) VALUES (?, ?, 'player')");
        $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
        reply('success', 'Registered');
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) reply('error', 'Username already taken.');
        reply('error', 'Server error.');
    }
}

if ($action === 'login') {
    $stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM players WHERE username = ?');
    $stmt->execute([$username]);
    $p = $stmt->fetch();

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
}

reply('error', 'Invalid request.');