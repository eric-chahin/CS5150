/**
* Class: A singleton that represents the functions for changing the HTML View on the checklist
*/
var ChecklistView = function() {

  this.addCourseToChecklistView = function(newCourse,semester) {
    var listing = newCourse.listing;
    var semester_name = user.current_schedule.convertSemesterName(semester);
    if (newCourse.getRequirementFilled() == undefined) {
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
                 if (this.childNodes[i].innerHTML == newCourse.getRequirementFilled()){
                  console.log(newCourse.getRequirementFilled());
                  
                  this.innerHTML = "<div class='requirement'>"+ newCourse.getRequirementFilled() +
                    "</div><div class='warning-col'></div><div class='drag-course dragcolumnchecklist'><span class='data' data-name='" + listing  +
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
  
  /* Create warning message */
  this.addCourseWarning = function(warning_code) {
        var html = "";
        //Excluded Warning
        if (warning_code == WarningType.FORBIDDEN) {
          //Warning: Excluded Course                            
           html = "<a class='hvrlink'><img src='img/warning_excluded.png' alt='Excluded Course Warning'></a>" +
            "<div class='details-pane'>" +
              "<h3 class='title'>Warning: Excluded Course</h3>" +
              "<p class='desc'>The course you have placed in this requirement is listed under excluded courses.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";                                                                       
        }
        //Level Warning
        if (warning_code == WarningType.COURSE_LEVEL || warning_code == WarningType.CREDITS) {
           // Warning: Course Level
           html = "<a class='hvrlink'><img src='img/warning_level.png' alt='Course Level Warning'></a>" +
            "<div class='details-pane'>" + 
              "<h3 class='title'>Warning: Course Level</h3>" +
              "<p class='desc'>The class you have added is not 3000+ level or 3+ credits.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";
        }
        //Specific Warning
        if (warning_code == WarningType.SPECIFIC_CLASS) {
          // Warning: Specific Course Needed
        html =  "<a class='hvrlink'><img src='img/warning_specific.png' alt='Specific Course Warning'></a>"+
            "<div class='details-pane'>"+
              "<h3 class='title'>Warning: Specific Course Needed</h3>"+
              "<p class='desc'>Only specific classes can fulfill this requirement and this course is not listed.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";
        }
        
        return html;
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