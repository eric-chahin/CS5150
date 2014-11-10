//http://www.html5rocks.com/en/tutorials/dnd/basics/

function applyrun() { 
  var dragSrc = null;
  var $dragSrcNode = null; //jQuery node
  var draggingColumn = null;
  var ENABLE_GHOST_COL = false;

  /* Checks to see if element's class property has <name> in it. */
  Element.prototype.hasClassName = function(name) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
  };

  /* Adds <name> to this tag's class property. */
  Element.prototype.addClassName = function(name) {
    if (!this.hasClassName(name)) {
      if (this.className) {
        this.className = [this.className, name].join(' ');
      } else {
        this.className = name;
      }
    }
  };

  /* Removes <name> from this tag's class property. */
  Element.prototype.removeClassName = function(name) {
    if (this.hasClassName(name)) {
      var c = this.className;
      this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
    }
  };


  function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
      return {x: ev.pageX, y: ev.pageY};
    }
    return {
      x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: ev.clientY + document.body.scrollTop  - document.body.clientTop
    };
  }

  function handleClick(e) {
    if (this.textContent !== "") {
      var $thisNode = $("#" + this.id);
      var thisCourse = $thisNode.data("course");
      if (thisCourse) {
        // console.log(thisCourse.toString());
        replacePopupText(thisCourse.toString());
      } else {
        // console.log(new Course(this.textContent,"").toString());
        replacePopupText(new Course(this.textContent,"").toString())
      }
    }
  }

  /* Replaces the current popup text with str. */
  function replacePopupText(str) {
    $("#popup").text(str);
  }


  function handleDragStart(e) {
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

    //changing the trashbin to being selected
    setTimeout(function(){
      $("#remove").css("background-image", "url(/CS5150/img/sidebar/icon_remove_selected.png)");
      $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new_grayed.png)");
      $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load_grayed.png)");
      $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save_grayed.png)");
      $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print_grayed.png)");
    }, 100);
    // Make the garbage can a drop target
    var trashcan = document.getElementById("remove");
    trashcan.addEventListener('drop',handleDrop);
    trashcan.addEventListener('dragover', handleDragOver);
    trashcan.addEventListener('dragleave', handleDragLeave);
    trashcan.addEventListener('dragend', handleDragEnd);
  }

  function handleDragOver(e) {
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

  function handleDragLeave(e) {
    this.removeClassName('over');
    // console.log("does this happen multiple times");
  }

  function handleDrop(e) {
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
        //NOTE: changed from this.textContent to this.innerHTML
        
      //   console.log("does it come to replace the data");
      // }
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
      console.log("CIWTT: " + user.current_schedule.courses_I_want.toString());

    }
    return false;
  }

  function handleDragEnd(e) {
    console.log("dragb dropped");
    var cols = document.querySelectorAll('.dragcolumn');
    [].forEach.call(cols, function (col) {
      col.removeClassName('over');
    });
    
    var cols = document.querySelectorAll('.dragcolumnchecklist');
    [].forEach.call(cols, function (col) {
      col.removeClassName('over');
    });

    dragSrc.style.opacity = '1';

    if (ENABLE_GHOST_COL) {
      document.body.removeChild(draggingColumn);
    }

    var cols = document.querySelectorAll('.dragcolumn');
    [].forEach.call(cols, function (col) {
      if (col.innerHTML == "") {
        $(col).css( "background-image", "url(/CS5150/img/hexagon_unfilled.png)");
        //col.addClassName('over');
      } else {
        $(col).css( "background-image", "url(/CS5150/img/hexagon.png)");
      }
    }); 
    //handling the scrollbar buttons
    setTimeout(function(){
      $("#remove").css("background-image", "url(/CS5150/img/sidebar/icon_remove_grayed.png)");
      $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new.png)");
      $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load.png)");
      $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save.png)");
      $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print.png)");
    }, 100);
  }

  function shakeGarbageCan() {
    setTimeout(function() {
     $("#remove").addClass("shaking");
    }, 100);
    setTimeout(function() {
     $("#remove").removeClass("shaking");
    }, 1000);
  }

  function attachColumnListener(col) {
    // Enable columns to be draggable.
    col.setAttribute('draggable', 'true');
    col.addEventListener('dragstart', handleDragStart);

    // Enable columns to be clickable
    col.addEventListener('click', handleClick);
    // Make each column itself a drop target.
    col.addEventListener('drop', handleDrop);
    col.addEventListener('dragover', handleDragOver);
    col.addEventListener('dragleave', handleDragLeave);
    col.addEventListener('dragend', handleDragEnd);
  }


  var cols = document.querySelectorAll('.dragcolumn');
  [].forEach.call(cols, function (col) {
    attachColumnListener(col);
  });


};

function recreateExistingDivs() { 
  console.log("recreate is being called");
  var nodes = $( "#resultspar" ).children();
  $( "#resultspar" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $("#permanent").append("<div id='resultspar'></div>");
    $("#resultspar").append("<div class='hexagon dragcolumn searchdiv'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}

function copySections(){
  // console.log("copy the sections");
  var classContainerChildren =  $(".classContainerChildren").clone();
  var yearChildren = $(".carousel_container").clone();
  $(".classContainerChildren").remove();
  $(".carousel_container").remove();
  $(".refresh_holder_classContainer").append(classContainerChildren);
  $(".carousel_holder").append(yearChildren);
}



