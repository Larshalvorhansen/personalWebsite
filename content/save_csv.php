<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true)['data'];
    file_put_contents('fisk.csv', $data);
    echo 'Saved successfully';
}
?>