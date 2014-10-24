/**
* Class: An object that represents a course taken at cornell on the checklist.
* @param listing      
*/
var Course = function(listing) {
  this.listing = listing;
  this.requirement_filled = determineRequirement(); //TODO replace with enum

  /* Returns the requirement that it should fulfills, 
   * returns null if cannot make decision. (TODO: perhaps it should return a list of possibilites)
   * 
   * TODO: Figure out what happens when requirements change. 
   * We may need to make it more data-driven. */
  function determineRequirement() {
    // debugger;
    for (var key in checklist_rules) {
      if (checklist_rules.hasOwnProperty(key)) {
        // alert(key);
        var rule = checklist_rules[key];
        if (rule.isAccepted(listing) == FilterValue.PERFECT) {
          return key;
        }
      }
    }
    return null;
  }
};