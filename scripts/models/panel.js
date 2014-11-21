/* Class: Panel is a singleton that contains methods to handle the clicks of the side panel. */
var Panel = function() {
  //Initialize all listeners for the panel

  $("#print").click(
    function() {
      // Save checklist
      user.save_schedule("false");
      var dataDict = {};
      var name  = 'Eric Chahin'; //TODO get!
      var netid = 'erc73'; //TODO get!
      var version = user.current_schedule.checklist.version;
      var cellsToFill = {'B4':'Name: ' + name,'B5':'Email: ' + netid + '@cornell.edu'}; //Dictionary of cell name to value
      user.current_schedule.getExcelLocations(cellsToFill);
      var html = getFormHtmlForPrinting(name, netid, version, cellsToFill);
      // Put html into div w. jquery
      $("#printDiv").html(html);
      // load up the individual fields on the form
      $("#printDiv input[name=name]").val(name);
      $("#printDiv input[name=netid]").val(netid);
      $("#printDiv input[name=version]").val(version);
      for (var key in cellsToFill) {
        if (cellsToFill.hasOwnProperty(key)) {
          var dumdum = cellsToFill[key];
          $("#printDiv input[name='cells["+key+"]']").val(cellsToFill[key]);
        }
      }
      // submit the form
      $("#printing_form").submit();
    }
  );

  function getFormHtmlForPrinting(name,netid,version,cells) {
    var url = "excel/PHPExcel/print_checklist.php";
    var html = '<form id="printing_form" action="' + url + '" method="post">';
    html += '<input type="text" name="name" />';
    html += '<input type="text" name="netid" />';
    html += '<input type="text" name="version" />';
    for (var key in cells) {
      if (cells.hasOwnProperty(key)) {
        html += '<input type="text" name="cells['+key+']" />';
      }
    }
    html += '</form>';
    return html;
  }
}