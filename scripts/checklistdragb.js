//http://www.html5rocks.com/en/tutorials/dnd/basics/

function checklistDrag() { 
  var dragSrc = null;
  var $dragSrcNode = null; //jQuery node
  var draggingColumn = null;
  var ENABLE_GHOST_COL = false;

  function checklisthandleClick(e) {
    console.log("Clicking");
   
  }

  function checklisthandleDragStart(e) {
    console.log("dragstart");
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    dragSrc = this;
    $dragSrcNode = $("#" + this.id);

    window.console && console.log(e, e.dataTransfer);
    window.foo = e;
    if (ENABLE_GHOST_COL) {
      draggingColumn = dragSrc.cloneNode(true);
      draggingColumn.style.display = 'none';
      document.body.appendChild(draggingColumn);
    }

    dragSrc.style.opacity = '0.4';
  }

  function checklisthandleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Allows us to drop.
    }
    if (ENABLE_GHOST_COL) {
      var mousePos = mouseCoords(e);
      draggingColumn.style.display = 'block';
      draggingColumn.style.position =  'absolute';  
      draggingColumn.style.top =  mousePos.y + 5 + 'px';
      draggingColumn.style.left = mousePos.x + 5 + 'px';
    }

    e.dataTransfer.dropEffect = 'move';

    this.addClassName('over');

    return false;
  }

  function checklisthandleDragLeave(e) {
    this.removeClassName('over');
    // console.log("does this happen multiple times");
  }

  function checklisthandleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
      //checklistcopySections();
      console.log("dropped");
    }


    // Don't do anything if we're dropping on the same column we're dragging.
    if (dragSrc != this) {
      var $thisNode = $("#" + this.id);
      var thisCourse = $thisNode.data("course");
      if (thisCourse == undefined) thisCourse = null;
      var dragCourse = $dragSrcNode.data("course");
      if (dragCourse == undefined) dragCourse = null;

      //Swapping the contents in this div and the dragSrc div, no object switching
        dragSrc.innerHTML = this.innerHTML; //this.getData('text/html');
       // var name2 = dragSrc.attr('data-name');
        //var name1 = this.attr('data-name'); 
        
       // dragSrc.attr('data-name', name1);
       // this.attr('data-name', name2);
        
        //NOTE: changed from this.textContent to this.innerHTML
        
      this.innerHTML = e.dataTransfer.getData('text/html');
      

      checklist_view.addChecklistWarnings();
    
      $(".unassigned-classes").children().each(function(){
        if($.trim($(this).text()) == ""){
         $(this).remove();
         console.log("Removing");
        }
      });
      
   
        
      console.log(user.current_schedule.toString());
      console.log("CIWTT: " + user.current_schedule.courses_I_want.toString());
    }

    return false;
  }

  function checklisthandleDragEnd(e) {
    
    var cols = document.querySelectorAll('.dragcolumnchecklist');
    [].forEach.call(cols, function (col) {
      col.removeClassName('over');
    });

    dragSrc.style.opacity = '1';

    if (ENABLE_GHOST_COL) {
      document.body.removeChild(draggingColumn);
    }
  }


  function checklistattachColumnListener(col) {
    // Enable columns to be draggable.
    col.setAttribute('draggable', 'true');
    
    col.addEventListener('dragstart', checklisthandleDragStart);

    // Enable columns to be clickable
    col.addEventListener('click', checklisthandleClick);
    // Make each column itself a drop target.
    col.addEventListener('drop', checklisthandleDrop);
    col.addEventListener('dragover', checklisthandleDragOver);
    col.addEventListener('dragleave', checklisthandleDragLeave);
    col.addEventListener('dragend', checklisthandleDragEnd);
  }

  var cols2 = document.querySelectorAll('.dragcolumnchecklist');
  [].forEach.call(cols2, function (col) {
    checklistattachColumnListener(col);
  });

};

function checklistrecreateExistingDivs() { 

  //checklist_box_container
  console.log("recreate is being called");
  var nodes = $( ".checklist_box" ).children();
  $( ".checklist_box" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $(".checklist_box_container").append("<div class='checklist_box'></div>");
    $(".checklist_box").append("<div class='hexagon dragcolumn searchdiv'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}

function checklistcopySections(){
  var checklistclone = $("#content").clone();
  var vector1_val = $("#vector1").val();
  var vector2_val = $("#vector2").val();
  $("#content").remove();
  $("#content_container").append(checklistclone);
  $("#vector1").val(vector1_val);
  $("#vector2").val(vector2_val);
  $("#vector1,#vector2").change(function() {
    user.current_schedule.updateVectorWarnings();
  });
}



