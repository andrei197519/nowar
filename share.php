<?php
require_once __DIR__ . '/photo_utils.php';

$photos = nowar_list_photos(__DIR__ . '/Photo');
$photo_map = [];
foreach ($photos as $photo) {
    $photo_map[$photo['file']] = $photo['comment'];
}

$requested = $_GET['photo'] ?? '';
if (!is_string($requested) || $requested === '' || !isset($photo_map[$requested])) {
    $requested = $photos[0]['file'] ?? '';
}
$comment = $requested !== '' ? $photo_map[$requested] : '';

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
    $scheme = $_SERVER['HTTP_X_FORWARDED_PROTO'];
}
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$base_url = $scheme . '://' . $host;

$image_url = $requested !== ''
    ? $base_url . '/Photo/' . rawurlencode($requested)
    : $base_url . '/og.jpg';
$page_url = $base_url . '/share.php?photo=' . rawurlencode($requested);
$title = 'STOP THE WAR';
$description = $comment !== '' ? $comment : 'NO TO WAR. FREEDOM FOR UKRAINE. END THE WAR NOW.';
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<meta property="og:type" content="website">
<meta property="og:title" content="<?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:description" content="<?php echo htmlspecialchars($description, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:url" content="<?php echo htmlspecialchars($page_url, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:image" content="<?php echo htmlspecialchars($image_url, ENT_QUOTES, 'UTF-8'); ?>">

<meta name="twitter:card" content="summary_large_image">
</head>
<body style="margin:0;background:#000;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;">
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;gap:16px;">
    <?php if ($requested !== ''): ?>
      <img src="<?php echo htmlspecialchars('/Photo/' . rawurlencode($requested), ENT_QUOTES, 'UTF-8'); ?>" alt="" style="max-width:92vw;max-height:70vh;object-fit:contain;">
    <?php endif; ?>
    <?php if ($comment !== ''): ?>
      <div style="max-width:900px;font-size:16px;opacity:.85;"><?php echo htmlspecialchars($comment, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>
    <a href="<?php echo htmlspecialchars('/maintenance.html?photo=' . rawurlencode($requested), ENT_QUOTES, 'UTF-8'); ?>" style="color:#ff2b2b;text-decoration:none;">Open the live page</a>
  </div>
</body>
</html>
