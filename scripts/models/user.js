/**
* Class: An object that represents a User 
* @param name     
* @param version 
* @param schedule
*/
var User = function(name, version, schedule) {
  this.full_name = name;
  this.checklist = new Checklist(version);
  this.schedule = schedule; //Schedule object

  //TODO save user function
  
};