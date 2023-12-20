<?php
header("Access-Control-Allow-Origin: *"); // Replace * with the appropriate domain in production
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type");
// Database connection using PDO
$host = 'localhost';
$dbname = 'bot';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $getMesg = isset($_POST['text']) ? $_POST['text'] : '';
        $getMesgForQuery = $getMesg; 
        $getMesg = htmlspecialchars($getMesg);

        $check_data = "SELECT replies FROM chatbot WHERE queries LIKE :query";
        $stmt = $conn->prepare($check_data);
        $getMesgForQuery = "%" . $getMesgForQuery . "%"; 
        $stmt->bindParam(':query', $getMesgForQuery);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $fetch_data = $stmt->fetch(PDO::FETCH_ASSOC);
            $reply = $fetch_data['replies'];
            echo $reply;
        } else {
            echo "Sorry can't be able to understand you!";
        }
        $insert_data = "INSERT INTO userinputs (userData) VALUES (:userData)";
        $stmt_insert = $conn->prepare($insert_data);
        $stmt_insert->bindParam(':userData', $getMesg);
        $stmt_insert->execute();
    } else {
        echo "Method Not Allowed!";
    }
} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage();
}
?>