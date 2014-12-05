/**
* Class: A singleton that represents the functions for changing the HTML View on the checklist
*/
var ChecklistView = function() {

  this.addCourseToChecklistView = function(newCourse,semester) {
    var listing = newCourse.listing;
    var semester_name = user.current_schedule.convertSemesterName(semester);
    if (newCourse.getRequirementFilled() == null) {
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
                if (this.childNodes[i].innerHTML == newCourse.getRequirementFilled() &&  this.childNodes[i+2].innerText == ""){
                  //console.log(newCourse.getRequirementFilled());
                  
                  this.innerHTML = "<div class='requirement'>"+ newCourse.getRequirementFilled() +
                    "</div><div class='warning-col'></div><div class='drag-course dragcolumnchecklist'><span class='data' data-name='" + listing  +
                    "' ><div class='course-name'>" + listing +
                    "</div><div class='course-credit'>"+ COURSE_INFORMATION[listing]["credits"] +"</div>" +
                    "<div class='course-semester'>" + semester_name + "</div>" +
                    " </span></div>";
                  return false; // Once the course is placed, then we should get out of the each loop.
                 } 
              }
         }
       });
      }
      checklistcopySections();
      checklistDrag();
      this.addChecklistWarnings();
  }

  /* View method to clean the divs and DOM for loading in a new schedule and checklist 
   * Explicit parameter number_of_semesters to not run this method in the wrong order. */
  this.wipeViewsClean = function(number_of_semesters) {
    this.deleteChecklistView();
    for (var s = 1; s <= number_of_semesters; s++) {
      if (s == 9 || s == 10){
        for (var course_i = 1; course_i <= 18; course_i++){
          $("#course_"+s+course_i).text("");
        }
      } else {
        for (var course_i = 1; course_i <= 8; course_i++) {
          $("#course_"+s+course_i).text("");
        }
      }
    }
  }

  /* Deletes entire checklist. Important for loading in a new checklist. */
  this.deleteChecklistView = function() {
    $(".classleftrow").empty();
    $(".classrightrow").empty();
  }
  
  /* Fills empty spots on the schedule. */
  this.fillEmptyScheduleSpots = function() {
    var cols = document.querySelectorAll('.dragcolumn');
    [].forEach.call(cols, function (col) {
      if (col.innerHTML == "") {
        $(col).css( "background-image", "url(/CS5150/img/hexagon_unfilled.png)");
      } else {
        var listing = col.innerText.replace(" ","");
        var color = HEXAGON_COLORS[listing];
        if (color) {
          var color_url = "/CS5150/img/hexagon_"+color+".png";
          $(col).css( "background-image", "url("+color_url+")");
        } else {
          $(col).css( "background-image", "url(/CS5150/img/hexagon.png)");
        }
      }
    }); 
  }

  /* Takes in a String array and updates the entire potential courses divs. */
  this.updatePotentialCourses = function(listing_array) {
    var i = 0;
    var selector = ".classContainer > a > div";
    if ($(selector).length == 0) {
      var selector = ".classContainer > div.dragcolumn";
    } 
    $(selector).each(function(){
      if (!(i < listing_array.length)) return false; // Acts like a while loop
      this.textContent = checklist_view.getCourseSpaced(listing_array[i]);
      i += 1;
    });
  }

  /* Returns a String array of the Potential Courses hexagons. */
  this.getPotentialCourses = function() {
    var potential_array = [];
    var selector = ".classContainer > a > div";
    if ($(selector).length == 0) {
      var selector = ".classContainer > div.dragcolumn";
    } 
    $(selector).each(function(){
      if (this.textContent != ""){
        potential_array.push(this.textContent);
      }
    });
    return potential_array;
  }

  /* Returns the course listing with a space for easy viewing. */
  this.getCourseSpaced = function(course) {
    var match = course.match(/\d+/);
    if (match == null) return course;
    var numIndex = course.indexOf(match[0]);
    return course.substring(0,numIndex) + " " + course.substring(numIndex);
  }

  /* Create warning message */
  this.addCourseWarning = function(warning_code) {
        var html = "";
        //Excluded Warning
        if (warning_code == WarningType.FORBIDDEN) {
          //Warning: Excluded Course                            
           html = "<a class='hvrlink'><img src='img/warning_excluded.png' alt='Excluded Course Warning'></a>" +
            "<div class='course-warning'>" +
              "<h3 class='title'>Warning: Excluded Course</h3>" +
              "<p class='desc'>The course you have placed in this requirement is listed under excluded courses.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";                                                                       
        }
        //Level Warning
        if (warning_code == WarningType.COURSE_LEVEL || warning_code == WarningType.CREDITS) {
           // Warning: Course Level
           html = "<a class='hvrlink'><img src='img/warning_level.png' alt='Course Level Warning'></a>" +
            "<div class='course-warning'>" + 
              "<h3 class='title'>Warning: Course Level</h3>" +
              "<p class='desc'>The class you have added is not 3000+ level or 3+ credits.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";
        }
        //Specific Warning
        if (warning_code == WarningType.SPECIFIC_CLASS) {
          // Warning: Specific Course Needed
        html =  "<a class='hvrlink'><img src='img/warning_specific.png' alt='Specific Course Warning'></a>"+
            "<div class='course-warning'>"+
              "<h3 class='title'>Warning: Specific Course Needed</h3>"+
              "<p class='desc'>Only specific classes can fulfill this requirement and this course is not listed.  Double-check that the course satisfies the requirement or add an alternative course to your checklist.</p>" +
            "</div>";
        }
        
        //Vector Warning
        if (warning_code == WarningType.VECTOR) {
          // Warning: Vector Unfulfilled
        html =  "<a class='hvrlink'><img src='img/warning_vector.png' alt='Unfulfilled Vector Warning'></a>"+
            "<div class='course-warning'>"+
              "<h3 class='title'>Warning: Unfulfilled Vector</h3>"+
              "<p class='desc'>It appears that you have not yet fulfilled this vector; one or more courses required for the vector are missing from your schedule.  For more information on vector requirements, click <a href='http://www.cs.cornell.edu/undergrad/csmajor/vectors'>here.</a></p>" +
            "</div>";
        }
        return html;
  }
            
  this.addChecklistWarnings = function(){
    var currentSched =  user.current_schedule;

    $(".warning-col").each(function(){
      $(this).html("");
    });
        
    for (var i = 0; i < currentSched.semesters.length; i++) {
      for (var j = 0; j < currentSched.semesters[i].length; j++) {
        var tmp = currentSched.semesters[i][j];
        var req = null;
        $('.drag-course').children('.data').each(function(){
          if(tmp != null && $(this).attr('data-name') == tmp.listing){
            if (tmp == null) {
              $(this).parent().prev().html("");
            } else {
              req = $(this).parent().prev().prev().html();
              tmp.setRequirementFilled(req);
              var warning = "";
              if (tmp.warnings.length > 0) {
                warning = checklist_view.addCourseWarning(tmp.warnings[0]);
              }
              $(this).parent().prev().html(warning);
            }
          }
        });
      }
    }
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
    checklist_view.addChecklistWarnings(); // Update warnings after dragging into the trash
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