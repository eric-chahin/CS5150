//courtesy of stackoverflow
//http://stackoverflow.com/questions/6691558/how-do-i-make-a-div-follow-me-as-i-scroll-down-the-page
window.onload = function() {

  function getScrollTop() {
    if (typeof window.pageYOffset !== 'undefined' ) {
      // Most browsers
      return window.pageYOffset;
    }

    var d = document.documentElement;
    if (d.clientHeight) {
      // IE in standards mode
      return d.scrollTop;
    }

    // IE in quirks mode
    return document.body.scrollTop;
  }

  window.onscroll = function() {
    var box = document.getElementById('sidebar'),
        scroll = getScrollTop();

    if (scroll <= 28) {
      box.style.top = "120px";
    }
    else {
      box.style.top = (scroll + 67) + "px";
    }
  };

//using this to handle clicking the buttons. previously wanted to do pseudo class active for effects
//however, after drag feature, the active class loses its effect
$("#new").mousedown(function(){
  $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new_selected.png)");
})

$("#new").mouseup(function(){
  $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new.png)");
})

$("#new").hover(function(){
  $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new_selected.png)");
}, function(){
  $("#new").css("background-image", "url(/CS5150/img/sidebar/icon_new.png)");
});

$("#load").mousedown(function(){
  $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load_selected.png)");
})

$("#load").mouseup(function(){
  $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load.png)");
})

$("#load").hover(function(){
  $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load_selected.png)");
}, function(){
  $("#load").css("background-image", "url(/CS5150/img/sidebar/icon_load.png)");
});

$("#save").mousedown(function(){
  $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save_selected.png)");
})

$("#save").mouseup(function(){
  $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save.png)");
})

$("#save").hover(function(){
  $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save_selected.png)");
}, function(){
  $("#save").css("background-image", "url(/CS5150/img/sidebar/icon_save.png)");
});

$("#print").mousedown(function(){
  $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print_selected.png)");
})

$("#print").mouseup(function(){
  $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print.png)");
})

$("#print").hover(function(){
  $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print_selected.png)");
}, function(){
  $("#print").css("background-image", "url(/CS5150/img/sidebar/icon_print.png)");
});

};

