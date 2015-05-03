<?php
error_reporting(0);
$url = $_REQUEST['url'];
$file = preg_replace("/^.*\//", "", $url);

/* gets the contents of a file if it exists, otherwise grabs and caches */
function get_content($file, $url, $hours = 24, $fn = '', $fn_args = '') {
    //vars
    $current_time = time();
    $expire_time = $hours * 60 * 60;
    $file_time = filemtime($file);
    //decisions, decisions
    if (file_exists($file) && ($current_time - $expire_time < $file_time)) {
        //echo 'returning from cached file';
        return file_get_contents($file);
    } else {
        $content = get_url($url);
        if ($fn) {
            $content = $fn($content, $fn_args);
        }
        file_put_contents($file, $content);
        //echo 'retrieved fresh from '.$url.':: '.$content;
        return $content;
    }
}

/* gets content from a URL via curl */
function get_url($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    $content = curl_exec($ch);
    curl_close($ch);
    return $content;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo get_content($file, $url);
