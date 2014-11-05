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
    
   if (isset($_POST['current_schedule'])) {
        $netid = $_POST['netid'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
        $schedules = $_POST['schedules'];
        $full_name = $_POST['full_name'];
    
        $qry = "UPDATE member SET Name='$full_name', current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num', schedules='$schedules' WHERE netid='$netid'";
    
        if ($tutorial_db->query($qry) == TRUE) {
            echo "ok";
        }
        else {
           //connection error
           echo "error";
        }
    }
    else {
        $netid = $_GET['netid'];

        $qry = "SELECT * FROM member WHERE netid='$netid'";
        $result = $tutorial_db->query($qry);
        //only one row will be returned since netid is a unique identifier
        $row = mysqli_fetch_array($result);
        echo(json_encode($row));

    } 
?>