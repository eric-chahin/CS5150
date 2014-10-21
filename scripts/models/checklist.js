/**
* Class: An object that represents a checklist and its requirements 
* @param version 
*/
var Checklist = function(version) {
  this.checklist_version = version;
  this.checklist_tags = ""; // TODO: the tag (String) -> filter function (string->boolean)
  this.checklist_rules = "";// TODO: put the tags with the rules
  //Hosts a list of tags (Strings) -> classes it fulfills (String List)

  function get_tags_from_server(v) {
    var rtn = [];
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
            rtn.push(data[x]["title"]);
          }
        }
      });
    }
    return rtn;    
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

  /* Creates a filter function for this rule. */
  function create_tag_f(credits,course_num,forbidden_lst) {
    return function(course_listing) {
      var course = COURSE_INFORMATION[course_listing];
      var c_str  = course["credits"];
      if (c_str.indexOf("-") !== -1) {
        var this_credits = parseInt(c_str.substring(c_str.indexOf("-")+1)); //Taking the max credits
      } else {
        var this_credits = parseInt(c_str);
      }
      var cn = parseInt(course_listing(course_listing.length-4,course_listing.length)); 
      var forbidden = is_forbidden(course_listing, course["forbidden"]); 
      return this_credits >= credits && cn >= course_num && !forbidden;
    };
  }

  items = get_tags_from_server(version);
  // alert(items[1]); // Should be liberal studies
};

