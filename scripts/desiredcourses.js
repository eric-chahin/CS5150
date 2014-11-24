
  function addToDesiredCourses(object){
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
        var hexagon_id = this.id;
        // if($(this).hasClass("hexagonLeft")){
        //   $(this).replaceWith('<div class="hexagonLeft dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'">' + course_spaced +'</div>');
        // }else{
        //   $(this).replaceWith('<div class="hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'">' + course_spaced +'</div>');
        // }
        $(this).replaceWith('<div class="ui-state-default hexagon dragcolumn searchdiv fadeinfadeout" new="true" draggable="true" id="'+this.id+'">' + course_spaced +'</div>');
        // copySections();
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