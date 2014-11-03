//http://www.html5rocks.com/en/tutorials/dnd/basics/

function checklistDrag() { 
  var dragSrc = null;
  var $dragSrcNode = null; //jQuery node
  var draggingColumn = null;
  var ENABLE_GHOST_COL = false;

  function checklisthandleClick(e) {
    console.log("Clicking");
   
  }

  /* Replaces the current popup text with str. */
  function replacePopupText(str) {
    $("#popup").text(str);
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
      //  var name2 = dragSrc.attr('data-name');
       // var name1 = this.attr('data-name');
        
       // dragSrc.attr('data-name', name1);
       // this.attr('data-name', name2);
        
        //NOTE: changed from this.textContent to this.innerHTML
        
      this.innerHTML = e.dataTransfer.getData('text/html');
     
      
      if (document.getElementById("remove") == this) {
        //send hexagon into the abyss
        dragSrc.innerHTML = "";
        this.innerHTML = "";
        shakeGarbageCan();
      }

      //gets their locations based on id course_12
      var dragIsScheduleCourse = "course_" === dragSrc.id.substring(0,7);
      var thisIsScheduleCourse = "course_" === this.id.substring(0,7);
      var dragSemester = parseInt(dragSrc.id.substring(7,8))-1;
      var dragIndex    = parseInt(dragSrc.id.substring(8))-1;
      var thisSemester = parseInt(this.id.substring(7,8))-1;
      var thisIndex    = parseInt(this.id.substring(8,9))-1;

      if (dragIsScheduleCourse && thisIsScheduleCourse) {
        $dragSrcNode.data("course",thisCourse);
        $thisNode.data("course",dragCourse); 
        user.current_schedule.swapCourses(dragSemester,dragIndex,thisSemester,thisIndex);
      } else if (dragIsScheduleCourse && !thisIsScheduleCourse) {
        if (dragSrc.textContent !== "" && !user.current_schedule.contains(dragSrc.textContent)) {
          var newCourse = user.current_schedule.addCourse(dragSrc.textContent, dragSemester, dragIndex); 
          $dragSrcNode.data("course", newCourse);
        } else {
          console.log("deleting " + this.textContent);
          user.current_schedule.deleteCourse(dragSemester, dragIndex);
          $dragSrcNode.data("course",null);
        }
      } else if (!dragIsScheduleCourse && thisIsScheduleCourse) {
        //add a new course from the hexagon that you've just dragged over
        if (!user.current_schedule.contains(this.textContent)){
          var newCourse = user.current_schedule.addCourse(this.textContent, thisSemester,thisIndex); 
          $thisNode.data("course", newCourse);
        } else {
          this.innerHTML = dragSrc.innerHTML;
          dragSrc.innerHTML = e.dataTransfer.getData('text/html');
          alert(dragSrc.textContent + " is already in your schedule! :(");
        }
      } else {
        //just swapping divs elsewhere, don't care
      }

      console.log(user.current_schedule.toString());


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
  console.log("recreate is being called");
  var nodes = $( "#resultspar" ).children();
  $( "#resultspar" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $("#permanent").append("<div id='resultspar'></div>");
    $("#resultspar").append("<div class='hexagon dragcolumn searchdiv'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}

function checklistcopySections(){
  // console.log("copy the sections");
  var classContainerChildren =  $(".classContainerChildren").clone();
  var yearChildren = $(".carousel_container").clone();
  $(".classContainerChildren").remove();
  $(".carousel_container").remove();
  $(".refresh_holder_classContainer").append(classContainerChildren);
  $(".carousel_holder").append(yearChildren);
}



