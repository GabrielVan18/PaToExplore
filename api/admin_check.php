<?php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/db.php';

if (empty($_SESSION['player_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$stmt = $pdo->prepare('SELECT role FROM players WHERE id = ?');
$stmt->execute([$_SESSION['player_id']]);
if ($stmt->fetchColumn() !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admins only']);
    exit;
}