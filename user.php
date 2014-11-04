<?php
    // Credentials
	header("Content-Type: application/json", true);
	//mysql defaults
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "";

	// the db name, which depends on what you name your db
	$dbname = "simple_login";


	//  Connection
	global $tutorial_db;

	$tutorial_db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

	$tutorial_db->set_charset("utf8");

	//  Check Connection
	if ($tutorial_db->connect_errno) {
    	printf("Connect failed: %s\n", $tutorial_db->connect_error);
    	exit();
	}
    
    $netid = $_POST['netid'];
    $current_schedule = $_POST['current_schedule'];
    $next_schedule_num = $_POST['next_schedule_num'];
    //$schedules = $_POST['schedules'];
    
    
    $qry = "UPDATE member SET current_schedule='$current_schedule', next_schedule_num='$next_schedule_num' WHERE netid='$netid'";
    
    if ($tutorial_db->query($qry) == TRUE) {
        echo "ok";
    }
    else {
        //connection error
        echo "error";
    }
?>