
<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db.php';

if (empty($_SESSION['player_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Not logged in'
    ]);
    exit;
}

$stmt = $pdo->prepare(
    'SELECT role FROM players WHERE id = ?'
);
$stmt->execute([$_SESSION['player_id']]);

if ($stmt->fetchColumn() !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Admins only'
    ]);
    exit;
}
