/**
* Class: An object that represents a User 
* @param name     
* @param version 
*/
var User = function(name, version) {
  this.full_name = name;
  this.checklist = new Checklist(version);
  //Make sure to set this when finding a valid schedule!
  this.schedule = null; //Schedule object
  // TODO decouple checklist and schedule in favor of "View" object

  this.current_view_id = -1; //Need to save the current view id for when user visits again
  this.views = []; //Should be an array of views

  //TODO save user function
  
};