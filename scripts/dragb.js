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

      if (dragCourse != null) {
        var dragListing = $dragSrcNode.data("course").listing;
      } else {
        var dragListing = "empty";
      }

      if (thisCourse != null) {
        var thisListing = $thisNode.data("course").listing;
      } else {
        var thisListing = "empty";
      }

      console.log("dropping "+ dragListing + " on " + thisListing);
      //Swapping the contents in this div and the dragSrc div
      dragSrc.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
      $dragSrcNode.data("course",thisCourse);
      $thisNode.data("course",dragCourse);

      //gets their locations based on id course_12
      var dragSemester = parseInt(dragSrc.id.substring(7,8))-1;
      var dragIndex    = parseInt(dragSrc.id.substring(8))-1;
      var thisSemester = parseInt(this.id.substring(7,8))-1;
      var thisIndex    = parseInt(this.id.substring(8,9))-1;

      user.schedule.moveCourse(thisCourse,dragSemester,dragIndex);
      user.schedule.moveCourse(dragCourse,thisSemester,thisIndex);
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
  }

  function attachColumnListener(col) {
    // Enable columns to be draggable.
    col.setAttribute('draggable', 'true');
    col.addEventListener('dragstart', handleDragStart);

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

  var cols2 = document.querySelectorAll('.dragcolumnchecklist');
  [].forEach.call(cols2, function (col) {
    attachColumnListener(col);
  });
};

function recreateExistingDivs() { 
  var nodes = $( "#resultspar" ).children();
  console.log(nodes);
  $( "#resultspar" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $("#permanent").append("<div id='resultspar'></div>");
    $("#resultspar").append("<div class='dragcolumn'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}


//when page is finished loading, applyrun() is called
$(document).ready(function(){
  applyrun();
});

