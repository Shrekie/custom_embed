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

app.controller('appConstructor', function($scope, $http, $route, googleApi, videoLinkModal) {
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
				$route.reload();
			});
		});
	};
});

app.controller('mainController', function($scope, $http, embedStream) {
	if($scope.userAuthenticated){
	$scope.populatedIframe = false;
	$scope.newEmbeds = {};
	var getNewUserEmbeds = function(){
		embedStream.getUserEmbeds().then((embeds) => {
			console.log(embeds);
			$scope.newEmbeds = embeds.reverse().slice(0, 4);
		}, (e) => {
			console.log(e);
		});
	};

	$scope.getStream = function(){
		$('#createEmbedButton').attr('disabled', 'disabled');
		embedStream.generateEmbed($scope.YTURL).then((streamUrl) => {
			$('.mainPlayer').attr('src', streamUrl);
			$('.mainIframeExample').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
			+ 'src="'+location.protocol+'//'+location.host+'/'+streamUrl+'"></iframe>');
			$('#createEmbedButton').removeAttr('disabled');
			$scope.populatedIframe = true;
			getNewUserEmbeds();
		}, (e) => {
			$('#createEmbedButton').removeAttr('disabled');
			alert('Could not make Embed');
			console.log(e);
        });
	};
	getNewUserEmbeds();
	}
});

app.controller('userEmbedCtrl', function($scope, $http, embedStream) {
	if($scope.userAuthenticated){
	$('#userEmbeds-tab').tab('show')
	$scope.embeds = {}
	embedStream.getUserEmbeds().then((embeds) => {
		$scope.embeds = embeds.reverse();
		console.log(embeds)
	}, (e) => {
		console.log(e);
	});
	}
});