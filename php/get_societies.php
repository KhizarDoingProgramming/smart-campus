<?php
header('Content-Type: application/json');
require_once 'db.php';
$result = $conn->query("SELECT * FROM societies");
$societies = [];
while($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['members'] = (int)$row['members'];
    $societies[] = $row;
}
echo json_encode($societies);
$conn->close();
?>
