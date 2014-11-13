/**
* Class: An object that represents a rule for the checklist
* @param title
* @param slots        How many slots on the checklist does this rule take up
* @param filter       Function that returns true/false if class satisfies this rule
* @param excel_cell   The first excel slot the rule occupies
*/
var Rule = function(title, slots, filter, header, excel_cell) {
  this.title = title;
  this.header = header;
  this.slots = slots;
  this.excel_cell = excel_cell;
  this.isAccepted = filter; //function that returns either {FORBIDDEN, ALLOWED, PERFECT}
                            //isAccepted(String,Warning lst)
};

