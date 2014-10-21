/**
* Class: An object that represents a course taken at cornell on the checklist.
* @param listing      
* @param semester
*/
var Course = function(listing, semester) {
  this.listing = listing;
  this.semester = semester; //From semester 0..7
  this.requirement_filled = determineRequirement(); //TODO replace with enum

  /* Returns the requirement that it should fulfills, 
   * returns null if cannot make decision. (TODO: perhaps it should return a list of possibilites)
   * 
   * TODO: Figure out what happens when requirements change. 
   * We may need to make it more data-driven. */
  function determineRequirement() {
    
  }
};