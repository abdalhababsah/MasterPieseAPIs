<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
include '../include/connect.php';



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        if (isset($data['PostID'])) {
            $postId = $data['PostID'];
            $query = "SELECT posts.* , users.Username , users.ProfilePictureURL AS profile_picture FROM posts JOIN users on users.UserID = posts.UserID WHERE PostID = ? ;";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$postId]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                echo json_encode($post);
            } else {
                echo json_encode(['message' => 'Post not found']);
            }
        } else {
            echo json_encode(['message' => 'Post ID not provided']);
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    echo json_encode(['message' => 'Incorrect request method']);
}

