
  function addToDesiredCourses(object){
    var course = object.getAttribute("data-course");
    var match = course.match(/\d+/);
    var numIndex = course.indexOf(match[0]);
    var course_spaced = course.substring(0,numIndex) + " " + course.substring(numIndex);
    //var name = object.text();
    //console.log(name);
    $(".classContainer > a > div").each(function(){
      // console.log($(this).text());
      if($(this).is(':empty')){
        var hexagon_id = this.id;
        if($(this).hasClass("hexagonLeft")){
          $(this).replaceWith('<div class="hexagonLeft dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'">' + course_spaced +'</div>');
        }else{
          $(this).replaceWith('<div class="hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'">' + course_spaced +'</div>');
        }
        copySections();
        applyrun();

        //Tie the course object to the DOM and load it to the model
        var c_obj = user.current_schedule.addCourse(course, -1, " because it is a potential course");
        $("#" + hexagon_id).data("course",c_obj);
        
        setTimeout(function() {
          $("#" + hexagon_id).removeClass('fadeinfadeout');
        },3000);
        return false;
      }
    })
    return false;
  }