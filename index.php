<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Checklist Interactive</title>
  <meta name="description" content="">
  <meta name="author" content="">

	<!--link rel="stylesheet/less" href="less/bootstrap.less" type="text/css" /-->
	<!--link rel="stylesheet/less" href="less/responsive.less" type="text/css" /-->
	<!--script src="js/less-1.3.3.min.js"></script-->
	<!--append ‘#!watch’ to the browser URL, then refresh the page. -->
	
	
	<link href="css/mybootstrap.css" rel="stylesheet">
	<link href="css/style.css" rel="stylesheet">
  <!-- Magnific Popup core CSS file -->
  <link href="css/magnific-popup.css" rel="stylesheet"> 


  <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
  <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
  <![endif]-->

  <!-- Fav and touch icons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72"   href="img/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
  <link rel="shortcut icon" href="img/favicon.png">
  
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/scripts.js"></script>
        
  <!-- Load search js -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <!-- // <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script> -->
	<!-- <script type="text/javascript" src="scripts/jquery-ui.js"></script> -->
	<script type="text/javascript" src="scripts/search.js"></script>
	<!-- There is draga, dragb,dragc js files -->
	<script type="text/javascript" src="scripts/dragb.js"></script>
  <script type="text/javascript" src="scripts/models/course.js"></script>
  <script type="text/javascript" src="scripts/models/user.js"></script>
  <script type="text/javascript" src="scripts/models/schedule.js"></script>
  <script type="text/javascript" src="scripts/models/checklist.js"></script>
  <script type="text/javascript" src="scripts/models/rule.js"></script>
  <script type="text/javascript" src="scripts/main.js"></script>
  <script type="text/javascript" src="scripts/magnific-popup.js"></script>

</head>

<body>
 
 <div class="titlebanner">
 </div>
<div id="popup" class="white-popup mfp-with-anim mfp-hide">
  You may put any HTML here. This is dummy copy. It is not meant to be read. 
  It has been placed here solely to demonstrate the look and feel of finished, 
  typeset text. Only for show. He who searches for meaning here will be sorely 
  disappointed.
</div>

<div class="container" data-ng-controller="userController">
	<div class="row clearfix">
		<div class="col-md-12 column">
			<div class="checklist_box">
        <div class="classleftrow">

         </div>
         <div class="classrightrow">
                
         </div>
			</div>
		</div>
	</div>
	<div class="row clearfix">
	  <div class="row" >
		<div class="col-md-12 column">
      <div class="carousel_holder">
      <div class="carousel_container">
			<div class="carousel slide" id="carousel-111948" data-interval="false">
				
				<div class="carousel-inner">

          <?php
          include 'carousel.php';
          ?>

        </div><a class="left carousel-control" href="#carousel-111948" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>
				<a class="right carousel-control" href="#carousel-111948" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>
			</div>
        </div>
        </div>
		</div>
	</div>
	  </div>
        
	<div class="row clearfix">
	  <div class="row3" >
           
	  <div class="col-md-4 column" style="z-index: 1;">
      <div class= "search">
        <div class= "searchtitle">
          <img src= "img/text_search.png">
          <br><br>
          <input type="text" id="search" autocomplete="off">
        </div>
        <!-- Show Results -->
        <!-- <h4 id="results-text">Showing results for: <b id="search-string"></b></h4> -->
        <p>
  		    <div id="results"></div>
        </p>
      </div>        
			  </div>
		<div class="col-md-8 column">
      <div class = "refresh_holder_classContainer">
        <div class="classContainerChildren">
			<div class="carousel slide" id="carousel-144942" data-interval="false">

				<div class="carousel-inner">
          
                                 <?php 
                                 //keep this immediate place holder
                               
                                   $classnumber = 54;
                                   for ($i = 0; $i <= ($classnumber); $i+=18) {
                                    if ($i == 0) echo ('<div class="item active">');
                                    else echo ('<div class="item">');
                                   
                                          echo ('
					    <div class= "classContainer"> 
                                                <div class= "coursetitle"><img src= "img/text_courses.png"></div>
                                                     <div class="hexagon dragcolumn">CS 3152</div>
                                                     <div class="hexagon dragcolumn">CS 4152</div>
                                                     <div class="hexagon dragcolumn">MATH 1920</div>
                                                     <div class="hexagon dragcolumn">MATH 2940</div>
                                                     <div class="hexagon dragcolumn">CS 3410</div>
                                                     <div class="hexagonLeft dragcolumn">CS 3410</div>
                                                     <div class="hexagon dragcolumn">CS 2110</div>
                                                     <div class="hexagon dragcolumn">CS 4410</div>
                                                     <div class="hexagon dragcolumn">CS 3110</div>
                                                     <div class="hexagon dragcolumn">CS 3410</div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagonLeft dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
                                                     <div class="hexagon dragcolumn"></div>
					    </div>
					</div>
					');
                                   }
                                          ?>
                               </div> <a class="left carousel-control" href="#carousel-144942" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>
				<a class="right carousel-control" href="#carousel-144942" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>
			</div>
    </div>
    </div>
		    </div>
		</div>
	</div>

</div>
</body>
</html>
