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
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (isset($data['senderID'], $data['receiverID'], $data['skillID'])) {
        $senderID = $data['senderID'];
        $receiverID = $data['receiverID'];
        $skillID = $data['skillID'];

        try {
            $checkQuery = "SELECT * FROM SkillSwapRequests 
                           WHERE SenderID = :senderID 
                           AND ReceiverID = :receiverID 
                           AND SkillID = :skillID";

            $checkStmt = $pdo->prepare($checkQuery);
            $checkStmt->bindParam(':senderID', $senderID);
            $checkStmt->bindParam(':receiverID', $receiverID);
            $checkStmt->bindParam(':skillID', $skillID);
            $checkStmt->execute();

            if ($checkStmt->rowCount() > 0) {
                // Request exists, perform deletion
                $deleteQuery = "DELETE FROM SkillSwapRequests 
                                WHERE SenderID = :senderID 
                                AND ReceiverID = :receiverID 
                                AND SkillID = :skillID";

                $deleteStmt = $pdo->prepare($deleteQuery);
                $deleteStmt->bindParam(':senderID', $senderID);
                $deleteStmt->bindParam(':receiverID', $receiverID);
                $deleteStmt->bindParam(':skillID', $skillID);
                $deleteStmt->execute();

                if ($deleteStmt->rowCount() > 0) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Skill swap request deleted"));
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Could not delete skill swap request"));
                }
            } else {
                // Request doesn't exist, proceed with insertion
                $insertQuery = "INSERT INTO SkillSwapRequests (SenderID, ReceiverID, SkillID, RequestStatus) 
                                VALUES (:senderID, :receiverID, :skillID, 'Pending')";

                $insertStmt = $pdo->prepare($insertQuery);
                $insertStmt->bindParam(':senderID', $senderID);
                $insertStmt->bindParam(':receiverID', $receiverID);
                $insertStmt->bindParam(':skillID', $skillID);
                $insertStmt->execute();

                if ($insertStmt->rowCount() > 0) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Skill swap request sent!"));
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Could not send skill swap request"));
                }
            }
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