<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

if (empty($_SESSION['player_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$score   = max(0, (int)($data['score'] ?? 0));
$level   = max(1, (int)($data['level'] ?? 1));
$seconds = max(0, (int)($data['seconds'] ?? 0));

$allowed = ['Prologue', 'Chapter1', 'Chapter2', 'Chapter3', 'Chapter4', 'Chapter5'];
$chapter = $data['chapter'] ?? null;
if (!in_array($chapter, $allowed, true)) {
    $chapter = null;
}

$stmt = $pdo->prepare(
    'INSERT INTO game_sessions (player_id, score, level_reached, chapter_key, time_played_seconds)
     VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$_SESSION['player_id'], $score, $level, $chapter, $seconds]);

echo json_encode(['success' => true]);