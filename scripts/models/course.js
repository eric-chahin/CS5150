/**
* Class: An object that represents a course taken at cornell on the checklist.
* Note: You cannot create a Course object without creating a checklist object first
* @param listing      
*/
var Course = function(listing, requirement_filled) {
  this.listing = listing.replace(" ","");
  this.requirement_filled = requirement_filled ? requirement_filled : determineRequirement();

  /* Returns the requirement that it should fulfills, 
   * returns null if cannot make decision. (TODO: perhaps it should return a list of possibilites)
   */
  function determineRequirement() {
    for (var key in checklist_rules) {
      if (checklist_rules.hasOwnProperty(key)) {
        var rule = checklist_rules[key];
        if (rule.isAccepted(listing) === FilterValue.PERFECT) {
          return key;
        }
        //TODO: Rethink this. Problem cases 4780, 4410
      }
    }
    return null;
  }

  this.toString = function() {
    //return COURSE_INFORMATION[this.listing]["title"] + " is a great course. You should really take it.";
    return this.listing; 
  };
};