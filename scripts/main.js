/* Class: Loader is a singleton that contains methods to load the data into the website */

//TODO: pass netid from weblogin into loader, must be used in Ajax call to user database
//TODO: pass all LDAP information into loader
//TODO: save this.numSemesters somewhere
var Loader = function() {
  /* Retrieves User information.
     Returns: User object */
  //flag if user is found in db
  this.suggested_potential_courses = null;
  this.checklistVectorData = "";
  this.potentialData = null; // null value is useful for telling if the user == null
  this.fetchUser = function(netid) {
    var user = null;
    var name = null;
    var next_schedule_num = null;
    var current_schedule_id = null;
    var version = null;
    var schedule = null;
    var schedule_name = null;
    var start_year = null;
    var checklist_data = null;
    $.ajax({
        type: "GET",
        url: "user.php", 
        async: false,
        dataType: "json",
        data:   {'netid': netid,
           'isInitialLoad': "true"},
        success: function(data){
          if (data != null) {
            name = data['name'];
            next_schedule_num = data['next_schedule_num'];
            current_schedule_id = data['current_schedule_id'];
            version = data['version'];
            start_year = data['start_year'];
          }
        }
    });
    $.ajax({
        type: "GET",
        url: "user.php", 
        async: false,
        dataType: "json",
        data:   {'netid': netid,
                 'schedule_id': current_schedule_id,
                  'isInitialLoad': "false"},
        success: function(data){
          if (data != null){
            schedule = data['schedule'];
            schedule_name = data['schedule_name'];
            var checklist = data['checklist_data'];
            var potential = data['potential_courses'];
            version = data['version'];
            start_year = data['start_year'];
            checklist_data = checklist ? checklist.split("#") : [];
            potential_data = potential ? potential.split("#") : [];
          }
        }
    });
    //TODO: deal with database corruption issue (checking other variables besides schedule)
    if (schedule == null){
       return user;
    } else {
      var courses_lst = schedule ? schedule.split(",") : [];   
      var s = new Schedule(schedule_name, version, current_schedule_id, courses_lst, start_year);
      document.getElementById("sidebarTitle").innerHTML = schedule_name;
      var pattern = /ENGR/;
      if (pattern.test(s.checklist.version)) {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Engineering";
      } else {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Arts and Sciences";
      }
      scheds = [];
      scheds[scheds.length] = s; //TODO: schema for adding schedules to schedule list?
      user = new User(name, netid, version, next_schedule_num, current_schedule_id, scheds, start_year);
      this.checklistVectorData = checklist_data;
      this.potentialData = potential_data;
      return user;
    }  
  }

  /* Scans through the user object and loads all elements on the schedule and 
   * checklist. Ties Course objects to the DOM. */
  this.applyUser = function(user) {
    //TODO: Put user's name somewhere on site
    //Apply schedule
    var user_semesters = user.current_schedule.semesters;
    for (var i = 0; i < user_semesters.length; i++) {
      var user_semester = user_semesters[i];
      var $semester = $("#semester"+(i+1));
      var $courses = $semester.children();
      for (var j = 1; j <= 8; j++) {
        if (user_semester[j-1] && user_semester[j-1].listing) {
          var listing = user_semester[j-1].listing;
          var listing_spaced = checklist_view.getCourseSpaced(listing);
          $courses[j].children[0].innerHTML = listing_spaced;
          // $courses[j].innerHTML = listing_spaced; // Use if we get rid of the links on top of the divs
          $("#course_"+(i+1)+j).data("course",user_semester[j-1]);
          checklist_view.addCourseToChecklistView(user_semester[j-1],i);
        }
      }
    }
    checklist_view.fillEmptyScheduleSpots(); // clear black hexagon background
    checklistcopySections();
  }

  this.getSuggestedPotential = function() {
    if (!this.suggested_potential_courses) {
      var data_array = null;
      $.ajax({
        type:     "GET",
        url:      "potential_courses.php",
        dataType: "json",
        async: false,
        cache: false,
        success: function(data){
          data_array = [];
          for (var i = 0; i < data.length; i++) {
            data_array.push(data[i]["course_listing"]);
          }
        }
      });
      this.suggested_potential_courses = data_array;
    }
    return this.suggested_potential_courses;
  }


  this.initializeHexagonColors = function() {
    var listOfClasses = [];
    var colors  = [];
    $.ajax({
      type:     "GET",
      url:      "hexagon_colors.php",
      dataType: "json",
      async: false,
      cache: false,
      success: function(data){
        for (var x = 0; x < data.length; x++) {
          // pull the color (entry), split the list, loop over the list TODO
          var entry = data[x];
          var color = entry["color"];
          colors.push(color);
          //if color doesn't exist then skip...
          var classes = entry["courses"].split(";");
          for (var i = 0; i < classes.length; i++) {
            listOfClasses.push([classes[i],color]);
          }
        }
      }
    });
    var passedColors = [];
    for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      var test_url = "/CS5150/img/hexagon_"+color+".png";
      $.ajax({
        type: "GET",
        url:  test_url,
        async: false,
        success: function(data) {
          passedColors.push(color);
        }
      });     
    }
    for (var i = 0; i < listOfClasses.length; i++) {
      if (passedColors.indexOf(listOfClasses[i][1]) >= 0)
        HEXAGON_COLORS[listOfClasses[i][0]] = listOfClasses[i][1];
    }
  }
}

/* Class: CourseInformation stores all information about the courses at Cornell. */
var CourseInformation = function() {
  var dict = {};
  this.get = function(key) {
    if (!dict[key]) {
      initializeCourseInfo(key);
    }
    return dict[key];
  }
  function initializeCourseInfo(listing) {
    $.ajax({
      type:     "GET",
      url:      "courses.php",
      dataType: "json",
      data: { 'listing': listing },
      async: false,
      cache: false,
      success: function(data){
        for (var x = 0; x < data.length; x++) {
          var entry = data[x];
          dict[entry["course_listing"]] = entry;
        }
      }, error: function(data){ console.error(data);}
    });
  }
}

/* The method sets up a popup at the selector with the html.
 * Uses the white-popup class for CSS. 
 * If you have event listeners for the html that you pass in, then you can pass
 *   in a zero argument function into open_f that can access all the selectors in 
 *   your html arg.
 * There automatically a way to click outside of the popup to exit.
 *   If you would like to turn that off, set dismiss_off to true. */
function makePopup(selector, html, open_f, dismiss_off) {
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
        src: "<div class='white-popup'>" + html + "</div>",
        type: 'inline'
    },
    midClick: true,
    modal: dismiss_off
  });
}

function setVectorDropDowns() {
  var html_str = "<option selected>Select Vector</option>";
  for (var vector in vectors) {
    if (vectors.hasOwnProperty(vector)) {
      html_str += "<option>" + vector + "</option>"
    }
  }
  $("#vector1,#vector2").html(html_str);
}

/* Separates the splash page HTML so that it can be used as a popup. */
function getSplashPageHTML() {
  var select_html = '<option selected disabled>Entering academic year</option>';
  var current_year = new Date().getFullYear();
  for (var i = 0; i < 6; i++) {
    select_html += '<option value="'+(current_year-i)+'">' + (current_year-i) + " - " + (current_year-i+1) + "</option>";
  }
  select_html = "<div class='popup-select'><select id='splashPageSelect'>" + select_html + "</select></div>";
  var radio_colleges = '<input type="radio" id="ENGR_radio" name="college" value="ENGR" checked>&nbsp;Engineering<br>\
                        <input type="radio" id="A&S_radio"  name="college" value="A&S">&nbsp;Arts & Sciences';
  var splash_html = "<div id='splashPage'>                                      \
     <div class='popup-title'><img src='img/text_welcome.png'></div>                   \
  <p>Welcome to Checklist Interactive!\
    This tool is intended for Cornell\
    University Computer Science students in the College of Engineering to plan\
    out their four years at Cornell in a smart and efficient manner. We want\
    students to be able to take all of the courses that they want to, while\
    fulfilling all of the requirements that they need to graduate.</p>\
                                                                                \
    <p>Please note that this page is NOT official, and once you have planned out\
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
  splash_html += radio_colleges;
  splash_html += '<center><input type="image" src="img/splashpage/continue.png" name="confirmSplash" id="confirmSplash" />';
  splash_html += '<br/><div><p id="splash_warning" style="color: #d00a0a;"></p></div></center>';
  
  //Add closing div
  splash_html += "</div>";
  return splash_html;
}

/* Calculates the appropriate checklist version given the start year. 
 * college_str is ENGR or A&S depending on if the student is in 
 * Engineering or Arts & Sciences. 
 * Pass in an empty version_lst and getVersion will populate it with all the 
 * different versions */
function getVersion(enteringYear, college_str, version_lst) {
  if (!version_lst) version_lst = [];
  var rtn_version = -1;
  $.ajax({
    type:     "GET",
    url:      "checklist.php",
    async:    false,
    dataType: "json",
    data:     { version: 0,
                table:   "checklist_rules"},
    cache: false,
    success: function(data) {
      var closest_version = -1;
      var min_version = 9007199254740992;
      for (var x = 0; x < data.length; x++) {
        var e = data[x];
        var curr_version = e['version'];
        if (curr_version.indexOf('_') >= 0) {
          curr_version = curr_version.substring(0,curr_version.indexOf('_'));
        }
        curr_version = parseInt(curr_version);
        //Put into version_lst
        if (version_lst.indexOf(curr_version) < 0) version_lst.push(curr_version);
        min_version = Math.min(curr_version,min_version);
        curr_diff = enteringYear - curr_version;
        if (curr_diff < 0) continue;
        if (closest_version === -1 || enteringYear - closest_version > curr_diff) {
          closest_version = curr_version;
        }
      }
      if (closest_version === -1) {
        console.error("There does not exist a schedule for this start year.");
        closest_version = min_version;
      }
      rtn_version = closest_version;
    }
  });
  version_lst.sort();
  return rtn_version + "_" + college_str;
}

function getSplashPageFunctions() {
  $("#confirmSplash").on('click', function() {
    var checkedValue = $('#splash_check:checked').val();
    var enteringYear = $('#splashPageSelect').val();
    if (checkedValue !== "confirm") {
      $("#splash_warning").text("You need to agree to the terms and conditions to use Checklist Interactive.");
    } else if (isNaN(enteringYear)) {
      $("#splash_warning").text("Please, select your first academic year at Cornell.");
    } else {
      var college = document.getElementById("A&S_radio").checked ? "A&S" : "ENGR";
      //TODO: the A&S checklist looks weird...fix its look
      user = new User(users_name, netid, getVersion(enteringYear,college), null, null, null, enteringYear);
      if (college == "ENGR") {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Engineering";
      } else {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Arts and Sciences";
      }
      //once user clicks confirm, we can put user in db
      $.ajax({
        type:  "POST",
        url: "user.php",
        async: true,
        dataType: "json",
        data:   {'netid': user.netid,
          'full_name': user.full_name,
          'next_schedule_num': user.next_schedule_num,
          'current_schedule_id': user.current_schedule.id
        },
        success: function(data){
          if (data == "error"){
          //TODO: couldn't connect to database on saving
          }
        }
      });
      finalizeWebsite();
      $.magnificPopup.close();
    }
    return false;
  });
}

function getNewPageHTML() {
  var new_html ='<div class="popup-content"><div class="popup-title">New Checklist</div>';
  new_html += '<div class="popup-dropdown">Name This Checklist:<br />';
  new_html += '<input type ="text" name="schedule_name" id="schedule_name" /></div></br></br>';
  new_html += '<input type="image" src="img/splashpage/continue.png" name="confirmNew" id="confirmNew" />';
  new_html += '<br/><br/><div><p id="new_schedule_warning" style="color: #d00a0a;"></p></div></div>';
  var current_year = new Date().getFullYear();
  var year_html = '';
  for (var i = 0; i < 6; i++) {
      year_html += '<option value="'+(current_year-i)+'">' + (current_year-i) + ' - ' + (current_year-i+1) + '</option>';
  }
  new_html += '<div id="revise-year-dropdown">Year:<br /><select id="revise_year">'+year_html+'</select></div>';
  
  var version_html = '';
  var temp_version = '';
  var version_lst = [];
  getVersion(current_year,"",version_lst);
  var version_html = '<option selected disabled>Checklist Version</option>';
  for (var i = 0; i < version_lst.length; i++) {
    version_html += '<option value="'+version_lst[i]+'">' + version_lst[i] + "</option>";
  }

  new_html += '<div id="revise-version-dropdown">Version:<br /><select id="revise_version">'+version_html+'</select></div>';
  
  var college_html = '';
  college_html += '<option value="ENGR">Engineering</option>';
  college_html += '<option value="A&S">Arts & Sciences</option>';
  new_html += '<div id="revise-college-dropdown">College:<br /><select id="revise_college">'+college_html+'</select></div>';
  
  return new_html;
}

function getNewPageFunctions() {
  $("#revise_year").val(user.current_schedule.startYear);
  var curr_version = user.current_schedule.checklist.version;
  var curr_college = "ENGR";
  if (curr_version.indexOf('_') >= 0) {
    curr_college = curr_version.substring(curr_version.indexOf('_')+1);
    curr_version = curr_version.substring(0,curr_version.indexOf('_'));
  }
  $("#revise_version").val(curr_version);
  $("#revise_college").val(curr_college);

  $("#revise_year").change(function() {
    var ver = getVersion($("#revise_year").val(),"");
    $("#revise_version").val(ver.substring(0,ver.length-1));
  });
  $("#revise_version").change(function() {
    alert("Before you change your checklist version, check with the undergraduate CS advisor to make sure "+
      "that you are allowed to work off a different version.");
  });
  $("#confirmNew").on('click', function () {
    var name = $('#schedule_name').val();
    // TODO: Also do a check to make sure you cannot enter a schedule with the same name
    if (name.trim() == "") {
      $("#new_schedule_warning").text("Please enter a name for this schedule.");
    } else {
      vec_data = getVectorInfo();
      user.save_schedule("false", vec_data, getPotentialCourseString());
      checklist_view.wipeViewsClean(user.current_schedule.numSemesters);
      var new_version = $("#revise_version").val()+"_"+$("#revise_college").val();
      //if ($("#revise_college").val() === "A&S") alert("TODO: Put in A&S checklists"); //ERC73 TODO: is this line necessary anymore?
      user.add_new_schedule(name, new_version, parseInt($("#revise_year").val())); //ERC73 TODO: get version from form fields
      setVectorDropDowns();
      loader.applyUser(user);
      document.getElementById("sidebarTitle").innerHTML = name;
      if ($("#revise_college").val() === "ENGR") {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Engineering";
      } else {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Arts and Sciences";
      }
      setSemesterYear(user.current_schedule.startYear);
      $.magnificPopup.close();
    }

    return false;
  });
}

function getLoadPageHTML() {
  var load_html = '<div class="popup-content"><div class="popup-title">Load Checklist</div>';
  load_html += '<div class="popup-dropdown"><select id="loadPageSelect"></select></div></br></br>';
  load_html += '<input type="image" src="img/splashpage/continue.png" name="loadSchedule" id="loadSchedule" />';
  load_html += '<br/><br/><div><p id="load_warning" style="color: #d00a0a;"></p></div></div>';
  load_html += '<a href="#" name="deleteSchedule" id="deleteSchedule">Delete Selected</a>';
  return load_html; 
}


function getLoadPageFunctions() {
  // Loading dropdown for schedules
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
  var options_html = '<option selected disabled>Select the Checklist you wish to load:</option>';
  for (var i = 0; i < (name_array.length-1); i=i+2){
    options_html += '<option value="'+name_array[i]+'">' + name_array[i+1] + "</option>";
  }
  $("#loadPageSelect").html(options_html);

  //Initializing the load...
  $("#loadSchedule").on('click', function () {
    var selection = document.getElementById("loadPageSelect");
    var schedule_id = selection.options[selection.selectedIndex].value;
    if (schedule_id === "Select the Checklist you wish to load:") {
      //i.e. they didn't acutally select something from the dropdown
      $(load_warning).text("Please select a saved schedule.");
    }
    else {
      //set user's 'schedule_name' to be his current schedule
      vec_data = getVectorInfo();
      user.save_schedule("false", vec_data, getPotentialCourseString());
      checklist_view.wipeViewsClean(user.current_schedule.numSemesters);
      loaded_data = user.load_schedule(schedule_id);
      split_loaded_data = loaded_data.split(";");
      checklist_data = split_loaded_data[0].split("#");
      potential_array = split_loaded_data[1] ? split_loaded_data[1].split("#") : [];
      checklist_view.updatePotentialCourses(potential_array);
      setVectorDropDowns();

      //when  we save, make sure to re-encode checklist data as a string, as opposed to an array of strings
      delim = "#";
      checklist_str = checklist_data[0] + delim + checklist_data[1] + delim +checklist_data[2] + delim +checklist_data[3] + delim + checklist_data[4] + delim + checklist_data[5];
      user.save_schedule("false", checklist_str, getPotentialCourseString());
      
      loader.applyUser(user);
      checklistcopySections();
      checklistDrag();
      setVectorInfo(checklist_data);
      document.getElementById("sidebarTitle").innerHTML = user.current_schedule.name;
      var pattern = /ENGR/;
      if (pattern.test(user.current_schedule.checklist.version)) {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Engineering";
      } else {
        document.getElementById("checklisttitle_sub").innerHTML = "College of Arts and Sciences";
      }
      setSemesterYear(user.current_schedule.startYear);
      $.magnificPopup.close();
    }
    return false;
  });

  $("#deleteSchedule").on('click', function () {
    var selection = document.getElementById("loadPageSelect");
    var schedule_id = selection.options[selection.selectedIndex].value;
    if (schedule_id === "Select the Checklist you wish to load:") {
      //i.e. they didn't acutally select something from the dropdown
      $(load_warning).text("Please select a saved schedule.");
    }
    else {
      if (schedule_id == user.current_schedule.id){
        $(load_warning).text("Cannot delete current schedule."); //TODO: change this message?
      } else {
        if (confirm("Are you sure you want to delete this schedule?") == true){
          user.delete_schedule(schedule_id, "true");
          $.magnificPopup.close();
        } 
      }
    }
    return false;
  });    
}

/* Provides a string containing checklist information to be saved.  
 * Information is delimited by "#", and is listed in the following order: 
 *   Vector1, Vector2, isVector1Completed, isVector2Completed, isTechWritingCompleted, 
 *   isProbabilityCompleted */
function getVectorInfo() {
    elems = [];
    var vector1 = document.getElementById("vector1");
    elems.push(vector1.options[vector1.selectedIndex].value);

    var vector2 = document.getElementById("vector2");
    elems.push(vector2.options[vector2.selectedIndex].value);
    
    var completedVec1 = document.getElementById("completedVec1");
    var completedVec2 = document.getElementById("completedVec2");
    elems.push(completedVec1.checked);
    elems.push(completedVec2.checked);

    var checkboxes = user.current_schedule.checklist.checkboxes;
    for (var i = 0; i < checkboxes.length; i++) {
      var box = document.getElementById('checkbox_' + i);
      elems.push(box.checked);
    }
    return elems.join("#");
}


function setVectorInfo(checklist_data) {
    var vector1 = document.getElementById("vector1");
    var options1 = document.getElementById("vector1").options;

    for (var i=0; i<options1.length; i++) {
        if (options1[i].value == checklist_data[0]) {
            options1[i].selected = true;
        }
        else {
            options1[i].selected = false;
        }
    }
    
    var vector2 = document.getElementById("vector2");
    var options2 = document.getElementById("vector2").options;
    for (var j=0; j<options2.length; j++) {
        if (options2[j].value == checklist_data[1]) {
            options2[j].selected = true;
        }
        else {
            options2[j].selected = false;
        }
    }

    document.getElementById("completedVec1").checked = (checklist_data[2] == "true");
    document.getElementById("completedVec2").checked = (checklist_data[3] == "true");

    for (var i = 0; i < user.current_schedule.checklist.checkboxes.length; i++) {
      document.getElementById("checkbox_" + i).checked = (checklist_data[4+i] == "true");
    }
    user.current_schedule.updateVectorWarnings();
}

//scrapes the potential courses from the checklist view and returns them as a string
//delimited by "#"
function getPotentialCourseString() {
    var potential_courses = checklist_view.getPotentialCourses();
    potential_str = "";
    for (var i=0; i<potential_courses.length; i++) {
        potential_str += potential_courses[i] + "#";
    }
    return potential_str.substring(0, potential_str.length-1);
}


function setupMagnificPopup() {
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
  makePopup("#start_splash_page",getSplashPageHTML(),getSplashPageFunctions,true);
  makePopup("#new",getNewPageHTML(), getNewPageFunctions, false);
  makePopup("#load",getLoadPageHTML(), getLoadPageFunctions, false);
  $("#save").on('click', function () {
      vec_data = getVectorInfo();
      user.save_schedule("false", vec_data, getPotentialCourseString());
  });
}

function setSemesterYear(startyear) {
    var second_half = startyear.substring(2);
    for (var i = 1; i <= 8; i++) {
        var sem_index = "sem_title_year_"+i;
        document.getElementById(sem_index).innerHTML = (i%2 == 0 ? "SPRING " : "FALL ") + (parseInt(second_half) + Math.floor(i/2));
    }
}


/* Retreive information about the user.  Netid will be a CGI variable that we can retrieve, and we use it to obtain user's name using LDAP.  
   The data will be returned in the form <netid> ; <name> (i.e.e delimited by a semicolon) */
function getLDAP() {
    var info = null;
    $.ajax({
           type: "GET",
           url: "get-ldap.php",
           async: false,
           dataType: "json",
           success: function(data) {
                info = data;
           }
    });
    return info.split(";");
}


/* Called upon after user is fetched or after confirm is clicked on splash page.
 * Sets up final touches on the website like applying the user data to the checklist.
 * It also sets up the event handlers and vector dropdown. */
function finalizeWebsite() {
  if (loader.potentialData !== null) {
    //In case we were loading in a new user, we don't want to overwrite the suggested potential courses
    checklist_view.updatePotentialCourses(loader.potentialData);
  }
  loader.applyUser(user); // must come AFTER setupMagnificPopup

  applyrun(); //This starts the dragging and dropping
  checklistDrag();
  setVectorDropDowns();
  setVectorInfo(loader.checklistVectorData);
  setSemesterYear(user.current_schedule.startYear);
  //Save the schedule to save in loaded potential courses
  user.save_schedule("false", getVectorInfo(), getPotentialCourseString());
}

//when page is finished loading, the main methods are called
$(document).ready(function(){
  //global enum
  FilterValue = Object.freeze({FORBIDDEN : 0, ALLOWED : 1, PERFECT : 2}); 
  WarningType = Object.freeze({SPECIFIC_CLASS : 0, COURSE_LEVEL : 1, FORBIDDEN : 2, CREDITS : 3, VECTOR : 4});
  //(course_id -> Course_information object)
  
  netid = "abc123";
  users_name = "need to get this somehow"
                  
  /* TODO: uncomment this block of code when copying to server
  userInfo = getLdAP();
  netid = userInfo[0];
  users_name = userInfo[1];
   */

  loader = new Loader();
  COURSE_INFORMATION = new CourseInformation();
  HEXAGON_COLORS = {}; // listing (String) -> color (String)
  loader.initializeHexagonColors();
  //global vars
  checklist_view = new ChecklistView();
  var panel = new Panel();
  setupMagnificPopup();
  user = loader.fetchUser(netid);

  if (user == null) {
    $("#start_splash_page").click();
    //TODO determine user's name from their netid, version and start_year from splash page
    // global variable 'user' is initialized when getSplashPageFunctions() is called
  } else {
    finalizeWebsite();
  }
});