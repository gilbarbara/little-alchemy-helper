<?php
$file = isset($_REQUEST['file']) ? $_REQUEST['file'] : 'base.json';
$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_URL => 'http://littlealchemy.com/base/'.$file
));
$output = curl_exec($curl);
curl_close($curl);

header('Content-Type: application/json');
echo $output;
?>