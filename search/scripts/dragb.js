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
  
  var thereturn = e.dataTransfer.setData('DownloadURL',  "image/png:vivianbestmanagerever.png:http://example.com/example-download-data");
  
  console.log( thereturn );

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
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // Don't do anything if we're dropping on the same column we're dragging.
  if (dragSrc != this) {
    dragSrc.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');

    // Set number of times the column has been moved.
    // var count = this.querySelector('.count');
    // var newCount = parseInt(count.getAttribute('data-col-moves')) + 1;
    // count.setAttribute('data-col-moves', newCount);
    // count.innerText = 'moves: ' + newCount;
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


// document.querySelector('#one').addEventListener('mousedown',function(e){ console.log('mousedown',e); })
// document.querySelector('#one').addEventListener('mousemove',function(e){ console.log('mousemove',e); })

function simulateClick() {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("mousedown", true, true, window,
    0, 75, 335, 75, 219, false, false, false, false, 0, null);
  var cb = document.querySelector('#one'); 
  var canceled = !cb.dispatchEvent(evt);
  
  var evt2 = document.createEvent("MouseEvents");
  evt2.initMouseEvent("mousemove", true, true, window,
    0, 87, 345, 87, 229, false, false, false, false, 0, null);
  var cb2 = document.querySelector('#one'); 
  var canceled2 = !cb2.dispatchEvent(evt2);
}

//end of applyrun()
};


//when page is finished loading, applyrun() is called
$(document).ready(function(){
  applyrun();
});

