/**
* Class: A singleton that represents the functions for changing the HTML View on the checklist
*/
var ChecklistView = function() {

  this.addCourseToChecklistView = function(newCourse,semester) {
    var listing = newCourse.listing;
    var semester_name = user.current_schedule.convertSemesterName(semester);
    if (newCourse.requirement_filled == null) {
      //assign a course to the unassigned box
        $(".unassigned-classes").append("<div class='unassigned-classRow dragcolumnchecklist'><span class='data' data-name='" + listing  +
                    "' ><div class='course-name'>" + listing +
                    "</div><div class='course-credit'>"+ COURSE_INFORMATION[listing]["credits"] +"</div>" +
                    "<div class='course-semester'>" + semester_name + "</div>" +
                    " </span></div>");
      } else {
       $(".classRow").each(function(){
         for (var i = 0; i < this.childNodes.length; i++) {
              if (this.childNodes[i] != null) {
                 if (this.childNodes[i].innerHTML == newCourse.requirement_filled){
                  console.log(newCourse.requirement_filled);
                  
                  this.innerHTML = "<div class='requirement'>"+ newCourse.requirement_filled +
                    "</div><div class='drag-course dragcolumnchecklist'><span class='data' data-name='" + listing  +
                    "' ><div class='course-name'>" + listing +
                    "</div><div class='course-credit'>"+ COURSE_INFORMATION[listing]["credits"] +"</div>" +
                    "<div class='course-semester'>" + semester_name + "</div>" +
                    " </span></div>";
                 } 
              }
         }
       });
      }
      checklistcopySections();
      checklistDrag();
  }

  /* Takes in the Course object that will be deleted. */
  this.deleteCourseFromChecklistView = function(oldCourse) {
    $(".data").each(function(){
      if($(this).attr('data-name') == oldCourse.listing){
        $(this).parent().append(
                " <div class='course-name'>" + "" +
               "  </div><div class='course-credit'></div>" +
               "<div class='course-semester'> ");
       $(this).remove();
      }
    });

    $(".unassigned-classes").children().each(function(){
      if($.trim($(this).text()) == ""){
       $(this).remove();
      }
    });
  }

  /* The courses before they were about to be swapped. */
  this.swapCoursesOnChecklistView = function(semester1, course1, semester2, course2) {
    var tmp  = course1;
    var tmp2 = course2;
    //Swap the test in the checklist for each semester 
    semester1 = user.current_schedule.convertSemesterName(semester1);
    semester2 = user.current_schedule.convertSemesterName(semester2);

    $(".data").each(function(){
      if(tmp != null && $(this).attr('data-name') == tmp.listing){
        for (var i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i] != null) {
             if (this.childNodes[i].innerHTML == semester1) 
              this.childNodes[i].innerHTML =  semester2;
          }
        }
      }
      if(tmp2 != null && $(this).attr('data-name') == tmp2.listing){
        for (var i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i] != null) {
             if (this.childNodes[i].innerHTML == semester2) 
              this.childNodes[i].innerHTML =  semester1;
          }
        }
      }
    });
  }
};