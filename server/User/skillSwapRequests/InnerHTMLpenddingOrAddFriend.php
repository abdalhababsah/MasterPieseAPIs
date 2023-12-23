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

// ... (existing code remains unchanged)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (isset($data['senderID'], $data['receiverID'])) {
        $senderID = $data['senderID'];
        $receiverID = $data['receiverID'];

        try {
            $checkQuery = "SELECT * FROM SkillSwapRequests 
                           WHERE (SenderID = :senderID AND ReceiverID = :receiverID)
                           OR (SenderID = :receiverID AND ReceiverID = :senderID)";

            $checkStmt = $pdo->prepare($checkQuery);
            $checkStmt->bindParam(':senderID', $senderID);
            $checkStmt->bindParam(':receiverID', $receiverID);
            $checkStmt->execute();

            $requestStatus = "Add Friend"; // Default status if no matching request found

            while ($row = $checkStmt->fetch(PDO::FETCH_ASSOC)) {
                $currentStatus = $row['RequestStatus'];

                // If any request is accepted, set the status to "Accepted" and break
                if ($currentStatus == "Accepted") {
                    $requestStatus = "Friend";
                    break;
                } elseif ($currentStatus == "Pending" && $requestStatus != "Accepted") {
                    // If there is a pending request, update the status to "Pending"
                    $requestStatus = "Pending";
                }
            }

            http_response_code(200);
            echo json_encode(array("message" => $requestStatus));

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array("message" => "Error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON data. Required keys are missing."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>
