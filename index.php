<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Checklist Interactive</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta HTTP-EQUIV="Pragma" CONTENT="no-cache">
    
    <link href="css/mybootstrap.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <!-- Magnific Popup core CSS file -->
    <link href="css/magnific-popup.css" rel="stylesheet"> 


    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon" sizes="57x57" href="img/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="img/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="img/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="img/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="img/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="img/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon-180x180.png">
    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="icon" type="image/png" href="img/favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="img/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="img/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="img/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="img/favicon-32x32.png" sizes="32x32">
    <meta name="msapplication-TileColor" content="#2d89ef">
    <meta name="msapplication-TileImage" content="img/mstile-144x144.png">
    <meta name="msapplication-config" content="img/browserconfig.xml">
    
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/scripts.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="scripts/search.js"></script>
    <script type="text/javascript" src="scripts/dragb.js"></script>
    <script type="text/javascript" src="scripts/checklistdragb.js"></script>
    <script type="text/javascript" src="scripts/models/course.js"></script>
    <script type="text/javascript" src="scripts/models/user.js"></script>
    <script type="text/javascript" src="scripts/models/schedule.js"></script>
    <script type="text/javascript" src="scripts/models/checklist.js"></script>
    <script type="text/javascript" src="scripts/models/rule.js"></script>
    <script type="text/javascript" src="scripts/models/vector.js"></script>
    <script type="text/javascript" src="scripts/models/panel.js"></script>
    <script type="text/javascript" src="scripts/main.js"></script>
    <script type="text/javascript" src="scripts/magnific-popup.js"></script>
    <script type="text/javascript" src="scripts/scrolling.js"></script>
    <script type="text/javascript" src="scripts/desiredcourses.js"></script>
    <script type="text/javascript" src="scripts/views/ChecklistView.js"></script>  
    <script type="text/javascript" src="scripts/draghover.js"></script>

  </head>

  <body> 
    <div class="titlebanner"></div>
    
    <div id="sidebar">
      <div id="sidebarContainer">
        <div id="sidebarTitle">First Schedule</div>
        <div class="scrollclick" id="new"></div>
        <div class="scrollclick" id="load"></div>
        <div class="scrollclick" id="save"></div>
        <div class="scrollclick" id="print"></div>
        <div id="remove"></div>
      </div>
    </div>
      
    <div id="popup" class="white-popup mfp-with-anim mfp-hide">
    </div>
    
    <a class="left carousel-control" href="#carousel-144942" data-slide-to="1" id="jump_to_potential"></a>
      
      <div class="container" data-ng-controller="userController">
        <div class="row clearfix">
          <div id="firefox_warning">
            <h2>
              Checklist Interactive is unfortunately not supported on Firefox.
              Please use Chrome or Safari.
            </h2>
          <!-- For people who have JS turned off for some reason. -->
          <noscript>
          <h3>For full functionality of this page it is necessary to enable JavaScript.</h3>
          Here are the <a href="http://www.enable-javascript.com" target="_blank"> 
          instructions how to enable JavaScript in your web browser</a>
          </noscript>
          </div>
          <div class="col-md-12 column">
            <div class="checklist_container">
              <div class="checklist_box">
                <div id="top"></div>
                <div id="middle"></div>
                <div id="bottom"></div>
                <div id ="content_container">
                  <div id="content">
                    <div id= "tutorialchecklist"><img src = "img/instructions/tutorial_checklist.png"></div>
                    <div class= "checklisttitle">COMPUTER SCIENCE CHECKLIST</div>
                    <div id="checklisttitle_sub">College of Engineering</div>
                    <div class="classleftrow"></div>
                    <div class="classrightrow"></div>
                    <div class ="classbottom">
                      <div id="checklist_disclaimer">  
                      *NOTE: This page is NOT official. There is no guarantee that the placement of your courses on the checklist are correct.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row clearfix">
          <div class="row" >
            <div class="col-md-12 column">
              <div class="carousel_holder">
                <div class="carousel_container">
                  <div id= "tutorialschedule"><img src = "img/instructions/tutorial_schedule.png"></div>
                  <div class="carousel slide" id="carousel-111948" data-interval="false">
                    <div class="carousel-inner" id="semester-carousel">
                      <?php
                      include 'carousel.php';
                      ?>
                    </div>
                    <a class="left carousel-control" href="#carousel-111948" data-slide="prev" id="left_slider">
                      <span class="glyphicon glyphicon-chevron-left"></span>
                    </a>
                    <a class="right carousel-control" href="#carousel-111948" data-slide="next" id="right_slider">
                      <span class="glyphicon glyphicon-chevron-right"></span>
                    </a>
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
                <div id= "tutorialsearch"><img src = "img/instructions/tutorial_search.png"></div>
                <div class= "searchtitle">
                  <img src= "img/text_search.png">
                  <br><br>
                  <input type="text" id="search" autocomplete="off" placeholder="e.g. CS 5150">
                </div>
                <p><div id="results"></div></p>
                <div class="hexagon-key">
                  <div class="key-item"><img src="img/key_blue.png"><div id="key-text">CS Core</div></div>
                  <div class="key-item"><img src="img/key_red.png"><div id="key-text">Engineering</div></div>
                </div>
              </div>        
            </div>
            <div class="col-md-8 column">
              <div class = "refresh_holder_classContainer">
                <div class="classContainerChildren">
                  <div class="carousel slide" id="carousel-144942" data-interval="false">
                    <div class="carousel-inner">

                      <?php 
                      //keep this immediate place holder
                      $potential_courses_panel_count = 4;
                      $hexagons_per_panel = 18; 
                      for ($i = 0; $i < ($potential_courses_panel_count*$hexagons_per_panel); $i+=$hexagons_per_panel) {
                        if ($i == 0) echo ('<div class="item active">');
                        else echo ('<div class="item">');
                          echo ('
                              <div class= "classContainer"> 
                                <div class= "coursetitle"><img src= "img/text_potential_courses.png"></div>
                                ');
                        for ($j = 0; $j < $hexagons_per_panel;$j+=1) {
                          if ($j % $hexagons_per_panel == 5 || $j % $hexagons_per_panel == 14) {
                            // echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,1));
                            echo (sprintf('<div id="potential_%d" class="hexagonLeft dragcolumn"></div>',$i+$j));
                          } else {
                            echo (sprintf('<div id="potential_%d" class="hexagon dragcolumn"></div>',$i+$j));
                          }
                        }
                            echo ('
                              </div>
                            </div>
                        ');
                       }
                      ?>
                    </div>
                          
                    <a class="left carousel-control" href="#carousel-144942" data-slide="prev" id="left_slider_courses">
                      <span class="glyphicon glyphicon-chevron-left"></span>
                    </a>
                    <a class="right carousel-control" href="#carousel-144942" data-slide="next" id="right_slider_courses">
                      <span class="glyphicon glyphicon-chevron-right"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- DO NOT DELETE THESE BUTTONS BELOW HERE, IT IS IMPORTANT FOR DISPLAYING POPUPS -->
        <div style="display:none;"><button id="start_splash_page"></button></div>
        <div style="display:none;"><button id="start_schedule_error"></button></div>
        <div style="display:none;" id="printDiv"></div>
      </div>
      <br />
      <br />
      <br />
    </div>
  </body>
</html>
