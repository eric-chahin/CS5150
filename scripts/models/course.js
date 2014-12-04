/**
* Class: An object that represents a course taken at cornell on the checklist.
* Note: You cannot create a Course object without creating a checklist object first
* @param listing
*/
var Course = function(listing, requirement_filled) {
  var listing = listing.replace(" ","");
  this.listing = listing;
  var requirement_filled = requirement_filled ? requirement_filled : determineRequirement();
  this.warnings = []; // A list of warnings that come with the reqirement_filled

  /* Returns the requirement that it should fulfills,
   * returns null if cannot make decision. (TODO: perhaps it should return a list of possibilites)
   */
  function determineRequirement() {
    for (var key in checklist_rules) {
      if (checklist_rules.hasOwnProperty(key)) {
        var rule = checklist_rules[key];
        if (rule.isAccepted(listing,[]) === FilterValue.PERFECT) {
          return key;
        }
        //TODO: Rethink this. Problem cases 4780, 4410
      }
    }
    return null;
  }

  this.getRequirementFilled = function() {
    return requirement_filled;
  }

  this.setRequirementFilled = function(req) {
    if (requirement_filled != req) {
      user.current_schedule.setSaved(false);
    }
    if (req !== null) {
      var rule = checklist_rules[req];
      if (rule) {
        var warns = [];
        rule.isAccepted(listing,warns);
        this.warnings = warns;
      }
    } else {
      this.warnings = [];
    }
    requirement_filled = req;
  }
    
  this.toString = function() {
    //in the user db, a course object is represented as <listing>#<requirement_filled>
    if (requirement_filled !== null) {
        return this.listing + "#" + requirement_filled;
    }
    else {
        return this.listing + "#";
    }
  };

  /* To use with popup. Returns HTML description of course from COURSE_INFORMATION. */
  this.prettyPrint = function() {
    var info = COURSE_INFORMATION[this.listing];
    return "<b>LISTING:</b> " + this.listing + "<br>" + 
           "<b>TITLE:</b> " + info.title + "<br>" +
           "<b>USUALLY OFFERED:</b> " + info.seasons + "<br>" +
           "<b>DESCRIPTION:</b> " + info.description;
  }

};