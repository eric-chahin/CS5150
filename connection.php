<!--This code is used to connect our form to the database -->

<?php
// $mysql_hostname = "localhost";
// $mysql_user = "checklist";
// $mysql_password = "zOPukWdPDt";
// $mysql_database = "checklistinteractive"; //change this to current database

    //Testing
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";

    // // the db name, which depends on what you name your db
    $dbname = "test";
    
$prefix = "";
$bd = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $bd) or die("Could not select database");
?>