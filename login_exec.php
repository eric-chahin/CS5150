<?php
	//Start session
	session_start();
 
	//Include database connection details
	require_once('connection.php');
 
	//Array to store validation errors
	$errmsg_arr = array();
 
	//Validation error flag
	$errflag = false;
 
	//Function to sanitize values received from the form. Prevents SQL injection
	function clean($str) {
		$str = @trim($str);
		if(get_magic_quotes_gpc()) {
			$str = stripslashes($str);
		}
		return mysql_real_escape_string($str);
	}
 
	//Sanitize the POST values (temporariliy removed call to clean function)
	$user = $_POST['login-username'];
	$pass = $_POST['login-password'];
 
	//Input Validations
	if($username == '') {
		$errmsg_arr[] = 'Username missing';
		$errflag = true;
	}
	if($password == '') {
		$errmsg_arr[] = 'Password missing';
		$errflag = true;
	}
 
	//If there are input validations, redirect back to the login form
//	if($errflag) {
//		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
//		session_write_close();
//		header("location: login.php");
//		exit();
//	}
 
	//Create query
	$qry="SELECT COUNT(username) FROM member WHERE username='$user' AND password='$pass'";
	$result=mysql_query($qry);
    $rows = mysql_fetch_array($result);
	//Check whether the query was successful or not
	if($result) {
		if($rows[0]==1) {
			//Login Successful
		//	session_regenerate_id();
		//	$member = mysql_fetch_assoc($result);
		//	$_SESSION['SESS_MEMBER_ID'] = $member['mem_id'];
		//	$_SESSION['SESS_FIRST_NAME'] = $member['username'];
		//	$_SESSION['SESS_LAST_NAME'] = $member['password'];
		//	session_write_close();
			header("location: index.php");
			exit();
		}else {
			//Login failed
			$errmsg_arr[] = 'user name and password not found';
			$errflag = true;
			if($errflag) {
				$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
				session_write_close();
				header("location: login.php");
				exit();
			}
		}
	}else {
		die("Query failed");
	}
?>