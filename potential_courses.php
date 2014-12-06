<?php
header("Content-Type: application/json", true);
// Credentials
//mysql defaults
// $dbhost = "localhost";
// $dbuser = "checklist";
// $dbpass = "zOPukWdPDt";

// // the db name, which depends on what you name your db
// $dbname = "checklistinteractive";

//Testing
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";

// // the db name, which depends on what you name your db
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
 
$query = 'SELECT * FROM potential_courses';
// Do Search
$result = $tutorial_db->query($query);

while($results = $result->fetch_array()) {
  $result_array[] = $results;
}
if ($result_array != null) {
  echo(json_encode($result_array));
} else {
  echo("[]");
}
?>