app.factory('googleApi', function($http, $q, $window) {

	var authenticate = function(cb){
        //TODO: Check login before forcing authentication.

		var width = 800, height = 600;
		var w = window.outerWidth - width, h = window.outerHeight - height;
		var left = Math.round(window.screenX + (w / 2));
		var top = Math.round(window.screenY + (h / 2.5));

		var loginWindow = $window.open('/auth/google', 'logIn', 'width='+width+',height='+height+',left='+left+',top='+top+
		',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0');
		$window.addEventListener("message", function(event){
			if(event.data == "this window has loaded");
			loginWindow.close();
			cb();
		}, {once:true});

	};

    return{
		authenticate
	}

});