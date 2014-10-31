r/**
* Class: An object that represents a User
* @param name
* @param version
*/
var User = function(name, version) {
  this.full_name = name;

  this.next_schedule_num = 0;

  this.current_schedule = -1; //Need to save the current view id for when user visits again
  this.schedules = []; //Should be an array of views

  this.add_new_schedule = function(schedule_name, version) {
  	var new_schedule_id = this.net_id + "_" + this.next_schedule_num;
  	this.next_schedule_num += 1;
  	this.schedules[this.schedules.length] = new Schedule(schedule_name, version, new_schedule_id);
  	this.current_schedule=this.schedules.length;
  	//should we make the new schedule the currently viewed one?
  }

  //TODO Alex/Chris : save user function
  // saves the schedule in this.schedules corresponding to this.current_schedule

  this.add_new_schedule("My First Schedule", version);
};