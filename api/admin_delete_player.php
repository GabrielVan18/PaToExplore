<?php
require __DIR__ . '/admin_check.php';

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int)($data['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid player id']);
    exit;
}

// Only player accounts can be deleted, never admins.
$stmt = $pdo->prepare("DELETE FROM players WHERE id = ? AND role = 'player'");
$stmt->execute([$id]);

echo json_encode(['success' => $stmt->rowCount() > 0]);