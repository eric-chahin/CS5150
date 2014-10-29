/* Class: Panel is a singleton that contains methods to handle the clicks of the side panel. */
var Panel = function() {
  //Initialize all listeners for the panel

  //TODO: change "Email Nicole All Your Problems" button to print button!
  $("#email_nicole").click(
    function() {
      // window.location="auth.php";
      alert("Printing your checklist...");
      //TODO fill user information below
      var cellsToFill = {'B4':'Name: ','B5':'Email: ', 'G5':'Cornell ID: '}; //Dictionary of cell name to value
      var dataDict = {};
      dataDict['name']    = 'Eric Chahin';
      dataDict['netid']   = 'erc73';
      dataDict['version'] = user.checklist.version;
      dataDict['cells']   = cellsToFill;
      $.ajax({
        type:     "POST",
        url:      "excel/PHPExcel/print_checklist.php",
        data: dataDict,
        cache: false,
        success: function(data){
          console.log(data);
        }
      });
    }
  );

  //TODO handle the logic for turning this on and off
  var confirmOnPageExit = function(e) {
    e = e || window.event;
    var message = 'Are you sure you have saved your checklist? ARE YOU SURE?!';
    if (e) {
      e.returnValue = message;
    }
    return message;
  };
  window.onbeforeunload = confirmOnPageExit; //Turns the dialog box on
  // window.onbeforeunload = null; //Turns the dialog box off
}