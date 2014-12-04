/**
* Class: An object that represents a User
* @param name
* @param netid
* @param version
*/

//TODO: change constructor for User to include start_year
//TODO: save this.numSemesters somewhere 
var User = function(name, netid, vers, next_schedule_num, current_schedule_id, schedules, start_year) {

  this.add_new_schedule = function(schedule_name, version, start_year) {
  	var new_schedule_id = this.netid + "_" + this.next_schedule_num;
  	this.next_schedule_num = parseInt(this.next_schedule_num) + 1;
  	this.current_schedule = new Schedule(schedule_name, version, new_schedule_id, [], start_year);
  	this.schedules[this.schedules.length] = this.current_schedule;
      
    initialized_checklist_data = "Select Vector#Select Vector#false#false#false#false";
    this.save_schedule("true", initialized_checklist_data);
      
  } 
  // given a schedule_id for a particular user (the id is guaranteed to be linked
  // to this user), set this users current schedule to be schedule with id
  // schedule_id.  Reflect this change in the tables as well.
  // TODO: start_year is currently version, get it from saving instead
  // returns the checklist_data (i.e. vector info -- including tech writing
  // and probability) so we know how to update the checklist view
  this.load_schedule = function(schedule_id) {
      var s = null;
      var net_id = this.netid;
      var version_number = this.user_version;
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
                    var checklist = data['checklist_data'];
                    checklist_data = checklist ? checklist.split("#") : [];
                    s = new Schedule(schedule_name, version_number, schedule_id, courses_lst, start_year);
                }
             }
      });
      this.current_schedule = s;
      return checklist_data;
  }

  //isNew is a flag that indicates whether the schedule to be saved was just created (i.e. using the 'add' button)
    //checklist_data is a string encoding of the vector (and tech writing / probability) info for this user.  It must be saved to the schedule table
    //every time the schedule is saved
  this.save_schedule = function(isNew, checklist_data) {
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
               'checklist_data': checklist_data,
               'isNew': isNew},
      success: function(data){
        if (data == "error"){
          //TODO: couldn't connect to database on saving
        }
      }
    });
  }

  
  //saves the vector (and tech writing / probability) info for this user
    //to the schedule table so it can be retrieved on successive loads.
    //checklist_data is an encoding of the data delimited by "#"
  this.save_checklist_info = function(checklist_data) {
      
      
  }
    
  
    
    
  this.load_checklist_info = function (checklist_data) {
      data_array = checklist_data.split("#");
      for (var i=0; i<data_array.length; i++) {
          console.log(data_array[i]);
      }
  }
    
    
  //Initializing fields
  this.full_name = name;
  this.netid = netid;
  //Addition: user object contains version
  //TODO: make version a function of start_year
  if (!vers)
    console.error("Version is null or undefined.");
  this.user_version = vers;
  this.start_year = start_year;
  this.schedules = schedules; //Should be an array of Schedule objects
  if (!this.schedules || this.schedules.length == 0) {
    //New user
    this.next_schedule_num = 0;
    this.schedules = [];
    this.current_schedule = null; //Of type Schedule object
    this.add_new_schedule("My First Schedule", vers, start_year);
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