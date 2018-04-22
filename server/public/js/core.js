var app = angular.module('custom_embed', ['ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', { 
		templateUrl: "/html/partials/main.html",
		controller: 'mainController'
	})
	.when('/userEmbeds', {
		templateUrl: "/html/partials/myEmbeds.html",
		controller: 'userEmbedCtrl'
	})
	.otherwise({ redirectTo: '/' });
});


app.controller('loginController', function($scope, $http, googleApi) {
	$scope.userAuthenticated = false;
	console.log(googleApi);
	googleApi.checkAuthentication().then((response)=>{
		console.log(response);
		$scope.userAuthenticated = response;
	},
	(e)=>{
		throw 'cant authenticate';
	});
	$scope.loginGoogle = function(){
		googleApi.authenticate(function() {
			$scope.$apply(function(){
				$scope.userAuthenticated = true
			});
		});
	};
});

app.controller('mainController', function($scope, $http, googleApi) {

	$scope.getStream = function(){
		console.log($scope.YTURL);
		$http({
			url: 'generateEmbed',
			method: "POST",
			data: { YTURL : $scope.YTURL }
		}).then(function (success) {
			console.log(success);
			$('#videoPlayer')[0].src = success.data;
			$('#iframeExample').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
			+ 'src="http://localhost:5000/'+success.data+'"></iframe>');
		}, function (error) {
			console.log(error);
		});

	};
});

app.controller('userEmbedCtrl', function($scope, $http, googleApi) {

	console.log('AYYY');

});