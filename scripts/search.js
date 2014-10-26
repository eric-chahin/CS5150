/* JS File */

// Search
$(document).ready(function() {  
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
					copySections();
					applyrun();
				}
			});
		}return false;    
	}
	$("input#search").live("keyup", function(e) {
		// Set Timeout
		clearTimeout($.data(this, 'timer'));

		// Set Search String
		var search_string = $(this).val();

		// Do Search
		if (search_string == '') {
			$("div#results").fadeOut();
		}else{
			$("div#results").fadeIn();
			$(this).data('timer', setTimeout(search, 100));
		};
	});

});