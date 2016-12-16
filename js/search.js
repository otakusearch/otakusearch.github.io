$(document).ready(function(){

	//GLOBAL VAR
	var XMLSource = $('#data').attr('xmlData');
	var keyword = '';
	var catType = '';
	var pub = '';
						   
	var i = 0;
   
	$("#searchButton").click(function() {
		keyword = $("input#term").val();
		catType = $("#category option:selected").val();
		
		//Reset any message
		var errMsg = '';
		pub = '';
	
		if ( keyword == '' ) { errMsg += 'Please enter a search term' + '\n'; }
		else if ( catType == 'none' ) { errMsg += 'Please select a category' + '\n'; }
		else { searchThis(); }

		if ( errMsg != '' ) {
			pub += '<div class="error">' + '\n';
			pub += errMsg;
			pub += '</div>' + '\n';
		}
		
		//Show error
		$('#result').html( pub );

	});
	
	function searchThis() {				
		$.ajax({
			type: "GET",
			url: XMLSource,
			dataType: "xml",
			success: function(xml) { loadPublication (xml) }	
		});
	}
	
	function loadPublication (xmlData) {
		i = 0;
		var row;
		
		var searchExp = "";
		
		$(xmlData).find('index').each(function(){
			
			var Genre = $(this).find('Genre').text();
			var Anime = $(this).find('Anime').text();
			var AnimeSources = $(this).find('AnimeSources').text();
			var Dubbed = $(this).find('Dubbed').text();
			var Manga = $(this).find('Manga').text();
			var MangaSources = $(this).find('MangaSources').text();
			
			//Format the keyword expression
			var exp = new RegExp(keyword,"gi");
			
			//Check if there is a category selected; 
			//if not, use height column as a default search
			if ( catType == 'Genre' ) { searchExp = Genre.match(exp); }
			else if ( catType == 'Anime' ) { searchExp = Anime.match(exp); }
			else if ( catType == 'AnimeSources' ) { searchExp = AnimeSources.match(exp); }
			else if (catType == 'Dubbed') { searchExp = Dubbed.match(exp); }
			else if (catType == 'Manga') { searchExp = Manga.match(exp); }
			else if (catType == 'MangaSources') { searchExp = MangaSources.match(exp); }
			
			if ( searchExp != null ) {
				
				//Start building the result
				if ((i % 2) == 0) { row = 'even'; }
				else { row = 'odd'; }
				
				i++;				
				
				pub += '<tr class="row ' + row + '">' + '\n';
				pub += '<td valign="top" class="col1">' + Genre + '</td>' + '\n';	
				pub += '<td valign="top" class="col2">' + Anime + '</td>' + '\n';	
				pub += '<td valign="top" class="col3">' + AnimeSources + '</td>' + '\n';
				pub += '<td valign="top" class="col4">' + Dubbed + '</td>' + '\n';
				pub += '<td valign="top" class="col5">' + Manga + '</td>' + '\n';
				pub += '<td valign="top" class="col6">' + MangaSources + '</td>' + '\n';	
				pub += '</tr>' + '\n';
			}	
		});
				
		if ( i == 0 ) {
			pub += '<div class="error">' + '\n';
			pub += 'No Result was Found' + '\n';	
			pub += '</div>' + '\n';
			
			//Populate the result
			$('#result').html( pub );
		}
		else {
			//Pass the result set
			showResult ( pub );
		}
	}
	
	function showResult (resultSet) {

		//Show the result
		pub = '<div class="message">There are ' + i + ' results!</div>';
		pub += '<table id="grid" border="0">' + '\n';
		pub += '<thead><tr>' + '\n';
		pub += '<th class="col1">Genre</th>' + '\n';
		pub += '<th class="col2">Anime</th>' + '\n';
		pub += '<th class="col3">AnimeSources</th>' + '\n';
		pub += '<th class="col4">Dubbed</th>' + '\n';
		pub += '<th class="col5">Manga</th>' + '\n';
		pub += '<th class="col6">MangaSources</th>' + '\n';
		pub += '</tr></thead>' + '\n';
		pub += '<tbody>' + '\n';
		
		pub += resultSet;
		
		pub += '</tbody>' + '\n';
		pub += '</table>' + '\n';
		
		//Populate 
		$('#result').html(pub)
		
		$('#grid').tablesorter(); 
	}
});