<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


$host = "localhost"; 
$dbname = "paystack_db";
$username = "Leeroyszn"; 
$password = "Leroy2003#"; 

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['reference'])) {
    die(json_encode(['success' => false, 'message' => 'No reference provided']));
}

$reference = $data['reference'];
$name = $data['name'];
$email = $data['email'];
$room = $data['room'];
$amount = $data['amount'];

$secretKey = 'sk_test_0eb77c7952b9c4b4c6fe9090a5eac72d4675c16c'; 

$url = "https://api.paystack.co/transaction/verify/" . $reference;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $secretKey",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if (!$result || !isset($result['data']['status']) || $result['data']['status'] !== 'success') {
    die(json_encode(['success' => false, 'message' => 'Payment verification failed!', 'error' => $result]));
}

$status = $result['data']['status'];
$stmt = $conn->prepare("INSERT INTO transactions (name, email, room, amount, reference, status) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiss", $name, $email, $room, $amount, $reference, $status);

if ($stmt->execute()) {
    $emailStatus = sendEmail($email, $name, $room, $amount, $reference);
    echo json_encode(['success' => true, 'message' => 'Payment verified and stored!', 'email' => $emailStatus]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database insert failed']);
}

$stmt->close();
$conn->close();

// Function to Send Email with PHPMailer
function sendEmail($email, $name, $room, $amount, $reference) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'aaronkurukigun@gmail.com';  // Your Gmail address
        $mail->Password   = 'mrlx xovj zpau tsvh';    // Your Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Email Content
        $mail->setFrom('aaronkurukigun@gmail.com', 'Dikim Rock Garden');
        $mail->addAddress($email, $name);
        $mail->isHTML(true);
        $mail->Subject = "Payment Confirmation - Room Booking";
        $mail->Body    = "<h3>Payment Successful!</h3>
                          <p>Thank you, <strong>$name</strong>, for booking a <strong>$room</strong>.</p>
                          <p>Amount Paid: <strong>₦$amount</strong></p>
                          <p>Reference: <strong>$reference</strong></p>
                          <p>We look forward to welcoming you!</p>";

    $mail->send();
return ['success' => true, 'message' => 'Email sent successfully'];
} catch (Exception $e) {
    return ['success' => false, 'message' => "Email failed: {$mail->ErrorInfo}"];
                      }
        }
?>
