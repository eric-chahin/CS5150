<?php
                                for ($i = 1; $i <= 8; $i++) {
                                              //if the current semester is a start of a new carousel cell, then add the item div
                                              if ($i == 1 || $i == 5) {
                                                   if ($i == 1) echo ('<div class="item active">');
                                                   else if ($i == 5) echo ('<div class="item">');
                                                   echo ('<div class= "twoyear">');
                                              }
                                              //if this semester is the start of a year, put the year div in
                                              if ($i % 2 == 1) echo ('<div class= "year">');
                                              
                                              //echo the semester div every time
                                              echo ('<div class= "semester">');
                                              
                                              if ($i % 2 == 1) {
                                                      $img = "img/text_fall" . (($i+1)/2) . ".png";
                                              }
                                              else {
                                                      $img = "img/text_spring" . ($i/2) . ".png";
                                              }
                                      
                                              echo ('<div class="semestertitle"><img src= "'.$img.'"></div>');
                                              echo ('
                                                     <div class="hexagon">CS 2110</div>
                                                     <div class="hexagon">CS 4410</div>
                                                     <div class="hexagonLeft">CS 3110</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagon">CS 3410</div>
                                                     <div class="hexagonLeft">CS 3110</div>
                                                     <div class="hexagon">CS 3410</div>
                                                   </div>
                                                   ');
                                              if ($i % 2 == 0) {
                                                      echo ('</div>');
                                              }
                                      
                                              if ($i == 4 || $i == 8) {
                                                      echo ('</div></div>');
                                              }
                                      }
?>