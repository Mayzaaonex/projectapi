<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$statsFile = __DIR__ . '/../data/stats.json';

if (!file_exists($statsFile)) {
    file_put_contents($statsFile, json_encode([
        'total_requests' => 0,
        'credits_used' => 0,
        'history' => []
    ]));
}

$stats = json_decode(file_get_contents($statsFile), true);

echo json_encode($stats);
?>