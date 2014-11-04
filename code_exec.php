<?php
session_start();
include('connection.php');
$email=$_POST['signup-email'];
$user=$_POST['signup-username'];
$password=$_POST['signup-password'];
    
$result1 = mysql_query("SELECT COUNT(netid) FROM member WHERE netid = '$user'");
    
$userRows = mysql_fetch_array($result1);
    
if (!$result1) {
    header("location: login.php");
}
    
if (!$userRows[0]) {
        mysql_query("INSERT INTO member(netid)VALUES('$user')");
        header("location: index.php?remarks=success");

} else {
    header("location: login.php?remarks=invalid_netid");
}
    
mysql_close($con);

?>