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
    this.semesters[1][0] = new Course("CS1110");
    this.semesters[1][1] = new Course("CS2800");
    this.semesters[2][0] = new Course("CS2110");
    this.semesters[3][0] = new Course("CS3110");
  }

  /* Pushes Course object into the semesters array at semester,index. */
  this.moveCourse = function(obj,semester,index) {
    this.semesters[semester][index] = obj;
  }

  /* Adds a new course with listing at [semester][index]. 
   * Overwrites anything that is there and returns the newly generated course. */
  this.addCourse = function(listing,semester,index) {
    listing = listing.replace(" ",""); // Removes spaces from input just in case
    console.log("adding " + listing + " at " + semester+index);
    var newCourse = new Course(listing);
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

  //Constructor code
  //If new:
    //TODO put disclaimer splash page up
    //TODO put different view up?
    this.init_new_schedule();
  //else:
    //TODO
}