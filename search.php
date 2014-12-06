<?php

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

// Get Search
$search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query']);
$search_string = $tutorial_db->real_escape_string($search_string);

// Check Length More Than One Character
if (strlen($search_string) >= 1 && $search_string !== ' ') {	
	//TODO searching for '  ' (two spaces) brings up results when it shouldn't really.
	$pos = strpos($search_string," ");
	if ($pos === false) {
		$search_space_deleted = $search_string;
	} else {
		$search_space_deleted = substr($search_string,0,$pos).substr($search_string,$pos+1);
	}
	$search_space_deleted = trim($search_space_deleted);

	$query = 'SELECT * FROM courses WHERE course_listing REGEXP "^'.$search_space_deleted.'" LIMIT 15';
	$result = $tutorial_db->query($query);
	while($results = $result->fetch_array()) {
		$result_array[] = $results;
	}

	$query = 'SELECT * FROM courses WHERE title LIKE "%'.$search_string.'%"  OR title LIKE "%'.$search_space_deleted.'%"'.' LIMIT 15';
	$result = $tutorial_db->query($query);
	while($results = $result->fetch_array()) {
		$result_array[] = $results;
	}

	$query = 'SELECT * FROM courses WHERE course_listing LIKE "%'.$search_string.'%"  OR course_listing LIKE "%'.$search_space_deleted.'%" OR title LIKE "%'. $search_string.'%" LIMIT 15';
	$result = $tutorial_db->query($query);
	while($results = $result->fetch_array()) {
		$result_array[] = $results;
	}

	//Removing duplicates from the 2D Array
	if (isset($result_array) && empty($result_array) == false) {
		$newArr = array();
		foreach ($result_array as $val) {
			$newArr[$val[0]] = $val;
		}
		$result_array = array_values($newArr);
	}

	$counter = 0;
	if (isset($result_array) && empty($result_array) == false) {
		foreach ($result_array as $result) {
	    $elem = $result_array[$counter][0];
	    $courseName = $result_array[$counter][1];
	    //find first number
	    preg_match('/^\D*(?=\d)/',$elem,$m);
	    $index_of_first_number = isset($m[0]) ? strlen($m[0]) : strlen($elem);
	    $num = substr($elem,$index_of_first_number);
	    $dept = substr($elem,0,$index_of_first_number);
	   	echo ('<div onclick="return addToDesiredCourses(this)" '.'data-course= '. $elem. ' ><div>');
	    //name of the course
			echo($dept." ".$num."");
			echo('<span>');
	    echo($courseName);
	    echo('</span>');
	    echo('</div></div>');
			$counter = $counter + 1;
		}
	}
}
?>