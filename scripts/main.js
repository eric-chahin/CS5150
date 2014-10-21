/* Class: Loader is a singleton that contains methods to load the data into the website */
var Loader = function() {

  /* Retrieves User information. Creates dummy Guest User object if not logged in
     Returns: User object */
  this.fetchUser = function() {
    //TODO 

    //TODO Get AJAX call and pull data from User table
    //Builds schedule if new or old user

    //If cannot find user profile, create new one!:
      var schedule = new Schedule();
      var user = new User("Eric Chahin", 2012, schedule);
    //else:
      //TODO pass in AJAX User data from table into Schedule object
    return user;
  }

  /* Scans through the user object and loads all elements on the schedule and 
   * checklist. */
  this.applyUser = function(user) {
    //TODO: Put user's name somewhere on site
    //TODO: Change revision?
    //Apply schedule
    // $(".dragcolumn").html("CS1110");
    // var $carousel = $("#carousel-111948").children[0];
    var user_semesters = user.schedule.semesters;
    for (var i = 0; i < user_semesters.length; i++) {
      var user_semester = user_semesters[i];
      var $semester = $("#semester"+(i+1));
      var $courses = $semester.children();
      for (var j = 1; j <= 8; j++) {
        if (user_semester[j-1] && user_semester[j-1].listing) {
          $courses[j].innerHTML = user_semester[j-1].listing;
          $("#course_"+(i+1)+j).data("course",user_semester[j-1]);
        }
      }
    }
  }

  //TODO: initialize COURSE_INFORMATION (course_id -> Course_information object)
  this.initializeCourseInfo = function() {
    var rtn = {};
    $.ajax({
      type:     "GET",
      url:      "courses.php",
      async:    false,
      dataType: "json",
      cache: false,
      success: function(data){
        for (var x = 0; x < data.length; x++) {
          var entry = data[x];
          rtn[entry["course_listing"]] = entry;
        }
      }
    });
    return rtn;    
  }
}

function fillEmptySpots() {
  var cols = document.querySelectorAll('.dragcolumn');
  [].forEach.call(cols, function (col) {
    if (col.innerHTML == "") {
      $(col).css( "background-image", "url(/CS5150/img/hexagon_unfilled.png)");
    }
  }); 
}

//when page is finished loading, the main methods are called
$(document).ready(function(){
  var loader = new Loader();
  user = loader.fetchUser();
  loader.applyUser(user);

  //(course_id -> Course_information object)
  COURSE_INFORMATION = loader.initializeCourseInfo();

  alert(COURSE_INFORMATION["CS2110"]["prerequisites"]);
  fillEmptySpots();
});
