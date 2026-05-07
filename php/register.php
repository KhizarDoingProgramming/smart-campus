<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
require_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name     = isset($data['name'])     ? trim($data['name'])     : '';
    $email    = isset($data['email'])    ? trim($data['email'])    : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    $dept     = isset($data['dept'])     ? trim($data['dept'])     : '';
    $rollNo   = isset($data['rollNo'])   ? trim($data['rollNo'])   : '';
    $joinDate = date('Y-m-d');
    if (empty($name) || empty($email) || empty($password) || empty($dept)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, dept, rollNo, joinDate) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $password, $dept, $rollNo, $joinDate);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $conn->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Only POST method allowed.']);
}
$conn->close();
?>