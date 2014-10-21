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

  //Constructor code
  //If new:
    this.init_new_schedule();
  //else:
    //TODO
}