/**
* Class: An object that represents a course taken at cornell on the checklist.
* @param listing      
* @param semester
*/
var Course = function(listing, semester) {
  this.listing = listing;
  this.semester = semester; //From semester 0..7
  this.requirement_filled = 0; //TODO replace with enum
};