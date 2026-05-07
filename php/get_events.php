<?php
header('Content-Type: application/json');
require_once 'db.php';
$result = $conn->query("SELECT * FROM events");
$events = [];
while($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['seats'] = (int)$row['seats'];
    $events[] = $row;
}
echo json_encode($events);
$conn->close();
?>
