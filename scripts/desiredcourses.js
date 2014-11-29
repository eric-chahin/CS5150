
  function addToDesiredCourses(object){
    var course = object.getAttribute("data-course");
    var match = course.match(/\d+/);
    var numIndex = course.indexOf(match[0]);
    var course_spaced = course.substring(0,numIndex) + " " + course.substring(numIndex);

    $(".classContainer > div > a > div").each(function(){
      if($(this).is(':empty')){
        var hex_id = "fade_id" + fade_id;
        fade_id++;
        var main_hexagon_id = $(this).parent().parent()[0].id;


        $(this).replaceWith('<div class="ui-state-default hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+hex_id+'">' + course_spaced +'</div>');
        var c_obj = new Course(course);
        user.current_schedule.addCourse(c_obj, -1);
        $("#" + main_hexagon_id).data("course",c_obj);


        checklist_view.fillEmptyScheduleSpots();
        applyrun();
        setTimeout(function() {
          $("#"+hex_id).removeClass('fadeinfadeout');
        },3000);
        return false;
      }
    })
    return false;
  }