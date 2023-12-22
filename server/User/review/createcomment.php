<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include '../include/connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // Validate and sanitize the input
        if (!empty($data['ReviewerID']) && !empty($data['TargetUserID']) && isset($data['Rating']) && isset($data['ReviewText'])) {
            $reviewerID = filter_var($data['ReviewerID'], FILTER_SANITIZE_NUMBER_INT);
            $targetUserID = filter_var($data['TargetUserID'], FILTER_SANITIZE_NUMBER_INT);
            $rating = filter_var($data['Rating'], FILTER_SANITIZE_NUMBER_INT);
            $reviewText = filter_var($data['ReviewText'], FILTER_SANITIZE_STRING);
            
            // Prepare an INSERT statement
            $query = "INSERT INTO reviewsratings (ReviewerID, TargetUserID, Rating, ReviewText) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$reviewerID, $targetUserID, $rating, $reviewText]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Review added successfully']);
            } else {
                echo json_encode(['message' => 'Failed to add review']);
            }
        } else {
            echo json_encode(['message' => 'Required fields are missing']);
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    echo json_encode(['message' => 'Incorrect request method']);
}
?>
