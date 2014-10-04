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

  <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
  <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
  <![endif]-->

  <!-- Fav and touch icons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
  <link rel="shortcut icon" href="img/favicon.png">
  
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/scripts.js"></script>
</head>

<body>
 
 <div class="titlebanner">
 </div>
  
<div class="container">
	<div class="row clearfix">
		<div class="col-md-12 column">
			<div class="checklist_box">
				<img src="img/checklist.png">
				
			</div>
		</div>
	</div>
	<div class="row clearfix">
	  <div class="row" >
		<div class="col-md-12 column">
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
        <div class="row clearfix">
            <div class="row2" >
               <div class="col-md-12 column">
                   <div class= "core">
                    <div class= "coretitle"><img src= "img/text_core.png"></div>
                                                    <div class="hexagonCore">CS 2110</div>
                                                    <div class="hexagonCore">CS 4410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                    <div class="hexagonCore">CS 2110</div>
                                                    <div class="hexagonCore">CS 4410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                    <div class="hexagonCore">CS 3410</div>
                                                
                   </div>
                
               </div>
            </div>
        </div>
        
	<div class="row clearfix">
	  <div class="row3" >
	  <div class="col-md-4 column">
						<div class= "search"> Search </div>
			  </div>
		<div class="col-md-8 column">
			<div class="carousel slide" id="carousel-144942" data-interval="false">

				<div class="carousel-inner">
                                 <?php 
                                   $classnumber = 54;
                                   for ($i = 0; $i <= ($classnumber); $i+=18) {
                                    if ($i == 0) echo ('<div class="item active">');
                                    else echo ('<div class="item">');
                                    
                                          echo ('
					    <div class= "classContainer"> 
                                                <div class= "coursetitle"><img src= "img/text_courses.png"></div>
                                                     <div class="hexagon">CS 2110</div>
                                                     <div class="hexagon">CS 4410</div>
                                                     <div class="hexagon">CS 3110</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagonLeft">CS 3410</div>
                                                     <div class="hexagon">CS 2110</div>
                                                     <div class="hexagon">CS 4410</div>
                                                     <div class="hexagon">CS 3110</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 2110</div>
                                                     <div class="hexagon">CS 4410</div>
                                                     <div class="hexagon">CS 3110</div>
                                                     <div class="hexagonLeft">CS 3410</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 4410</div>
                                                     <div class="hexagon">CS 3110</div>
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
</body>
</html>
