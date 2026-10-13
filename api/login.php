<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

$stmt = $pdo->prepare('SELECT id, password_hash FROM players WHERE username = ?');
$stmt->execute([$username]);
$player = $stmt->fetch();

if (!$player || !password_verify($password, $player['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
    exit;
}

session_regenerate_id(true);
$_SESSION['player_id'] = $player['id'];
$pdo->prepare('UPDATE players SET last_login = NOW() WHERE id = ?')->execute([$player['id']]);

echo json_encode(['success' => true, 'player_id' => $player['id']]);