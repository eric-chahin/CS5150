//http://www.html5rocks.com/en/tutorials/dnd/basics/
function applyrun() { 
var dragSrc = null;
var draggingColumn = null;
var ENABLE_GHOST_COL = false;

Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    if (this.className) {
      this.className = [this.className, name].join(' ');
    } else {
      this.className = name;
    }
  }
};

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
  console.log("does this happen multiple times");
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  // Don't do anything if we're dropping on the same column we're dragging.
  if (dragSrc != this) {
    console.log("we are suppose to be this");
    dragSrc.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}

function handleDragEnd(e) {
  var cols = document.querySelectorAll('.column');
  [].forEach.call(cols, function (col) {
    col.removeClassName('over');
  });

  dragSrc.style.opacity = '1';

  if (ENABLE_GHOST_COL) {
    document.body.removeChild(draggingColumn);
  }
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


var cols = document.querySelectorAll('.column');
[].forEach.call(cols, function (col) {
  attachColumnListener(col);
});


//end of applyrun()
};

function recreateExistingDivs() { 
  var nodes = $( "#resultspar" ).children();
  console.log(nodes);
  $( "#resultspar" ).remove();
  for(var i = 0; i< nodes.length;i++){
    $("#permanent").append("<div id='resultspar'></div>");
    $("#resultspar").append("<div class='column'" + "draggable='true'>" + nodes[i].innerHTML + "</div>");
  }
}


//when page is finished loading, applyrun() is called
$(document).ready(function(){
  applyrun();
});

