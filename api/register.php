<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Username required; password must be at least 6 characters']);
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO players (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    echo json_encode(['success' => true, 'player_id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['error' => 'Username already taken']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Server error']);
    }
}