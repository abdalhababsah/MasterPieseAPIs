<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include '../include/connect.php';



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        if (!empty($data['UserID'])) {
            $userID = $data['UserID'];

            $query = "SELECT s.RequestID, s.SenderID, s.ReceiverID, s.SkillID,sender.ProfilePictureURL,sender.mainProffision, s.RequestStatus, sender.Username AS SenderUsername
                      FROM skillswaprequests s
                      INNER JOIN users sender ON s.SenderID = sender.UserID
                      WHERE s.ReceiverID = :userID or s.SenderID = :userID AND s.RequestStatus = 'Accepted'";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':userID', $userID);
            $stmt->execute();
            $pendingRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($pendingRequests) {
                echo json_encode($pendingRequests);
            } else {
                echo json_encode(array("message" => "No freinds swap requests found for this user"));
            }
        } else {
            echo json_encode(array("message" => "UserID not provided"));
        }
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    echo json_encode(array("message" => "Invalid request method"));
}
?>
