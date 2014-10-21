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

  function create_tag_f(credits,course_num,forbidden_lst) {
    return function(course_listing) {
      var course = COURSE_INFORMATION[course_listing];
      var c  = course["credits"];
      var cn = 7000 //TODO: find course_number from course_listing
      var encoded_forbidden = course["forbidden"];
      var is_forbidden = false; // TODO: find out whether the course is forbidden
      return c >= credits && cn >= course_num && !is_forbidden;
    };
  }

  items = get_tags_from_server(version);
  alert(items[1]);
};

