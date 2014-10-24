/**
* Class: An object that represents a User 
* @param name     
* @param version 
* @param schedule
*/
var User = function(name, version) {
  this.full_name = name;
  this.checklist = new Checklist(version);
  //Make sure to set this when finding a valid schedule!
  this.schedule = null; //Schedule object


  //TODO save user function
  
};