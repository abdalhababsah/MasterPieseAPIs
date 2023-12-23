<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "abodmaster");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password']; // Consider hashing this password
    $mainProffision = $_POST['mainProffision'];
    // Handle multiple image uploads for ProfilePictureURL
    $profileImageArray = array();
    if (!empty($_FILES['profile_picture']['name'])) {
        foreach ($_FILES['profile_picture']['name'] as $key => $value) {
            $img_name = time() . '_' . $_FILES['profile_picture']['name'][$key];
            $img_path = 'C:\xampp\htdocs\MasterPieseAPIsGithub\MasterPieseAPIs\server\User\loginAndRegister\img\\' . $img_name;

            move_uploaded_file($_FILES['profile_picture']['tmp_name'][$key], $img_path);

            // Add the image name to the array
            $profileImageArray[] = $img_name;
        }
    }

    // Add the image array to the data array
    $profilePictureURL = (!empty($profileImageArray)) ? implode(', ', $profileImageArray) : null;

    // Fixed the query and removed extra comma at the end of the columns
    $query = 'INSERT INTO users (Username, Email, PasswordHash, ProfilePictureURL, mainProffision) VALUES (?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($query);

    // $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt->bind_param("sssss", $username, $email, $password, $profilePictureURL, $mainProffision);

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['message' => 'User registered successfully']);
    } else {
        echo json_encode(['message' => 'Failed to register the user']);
    }
} else {
    echo json_encode(['message' => 'Incorrect request method']);
}
