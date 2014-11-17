<?php
    // Credentials
	header("Content-Type: application/json", true);
	//mysql defaults
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "";

	// the db name, which depends on what you name your db
	$dbname = "test";


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
        $schedule_name = $_POST['schedule_name']; 
       
        mysql_query("START TRANSACTION");
        //TODO: use a transaction to handle possible database failures
        $qry1= "INSERT INTO member(netid,name,current_schedule_id,next_schedule_num,schedules)VALUES('$netid','$full_name','$current_schedule_id','$next_schedule_num','$schedules')"; 
      //  $qry2= "INSERT INTO schedule(netid,schedule_id,schedule_name,schedule)VALUES('$netid','$current_schedule_id','$schedule_name','$schedules')";

        if ($tutorial_db->query($qry1)) {
            mysql_query("COMMIT");
            echo "ok";
        }
        else {
            //connection error
            mysql_query("ROLLBACK"); 
            echo "error";
        }
        
    }
    else if (isset($_POST['netid'])) {
       //save user state
        $netid = $_POST['netid'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
        $schedules = $_POST['schedules'];
        $schedule_name = $_POST['schedule_name'];
        $isNew = $_POST['isNew'];
        $new_flag = ($isNew === 'true');
        
        if ($new_flag) {
            //create new entry in schedule table
            mysql_query("START TRANSACTION");
            
            $qry1 = "INSERT INTO schedule(netid,schedule_id,schedule_name,schedule)VALUES('$netid','$current_schedule_id','$schedule_name','$schedules')";
            $qry2= "UPDATE member SET current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num', schedules='$schedules' WHERE netid='$netid'";
            
            if ($tutorial_db->query($qry1) and $tutorial_db->query($qry2)) {
                mysql_query("COMMIT");
                echo "ok";
            }
            else {
                //connection error
                mysql_query("ROLLBACK");
                echo "error";
            }
            
        }
        else {
            //update schedule data and user data
            
            //$qry = "UPDATE member, schedule SET member.current_schedule_id='$current_schedule_id', member.next_schedule_num='$next_schedule_num', member.schedules='$schedules', schedule.schedule_id='$current_schedule_id', schedule.schedule_name='$schedule_name', schedule.schedule='$schedules' WHERE member.netid= schedule.netid AND schedule.current_schedule_id='$current_schedule_id'";
            mysql_query("START TRANSACTION");
            
            $qry1="UPDATE member SET current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num', schedules='$schedules' WHERE netid='$netid'";
            $qry2="UPDATE schedule SET schedule_name='$schedule_name', schedule='$schedules' WHERE netid='$netid' AND schedule_id='$current_schedule_id'";
            
            if ($tutorial_db->query($qry1) and $tutorial_db->query($qry2)) {
                mysql_query("COMMIT");
                echo "ok";
            }
            else {
                //connection error
                mysql_query("ROLLBACK");
                echo "error";
            }

            
        }
    }
    else if (isset($_GET['netid'])) {
        $netid = $_GET['netid'];
        $isInitialLoad = $_GET['isInitialLoad'];
        $loadUser = ($isInitialLoad === 'true');
        
        if (isset($_GET['schedule_id'])) {
            //retrieve schedule corresponding the the one with this id
            $schedule_id = $_GET['schedule_id'];
            
            $qry = "SELECT * FROM schedule WHERE netid='$netid' AND schedule_id='$schedule_id'";
            $result = $tutorial_db->query($qry);
            //exactly one row to be returned, since netid and schedul_id are
            //a key for the schedule table
            $row = mysqli_fetch_array($result);
            echo(json_encode($row));
        
        }
        else if ($loadUser) {
            //get initial user information
            $qry = "SELECT * FROM member WHERE netid='$netid'";
            $result = $tutorial_db->query($qry);
            //at most one row will be returned since netid is a unique identifier
            $row = mysqli_fetch_array($result);
            echo(json_encode($row));
            
        }
        else {
            //load scchedule names for user with this netid
            $netid = $_GET['netid'];
            
            $qry = "SELECT schedule_id, schedule_name FROM schedule WHERE netid='$netid'";
            $result = $tutorial_db->query($qry);
            
            $schedule_names = "";
            while ($row = mysqli_fetch_array($result)) {
                //each row corresponds to a different schedule for the current user
                //user a semicolon as delimiter
                $schedule_names .= $row[0] . ";" . $row[1] . ";";
            }
            echo(json_encode($schedule_names));
        }
    }
    

    

?>