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
      $img = "img/text_fall" . (($i+1)/2) . ".png";
    }
    else {
      $img = "img/text_spring" . ($i/2) . ".png";
    }

    echo ('<div class="semestertitle"><img src= "'.$img.'"></div>');
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
?>