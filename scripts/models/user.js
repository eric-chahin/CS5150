/**
* Class: An object that represents a User
* @param name
* @param netid
* @param version
*/

var User = function(name, netid, vers, next_schedule_num, current_schedule, start_year) {

  this.add_new_schedule = function(schedule_name, version, start_year) {
  	var new_schedule_id = this.netid + "_" + this.next_schedule_num;
  	this.next_schedule_num = parseInt(this.next_schedule_num) + 1;
  	this.current_schedule = new Schedule(schedule_name, version, new_schedule_id, [], start_year);
      
    initialized_checklist_data = "Select Vector#Select Vector#false#false#false#false";
    this.save_schedule("true", initialized_checklist_data);
      
  } 
  // given a schedule_id for a particular user (the id is guaranteed to be linked
  // to this user), set this users current schedule to be schedule with id
  // schedule_id.  Reflect this change in the tables as well.
  // TODO: start_year is currently version, get it from saving instead
  // returns a string of the checklist_data (i.e. vector info -- including tech writing
  // and probability) and potential courses so we know how to update the checklist view
  this.load_schedule = function(schedule_id) {
      var s = null;
      var net_id = this.netid;
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
                    var version_number = data['version'];
                    var start_yr = data['start_year'];
                    var schedule = data['schedule'];
                    var courses_lst = schedule ? schedule.split(",") : [];
                    checklist = data['checklist_data'];
                    potential = data['potential_courses'];
                    s = new Schedule(schedule_name, version_number, schedule_id, courses_lst, start_yr);
                }
             }
      });
      this.current_schedule = s;
      return checklist + ";" + potential;
  }

  //isNew is a flag that indicates whether the schedule to be saved was just created (i.e. using the 'add' button)
    //checklist_data is a string encoding of the vector (and tech writing / probability) info for this user.  It must be saved to the schedule table
    //every time the schedule is saved
  this.save_schedule = function(isNew, checklist_data, potential_str) {
    this.current_schedule.setSaved(true);
    $.ajax({
      type:  "POST",
      url: "user.php",
      async: false,
      dataType: "json",
      data:   {'netid': this.netid,
               'next_schedule_num': this.next_schedule_num,
               'current_schedule_id': this.current_schedule.id,
               'version': this.current_schedule.checklist.version,
               'start_year': this.current_schedule.startYear,
               'schedule_name': this.current_schedule.name,
               'schedules': this.current_schedule.toArray().toString(),
               'checklist_data': checklist_data,
               'potential_courses': potential_str,
               'isNew': isNew},
      success: function(data){
        if (data == "error"){
          //TODO: couldn't connect to database on saving
        }
      }
    });
  }

  /* Delete the schedule specified with the schedule_id. Updates
     database to reflect the change. */
  this.delete_schedule = function(schedule_id, isDelete){
    //assume schedule_id != current_schedule_id
    $.ajax({
      type:  "POST",
      url: "user.php",
      async: false,
      dataType: "json",
      data:   {'netid': this.netid,
               'schedule_id': schedule_id,
               'isDelete': isDelete},
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
  if (!vers)
    console.error("Version is null or undefined.");
  if (!current_schedule || current_schedule.length == 0) {
    //New user
    this.next_schedule_num = 0;
    this.current_schedule = null; //Of type Schedule object
    this.add_new_schedule("First Schedule", vers, start_year);
  } else {
    //Loading old user
    this.next_schedule_num = next_schedule_num;
    this.current_schedule = current_schedule;
    if (!this.current_schedule) {
      console.log("The current schedule could not be found. Check user data integrity.");
    }
  }
};