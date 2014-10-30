/**
* Class: An object that represents a rule for the checklist
* @param title
* @param slots     How many slots on the checklist does this rule take up
* @param filter    Function that returns true/false if class satisfies this rule
*/
var Rule = function(title, slots, filter, header) {
  this.header = header;
  this.title = title;
  this.slots = slots;
  this.isAccepted = filter; //function that returns either {FORBIDDEN, ALLOWED, PERFECT} 
};

