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

// Get Search
$version = $_GET['version'];
$table   = $_GET['table'];
$version = $tutorial_db->real_escape_string($version);
$table   = $tutorial_db->real_escape_string($table);

// Check Length More Than One Character
if (strlen($version) >= 1 && $version !== ' ') {
 
  $query = 'SELECT * FROM '.$table.' WHERE version ='.$version;
  // Do Search
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
}
?>