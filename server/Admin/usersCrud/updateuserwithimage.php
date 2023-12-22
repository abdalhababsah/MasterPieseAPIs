<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../include/connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_POST['id'] ?? null;
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $location = $_POST['location'] ?? '';
    $bio = $_POST['bio'] ?? '';
    $image = ''; // Initialize empty string for image file name

    // Input validation (basic examples)
    if ($userId === null || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($username) < 3) {
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }

    // Image upload handling
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $uploadDir = 'C:/xampp/htdocs/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/loginAndRegister/img/';
        $imageTmp = $_FILES['image']['tmp_name'];
        $image = basename($_FILES['image']['name']);
        move_uploaded_file($imageTmp, $uploadDir . $image);
    }

    // Update query preparation
    $updateQuery = "UPDATE users SET ";
    $setClauses = [];
    $params = [];

    if (!empty($username)) {
        $setClauses[] = "Username = ?";
        $params[] = $username;
    }
    if (!empty($image)) {
        $setClauses[] = "ProfilePictureURL = ?";
        $params[] = $image;
    }
    if (!empty($email)) {
        $setClauses[] = "Email = ?";
        $params[] = $email;
    }
    if (!empty($password)) {
        $setClauses[] = "PasswordHash = ?";
        $params[] = $password;
    }
    if (!empty($location)) {
        $setClauses[] = "Location = ?";
        $params[] = $location;
    }
    if (!empty($bio)) {
        $setClauses[] = "Bio = ?";
        $params[] = $bio;
    }

    if (count($setClauses) > 0) {
        $updateQuery .= implode(", ", $setClauses);
        $updateQuery .= " WHERE UserID = ?";
        $params[] = $userId;

        // Prepare and execute statement using PDO
        $stmt = $pdo->prepare($updateQuery);
        if ($stmt->execute($params)) {
            echo json_encode(['success' => 'Profile updated successfully.']);
        } else {
            echo json_encode(['error' => 'Update failed']);
        }
    } else {
        echo json_encode(['error' => 'No data to update']);
    }
} else {
    echo json_encode(['error' => 'Please use POST method']);
}

?>
