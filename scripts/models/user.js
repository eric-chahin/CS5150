/**
* Class: An object that represents a User
* @param name
* @param netid
* @param version
*/


//TODO: change constructor for User to include start_year 
var User = function(name, netid, vers, next_schedule_num, current_schedule_id, schedules) {

  this.add_new_schedule = function(schedule_name, version) {
  	var new_schedule_id = this.netid + "_" + this.next_schedule_num;
  	this.next_schedule_num = parseInt(this.next_schedule_num) + 1;
  	this.current_schedule = new Schedule(schedule_name, version, new_schedule_id, []);
  	this.schedules[this.schedules.length] = this.current_schedule;
    this.save_schedule("true");
  }

  this.load_schedule = function(schedule_id) {
    //TODO 
  }

  //TODO Alex/Chris : save user function
  // saves the schedule in this.schedules corresponding to this.current_schedule
  //NOTE: Need to save the current view id for when user visits again
  //isNew is a flag that indicates whether the schedule to be saved was just created (i.e. using the 'add' button)
  this.save_schedule = function(isNew) {
    //user data ON PAGE has been updated in main.js, the rest must be updated here
    this.current_schedule.setSaved(true);
    $.ajax({
      type:  "POST",
      url: "user.php",
      async: false,
      dataType: "json",
      data:   {'netid': this.netid,
               'next_schedule_num': this.next_schedule_num, 
               'current_schedule_id': this.current_schedule.id,
               'schedule_name': this.current_schedule.name,
               'schedules': this.current_schedule.toArray().toString(),
               'isNew': isNew},
      success: function(data){
        if (data == "error"){
          //TODO: couldn't connect to database on saving
        }
      }
    });
  }

  //Initializing fields
  this.full_name = name;
  this.netid = netid;
  this.schedules = schedules; //Should be an array of Schedule objects
  if (!this.schedules || this.schedules.length == 0) {
    //New user
    this.next_schedule_num = 0;
    this.schedules = [];
    this.current_schedule = null; //Of type Schedule object
    this.add_new_schedule("My First Schedule", vers);
  } else {
    //Loading old user
    this.next_schedule_num = next_schedule_num;
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