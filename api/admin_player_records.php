
<?php
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function sendJson($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

try {
    require __DIR__ . '/admin_check.php';

    if (!isset($pdo) || !($pdo instanceof PDO)) {
        throw new RuntimeException('Database connection is unavailable.');
    }

    $id = $_GET['id'] ?? '';

    if (!is_string($id) || !ctype_digit($id) || (int)$id < 1) {
        sendJson(400, [
            'success' => false,
            'error' => 'Invalid player ID.'
        ]);
    }

    $playerId = (int)$id;

    // Kunin ang player information.
    $stmt = $pdo->prepare("
        SELECT id, username, created_at, last_login
        FROM players
        WHERE id = ? AND role = 'player'
        LIMIT 1
    ");
    $stmt->execute([$playerId]);
    $player = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$player) {
        sendJson(404, [
            'success' => false,
            'error' => 'Player not found.'
        ]);
    }

    // Kunin ang game records at statistics.
    $stmt = $pdo->prepare("
        SELECT
            COUNT(*) AS records,
            COALESCE(MAX(score), 0) AS best_score,
            COUNT(DISTINCT chapter_key) AS chapters_done,
            MAX(played_at) AS last_played
        FROM game_sessions
        WHERE player_id = ?
    ");
    $stmt->execute([$playerId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    $player['records'] = (int)$stats['records'];
    $player['best_score'] = (int)$stats['best_score'];
    $player['chapters_done'] = (int)$stats['chapters_done'];
    $player['last_played'] = $stats['last_played'];

    // Kunin ang 20 pinakahuling game records.
    $stmt = $pdo->prepare("
        SELECT
            chapter_key,
            score,
            time_played_seconds,
            played_at
        FROM game_sessions
        WHERE player_id = ?
        ORDER BY played_at DESC
        LIMIT 20
    ");
    $stmt->execute([$playerId]);
    $recent = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($recent as &$record) {
        $record['score'] = (int)$record['score'];
        $record['time_played_seconds'] =
            (int)$record['time_played_seconds'];
    }
    unset($record);

    sendJson(200, [
        'success' => true,
        'player' => $player,
        'recent' => $recent
    ]);

} catch (Throwable $e) {
    error_log('Admin player records error: ' . $e->getMessage());

    sendJson(500, [
        'success' => false,
        'error' => 'Unable to retrieve player records. Check the PHP error log.'
    ]);
}
