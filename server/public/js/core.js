var app = angular.module('custom_embed', ['ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', { 
		controller: 'mainController'
	})
	.otherwise({ redirectTo: '/' });
});

app.controller('mainController', function($scope, $http, googleApi) {

	$scope.getStream = function(){
		console.log($scope.YTURL);
		$http({
			url: 'getStream',
			method: "POST",
			data: { YTURL : $scope.YTURL }
		}).then(function (success) {
			console.log(success);
			$('#videoPlayer')[0].src = success.data;
			$('#videoPlayer')[0].load();
		}, function (error) {
			console.log(error);
		});

	};

	$scope.loginGoogle = function(){
		googleApi.authenticate(function() {
			console.log('authenticated!')
		});
	};

});