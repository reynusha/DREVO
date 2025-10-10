<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_POST['secret'] !== 'drevo123') {
    die(json_encode(['error' => 'Invalid secret']));
}

$newSupply = $_POST['supply'];
file_put_contents('supply-data.json', $newSupply);
echo json_encode(['success' => true]);
?>
