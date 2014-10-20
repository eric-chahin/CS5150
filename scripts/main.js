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
      var user = new User("Eric Chahin", 1.0, schedule);
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
}

/* Class: Schedule is a singleton that contains all the planned classes for the user, their "schedule". */
var Schedule = function() {
  //Semester 2D Array that contain Course objects
  this.semesters = new Array(8);
  for (var i = 0; i < this.semesters.length; i++) {
    this.semesters[i] = new Array(8);
  }

  /* If there is a new user, the method initializes the Schedule to the default
   * schedule which is defined in data/guest_data.csv */
  this.init_new_schedule = function() {
    //TODO read the CSV file
    //below is a test
    this.semesters[1][0] = new Course("CS1110",1,0);
    this.semesters[1][1] = new Course("CS2800",1,1);
    this.semesters[2][0] = new Course("CS2110",2,0);
    this.semesters[3][0] = new Course("CS3110",3,0);
  }

  //If new:
    this.init_new_schedule();
  //else:
    //TODO
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

  fillEmptySpots();
});
