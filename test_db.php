<?php
$host = "localhost";
$dbname = "paystack_db";
$username = "root";  // Default for XAMPP
$password = "";      // Default is empty for XAMPP

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "✅ Database connection successful!";
?>
