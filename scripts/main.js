/* Class: Loader is a singleton that contains methods to load the data into the website */

//TODO: pass netid from weblogin into loader, must be used in Ajax call to user database
var Loader = function() {
  /* Retrieves User information.
     Returns: User object */
  //flag if user is found in db
  this.isNewUser = false;

    
  //TODO: fetchUser should take in a netid?
  this.fetchUser = function(netid) {
    //TODO Get AJAX call and pull data from User table
    var user = null;
    $.ajax({
        type: "GET",
        url: "user.php", 
        async: false,
        dataType: "json",
        data:   {'netid': netid,
           'isInitialLoad': "true"},
        success: function(data){
          if (data == null) {
           //user was not found, must create new one. we set user to null
           //we create user object and set flag below
           user = null;
          }
          else {
            var name = data['name'];
            var next_schedule_num = data['next_schedule_num'];
            var current_schedule_id = data['current_schedule_id'];
           
            var schedules = data['schedules']; //TODO needs to be an array of schedule IDs

            var courses_lst = schedules ? schedules.split(",") : [];
            //TODO change schdule encoding to include name and verison
            //TODO generalize decoding for case of mulitple schedules
            var s = new Schedule("first", 2012, current_schedule_id, courses_lst);
          
            scheds = [];
            scheds[scheds.length] = s; //TODO: schema for adding schedules to schedule list?
        
            this.isNewUser = false;
            user = new User(name, netid, 2012, next_schedule_num, current_schedule_id, scheds);
          }
        }
    });
      
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
          var listing = user_semester[j-1].listing;
          var match = listing.match(/\d+/);
          var numIndex = listing.indexOf(match[0]);
          var listing_spaced = listing.substring(0,numIndex) + " " + listing.substring(numIndex);
          $courses[j].innerHTML = listing_spaced;
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
      async: false,
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
function makePopup(selector,html,open_f,dismiss_off, user) {
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
  var select_html = '<option selected disabled>Entering year</option>';
  var current_year = new Date().getFullYear();
  for (var i = 0; i < 6; i++) {
    select_html += '<option value="'+(current_year-i)+'">' + (current_year-i) + "</option>";
  }
  select_html = "<select id='splashPageSelect'>" + select_html + "</select>";

  var splash_html = "<div id='splashPage'>                                      \
     <div class='popup-title'><img src='img/text_welcome.png'></div>                   \
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
                    <label for="splash_check"></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Accept\
                  </div>';
  splash_html += select_html;
  splash_html += '<br><br><center><input type="image" src="img/splashpage/continue.png" name="confirmSplash" id="confirmSplash" />';
  splash_html += '<br/><div><p id="splash_warning" style="color: #d00a0a;"></p></div></center>';
  
  //Add closing div
  splash_html += "</div>";
  return splash_html;
}

function getSplashPageFunctions() {
  $("#confirmSplash").on('click', function() {
    var checkedValue = $('#splash_check:checked').val();
    var enteringYear = $('#splashPageSelect').val();
    if (checkedValue !== "confirm") {
      $("#splash_warning").text("You need to agree to the terms and conditions to use Checklist Interactive.");
    } else if (isNaN(enteringYear)) {
      $("#splash_warning").text("Please, select your first year at Cornell.");
    } else {
      $.magnificPopup.close();
      //once user clicks confirm, we can put user in db
      $.ajax({
             type:  "POST",
             url: "user.php",
             async: true,
             dataType: "json",
             data:   {'netid': user.netid,
              'full_name': user.full_name,
              'next_schedule_num': user.next_schedule_num,
              'current_schedule_id': user.current_schedule.id,
              'schedules': user.current_schedule.toArray().toString()},
             success: function(data){
               if (data == "error"){
               //TODO: couldn't connect to database on saving
               }
             }
      });
                        
    }
    return false;
  });
}



function getNewPageHTML() {
    var new_html = 'Enter new schedule name:<br />';
    new_html += '<input type ="text" name="schedule_name" id="schedule_name" />';
    new_html += '<br><center><input type="image" src="img/splashpage/continue.png" name="confirmNew" id="confirmNew" />';
    new_html += '<br/><br/><div><p id="new_schedule_warning" style="color: #d00a0a;"></p></div></center>';
    
    return new_html;
}


function getNewPageFunctions() {
    $("#confirmNew").on('click', function () {
        var name = $('#schedule_name').val();
        if (name == "") {
            $("#new_schedule_warning").text("Please enter a name for this schedule.");
        }
        else {
            //close popup and save schedule in db with the user provided name
            $.magnificPopup.close();
            user.add_new_schedule(name, "2011"); //TODO: get version
            window.location.reload(); //for now, just reload page to load new schedule
        }
    
        return false;
    });
}


function getLoadPageHTML() {
  // first need to retrieve all schedule names to populate the dropdown
    var name_array = [];
    $.ajax({
           type: "GET",
           url: "user.php",
           async: false,
           dataType: "json",
           data: {
                'netid': user.netid,
                'isInitialLoad': "false"
           },
           success: function(data) {
                name_array = data.split(";");
           }
    });
    
  var select_html = '<option selected disabled>Select the Checklist you wish to load:</option>';
  for (var i = 0; i < (name_array.length-1); i=i+2){
    select_html += '<option value="'+name_array[i]+'">' + name_array[i+1] + "</option>"; //TODO: link this to the user's saved schedules somehow
  }
  select_html = "<select id='loadPageSelect'>" + select_html + "</select>";
  var load_html = select_html;
  load_html += '<br><br><center><input type="image" src="img/splashpage/continue.png" name="loadSchedule" id="loadSchedule" />';
  load_html += '<br/><br/><div><p id="load_warning" style="color: #d00a0a;"></p></div></center>';
  return load_html; 
}


function getLoadPageFunctions() {
    $("#loadSchedule").on('click', function () {
        var selection = document.getElementById("loadPageSelect");
        var schedule_id = selection.options[selection.selectedIndex].value;
        if (schedule_id === "Select the Checklist you wish to load:") {
            //i.e. they didn't acutally select something from the dropdown
            $(load_warning).text("Please select a saved schedule.");
        }
        else {
            //set user's 'schedule_name' to be his current schedule
            user.load_schedule(schedule_id);
            $.magnificPopup.close();
            window.location.reload();  // for now, reload page after loading schedule
                    
        }
        return false;
    });
    
}



function saveUserFunction() {
  user.save_schedule("false");
}



function setupMagnificPopup(user) {
  $('.hexagon').wrap("<a href='#popup' data-effect='mfp-zoom-out' class='open-popup-link'></a>");
  $('.hexagonLeft').wrap("<a href='#popup' data-effect='mfp-zoom-out' class='open-popup-link'></a>");
  $('.open-popup-link').magnificPopup({
    type:'inline',
    removalDelay: 50, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function() {
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
  makePopup("#start_splash_page",getSplashPageHTML(),getSplashPageFunctions,true, null);
  makePopup("#new",getNewPageHTML(), getNewPageFunctions, false, user);
  makePopup("#load",getLoadPageHTML(), getLoadPageFunctions, false, user);
  makePopup("#save", 'Saved!', saveUserFunction, false, user); 
  makePopup("#print",'Enter message to Nicole:<br /><textarea />', false, false, null)
}

//when page is finished loading, the main methods are called
$(document).ready(function(){
  //global enum
  FilterValue = Object.freeze({FORBIDDEN : 0, ALLOWED : 1, PERFECT : 2}); 
  //(course_id -> Course_information object)
  var netid = "og"; //TODO get netid from web auth login
  var loader = new Loader(); //this is where we would pass the netid from web login
  COURSE_INFORMATION = {};
  loader.initializeCourseInfo();
  user = loader.fetchUser(netid);
  
  if (user == null) {
  //netid was not found in user table. create new user object
    loader.isNewUser = true;
    //TODO determine user's name from their netid
    user = new User("need to get this somehow", netid, 2012, null, null, null);

  }
  
  loader.applyUser(user);
  setupMagnificPopup(user);
  var panel = new Panel();

  fillEmptySpots();
  applyrun(); //This starts the dragging and dropping
  checklistDrag();

  //TODO see if user is a new user, if so:
  if (loader.isNewUser) {
    $("#start_splash_page").click();
  }
    //TODO: saving while someone is actually on a schedule

});
