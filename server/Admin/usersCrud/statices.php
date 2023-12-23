<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
include '../include/connect.php';

try {
    

    // Users count
    $usersQuery = "SELECT COUNT(*) AS userCount FROM users";
    $usersStmt = $pdo->query($usersQuery);
    $userCount = $usersStmt->fetchColumn();

    // Posts count
    $postsQuery = "SELECT COUNT(*) AS postCount FROM posts";
    $postsStmt = $pdo->query($postsQuery);
    $postCount = $postsStmt->fetchColumn();

    // Friends count where status is 'accepted'
    $friendsQuery = "SELECT COUNT(*) AS friendCount FROM skillswaprequests WHERE RequestStatus = 'Accepted'";
    $friendsStmt = $pdo->query($friendsQuery);
    $friendCount = $friendsStmt->fetchColumn();

    // Combine counts into an array
    $counts = array(
        "userCount" => $userCount,
        "postCount" => $postCount,
        "friendCount" => $friendCount
    );

    // Return the counts as JSON
    echo json_encode($counts);

} catch (PDOException $e) {
    // Handle any errors
    http_response_code(500);
    echo json_encode(array("message" => "Internal Server Error: " . $e->getMessage()));
}
?>
