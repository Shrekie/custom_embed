var app = angular.module('custom_embed', ['ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', { 
		templateUrl: "/html/partials/main.html",
	})
	.when('/userEmbeds', {
		templateUrl: "/html/partials/myEmbeds.html",
	})
	.otherwise({ redirectTo: '/' });
});

app.controller('videoModalController', function($scope, videoLinkModal) {

	$scope.openModal = function(currentEmbed){
		console.log(currentEmbed);
		videoLinkModal.createModalContent($scope.userAuthenticated, currentEmbed);
	}

});

app.controller('loginController', function($scope, $http, $route, googleApi) {
	$scope.userAuthenticated = false;

	googleApi.checkAuthentication().then((response)=>{
		$scope.userAuthenticated = response;
		$route.reload();
	},
	(e)=>{
		console.log(e);
	});

	$scope.loginGoogle = function(){
		googleApi.authenticate(function() {
			$scope.$apply(function(){
				$scope.userAuthenticated = true;
				$route.reload();
			});
		});
	};

	$scope.logoutGoogle = function(){
		googleApi.unbindAuthentication().then((response)=>{
			$scope.userAuthenticated = response;
			$route.reload();
		},
		(e)=>{
			console.log(e);
		});
	};

});

app.controller('embedFetchController', function($scope, embedManager) {
	$scope.newEmbeds = {};
	$scope.embeds = {};

	var getEmbeds = function(){
		embedManager.getUserEmbeds().then((embeds) => {
			if (embeds.notFound == true){
				$scope.embeds = []
				$scope.newEmbeds = []
			}else{
				var reversed = embeds.reverse();
				$scope.embeds = reversed;
				$scope.newEmbeds = reversed.slice(0, 4);
			}
		}, (e) => {
			console.log(e);
		});
	}

	$scope.$on('new-embeds', function(event, args) {
		getEmbeds();
	});

	getEmbeds();

});

app.controller('mainController', function($scope, $rootScope, $http, embedManager, iframeManager) {
	$scope.populatedIframe = false;

	$scope.getStream = function(){
		
		$('#createEmbedButton').attr('disabled', 'disabled');

		embedManager.generateEmbed($scope.YTURL).then((video) => {
			if(video.totalEmbedsExceeded){
				alert('Total number of embeds exceeded, please delete some embeds.');
				$('#createEmbedButton').removeAttr('disabled');
			}else{
				console.log(video);
				var iframeBuild = iframeManager.createIframe($('.mainPlayerContainer'), $('.mainIframeExample'), video)
				.buttons($('.mainIframeContainer .customization-ctrl'))
				iframeBuild.copyB();
				iframeBuild.deleteB(function(){
					//TODO: dont show the embed
					$rootScope.$broadcast('new-embeds');
				});
				iframeBuild.configButtons($('.mainIframeContainer config-ctrl'), function(){
					$rootScope.$broadcast('new-embeds');
				});
				$('#createEmbedButton').removeAttr('disabled');
				$scope.populatedIframe = true;
				$rootScope.$broadcast('new-embeds');
				
			}
		}, (e) => {
			$('#createEmbedButton').removeAttr('disabled');
			alert('Could not make Embed');
			console.log(e);
		});
		
	};
	
});

app.controller('userEmbedCtrl', function($scope) {
	$('#userEmbeds-tab').tab('show');
});