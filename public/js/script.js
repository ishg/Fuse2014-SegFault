$(document).ready(function(){
	var connectBtn = document.getElementById('connect-health-data-btn');
	connectBtn.addEventListener('click', function(e) {
		/*
		var options = {
		  publicToken: '876289965adce127a26cddfb2e76c371', // you should have this from the succesful authentication flow
		  clientUserId: encodeURIComponent('ishg'), // can be email or any other unique identifier
		  close: function() {
		    // optional callback that will be called if the user closes the popup 
		    // without connecting any data sources.
		  },
		  error: function(err) {
		    // optional callback that will be called if an error occurs while 
		    // loading the popup.
		    
		    // `err` is an object with the fields: `code`, `message`, `detailedMessage`
		  } 
		}
		HumanConnect.open(options);
		*/
		$.get('https://api.humanapi.co/v1/human/activities/summaries?access_token=ntnhC55SwKUsbP1fnzD6ViFRd98=2govHQF2178de54bc9709bbdbe70d48bacf973ea4d7df27d4fdd4ea8ef66e20436e39b04f9cd5b451a392c3a9fef5ccca7cf646a4e24cc08133246bea874cdbe6b1a77491e4d3fa31c8ee752ff87d40d6b95e4ab459df53fc792b0c5130dbc2de0acca95ae350e7e21a2b588bc166f0ab2fb05f1', function(res){
			console.log(res);
		});
	});
})