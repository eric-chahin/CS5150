/**
* Class: An object that represents a User 
* @param garbage      Reference to the 2-item garbage list which stores how many
                      junk rows to send to the the ith player
* @param garbageIndex Which index of the garbage array am I
*/
var User = function(name, version, schedule) {
  this.full_name = name;
  this.checklist_version = version;
  this.schedule = schedule; //Schedule object

  //TODO save user function
};