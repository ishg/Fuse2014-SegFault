$(document).ready(function(){
	var connectBtn = document.getElementById('connect-health-data-btn');
	connectBtn.addEventListener('click', function(e) {

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
	});
})