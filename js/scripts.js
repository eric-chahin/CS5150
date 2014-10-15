$( document ).ready(function() {

    var cols = document.querySelectorAll('.dragcolumn');
    [].forEach.call(cols, function (col) {
    if (col.innerHTML == "") {
           $(col).css( "background-image", "url(/CS5150/img/hexagon_unfilled.png)");
            //col.addClassName('over');
    }

    }); 
  
   // var color = $( this ).css( "background-color" );
    
});