<?php
function nowar_clean_text($text) {
    $text = is_string($text) ? $text : '';
    $text = preg_replace('/\s+/u', ' ', $text);
    return trim($text);
}

function nowar_decode_user_comment($value) {
    if (!is_string($value) || $value === '') {
        return '';
    }
    $prefix = substr($value, 0, 8);
    if ($prefix === "ASCII\0\0\0") {
        return nowar_clean_text(substr($value, 8));
    }
    if ($prefix === "UNICODE\0") {
        $decoded = @iconv('UTF-16BE', 'UTF-8', substr($value, 8));
        return nowar_clean_text($decoded);
    }
    if ($prefix === "JIS\0\0\0\0\0") {
        return nowar_clean_text(substr($value, 8));
    }
    return nowar_clean_text($value);
}

function nowar_extract_comment($path) {
    $comment = '';

    if (function_exists('exif_read_data')) {
        $exif = @exif_read_data($path, null, true, false);
        if (is_array($exif)) {
            if (!empty($exif['IFD0']['XPComment'])) {
                $decoded = @iconv('UTF-16LE', 'UTF-8', $exif['IFD0']['XPComment']);
                $comment = nowar_clean_text($decoded);
            }
            if ($comment === '' && !empty($exif['IFD0']['ImageDescription'])) {
                $comment = nowar_clean_text($exif['IFD0']['ImageDescription']);
            }
            if ($comment === '' && !empty($exif['EXIF']['UserComment'])) {
                $comment = nowar_decode_user_comment($exif['EXIF']['UserComment']);
            }
        }
    }

    if ($comment === '') {
        $info = [];
        @getimagesize($path, $info);
        if (!empty($info['APP13'])) {
            $iptc = @iptcparse($info['APP13']);
            if (is_array($iptc)) {
                $fields = ['2#120', '2#005', '2#025'];
                foreach ($fields as $field) {
                    if (!empty($iptc[$field][0])) {
                        $comment = nowar_clean_text($iptc[$field][0]);
                        break;
                    }
                }
            }
        }
    }

    return $comment;
}

function nowar_list_photos($dir) {
    if (!is_dir($dir)) {
        return [];
    }
    $files = array_values(array_filter(scandir($dir), function ($file) use ($dir) {
        if ($file === '.' || $file === '..') {
            return false;
        }
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (!is_file($path)) {
            return false;
        }
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        return in_array($ext, ['jpg', 'jpeg', 'png'], true);
    }));
    natcasesort($files);
    $files = array_values($files);

    $photos = [];
    foreach ($files as $file) {
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        $photos[] = [
            'file' => $file,
            'comment' => nowar_extract_comment($path),
        ];
    }
    return $photos;
}
