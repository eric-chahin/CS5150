/* Class: Schedule is a singleton that contains all the planned classes for the user, their "schedule". */

//TODO: save this.numSemesters somewhere
var Schedule = function(schedule_name, version, id, courses_lst, startYear) {
  this.checklist = new Checklist(version);
  this.id = id; // Should be in the form <netid>_<id>
  this.name = schedule_name;
  this.numSemesters = 10;
  this.vector_warnings = [false,false]; //Length of how many vectors we have.
  //TODO: fix this so it always grabs last two digits
  var startYear = startYear % 100;

  // The courses_I_want array does NOT correspond to the order that they show up on the page necessarily
  // It acts merely as a collection of wanted courses. Switching the ordering should not affect the view.
  this.courses_I_want = []; //TODO load/save this properly
  //TODO: make version a function fo start_year
  if (!version)
    console.error("Version is null or undefined.");
  this._saved = true; //Private variable. Please don't touch outside of class

  //Semester 2D Array that contain Course object

  this.semesters = new Array(this.numSemesters);
  for (var i = 0; i < this.semesters.length; i++) {
    this.semesters[i] = new Array(8);
    if (i == 8 || i == 9) {
      this.semesters[i] = new Array(18);
    }
  }

  /* This method takes in a saved schedule and initializes all of the
   * courses in the schedule area and potential courses area.
   * This method does NOT tie the course object to the DOM.
   * It only loads the DB's serialized data into Course objects and stores
   * them into the Schedule object.
   *
   * @param savedSchedule   Takes in the courses list from the DB
   *                         It is a (int,"listing#requirement") array
   */
  this.init_schedule = function(savedSchedule) {
    var countInArrays = new Array(this.numSemesters+1);
    for (var k = 0; k < countInArrays.length; k++) {
        countInArrays[k] = 0;
    }
    if (savedSchedule.length == 0) {
      //This happens when setting up a new schedule, the saved Schedule will be an empty array
      //We need to load the potential courses from the given list in data/potential_courses.csv
      var potentials = loader.getSuggestedPotential();
      checklist_view.updatePotentialCourses(potentials);
    } else {
      for (var i = 0; i < savedSchedule.length; i=i+2) {
        if (savedSchedule[i] == -1){
          str = savedSchedule[i+1];
          var arr = str.split("#");
          var name = arr[0];
          var req = arr[1];
          if (arr[1]=="") {
              req = null;
          }
          this.courses_I_want[countInArrays[this.numSemesters]] = new Course(name, req);
          countInArrays[this.numSemesters] = countInArrays[this.numSemesters] + 1;
        } else {
          var sem = savedSchedule[i];
          str = savedSchedule[i+1];
          var arr = str.split("#");
          var name = arr[0];
          var req = arr[1];
          if (arr[1]=="") {
              req = null;
          }
          this.semesters[sem][countInArrays[sem]] = new Course(name, req);
          countInArrays[sem] = countInArrays[sem] + 1;
        }
      }
    }
  }

  //TODO: Make sure that the this._saved flag is false when switching requirements around AND CIWTT
  var confirmOnPageExit = function(e) {
    e = e || window.event;
    var message = 'Are you sure you have saved your checklist?';
    if (e) {
      e.returnValue = message;
    }
    return message;
  };
  this.setSaved = function(bool) {
    this._saved = bool;
    if (bool) {
      window.onbeforeunload = null;
    } else {
      window.onbeforeunload = confirmOnPageExit;
    }
  }

  /* Pushes Course object into the semesters array at semester,index. */
  this.moveCourse = function(obj,semester,index) {
    this.setSaved(false);
    this.semesters[semester][index] = obj;
  }

  /*Creates the string name for a semester number*/
  this.convertSemesterName = function(semesterNum){
    var name = "";
    if (semesterNum % 2 == 0) {
      name = "FA";
    }else{
      name = "SP";
      semesterNum+=1;
    }

    name+= startYear + Math.floor(semesterNum/2);
    return name;
  }

  /* This method returns true/false whether this course would be overflowing the
   * slot count for the requirement it is trying to fulfill. */
  this.overflowsSlotCount = function(courseToAdd) {
    if (courseToAdd.getRequirementFilled() === null) {
      return false;
    } else {
      var courses = this.ruleToCourses();
      var current_lst = courses[courseToAdd.getRequirementFilled()];
      return current_lst &&
        current_lst.length >= checklist_rules[courseToAdd.getRequirementFilled()].slots;
    }
  }

  /* Adds a new course with listing at [semester][index].
   *  Overwrites anything that is there and returns the newly generated course.
   *
   *  This method should obey the checklist rules. Therefore, if have CS1110
   *    taking "Intro Programming" and courseToAdd is CS1112 -- Intro Programming,
   *    this method should set the courseToAdd.setRequirementFilled(null).
   *
   *  Returns the added Course object.
   *
   *  There should only be TWO PLACES where Course objects are created.
   *    1. Loading in a Schedule
   *    2. Going from Search -> Potential
   *  courseToAdd should NEVER be null. The course should be initialized
   *  before this method is called!  */
  this.addCourse = function(courseToAdd,semester,index) {
    this.setSaved(false);
    var listing = courseToAdd.listing;
    listing = listing.replace(" ",""); // Removes spaces from input just in case
    console.log("adding " + listing + " at " + semester+index);

    if (semester == -1){
      this.courses_I_want.push(courseToAdd);
    } else {
      if (this.overflowsSlotCount(courseToAdd)) {
        courseToAdd.setRequirementFilled(null);
        //TODO: In the future, get other possible matches and try to match there. (low priority)
      }
      this.semesters[semester][index] = courseToAdd;
    }
    return courseToAdd;
  }

  /* Swaps the object at [semester1][index1] with [semester2][index2]
   * Returns the two course objects that were swapped before they were swapped. */
  this.swapCourses = function(semester1,index1,semester2,index2) {
    this.setSaved(false);
    console.log("switch " + semester1+index1 + " with " + semester2+index2);
    var tmp = this.semesters[semester1][index1];
    var tmp2 = this.semesters[semester2][index2];
    this.semesters[semester1][index1] = tmp2;
    this.semesters[semester2][index2] = tmp;

    return [tmp,tmp2];
  }

  /* Returns the old course and sets the spot in the semester to null. */
  this.deleteCourse = function(semester,index) {
    this.setSaved(false);
    var oldCourse = this.semesters[semester][index];
    this.semesters[semester][index] = null;

    return oldCourse;
  }

  /* Removes Course object from courses_I_want because of (1) trashcan or (2)
   *  moving onto schedule. */
  this.deletePotentialCourse = function(course) {
    if (!course) return;
    var index = this.courses_I_want.indexOf(course);
    if (index > -1) {
      console.log("Deleted " + course.listing + " from potential courses");
      this.courses_I_want.splice(index,1);
    }
  }

  /* Returns whether or not the courses fulfill vector_name */
  function fulfillsThisVector(vector_name, courses_lst) {
    if (vectors[vector_name]) { 
      var vector_rules = vectors[vector_name].components;
      var possibilities = [];
      var left_to_fill = new Array(vector_rules.length);
      for (var comp_i = 0; comp_i < vector_rules.length; comp_i++) {
        var component = vector_rules[comp_i];
        for (var course_i = 0; course_i < courses_lst.length; course_i++) {
          if (component.fulfillsVector(courses_lst[course_i][1].listing)) {
            if (possibilities.indexOf(courses_lst[course_i][1]) == -1)
              possibilities.push(courses_lst[course_i][1]);
          }
        }
        left_to_fill[comp_i] = component.slots;
      }
      return findVectorAssignment(vector_rules, left_to_fill, possibilities, 0);
    } else {
      return true; // if the vector doesn't exist, then don't initialize warnings
    }
  }

  /* Returns true if could find assignment. False otherwise. 
   * Parameters: 
   *   components         array of components
   *   left_to_fill       array of ints to show the number left to fill for the corresponding component
   *   possibilities      A list of Course objects that could fit in the slots
   *   i                  The current index of possibilities, giving the current course. */
  function findVectorAssignment(components, left_to_fill, possibilities, i) {
    var sum = 0;
    $.each(left_to_fill, function() {
      sum += this;
    });
    if (sum == 0) {
      return true;
    } else if (i >= possibilities.length) {
      return false;
    } else {
      var valid_assignment_exists = false;
      for (var c = 0; c < components.length; c++) {
        var new_left_to_fill = left_to_fill.slice(0);
        if (new_left_to_fill[c] > 0 && components[c].fulfillsVector(possibilities[i].listing)) {
          new_left_to_fill[c] -= 1;
          valid_assignment_exists = valid_assignment_exists || findVectorAssignment(components, new_left_to_fill, possibilities, i+1);
        }
      }
      return valid_assignment_exists;
    }
  }

  /* This will update the warnings field in schedule. */
  this.updateVectorWarnings = function() {
    //at this point, all the requirements in the Course objects are set.
    var vectors_to_check = [$("#vector1").val(),$("#vector2").val()];
    var courses_lst = this.toArray();
    for (var i = 0; i < vectors_to_check.length; i++) {
      this.vector_warnings[i] = !fulfillsThisVector(vectors_to_check[i],courses_lst);
    }
    
    var vectorwarninghtml = "<a class='hvrlink'><img src='img/warning_vector.png' alt='Unfulfilled Vector Warning'></a>"+
            "<div class='course-warning'>"+
              "<h3 class='title'>Warning: Unfulfilled Vector</h3>"+
              "<p class='desc'>It appears that you have not yet fulfilled this vector; one or more courses required for the vector are missing from your schedule.  Double-check the vector listing to ensure that the requirements have been met.</p>" +
            "</div>";
            
    var containingClass = this;
    
    $('.vector-warning').each(function(i) {
        console.log(!containingClass.vector_warnings[i]);
        if(containingClass.vector_warnings[i]) {
           this.innerHTML = vectorwarninghtml;
        } else {
            this.innerHTML = "";
        }
    });    
    console.log("Vector flags: " + this.vector_warnings);
  }

  /* Returns whether this listing is already in the schedule */
  this.contains = function(listing) {
    listing = listing.replace(" ",""); // Removes spaces from input just in case
    for (var s = 0; s < this.semesters.length; s++) {
      for (var i = 0; i < this.semesters[s].length; i++) {
        if (this.semesters[s][i] && listing === this.semesters[s][i].listing) {
          return true;
        }
      }
    }
    return false;
  }

  /* Returns whether a crosslisted class is found in the schedule */
  this.crosslist_contains = function(listing) {
    listing = listing.replace(" ",""); // Removes spaces from input just in case
    var crosslisted_classes = COURSE_INFORMATION[listing]["crosslists"].split(";");
    for (var i = 0; i < crosslisted_classes.length; i++) {
      if (this.contains(crosslisted_classes[i])) {
        return true;
      }
    }
    return false;
  }

  this.toString = function() {
    var rtnStr = "";
    for (var s = 0; s < this.semesters.length; s++) {
      for (var i = 0; i < this.semesters[s].length; i++) {
        if (this.semesters[s][i]) {
          rtnStr += this.semesters[s][i].listing + " --- " + this.semesters[s][i].getRequirementFilled() + "\n";
        }
      }
    }
    return rtnStr;
  }

  /*written by Ben
   *  Returns array containing (semester it's being taken in,Course)
   *  return type is [(int,Course),...]
   *  semester = -1 if course is not yet on schedule (course i want to take)
   *  Strictly reads from the schedule object. Does not save state anywhere
   *  in order to avoid maintaining multiple states.
   */
  this.toArray = function(){
    var output = []
    console.log(this.semesters);
    console.log(this.semesters.length);
    for (var s = 0; s < this.semesters.length; s++) {
      for (var i = 0; i < this.semesters[s].length; i++) {
        if (this.semesters[s][i]) {
          console.log(this.semesters[s][i]);
          output[output.length]= [s,this.semesters[s][i]];
        }
      }
    }
    for (var i = 0; i<this.courses_I_want.length; i++){
      output[output.length]= [-1,this.courses_I_want[i]];
    }
    console.log(output);
    return output;
  }

  /*written by Ben
   *  repopulates schedule from saved user schedule
   *  takes array containing (semester it's being taken in, Course)
   *   is [(int,Course),...]
   *  semester = -1 if course is not yet on schedule (course i want to take)
   *  input format is assumed to be same as output format of this.toArray */
  this.fromArray = function(savedSchedule){
    var countInArrays = new Array(this.numSemesters+1)
    for (var k = 0; k < countInArrays.length; k++) {
      countInArrays[k] = 0;
    }
    for (var i = 0; i < savedSchedule.length; i++) {
      if (savedSchedule[i][0] == -1){
        this.courses_I_want[countInArrays[this.numSemesters]] = savedSchedule[i][1];
        countInArrays[this.numSemesters] = countInArrays[this.numSemesters] + 1;
      }
      else {
        this.semesters[countInArrays[i]] = savedSchedule[i][1];
        countInArrays[i] = countInArrays[i] + 1;
      }
    }
    //add a function call to update the checklist
  }

  /* Returns JSON object of title of Rule -> Course array
   *  Strictly reads from the schedule object. Does not save state anywhere
   *  in order to avoid maintaining multiple states.
   *  Unassigned courses will be under the key "null" */
  this.ruleToCourses = function() {
    var courses = this.toArray();
    var ruleToCourse = {};
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i][1];
      if (!ruleToCourse[c.getRequirementFilled()]) {
        ruleToCourse[c.getRequirementFilled()] = [c];
      } else {
        ruleToCourse[c.getRequirementFilled()].push(c);
      }
    }
    return ruleToCourse;
  }

  /* Returns the semester number that the listing was found in. */
  this.searchForSemester =  function(listing) {
    for (var s = 0; s < this.semesters.length; s++) {
      var semester = this.semesters[s];
      for (var i = 0; i < semester.length; i++) {
        if (semester[i] && semester[i].listing == listing) {
          return s
        }
      }
    }
  }

  /* Pass in a dictionary of excel cell locations -> value (String).
   * The method modifies the dictionary passed in. */
  this.getExcelLocations = function(dict) {
    var courses = this.ruleToCourses();
    for (var rule in courses) {
      if (courses.hasOwnProperty(rule)) {
        var coursesForThisRule = courses[rule];
        if (rule !== "null") {
          var excelLocForRule = checklist_rules[rule].excel_cell;
          var excelNum = parseInt(excelLocForRule.match(/\d+/)[0]);
          var column = excelLocForRule.substring(0,excelLocForRule.indexOf("" + excelNum));
          var credits_col = String.fromCharCode(column.charCodeAt(0)+2); //This won't work for columns like "AA" or "AZ"
          var semester_col = String.fromCharCode(column.charCodeAt(0)+3);
          for (var i = 0; i < checklist_rules[rule].slots && i < coursesForThisRule.length; i++) {
            dict[column + (excelNum+i)] = coursesForThisRule[i].listing // check with matlab! Shouldn't get 2!
            dict[credits_col + (excelNum+i)] = COURSE_INFORMATION[coursesForThisRule[i].listing]["credits"];
            var semester_number = this.searchForSemester(coursesForThisRule[i].listing);
            dict[semester_col + (excelNum+i)] = this.convertSemesterName(semester_number);
          }
        }
      }
    }
  }

  this.init_schedule(courses_lst);
}