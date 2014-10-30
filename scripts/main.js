/* Class: Loader is a singleton that contains methods to load the data into the website */
var Loader = function() {

  /* Retrieves User information. Creates dummy Guest User object if not logged in
     Returns: User object */
  this.fetchUser = function() {
    //TODO 

    //TODO Get AJAX call and pull data from User table
    //Builds schedule if new or old user

    //If cannot find user profile, create new one!:
      var user = new User("Eric Chahin", 2012);
      var schedule = new Schedule();
      /* This needed to be set after the fact because checklist_rules are defined when
       * creating a checklist object and creating a schedule depends on knowing the 
       * checklist rules in order to add classes. */
      user.schedule = schedule; 
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
  //global enum
  FilterValue = Object.freeze({FORBIDDEN : 0, ALLOWED : 1, PERFECT : 2}); 
  //(course_id -> Course_information object)
  var loader = new Loader();
  COURSE_INFORMATION = loader.initializeCourseInfo();
  user = loader.fetchUser();
  loader.applyUser(user);

  // $('.open-popup-link').magnificPopup({
  //   type:'inline',
  //   midClick: true 
  // });


  $('.hexagon').wrap("<a href='#popup' data-effect='mfp-zoom-out' class='open-popup-link'></a>");
  $('.hexagonLeft').wrap("<a href='#popup' data-effect='mfp-zoom-out' class='open-popup-link'></a>");
  $('.open-popup-link').magnificPopup({
    type:'inline',
    removalDelay: 500, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function() {
         this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // alert(COURSE_INFORMATION["CS2110"]["prerequisites"]);
  fillEmptySpots();
  user.schedule.createChecklist();
  applyrun(); //This starts the dragging and dropping

});
