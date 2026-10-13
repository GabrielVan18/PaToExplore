<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

if (empty($_SESSION['player_id'])) {
    echo json_encode(['logged_in' => false]);
    exit;
}

$stmt = $pdo->prepare('SELECT id, username, role FROM players WHERE id = ?');
$stmt->execute([$_SESSION['player_id']]);
$player = $stmt->fetch();

echo json_encode($player
    ? ['logged_in' => true, 'player_id' => $player['id'], 'username' => $player['username'], 'role' => $player['role']]
    : ['logged_in' => false]);