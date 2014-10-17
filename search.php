<?php

// Credentials
//mysql defaults
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";

// the db name, which depends on what you name your db
$dbname = "test";
/*

//	Connection
global $tutorial_db;

$tutorial_db = new mysqli();
$tutorial_db->connect($dbhost, $dbuser, $dbpass, $dbname);
$tutorial_db->set_charset("utf8");

//	Check Connection
if ($tutorial_db->connect_errno) {
    printf("Connect failed: %s\n", $tutorial_db->connect_error);
    exit();
}
*/
/************************************************
	Search Functionality
************************************************/

// Define Output HTML Formating
$html = '';
$html .= '<li class="result">';
$html .= '<a target="_blank" href="urlString">';
$html .= '<h3>nameString</h3>';
$html .= '<h4>functionString</h4>';
$html .= '</a>';
$html .= '</li>';
/*
// Get Search
$search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query']);
$search_string = $tutorial_db->real_escape_string($search_string);

// Check Length More Than One Character
if (strlen($search_string) >= 1 && $search_string !== ' ') {
	// Build Query
	//This is dependent on your database table name and the column names
	//mine is set up as so:
	//database: test
	// courseNames: name of the table
	//CourseName | CourseNumber | Course | Term
	//CS2110	 |2110			| Data Struct| Fall 	
	//CS3410	 |3410			| CompOrg	 | Fall
	//CS4410	 |4410			|OS          | Fall		
	$query = 'SELECT * FROM courseNames WHERE CourseName LIKE "%'.$search_string.'%" OR CourseName LIKE "%'.$search_string.'%"';

	// Do Search
	$result = $tutorial_db->query($query);
	
	
	while($results = $result->fetch_array()) {
		$result_array[] = $results;
	}*/
$result_array = array("CS 1110", "CS 2110", "CS 3110", "CS 4820", "CS 2800", "CS 3152", "CS 4152", "CS 4999");
	// Check If We Have Results
	$counter = 0;
	if (isset($result_array)) {

		foreach ($result_array as $result) {
		    if ($counter == 4) {
		        echo('<div class="hexagonLeft dragcolumn" >');
		    }else {
			echo('<div class="hexagon dragcolumn" new="true">');
		    }
			echo($result_array[$counter]."".'</div>');
			$counter = $counter + 1;
		}
	}else{
		// this is not correct
		// needs refining
		
		echo('<div class="hexagon dragcolumn new" >'.$result_array[$counter]."".'</div>'.'<script type="text/javascript" src="scripts/dragb.js"></script>');
	}
	$counter = 0;


?>