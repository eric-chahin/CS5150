//http://www.html5rocks.com/en/tutorials/dnd/basics/

function applyrun() { 
  var dragSrc = null;
  var $dragSrcNode = null; //jQuery node
  var draggingColumn = null;

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
      //currently data-course is just the course name which is useless
      var thisCourse = $thisNode.data("course");
      replacePopupHTML("<p>Cannot connect to server to get course information.</p>"); // In case the connection drops
      if (thisCourse) {
        replacePopupHTML(thisCourse.prettyPrint());
      } else {
        //new Course(this.textContent,"").toString()
        replacePopupHTML(new Course(this.textContent).prettyPrint());
      }
    }else{
      //Athena pointed out that the last course clicked was always in the popup when you click an empty spot
      //this is $(#popup) contained the last course; it is now replaced with the below string 
      replacePopupHTML("You clicked an empty spot");
    }
  }

  /* Replaces the current popup HTML with str. */
  function replacePopupHTML(str) {
    //course name is showing up, but the popup is not happening
    //the mag pop up effects go away with search, reapplying
    //the theme for cs 5150 and search: reapply for no understandable reason
    $('.open-popup-link').magnificPopup({
    type:'inline',
    removalDelay: 50, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function() {
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
    $("#popup").html(str);
  }


  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    dragSrc = this;
    $dragSrcNode = $("#" + this.id);


    // window.console && console.log(e, e.dataTransfer);
    window.foo = e;

    dragSrc.style.opacity = '0.4';

    //changing the trashbin to being selected
    setTimeout(function(){
      $("#remove").css("background-image", "url(img/sidebar/icon_remove_selected.png)");
      $("#new").css("background-image", "url(img/sidebar/icon_new_grayed.png)");
      $("#load").css("background-image", "url(img/sidebar/icon_load_grayed.png)");
      $("#save").css("background-image", "url(img/sidebar/icon_save_grayed.png)");
      $("#print").css("background-image", "url(img/sidebar/icon_print_grayed.png)");
    }, 100);
      
    // Make the left schedule slider trigger an action
    var slider = document.getElementById("left_slider");
    slider.addEventListener('dragover', function(){
        document.getElementById('left_slider').click();
    });
    
    // Make the right schedule slider trigger an action
    slider = document.getElementById("right_slider");
    slider.addEventListener('dragover', function(){
        document.getElementById('right_slider').click();
    });
    
    // Make the left courses slider trigger an action
    slider = document.getElementById("left_slider_courses");
    slider.addEventListener('dragover', function(){
        setTimeout(function(){
            document.getElementById('left_slider_courses').click();
        }, 10000);
    });
    
    // Make the right courses slider trigger an action
    slider = document.getElementById("right_slider_courses");
    slider.addEventListener('dragover', function(){
        document.getElementById('right_slider_courses').click();
    });
    
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

    e.dataTransfer.dropEffect = 'move';

    this.addClassName('over');

    return false;
  }

  function handleDragLeave(e) {
    this.removeClassName('over');
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

      if (document.getElementById("remove") == this) {
        //send hexagon into the abyss
        if (dragSrc === null) {
          return false;
        } else {
          dragSrc.innerHTML = "";
          this.innerHTML = "";
          shakeGarbageCan();
        }
      } else {
        //Swapping the contents in this div and the dragSrc div, no object switching
        dragSrc.innerHTML = this.innerHTML; //this.getData('text/html');
        //NOTE: changed from this.textContent to this.innerHTML
        this.innerHTML = e.dataTransfer.getData('text/html');
      }

      //gets their locations based on id course_101
      var dragIsScheduleCourse = "course_" === dragSrc.id.substring(0,7);
      var thisIsScheduleCourse = "course_" === this.id.substring(0,7);
      var dragSemester = findSemester(dragSrc.id)
      var dragIndex    = (dragSemester == 9) ? parseInt(dragSrc.id.substring(9))-1 : parseInt(dragSrc.id.substring(8))-1;
      var thisSemester = findSemester(this.id)
      var thisIndex    = (thisSemester == 9) ? parseInt(this.id.substring(9))-1 : parseInt(this.id.substring(8))-1;

      if (dragIsScheduleCourse && thisIsScheduleCourse) {
        $dragSrcNode.data("course",thisCourse);
        $thisNode.data("course",dragCourse); 
        var temps = user.current_schedule.swapCourses(dragSemester,dragIndex,thisSemester,thisIndex);
        checklist_view.swapCoursesOnChecklistView(dragSemester,temps[0],thisSemester,temps[1]);
      } else if (dragIsScheduleCourse && !thisIsScheduleCourse) {
        if (dragSrc.textContent !== "" && !user.current_schedule.contains(dragSrc.textContent)) {
          var newCourse = user.current_schedule.addCourse(new Course(dragSrc.textContent,null), dragSemester, dragIndex); 
          checklist_view.addCourseToChecklistView(newCourse,dragSemester);
          $dragSrcNode.data("course", newCourse);
        } else {
          // console.log("deleting " + this.textContent);
          var oldCourse = user.current_schedule.deleteCourse(dragSemester, dragIndex);
          checklist_view.deleteCourseFromChecklistView(oldCourse);
          $dragSrcNode.data("course",null);
        }
      } else if (!dragIsScheduleCourse && thisIsScheduleCourse) {
        //add a new course from the hexagon that you've just dragged over
        if (!user.current_schedule.contains(this.textContent) && !user.current_schedule.crosslist_contains(this.textContent)){
          var newCourse = user.current_schedule.addCourse(new Course(this.textContent,null), thisSemester,thisIndex); 
          checklist_view.addCourseToChecklistView(newCourse,thisSemester);
          $thisNode.data("course", newCourse);
        } else {
          this.innerHTML = dragSrc.innerHTML;
          dragSrc.innerHTML = e.dataTransfer.getData('text/html');
          //Error message for user
          $("#start_schedule_error").click();
          $("#schedule_error_msg").fadeIn(700);
          $("#schedule_error_msg").text(dragSrc.textContent + " or a course crosslisted with it is already in your schedule.");

        }
      } else {
        //just swapping divs elsewhere, don't care
      }

      user.current_schedule.updateVectorWarnings();
      // console.log(user.current_schedule.toString());
      // console.log("CIWTT: " + user.current_schedule.courses_I_want.toString());
    }
    return false;
  }

  function handleDragEnd(e) {
    var cols = document.querySelectorAll('.dragcolumn');
    [].forEach.call(cols, function (col) {
      col.removeClassName('over');
    });
    
    var cols = document.querySelectorAll('.dragcolumnchecklist');
    [].forEach.call(cols, function (col) {
      col.removeClassName('over');
    });

    dragSrc.style.opacity = '1';
    dragSrc = null;

    checklist_view.fillEmptyScheduleSpots();
    //handling the scrollbar buttons
    setTimeout(function(){
      $("#remove").css("background-image", "url(img/sidebar/icon_remove_grayed.png)");
      $("#new").css("background-image", "url(img/sidebar/icon_new.png)");
      $("#load").css("background-image", "url(img/sidebar/icon_load.png)");
      if (user.current_schedule._saved == true) {
        $("#save").css("background-image", "url(img/sidebar/icon_save.png)");
      } else {
        $("#save").css("background-image", "url(img/sidebar/icon_save_unsaved.png)");
      }
      $("#print").css("background-image", "url(img/sidebar/icon_print.png)");
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

/* Helper method to locate the semester of course
   objects. Input string is of the format:
   course id "course_(semester)(index)
   example: "course_915" 
   returns the semester integer*/ 
function findSemester(input){
  if (input.length < 10) { 
    return parseInt(input.substring(7,8))-1;
  } else if (input.length > 10) {
    return parseInt(input.substring(7,9))-1;
  } else {
    var info = input.substring(7);
    if (info.substring(0,1) == "9") {
      return 8;
    } else {
      return 9;
    }
  }
}

function recreateExistingDivs() { 
  var nodes = $( "#resultspar" ).children();
  $( "#resultspar" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $("#permanent").append("<div id='resultspar'></div>");
    $("#resultspar").append("<div class='hexagon dragcolumn searchdiv'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}

function copySections(){
  var classContainerChildren =  $(".classContainerChildren").clone();
  var yearChildren = $(".carousel_container").clone();
  $(".classContainerChildren").remove();
  $(".carousel_container").remove();
  $(".refresh_holder_classContainer").append(classContainerChildren);
  $(".carousel_holder").append(yearChildren);
}
