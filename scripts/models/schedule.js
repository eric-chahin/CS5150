/* Class: Schedule is a singleton that contains all the planned classes for the user, their "schedule". */
var Schedule = function(schedule_name, version, id, courses_lst) {
  this.checklist = new Checklist(version);
  this.id = id; // Should be in the form <netid>_<id>
  this.name = schedule_name;
  this.courses_I_want = [] //TODO load/save this properly

  //Semester 2D Array that contain Course objects
  this.semesters = new Array(8);
  for (var i = 0; i < this.semesters.length; i++) {
    this.semesters[i] = new Array(8);
  }

  /* If there is a new user, the method initializes the Schedule to the default
   * schedule which is defined in data/guest_data.csv
   *
   * @param courses_lst   Takes in the courses list from the DB and parses
   */
  this.init_schedule = function(courses_lst) {
    //TODO read from courses_lst
    //TODO store the Courses in the semester
    //TODO
    this.semesters[1][0] = new Course("CS1110",null);
    this.semesters[1][1] = new Course("CS2800",null);
    this.semesters[2][0] = new Course("CS2110",null);
    this.semesters[3][0] = new Course("CS3110",null);
  }

  /* Pushes Course object into the semesters array at semester,index. */
  this.moveCourse = function(obj,semester,index) {
    this.semesters[semester][index] = obj;
  }

  /* Adds a new course with listing at [semester][index].
   * Overwrites anything that is there and returns the newly generated course.
   *
   * NOTE: You should not use this method to load in User from the User DB because it
   * is not given a requirement_filled for the course.
   */
  this.addCourse = function(listing,semester,index) {
    listing = listing.replace(" ",""); // Removes spaces from input just in case
    console.log("adding " + listing + " at " + semester+index);
    var newCourse = new Course(listing, null);
    this.semesters[semester][index] = newCourse;
    return newCourse;
  }

  /* Swaps the object at [semester1][index1] with [semester2][index2] */
  this.swapCourses = function(semester1,index1,semester2,index2) {
    console.log("switch " + semester1+index1 + " with " + semester2+index2);
    var tmp = this.semesters[semester1][index1];
    this.semesters[semester1][index1] = this.semesters[semester2][index2];
    this.semesters[semester2][index2] = tmp;
  }

  /* Returns the old course and sets the spot in the semester to null. */
  this.deleteCourse = function(semester,index) {
    var oldCourse = this.semesters[semester][index];
    this.semesters[semester][index] = null;
    return oldCourse;
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

  this.createChecklist = function() {
    var leftChecklistRows = 18;
    var count = 0;
    var header = "";
    for (var rule in checklist_rules) {
      for (var i = 0; i < checklist_rules[rule].slots; i++) {

        var checklistclass = ".classleftrow";
        if (count > leftChecklistRows) {
           checklistclass = ".classrightrow";
        }

        if (header != checklist_rules[rule].header) {
           $(checklistclass).append("<div class='classRow'>" +
                  checklist_rules[rule].header +
                  " </div>");
          header = checklist_rules[rule].header
        }

        $(checklistclass).append("<div class='classRow'>" +
                  " <div class='requirement'>" + checklist_rules[rule].title +
                  "</div><div class='drag-course dragcolumnchecklist'>" +
                  " <div class='course-name'>" + "" +
                 "  </div><div class='course-credit'></div>" +
                 "<div class='course-semester'></div> " +
                 " </div></div>");

      if (count == leftChecklistRows) {
         $(".classleftrow").append("<div class ='unassigned-box'><div class='classRow'>Unassigned Courses</div></div>");
      }

      count++;
      }
    }
   }

  this.toString = function() {
    var rtnStr = "";
    for (var s = 0; s < this.semesters.length; s++) {
      for (var i = 0; i < this.semesters[s].length; i++) {
        if (this.semesters[s][i]) {
          rtnStr += this.semesters[s][i].listing + " --- " + this.semesters[s][i].requirement_filled + "\n";
        }
      }
    }
    return rtnStr;
  }

  /*written by Ben
   *  Returns array containing (Course, semester it's being taken in)
   *  return type is [(int,Course),...]
   *  semester = -1 if course is not yet on schedule (course i want to take)
   *  Strictly reads from the schedule object. Does not save state anywhere
   *  in order to avoid maintaining multiple states. */
  this.toArray = function(){
    var output = []
    for (var s = 0; s < this.semesters.length; s++) {
      for (var i = 0; i < this.semesters[s].length; i++) {
        if (this.semesters[s][i]) {
          output[output.length]= [s,this.semesters[s][i]];
        }
      }
    }
    for (var i = 0; i<this.courses_I_want.length; i++){
      output[output.length]= [-1,this.courses_I_want[i]];
    }
    return output;
  }

  /*written by Ben
   *  repopulates schedule from saved user schedule
   *  input format is assumed to be same as output format of this.toArray */
  this.fromArray = function(savedSchedule){
    var countInArrays = new Array(9)
    for (var k = 0; k < countInArrays.length; k++) {
      countInArrays[k] = 0;
    }
    for (var i = 0; i < savedSchedule.length; i++) {
      if (savedSchedule[i][0] == -1){
        this.courses_I_want[countInArrays[8]] = savedSchedule[i][1];
        countInArrays[8] = countInArrays[8] + 1;
      }
      else {
        this.courses_I_want[countInArrays[i]] = savedSchedule[i][1];
        countInArrays[i] = countInArrays[i] + 1;
      }
    }
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
      if (!ruleToCourse[c.requirement_filled]) {
        ruleToCourse[c.requirement_filled] = [c];
      } else {
        ruleToCourse[c.requirement_filled].push(c);
      }
    }
    return ruleToCourse;
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
          for (var i = 0; i < checklist_rules[rule].slots && i < coursesForThisRule.length; i++) {
            dict[column + (excelNum+i)] = coursesForThisRule[i].listing // check with matlab! Shouldn't get 2!
          }
        }
      }
    }
  }

  //Constructor code
  //If new:
    //TODO put disclaimer splash page up
    //TODO put different view up?
    this.init_schedule(courses_lst);
  //else:
    //TODO
}