/* Class: Loader is a singleton that contains methods to load the data into the website */
var Loader = function() {

  /* Retrieves User information. Creates dummy Guest User object if not logged in
     Returns: User object */
  this.fetchUser = function() {

    //TODO Get AJAX call and pull data from User table
    //Builds schedule if new or old user

    //If cannot find user profile, create new one!:
    var user = new User("Eric Chahin", "erc73", 2012, null, null, null);
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
    var user_semesters = user.current_schedule.semesters;
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

  this.initializeCourseInfo = function() {
    $.ajax({
      type:     "GET",
      url:      "courses.php",
      dataType: "json",
      cache: false,
      success: function(data){
        for (var x = 0; x < data.length; x++) {
          var entry = data[x];
          COURSE_INFORMATION[entry["course_listing"]] = entry;
        }
      }
    });
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

/* The method sets up a popup at the selector with the html.
 * Uses the white-popup class for CSS. 
 * If you have event listeners for the html that you pass in, then you can pass
 *   in a zero argument function into open_f that can access all the selectors in 
 *   your html arg.
 * There automatically is a button added to dismiss the popup.
 *   If you would like to turn that off, set dismiss_off to true. */
function makePopup(selector,html,open_f,dismiss_off) {
  var dismiss_button = "<br/><button class='dismiss'>Dismiss</button>";
  if (dismiss_off)
    dismiss_button = "";
  $(selector).attr('data-effect','mfp-zoom-out');
  $(selector).magnificPopup({
    type: 'inline',
    removalDelay: 500, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function() {
        this.st.mainClass = this.st.el.attr('data-effect');
      },
      open: function() {
        $('.dismiss').on('click',function(e) {
          $.magnificPopup.close();
        });
        //Set up other functions
        if (open_f)
          open_f();
      }
    },
    items: {
        src: "<div class='white-popup'>" + html + dismiss_button + "</div>",
        type: 'inline'
    },
    midClick: true,
    modal: true
  });
}

/* Separates the splash page HTML so that it can be used as a popup. */
function getSplashPageHTML() {
  var splash_html = "<div id='splashPage'>                                      \
  <p>Welcome to Checklist Interactive! This tool is intended for Cornell\
    University Computer Science students in the College of Engineering to plan\
    out their four years at Cornell in a smart and efficient manner. We want\
    students to be able to take all of the courses that they want to, while\
    fulfilling all of the requirements that they need to graduate.\
                                                                                \
    Please note that this page is NOT official, and once you have planned out\
    your courses on the checklist, you should set up an appointment and get your\
    checklist checked by Nicole Roy (or the current assistant director of\
    undergraduate advising). We are not guaranteeing that placing your courses\
    on the checklist will allow you to graduate. </p>";
  //TODO add button and checkbox
  splash_html += '<div class="splash_check">\
                    <input type="checkbox" value="confirm" id="splash_check" name="splash_check" style="display: none;"/>\
                    <label for="splash_check"></label>\
                    <p>Yes, agreed.</p>\
                  </div>';
  splash_html += '<input type="image" src="img/Splash Assets/continue.png" name="confirmSplash" id="confirmSplash" />';
  splash_html += '<br/><div><p id="splash_warning" style="color: #d00a0a;"></p></div>';
  
  //Add closing div
  splash_html += "</div>";
  return splash_html;
}

function getSplashPageFunctions() {
  $("#confirmSplash").on('click', function() {
    var checkedValue = $('#splash_check:checked').val();
    if (checkedValue === "confirm") {
      $.magnificPopup.close();
    } else {
      $("#splash_warning").text("You need to agree to the terms and conditions to use Checklist Interactive.");
    }
    return false;
  });
}

function setupMagnificPopup() {
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
  makePopup("#start_splash_page",getSplashPageHTML(),getSplashPageFunctions,true);
  makePopup("#new",'New Page');
  makePopup("#load",'Load Page');
  makePopup("#print",'Enter message to Nicole:<br /><textarea />')
}

//when page is finished loading, the main methods are called
$(document).ready(function(){
  //global enum
  FilterValue = Object.freeze({FORBIDDEN : 0, ALLOWED : 1, PERFECT : 2}); 
  //(course_id -> Course_information object)
  var loader = new Loader();
  COURSE_INFORMATION = {};
  loader.initializeCourseInfo();
  user = loader.fetchUser();
  loader.applyUser(user);
  setupMagnificPopup();
  var panel = new Panel();


  fillEmptySpots();
  applyrun(); //This starts the dragging and dropping

  //TODO see if user is a new user, if so:
    $("#start_splash_page").click();

});
