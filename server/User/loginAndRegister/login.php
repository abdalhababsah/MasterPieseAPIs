<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// {
//     "email": "admin@example.com",
//     "password": "abd12345"
// }

class UserAuthentication {
    private $pdo;

    public function __construct($db) {
        $this->pdo = $db;
    }

    public function authenticateUser($json_data) {
        $data = json_decode($json_data, true);

        if ($data && isset($data["email"]) && isset($data["password"])) {
            $email = $data["email"];
            $password = $data["password"];

            $query = "SELECT UserID , RolesID,mainProffision FROM users WHERE email = :email AND passwordHash = :password";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0) {  
                $user = $result[0];
                $response = array('STATUS' => true, 'ROLE' => $user['RolesID'], 'USER_ID' => $user['UserID'],'mainProffision' => $user['mainProffision']);
            } else {
                $response = array('STATUS' => false);
            }
        } else {
            $response = array('error' => 'Invalid JSON data');
        }

        return $response;
    }
}

include '../include/connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_data = file_get_contents('php://input');
    $authenticator = new UserAuthentication($pdo);
    $response = $authenticator->authenticateUser($json_data);
} else {
    $response = array('error' => 'Invalid request method');
}

header("Content-Type: application/json");
echo json_encode($response);

$pdo = null;

// {
//     "STATUS": true,
//     "ROLE": 1,
//     "USER_ID": 1
// }

