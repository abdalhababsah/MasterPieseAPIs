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
                http_response_code(400);
                echo json_encode(array("message" => "Skill swap request already exists"));
            } else {
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
            echo json_encode(array("message" => "Error sending skill swap request: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON data. Required keys are missing."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}


// Include the file with database connection details
// include '../include/connect.php';

// Check if the request method is POST
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     // Retrieve data from the request body
//     $json_data = file_get_contents('php://input');
//     $data = json_decode($json_data, true);

//     // Check if required keys exist in the JSON data
//     if (isset($data['senderID'], $data['receiverID'], $data['skillID'])) {
//         // Retrieve data from JSON
//         $senderID = $data['senderID'];
//         $receiverID = $data['receiverID'];
//         $skillID = $data['skillID'];

//         try {
//             // Your SQL query to insert a new skill swap request
//             $query = "INSERT INTO SkillSwapRequests (SenderID, ReceiverID, SkillID, RequestStatus) 
//                       VALUES (:senderID, :receiverID, :skillID, 'Pending')";

//             // Prepare the SQL statement
//             $stmt = $pdo->prepare($query);

//             // Bind parameters
//             $stmt->bindParam(':senderID', $senderID);
//             $stmt->bindParam(':receiverID', $receiverID);
//             $stmt->bindParam(':skillID', $skillID);

//             // Execute the query
//             $stmt->execute();

//             // Check if the query was successful
//             if ($stmt->rowCount() > 0) {
//                 // Request successfully added
//                 http_response_code(201); // Set response code to 201 (Created)
//                 echo json_encode(array("message" => "Skill swap request sent!"));
//             } else {
//                 // If the request couldn't be added
//                 http_response_code(400); // Set response code to 400 (Bad Request)
//                 echo json_encode(array("message" => "Could not send skill swap request"));
//             }
//         } catch (PDOException $e) {
//             // Error handling if the query fails
//             http_response_code(500); // Set response code to 500 (Internal Server Error)
//             echo json_encode(array("message" => "Error sending skill swap request: " . $e->getMessage()));
//         }
//     } else {
//         // If required keys are not present in the JSON data
//         http_response_code(400); // Set response code to 400 (Bad Request)
//         echo json_encode(array("message" => "Invalid JSON data. Required keys are missing."));
//     }
// } else {
//     // If the request method is not POST
//     http_response_code(405); // Set response code to 405 (Method Not Allowed)
//     echo json_encode(array("message" => "Method not allowed"));
// }
