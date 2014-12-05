<?php
  for ($i = 1; $i <= 8; $i++) {
    //if the current semester is a start of a new carousel cell, then add the item div
    if ($i == 1 || $i == 5) {
      if ($i == 1) echo ('<div class="item active" id="year_first">');
      else if ($i == 5) echo ('<div class="item" id="year_second">');
      echo ('<div class= "twoyear">');
    }
    //if this semester is the start of a year, put the year div in
    if ($i % 2 == 1) echo ('<div class= "year">');
    
    //echo the semester div every time
    echo (sprintf('<div id="semester%d" class= "semester">', $i));
    
    if ($i % 2 == 1) {
      $sem_title = "FALL " . (($i+1)/2);
    }
    else {
      $sem_title = "SPRING " . ($i/2);
    }
    
    if ($i <= 2) {
        $sem_sub = "FRESHMAN";
    } else if ($i == 3 || $i == 4){
        $sem_sub = "SOPHOMORE";
    } else if ($i == 5 || $i == 6) {
        $sem_sub = "JUNIOR";
    } else if ($i == 7 || $i == 8) {
        $sem_sub = "SENIOR";
    } else {
        $sem_sub = "";
    }

    echo ('<div class="semestertitle"><div class="semestertitle_main">'.$sem_title.'</div><div class="semestertitle_sub">'.$sem_sub.'</div></div>');
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,1));
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,2));
    echo (sprintf('<div id="course_%d%d" class="hexagonLeft dragcolumn"></div>',$i,3));
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,4));
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,5));
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,6));
    echo (sprintf('<div id="course_%d%d" class="hexagonLeft dragcolumn"></div>',$i,7));
    echo (sprintf('<div id="course_%d%d" class="hexagon dragcolumn"></div>',$i,8));
    echo('</div>');
    if ($i % 2 == 0) {
      echo ('</div>');
    }

    if ($i == 4 || $i == 8) {
      echo ('</div></div>');
    }
  }
         $hexagons_per_panel = 18;
          $htmlString = '<div class="item" id="year_third" ><div class= "semester9" id="semester9"> <div class= "coursetitle"><img src= "img/text_extra_semester.png"></div>';
            for ($j = 1; $j <= $hexagons_per_panel;$j+=1) {
              if ($j % $hexagons_per_panel == 5 || $j % $hexagons_per_panel == 14) {
              
                $htmlString .= sprintf('<div id="course_9%d" class="hexagonLeft dragcolumn"></div>',$j);
              } else {
                 $htmlString .= sprintf('<div id="course_9%d" class="hexagon dragcolumn"></div>',$j);
              }
            }
          $htmlString .= '</div>';
       echo ($htmlString);
       
       
       
       $hexagons_per_panel = 18;
          $htmlString = '<div class= "semester10" id="semester10"> <div class= "coursetitle"><img src= "img/text_extra_semester.png"></div>';
            for ($j = 1; $j <= $hexagons_per_panel;$j+=1) {
              if ($j % $hexagons_per_panel == 5 || $j % $hexagons_per_panel == 14) {
              
                $htmlString .= sprintf('<div id="course_10%d" class="hexagonLeft dragcolumn"></div>',$j);
              } else {
                 $htmlString .= sprintf('<div id="course_10%d" class="hexagon dragcolumn"></div>',$j);
              }
            }
          $htmlString .= '</div></div>';
       echo ($htmlString);
       
?>