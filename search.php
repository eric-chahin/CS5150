<?php

// Credentials
//mysql defaults
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";

// the db name, which depends on what you name your db
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
	$query = 'SELECT * FROM courses WHERE course_listing or title LIKE "%'.$search_string.'%"';

	// Do Search
	$result = $tutorial_db->query($query);
	
	while($results = $result->fetch_array()) {
		$result_array[] = $results;
	}
	$counter = 0;
	if (isset($result_array) && empty($result_array) == false) {

		foreach ($result_array as $result) {
	    if (($counter -4 ) %7== 0 && $counter!=0) {
	    	//.wrap("<a href="#popup" data-effect="mfp-zoom-out" class="open-popup-link"></a>");
	       echo('<a href="#popup" data-effect="mfp-zoom-out" class="open-popup-link"><div class="hexagonLeft dragcolumn searchdiv" new="true" draggable="true">');
	    }else {
				echo('<a href="#popup" data-effect="mfp-zoom-out" class="open-popup-link"><div class="hexagon dragcolumn searchdiv" new="true" draggable="true">');
	    }
	    $elem = $result_array[$counter][0];
	    //find first number
	    preg_match('/^\D*(?=\d)/',$elem,$m);
	    $index_of_first_number = isset($m[0]) ? strlen($m[0]) : strlen($elem);
	    $num = substr($elem,$index_of_first_number);
	    $dept = substr($elem,0,$index_of_first_number);
			echo($dept." ".$num."".'</div></a>');
			$counter = $counter + 1;
		}
	}
	//if empty don't care
	/*else{
		//if empty
		
		//echo('<div class="hexagon dragcolumn new" >'.$result_array[$counter]."".'</div>'.'<script type="text/javascript" src="scripts/dragb.js"></script>');
	}*/
	$counter = 0;

}
?>