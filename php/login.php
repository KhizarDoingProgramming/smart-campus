<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
require_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email    = isset($data['email'])    ? trim($data['email'])    : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        exit;
    }
    $stmt = $conn->prepare("SELECT * FROM users WHERE (email = ? OR rollNo = ?) AND password = ?");
    $stmt->bind_param("sss", $email, $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        unset($user['password']);
        echo json_encode(['success' => true, 'message' => 'Login successful!', 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Only POST method allowed.']);
}
$conn->close();
?>