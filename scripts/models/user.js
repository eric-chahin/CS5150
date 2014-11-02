/**
* Class: An object that represents a User
* @param name
* @param netid
* @param version
*/
var User = function(name, netid, version, next_schedule_num, current_schedule_id, schedules) {

  this.add_new_schedule = function(schedule_name, version) {
  	var new_schedule_id = this.netid + "_" + this.next_schedule_num;
  	this.next_schedule_num += 1;
  	this.current_schedule = new Schedule(schedule_name, version, new_schedule_id, "TODO NEED TO LOAD FROM SCHEDULE");
  	this.schedules[this.schedules.length] = this.current_schedule;
  }

  this.load_different_schedule = function() {
    //TODO 
  }

  //TODO Alex/Chris : save user function
  // saves the schedule in this.schedules corresponding to this.current_schedule
  //NOTE: Need to save the current view id for when user visits again


  //Initializing fields
  this.full_name = name;
  this.netid = netid;
  if (!this.schedules || this.schedules.length == 0) {
    //New user
    this.next_schedule_num = 0;
    this.schedules = [];
    this.current_schedule = null; //Of type Schedule object
    this.add_new_schedule("My First Schedule", version);
  } else {
    //Loading old user
    this.next_schedule_num = next_schedule_num;
    this.schedules = schedules; //Should be an array of Schedule objects
    this.current_schedule = null; //Of type Schedule object
    for (var i = 0; i < schedules.length; i++) {
      if (this.schedules[i].id == current_schedule_id) {
        this.current_schedule = this.schedules[i];
      }
    }
    if (!this.current_schedule) {
      console.log("The current schedule could not be found. Check user data integrity.");
    }
  }
};