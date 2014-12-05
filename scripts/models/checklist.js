/**
* Class: An object that represents a checklist and its requirements 
* @param version 
*/
var Checklist = function(version) {
  this.version = version;
  checklist_rules = null; // dictionary of Rules (title) -> Rule
  vectors = null; // Holds vector name (function) -> vector object (Vector)

  function get_rules_from_server(v) {
    if(v !== ''){
      $.ajax({
        type:     "GET",
        url:      "checklist.php",
        async:    false,
        dataType: "json",
        data:     { version: v,
                    table:   "checklist_rules"},
        cache: false,
        success: function(data){
          for (var x = 0; x < data.length; x++) {
            var e = data[x]
            var r = new Rule(e["title"],e["slot_count"],generate_filter_f(e["tag"]),e["header"],e["excel_cell"]);
            tmp_rules[e["title"]] = r;
          }
        }
      });
    }
    return false;    
  }

  function get_tags_from_server(v) {
    if(v !== ''){
      $.ajax({
        type:     "GET",
        url:      "checklist.php",
        async:    false,
        dataType: "json",
        data:     { version: v,
                    table:   "checklist_tags"},
        cache: false,
        success: function(data){
          for (var x = 0; x < data.length; x++) {
            var e = data[x]
            tagsDict[e["tag"]] = create_tag_f(e["credits"],e["course_num"],e["forbidden"]);
          }
        }
      });
    }
    return false;    
  }

  function get_vectors_from_server(ver) {
    if(ver !== ''){
      $.ajax({
        type:     "GET",
        url:      "checklist.php",
        async:    false,
        dataType: "json",
        data:     { version: ver,
                    table:   "checklist_vectors"},
        cache: false,
        success: function(data){
          for (var x = 0; x < data.length; x++) {
            var e = data[x]
            if (!vectorDict[e["title"]]) {
              vectorDict[e['title']] = new Vector(e['title']);
            }
            // add the  component
            vectorDict[e["title"]].addComponent(e['slot_count'], create_vector_f(e['allowed'],e['forbidden']));
          }
        }
      });
    }
    return false;
  }

  /* Given a course listing and forbidden list, return true if this course is
   * not allowed and false if it is. 
   * Note: the forbidden list is an encoded string where the values are separated by ';'
   *       Also, if there is an asterisk, it matches with the prefix. */
  function is_forbidden(course_listing,forbidden_str) {
    var forbidden_courses = forbidden_str.split(";");
    for (var i = 0; i < forbidden_courses.length; i++) {
      var forbid = forbidden_courses[i];
      if (forbid.indexOf("*") === -1) {
        if (forbid === course_listing)
          return true;
      } else {
        var prefix = forbid.substring(0,forbid.indexOf("*"));
        if (course_listing.substring(0,prefix.length) === prefix)
          return true;
      }
    }
    return false;
  }

  /* Creates a tag function for this rule. 
   * Returns true if accepted by tag. */
  function create_tag_f(credits,course_num,forbidden_str) {
    return function(course_listing, warnings) {
      course_listing = course_listing.replace(" ","");
      var course = COURSE_INFORMATION[course_listing];
      if (!course) debugger;
      var c_str  = course["credits"];
      if (c_str.indexOf("-") !== -1) {
        var this_credits = parseInt(c_str.substring(c_str.indexOf("-")+1)); //Taking the max credits
      } else {
        var this_credits = parseInt(c_str);
      }
      var cn = parseInt(course_listing.substring(course_listing.length-4,course_listing.length)); 
      var forbidden = is_forbidden(course_listing, forbidden_str); 
      var too_few_credits = this_credits < credits;
      var course_num_too_low = cn < course_num;
      if (forbidden)
        warnings.push(WarningType.FORBIDDEN);
      if (too_few_credits)
        warnings.push(WarningType.CREDITS);
      if (course_num_too_low)
        warnings.push(WarningType.COURSE_LEVEL);
      return !too_few_credits && !course_num_too_low && !forbidden;
    };
  }

  /* The filter function gives the go-ahead on whether the passed in class is
   * acceptable to take by the rule. 
   * There are three values the return function can return:
   *    1. FORBIDDEN - the class does not obey the requirements
   *    2. ALLOWED   - the class fits some broad category of classes (e.g CS4780 can be a tech elective)
   *    3. PERFECT   - the class is a perfect match for this rule. 
   *                  (e.g. CHEM2090 is perfect for the CHEM 2090 slot.) 
   * The filter function is different from the tag function because the tag function is based off of
   *   a different set of requirements. The tag function can be used in place of the list of accepted courses
   *
   * @param tag           General set of restrictions 
   *  OR    allowed_lst   Allowed list of classes to take from the Rule
   * NOTE: one of these parameters must be null
   * 
   */
  function generate_filter_f(tag_allowed_lst) {
    if (tag_allowed_lst.charAt(0) === "$") {
      //tag
      var rtn_f = function(listing,warnings) {
        var f = tagsDict[tag_allowed_lst];
        if (!f) {
          //Special case: Freshman Writing Seminar
          //The tag is $FWS, and is accepted whenever a course title starts with "FWS"
          if (tag_allowed_lst === "$FWS") {
            if (COURSE_INFORMATION[listing].title.substring(0,3) === "FWS") {
              return FilterValue.PERFECT;
            } else {
              warnings.push(WarningType.FORBIDDEN);
              return FilterValue.FORBIDDEN;
            }
          } else {
            return FilterValue.FORBIDDEN;
          }
        }
        if (f(listing,warnings)) {
          return FilterValue.ALLOWED;
        } else {
          return FilterValue.FORBIDDEN;
        }
      };
    } else {
      //allowed_lst
      var rtn_f = function(listing,warnings) {
        //A bit weird, but we are just using is_forbidden to see if listing matches with the list
        var accepted = is_forbidden(listing,tag_allowed_lst) 
        if (accepted) {
          return FilterValue.PERFECT;
        } else {
          warnings.push(WarningType.SPECIFIC_CLASS);
          return FilterValue.FORBIDDEN;
        }
      };
    }

    return rtn_f;
  }

  /* Loads the HTML for the checklist. Essential when creating a new Checklist object. */
  this.createChecklistHTML = function() {
    var leftChecklistRows = 19;
    var count = 0;
    var header = "";
    var checklistclass = ".classleftrow";
    for (var rule in checklist_rules) {
      for (var i = 0; i < checklist_rules[rule].slots; i++) {
        
       
        if (count == leftChecklistRows) {
           checklistclass = ".classrightrow";
        }
        
        if (header != checklist_rules[rule].header) {
           $(checklistclass).append("<div class='classRow'>" +
                  checklist_rules[rule].header +
                  " </div>");
          header = checklist_rules[rule].header
                              $(checklistclass).append("<div class='classRow'><div class='requirement'>Requirement</div><div class = 'warning-col'>" +          
                                    "</div>" +
                                    "<div class='drag-course'><div class='course-name'>Course Name</div><div class='course-credit'>Cr</div>" +
                                    "<div class='course-semester'>Sem</div></div>" +
                  " </div>");
        }
        
        $(checklistclass).append("<div class='classRow'>" +
                  " <div class='requirement'>" + checklist_rules[rule].title +
                  "</div><div class = 'warning-col'></div><div class='drag-course dragcolumnchecklist'>" +
                  " <div class='course-name'>" + "" +
                 "  </div><div class='course-credit'></div>" +
                 "<div class='course-semester'></div> " +
                 " </div></div>");
      if (count == leftChecklistRows) {
         $(".classleftrow").append("<div class ='unassigned-box'><div class='classRow'>Unassigned Courses</div>" + 
                                  "<div class ='unassigned-classes'></div></div><div class ='checkbox-requirements'>"+
                                  "<input type='checkbox' name='techBox' id='techBox' value='tech'> Technical Writing<br>" +
                                  " <input type='checkbox' name='statBox' id='statBox' value='stat'> Probability</div>");      
      }
      count++;
      }
         
    }
    $(checklistclass).append("<div class='vector-content'><h3>Vector</h5>"
                         +"<div class='vector-row'>Vector 1:<select type='text' name='vector1' id='vector1'><option selected disabled>Select Vector</option></select> Completed? <input type='checkbox' name='completedVec1' id='completedVec1' value='tech'><div class='vector-warning'></div>"
                         +"<div class='vector-row'>Vector 2:<select type='text' name='vector2' id='vector2'><option selected disabled>Select Vector</option></select> Completed? <input type='checkbox' name='completedVec2' id='completedVec2' value='tech'><div class='vector-warning'></div></div></div>");
}


  /* 
   * Takes in a list and returns true if the course matches a rule in the lst
   * 'x' can match with any digit
   * 'f' can match with 4, 5, or 6
   */
  var course_match = function(lst,course) {
    for (var i = 0; i < lst.length; i++) {
      var other_course = lst[i];
      var equal_words = true;
      for (var j = 0; j < other_course.length; j++) {
        var current_char = other_course.charAt(j);
        if (current_char === 'x') {
          if (isNaN(course.charAt(j))) {
            equal_words = false;
            break;
          }
        } else if (current_char === 'f') {
          var c = course.charAt(j);
          if (c !== '4' && c !== '5' && c !== '6') {
            equal_words = false;
            break;
          }
        } else if (current_char !== course.charAt(j)) {
          equal_words = false;
          break;
        }
      }
      if (equal_words) 
        return true;
    }
    return false;
  }

  /*
   * Takes in an allowed_str and forbidden_str from the vector database and 
   * returns a function that tells whether a course_listing fulfills the vector 
   *
   * The two parameters are strings in encoded list form "item1;item2;item3;etc"
   */
  var create_vector_f = function(allowed_str, forbidden_str) {
    return function(course_listing, warnings) {
      var allowed_lst = allowed_str.split(";");
      if (forbidden_str.length === 0) {
        var forbidden_lst = [];
      } else {
        var forbidden_lst = forbidden_str.split(";");
      }
      return course_match(allowed_lst,course_listing) && !course_match(forbidden_lst, course_listing);
    };
  }

  var tagsDict = {}; // Holds tag_name (String) -> tag function (function)
  var tmp_rules = {};
  var vectorDict = {}; 
  get_tags_from_server(version);
  get_rules_from_server(version);
  get_vectors_from_server(version);
  checklist_rules = tmp_rules;
  vectors = vectorDict;
  //TEST
  //TODO TODO tell when checklist slot or vector slot is satisfied
  this.createChecklistHTML();
};

