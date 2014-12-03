
  function addToDesiredCourses(object){
    console.log("addToDesiredCourses");
    console.log(object);
    var course = object.getAttribute("data-course");
    var course_spaced = checklist_view.getCourseSpaced(course);
    //var name = object.text();
    //console.log(name);
    $(".classContainer > a > div").each(function(){
      // console.log($(this).text());
      if($(this).is(':empty')){
        var hexagon_id = this.id;
        // TODO - add in extra info- name of course, and course descr(?)
        if($(this).hasClass("hexagonLeft")){
          $(this).replaceWith('<div class="hexagonLeft dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'" data-course="' + course_spaced +'">' + course_spaced +'</div>');
        }else{
          $(this).replaceWith('<div class="hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'" data-course="' + course_spaced +'">' + course_spaced +'</div>');
        }
        copySections();
        checklist_view.fillEmptyScheduleSpots();
        applyrun();
        setTimeout(function() {
          $("#" + hexagon_id).removeClass('fadeinfadeout');
        },3000);
        return false;
      }
    })
    return false;
  }