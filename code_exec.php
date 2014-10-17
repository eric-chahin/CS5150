<?php
session_start();
include('connection.php');
$email=$_POST['signup-email'];
$user=$_POST['signup-username'];
$password=$_POST['signup-password'];
    
$result1 = mysql_query("SELECT COUNT(username) FROM member WHERE username = '$user'");
$result2 = mysql_query("SELECT COUNT(address) FROM member WHERE address = '$email'");
    
$userRows = mysql_fetch_array($result1);
$addressRows = mysql_fetch_array($result2);
    
if (!$result1 || !$result2) {
    header("location: login.php");
}
    
if (!$userRows[0]) {
    if (!$addressRows[0]) {
        mysql_query("INSERT INTO member(address, username, password)VALUES('$email', '$user', '$password')");
        header("location: index.php?remarks=success");
    }
    else {
        header("location: login.php?remarks=invalid_email");
    }
}
else {
    header("location: login.php?remarks=invalid_username");
}
    
mysql_close($con);

?>