/* JS File */

// Search
$(document).ready(function() {  

  var enter = function(elem) {
    $(elem).find("span").css({"display":"block"});
  }

  var exit = function(elem) {
    $(elem).find("span").css({"display":"none"});
  }

  var initHover = function() {
    $("div#results > div").hover(function() {
      $("div#results > div").find("span").css("display","none");
      $(this).find("span").css("display","block");
    },function() {
      $(this).find("span").css("display","none");
    });
  }

  function search() {
    var query_value = $('input#search').val();
    $('b#search-string').html(query_value);
    if(query_value !== ''){
      $.ajax({
        type: "POST",
        url: "search.php",
        data: { query: query_value },
        cache: false,
        success: function(html){
          $("div#results").html(html);
          initHover();
          copySections();
          applyrun();
        }
      });
    }
    return false;    
  }

  search_hover_index = -1;
  position_array = [];
  div_array = [];
  var setPositionArray = function(divs) {
    position_array = [];
    for (var i = 0; i < divs.length; i++) {
      position_array.push($(divs[i]).position().top - 110 + $("div#results").scrollTop());
    }
  }




  $("input#search").live("keyup", function(e) {
    if (e.keyCode == 13) {
      //Send what span is open
      $("div#results > div").each(function() {
        // console.log($(this).css("display"));
        // if ($(this).css("display") == )
        if ($(this).find("span").css("display") === "block") {
          $(this).click();
        }
      });
    }
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13 
                         || e.keyCode === 39 || e.keyCode === 37) 
      return;
    
    // Set Timeout
    clearTimeout($.data(this, 'timer'));

    // Set Search String
    var search_string = $(this).val();
    $("div#results > div").find("span").css("display","none");
    $("div#results").scrollTop(0);
    search_hover_index = -1;

    // Do Search
    if (search_string == '') {
      $("div#results").fadeOut();
    }else{
      $("div#results").fadeIn();
      $(this).data('timer', setTimeout(search, 100));
    };
  });

  $("input#search").keydown(function(key) {
    if (key.keyCode !== 38 && key.keyCode !== 40)
      return;

    $(div_array[search_hover_index]).find("span").css("display","none");
    div_array = $("div#results > div");
    setPositionArray(div_array);
    $(div_array[search_hover_index]).find("span").css("display","block");

    if (div_array.length == 0) {
      return;
    }

    if (search_hover_index == -1 && (key.keyCode == 38 || key.keyCode == 40)) {
      // up or down keys
      search_hover_index = 0; //start at beginning
      enter(div_array[search_hover_index]);
    } else {
      var top_of_div = 0;
      if (key.keyCode == 38 && search_hover_index > 0) { // UP
        exit(div_array[search_hover_index]);
        search_hover_index--;
        enter(div_array[search_hover_index]);
      } else if (key.keyCode == 40 && search_hover_index < div_array.length-1) { // DOWN
        exit(div_array[search_hover_index]);
        search_hover_index++;
        enter(div_array[search_hover_index]);
      }

      if (search_hover_index <= 4 ) {
        // do nothing
        $("div#results").scrollTop(0);
      } else if (search_hover_index > 4) {
        $("div#results").scrollTop(position_array[search_hover_index-3]);
      } else {
        $("div#results").scrollTop(position_array[search_hover_index]);
      }
    }
  });

});