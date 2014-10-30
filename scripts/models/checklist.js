/**
* Class: An object that represents a checklist and its requirements 
* @param version 
*/
var Checklist = function(version) {
  this.version = version;
  checklist_rules = null; // dictionary of Rules (title) -> Rule

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
            var r = new Rule(e["title"],e["slot_count"],generate_filter_f(e["tag"]),e["header"]);
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
    return function(course_listing) {
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
      return this_credits >= credits && cn >= course_num && !forbidden;
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
      var rtn_f = function(listing) {
        var f = tagsDict[tag_allowed_lst];
        if (!f) {
          //TODO: Take care of FWS and Liberal Studies tags
          return FilterValue.FORBIDDEN;
        }
        if (f(listing)) {
          return FilterValue.ALLOWED;
        } else {
          return FilterValue.FORBIDDEN;
        }
      };
    } else {
      //allowed_lst
      var rtn_f = function(listing) {
        var lst = tag_allowed_lst.split(";");
        return (lst.indexOf(listing) > -1) ? FilterValue.PERFECT : FilterValue.FORBIDDEN;
      };
    }

    return rtn_f;
  }

  /* Returns JSON object of title of Rule -> Course obj. 
   *  Strictly reads from the schedule object. Does not save state anywhere
   *  in order to avoid maintaining multiple states. */
  this.readSchedule = function() {
    //TODO Ben
  }

  /* Loads the HTML for the checklist. Essential when creating a new Checklist object. */
  this.createChecklistHTML = function() {
    var leftChecklistRows = 12;
    var count = 0;
    var header = "";
    for (var rule in checklist_rules) {
      for (var i = 0; i < checklist_rules[rule].slots; i++) {
        
        var checklistclass = ".classleftrow";
        if (count > leftChecklistRows) {
           checklistclass = ".classrightrow";
        }
        
        if (header != checklist_rules[rule].header) {
           $(checklistclass).append("<div class='classRow'>" +
                  checklist_rules[rule].header +
                  " </div>");
          header = checklist_rules[rule].header
        }
        
        $(checklistclass).append("<div class='classRow'>" +
                  " <div class='requirement'>" + checklist_rules[rule].title +
                  "</div><div class='drag-course dragcolumnchecklist'>" +
                  " <div class='course-name'>" + "" +
                 "  </div><div class='course-credit'></div>" +
                 "<div class='course-semester'></div> " +
                 " </div></div>");
      }
      if (count == leftChecklistRows) {
         $(".classleftrow").append("<div class ='unassigned-box'><div class='classRow'>Unassigned Courses</div></div>");
      }
      
      count++;
    }
   }


  
  var tagsDict = {}; // Holds tag_name (String) -> tag function (function)
  var tmp_rules = {};
  get_tags_from_server(version);
  get_rules_from_server(version);
  checklist_rules = tmp_rules;
  this.createChecklistHTML();
};

