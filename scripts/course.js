/**
* Class: An object that represents a course taken at cornell on the checklist.
* @param garbage      Reference to the 2-item garbage list which stores how many
                      junk rows to send to the the ith player
* @param garbageIndex Which index of the garbage array am I
*/
var Course = function(listing, semester, i) {
  this.listing = listing;
  this.semester = semester; //From semester 0..7
  this.semester_index = i;
  this.requirement_filled = 0; //TODO replace with enum
};