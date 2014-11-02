
	function addToDesiredCourses(object){
		console.log("addToDesiredCourses");
		console.log(object);
		var course = object.getAttribute("data-course");
		//var name = object.text();
		//console.log(name);
		$(".classContainer > a > div").each(function(){
			// console.log($(this).text());
			if($(this).is(':empty')){

				if($(this).hasClass("hexagonLeft")){
					$(this).replaceWith('<div class="hexagonLeft dragcolumn searchdiv" new="true" draggable="true">' + course +'</div>');
				}else{
					$(this).replaceWith('<div class="hexagon dragcolumn searchdiv" new="true" draggable="true">' + course +'</div>');
				}
				copySections();
				applyrun();
				return false;
			}
		})

		//.append('<a href="#popup" data-effect="mfp-zoom-out" class="open-popup-link"><div class="hexagonLeft dragcolumn searchdiv" new="true" draggable="true">' + "blank" +'</div></a>');
		return false;
	}