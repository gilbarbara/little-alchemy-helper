<?php
$url = isset($_REQUEST['url']) ? $_REQUEST['url'] : 'http://littlealchemy.com/offline/resources/base.113.json';
$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_URL => $url
));
$output = curl_exec($curl);
curl_close($curl);

header('Content-Type: application/json');
echo $output;
?>
