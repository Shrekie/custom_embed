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
		console.log(e);
	});
	$scope.loginGoogle = function(){
		googleApi.authenticate(function() {
			$scope.$apply(function(){
				$scope.userAuthenticated = true
			});
		});
	};
});

app.controller('mainController', function($scope, $http, googleApi, embedStream) {

	$scope.getStream = function(){
		embedStream.generateEmbed($scope.YTURL).then((streamUrl) => {
			$('#videoPlayer')[0].src = streamUrl;
			$('#iframeExample').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
			+ 'src="'+window.location+streamUrl+'"></iframe>');
		}, (e) => {
			console.log(e);
        });
	};
});

app.controller('userEmbedCtrl', function($scope, $http, googleApi, embedStream) {
	$('#userEmbeds-tab').tab('show')
	$scope.embeds = {}
	embedStream.getUserEmbeds().then((embeds) => {
		$scope.embeds = embeds;
		console.log(embeds)
	}, (e) => {
		console.log(e);
	});

});