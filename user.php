<?php
    // Credentials
	header("Content-Type: application/json", true);
	//mysql defaults
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "";

	// the db name, which depends on what you name your db
	$dbname = "registration";


	//  Connection
	global $tutorial_db;

	$tutorial_db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

	$tutorial_db->set_charset("utf8");

	//  Check Connection
	if ($tutorial_db->connect_errno) {
    	printf("Connect failed: %s\n", $tutorial_db->connect_error);
    	exit();
	}
    
    if (isset($_POST['full_name'])) {
        //insert new user into db
        $netid = $_POST['netid'];
        $full_name = $_POST['full_name'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
        $schedules = $_POST['schedules'];
       
        $qry = "INSERT INTO member(netid,name,current_schedule_id,next_schedule_num,schedules)VALUES('$netid','$full_name','$current_schedule_id','$next_schedule_num','$schedules')";
        if ($tutorial_db->query($qry) == TRUE) {
            echo "ok";
        }
        else {
            //connection error
            echo "error";
        }
        
    }
    else if (isset($_POST['netid'])) {
       //save user state
        $netid = $_POST['netid'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
        $schedules = $_POST['schedules'];

        $qry = "UPDATE member SET current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num', schedules='$schedules' WHERE netid='$netid'";
    
        if ($tutorial_db->query($qry) == TRUE) {
            echo "ok";
        }
        else {
           //connection error
           echo "error";
        }
    }
    else if (isset($_GET['netid'])) {
        //get user information
        $netid = $_GET['netid'];

        $qry = "SELECT * FROM member WHERE netid='$netid'";
        $result = $tutorial_db->query($qry);
        //at most one row will be returned since netid is a unique identifier
        $row = mysqli_fetch_array($result);
        echo(json_encode($row));
    }

    

?>