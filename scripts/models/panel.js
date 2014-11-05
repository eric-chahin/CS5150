/* Class: Panel is a singleton that contains methods to handle the clicks of the side panel. */
var Panel = function() {
  //Initialize all listeners for the panel

  $("#print").click(
    function() {
      //TODO fill user information below
      var cellsToFill = {'B4':'Name: ','B5':'Email: ', 'G5':'Cornell ID: '}; //Dictionary of cell name to value
      user.current_schedule.getExcelLocations(cellsToFill);
      var dataDict = {};
      dataDict['name']    = 'Eric Chahin';
      dataDict['netid']   = 'erc73';
      dataDict['version'] = us;//user.current_schedule.checklist.version;
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
}