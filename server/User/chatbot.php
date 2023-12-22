<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'bot';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $getMesg = isset($_POST['text']) ? $_POST['text'] : '';
        $getMesgForQuery = htmlspecialchars($getMesg);

        $check_data = "SELECT replies, redirect_url FROM chatbot WHERE queries LIKE :query";
        $stmt = $conn->prepare($check_data);
        $getMesgForQuery = "%" . $getMesgForQuery . "%";
        $stmt->bindParam(':query', $getMesgForQuery);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $fetch_data = $stmt->fetch(PDO::FETCH_ASSOC);
            $reply = $fetch_data['replies'];
            $redirectUrl = $fetch_data['redirect_url'];

            echo json_encode(array("reply" => $reply, "redirect" => $redirectUrl));
        } else {
            echo json_encode(array("reply" => "Sorry, I can't understand you!", "redirect" => ""));
        }
    } else {
        echo "Method Not Allowed!";
    }
} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage();
}
?>
