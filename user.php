<?php
    // Credentials
	header("Content-Type: application/json", true);
	//mysql defaults
    //Production
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

	$tutorial_db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

	$tutorial_db->set_charset("utf8");

	//  Check Connection
	if ($tutorial_db->connect_errno) {
    	printf("Connect failed: %s\n", $tutorial_db->connect_error);
    	exit();
	}
    
    // Insert new user into db
    if (isset($_POST['full_name'])) {
        $netid = $_POST['netid'];
        $full_name = $_POST['full_name'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
       
        mysql_query("START TRANSACTION");
        $qry1= "INSERT INTO member(netid,name,current_schedule_id,next_schedule_num)VALUES('$netid','$full_name','$current_schedule_id','$next_schedule_num')"; 
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
    // Delete user state
    else if (isset($_POST['isDelete'])){
        $netid = $_POST['netid'];
        $schedule_id = $_POST['schedule_id'];

        $qry1= "DELETE FROM schedule WHERE netid='$netid' AND schedule_id='$schedule_id'";

        if ($tutorial_db->query($qry1)) {
            echo "ok";
        } else {
            //connection error
            echo "error";
        }        
    }
    // Save user state
    else if (isset($_POST['netid'])) {
        $netid = $_POST['netid'];
        $current_schedule_id = $_POST['current_schedule_id'];
        $next_schedule_num = $_POST['next_schedule_num'];
        $version = $_POST['version'];
        $start_year = $_POST['start_year'];
        $schedules = $_POST['schedules'];
        $schedule_name = $tutorial_db->real_escape_string($_POST['schedule_name']);
        $checklist_data = $_POST['checklist_data'];
        $potential_courses = $_POST['potential_courses'];
        $isNew = $_POST['isNew'];
        $new_flag = ($isNew === 'true');
        
        //Create new entry in schedule table
        if ($new_flag) {
            mysql_query("START TRANSACTION");
            
            $qry1 = "INSERT INTO schedule(netid,schedule_id,version,start_year,schedule_name,schedule,checklist_data,potential_courses)VALUES('$netid','$current_schedule_id','$version','$start_year','$schedule_name','$schedules','$checklist_data','$potential_courses')";
            $qry2= "UPDATE member SET current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num' WHERE netid='$netid'";
            
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
        //Update schedule data and user data
        else {
            mysql_query("START TRANSACTION");
            
            $qry1="UPDATE member SET current_schedule_id='$current_schedule_id', next_schedule_num='$next_schedule_num' WHERE netid='$netid'";
            $qry2="UPDATE schedule SET schedule_name='$schedule_name', schedule='$schedules', checklist_data='$checklist_data', potential_courses='$potential_courses' WHERE netid='$netid' AND schedule_id='$current_schedule_id'";

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
    //Get user or schedule state
    else if (isset($_GET['netid'])) {
        $netid = $_GET['netid'];
        $isInitialLoad = $_GET['isInitialLoad'];
        $loadUser = ($isInitialLoad === 'true');
        
        //Retrieve schedule corresponding to the one with this id
        if (isset($_GET['schedule_id'])) {
            $schedule_id = $_GET['schedule_id'];
            
            $qry = "SELECT * FROM schedule WHERE netid='$netid' AND schedule_id='$schedule_id'";
            $result = $tutorial_db->query($qry);
            //exactly one row to be returned, since netid and schedul_id are
            //a key for the schedule table
            $row = mysqli_fetch_array($result);
            echo(json_encode($row));
        
        }
        //Get initial user information
        else if ($loadUser) {
            $qry = "SELECT * FROM member WHERE netid='$netid'";
            $result = $tutorial_db->query($qry);
            //at most one row will be returned since netid is a unique identifier
            $row = mysqli_fetch_array($result);
            echo(json_encode($row));
            
        }
        //Load schedule names for user with this netid
        else {
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