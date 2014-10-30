/**
* Class: An object that represents a User's View. 
*        This is simply a schedule & checklist pairing.
*        There is a the user -> view relationship is one to many.
*        ** There will only be ONE view displayed to the user at any time **
*        Users may save a view, load a different view, and create a new view.
* @param version 
*/
var View = function(version) {
  this.checklist = new Checklist(version);
  //Make sure to set this when finding a valid schedule!
  this.schedule = null; //Schedule object

  //TODO save view function
  
};