
  function addToDesiredCourses(object){
    
    /* Fades the passed in div in and out */
    function fadeInFadeOut(jQuery_div) {

    }

    console.log("addToDesiredCourses");
    console.log(object);
    var course = object.getAttribute("data-course");
    var match = course.match(/\d+/);
    var numIndex = course.indexOf(match[0]);
    var course_spaced = course.substring(0,numIndex) + " " + course.substring(numIndex);
    //var name = object.text();
    //console.log(name);
    $(".classContainer > a > div").each(function(){
      // console.log($(this).text());
      if($(this).is(':empty')){

        if($(this).hasClass("hexagonLeft")){
          $(this).replaceWith('<div class="hexagonLeft dragcolumn searchdiv fadeinfadeout" new="true" draggable="true">' + course_spaced +'</div>');
        }else{
          $(this).replaceWith('<div class="hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true">' + course_spaced +'</div>');
        }
        copySections();
        applyrun();
        setTimeout(function() {

          $(".fadeinfadeout").removeClass('fadeinfadeout');
        },3000);
        return false;
      }
    })

    //.append('<a href="#popup" data-effect="mfp-zoom-out" class="open-popup-link"><div class="hexagonLeft dragcolumn searchdiv" new="true" draggable="true">' + "blank" +'</div></a>');
    return false;
  }