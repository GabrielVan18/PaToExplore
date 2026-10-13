<?php
require __DIR__ . '/admin_check.php';

$players = $pdo->query(
    "SELECT p.id, p.username, p.role, p.created_at, p.last_login,
            COUNT(g.id) AS records,
            COALESCE(MAX(g.score), 0) AS best_score,
            COUNT(DISTINCT g.chapter_key) AS chapters_done,
            MAX(g.played_at) AS last_played
     FROM players p
     LEFT JOIN game_sessions g ON g.player_id = p.id
     WHERE p.role = 'player'
     GROUP BY p.id
     ORDER BY p.created_at DESC"
)->fetchAll();

$recent = $pdo->query(
    "SELECT p.username, g.chapter_key, g.score, g.time_played_seconds, g.played_at
     FROM game_sessions g
     JOIN players p ON p.id = g.player_id
     ORDER BY g.played_at DESC, g.id DESC
     LIMIT 20"
)->fetchAll();

echo json_encode(['players' => $players, 'recent' => $recent]);