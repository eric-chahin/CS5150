<?php
header("Content-Type: application/json", true);
// Credentials
//mysql defaults
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";

// the db name, which depends on what you name your db
$dbname = "test";


//  Connection
global $tutorial_db;

$tutorial_db = new mysqli();
$tutorial_db->connect($dbhost, $dbuser, $dbpass, $dbname);
$tutorial_db->set_charset("utf8");

//  Check Connection
if ($tutorial_db->connect_errno) {
    printf("Connect failed: %s\n", $tutorial_db->connect_error);
    exit();
}
 
$version = $_GET['version'];
$query = 'SELECT * FROM checkboxes WHERE version ="'.$version.'"';

$result = $tutorial_db->query($query);
$result_array = [];
while($results = $result->fetch_array()) {
  $result_array[] = $results;
}
if ($result_array != null) {
  echo(json_encode($result_array));
} else {
  echo("[]");
}
?>