/**
* Class: An object that represents a User
* @param name
* @param netid
* @param version
*/

//TODO: change constructor for User to include start_year
//TODO: save this.numSemesters somewhere 
var User = function(name, netid, vers, next_schedule_num, current_schedule_id, schedules) {

  this.add_new_schedule = function(schedule_name, version) {
  	var new_schedule_id = this.netid + "_" + this.next_schedule_num;
  	this.next_schedule_num = parseInt(this.next_schedule_num) + 1;
  	this.current_schedule = new Schedule(schedule_name, version, new_schedule_id, []);
  	this.schedules[this.schedules.length] = this.current_schedule;
    this.save_schedule("true");
  } 
  // given a schedule_id for a particular user (the id is guaranteed to be linked
  // to this user), set this users current schedule to be schedule with id
  // schedule_id.  Reflect this change in the tables as well.
  this.load_schedule = function(schedule_id) {
      var s = null;
      var net_id = this.netid;
      var version_number = this.user_version
      $.ajax({
             type: "GET",
             url: "user.php",
             async: false,
             dataType: "json",
             data: {'netid': net_id,
             'schedule_id': schedule_id,
             'isInitialLoad': "false"},
             success: function(data){
                if (data != null) {
                    var schedule_name = data['schedule_name'];
                    var schedule_id = data['schedule_id'];
                    var schedule = data['schedule'];
                    var courses_lst = schedule ? schedule.split(",") : [];
                    s = new Schedule(schedule_name, version_number, schedule_id, courses_lst);
                }
             }
      });
      this.current_schedule = s;
      this.save_schedule("false");
  }

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
  //Addition: user object contains version
  if (!vers)
    console.error("Version is null or undefined.");
  this.user_version = vers;
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