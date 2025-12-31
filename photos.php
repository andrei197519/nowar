<?php
require_once __DIR__ . '/photo_utils.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

$photos = nowar_list_photos(__DIR__ . '/Photo');
$payload = ['photos' => []];

foreach ($photos as $photo) {
    $payload['photos'][] = [
        'file' => $photo['file'],
        'comment' => $photo['comment'],
    ];
}

echo json_encode($payload, JSON_UNESCAPED_UNICODE);
