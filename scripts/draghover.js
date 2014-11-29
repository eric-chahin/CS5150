var dragged, mousex, mousey, coordinates = [];

var continueDragging = function(e) {
    // Change the location of the draggable object
    dragged.css({
        "left": e.pageX - (dragged.width() / 2),
        "top": e.pageY - (dragged.height() / 2)
    });

    // Check if we hit any boxes
    for (var i in coordinates) {
        if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
            if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                // Yes, the mouse is on a droppable area
                // Lets change the background color
                coordinates[i].dom.addClass("somethingover");
            }
        } else {
            // Nope, we did not hit any objects yet
            coordinates[i].dom.removeClass("somethingover");
        }
    }

    // Keep the last positions of the mouse coord.s
    mousex = e.pageX;
    mousey = e.pageY;
}

var endDragging = function(e) {
    // Remove document event listeners
    $(document).unbind("mousemove", continueDragging);
    $(document).unbind("mouseup", endDragging);

    // Check if we hit any boxes
    for (var i in coordinates) {
        if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
            if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                // Yes, the mouse is on a droppable area
                droptarget = coordinates[i].dom;
                droptarget.removeClass("somethingover").addClass("dropped");
                dragged.hide("fast", function() {
                    $(this).remove();
                });
            }
        }
    }

    // Reset variables
    mousex = 0;
    mousey = 0;
    dragged = null;
    coordinates = [];
}

var startDragging = function(e) {

    // Find coordinates of the droppable bounding boxes
    $(".droppable").each(function() {
        var lefttop = $(this).offset();
        // and save them in a container for later access
        coordinates.push({
            dom: $(this),
            left: lefttop.left,
            top: lefttop.top,
            right: lefttop.left + $(this).width(),
            bottom: lefttop.top + $(this).height()
        });
    });

    // When the mouse down event is received
    if (e.type == "mousedown") {
        dragged = $(this);
        // Change the position of the draggable
        dragged.css({
            "left": e.pageX - (dragged.width() / 2),
            "top": e.pageY - (dragged.height() / 2),
            "position": "absolute"
        });
        // Bind the events for dragging and stopping
        $(document).bind("mousemove", continueDragging);
        $(document).bind("mouseup", endDragging);
    }
}

// Start the dragging
$(".draggable").on("mousedown", startDragging);
