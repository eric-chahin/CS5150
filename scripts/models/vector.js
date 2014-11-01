/**
* Class: An object that represents a vector for the checklist
* @param title
* @param slots     How many slots on the checklist does this rule take up
* @param filter    Function that returns true/false if class satisfies this rule
*/
var Vector = function(title) {
  this.title = title;
  this.components = [];
  
  this.addComponent = function(slots, fullfills_f) {
    this.components.push(new VectorComponent(slots, fullfills_f));
  }
};

/**
* Class: An object that represents a COMPONENT for the vector
* @param slots          How many slots on the vector does this VectorComponent take up
* @param fullfills_f    Function that returns true/false if course satisfies this vector component
*/
var VectorComponent = function(slots, fullfills_f) {
  this.slots = slots;
  this.fulfillsVector = fullfills_f; // course_listing (String) -> bool
};



