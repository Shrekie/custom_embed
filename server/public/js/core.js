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

app.controller('loginController', function($scope, $http, $route, googleAPI) {
	$scope.userAuthenticated = false;

	googleAPI.checkAuthentication().then((response)=>{
		$scope.userAuthenticated = response;
		$route.reload();
	},
	(e)=>{
		console.log(e);
	});

	$scope.loginGoogle = function(){
		googleAPI.authenticate(function() {
			$scope.$apply(function(){
				$scope.userAuthenticated = true;
				$route.reload();
			});
		});
	};

	$scope.logoutGoogle = function(){
		googleAPI.unbindAuthentication().then((response)=>{
			$scope.userAuthenticated = response;
			$route.reload();
		},
		(e)=>{
			console.log(e);
		});
	};

});

app.controller('embedFetchController', function($scope, embedAPI) {
	$scope.newEmbeds = {};
	$scope.embeds = {};

	var getEmbeds = function(){
		embedAPI.getUserEmbeds().then((embeds) => {
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

app.controller('videoModalController', function($scope, videoLinkModal, $rootScope) {

	$scope.openModal = function(currentEmbed){
		$rootScope.$broadcast('clear-main');
		videoLinkModal.createModalContent($scope.userAuthenticated, currentEmbed);
	};

});

app.controller('mainController', function($scope, $rootScope, $http, embedAPI, iframeManager) {
	$scope.populatedIframe = false;

	var createMainContent = function(video){

		var iframeBuild = iframeManager.createIframe($('.mainPlayerContainer'), $('.mainIframeExample'), video)
		.buttons($('.mainIframeContainer .customization-ctrl'));

		iframeBuild.copyB();
		iframeBuild.deleteB(function(){
			$rootScope.$broadcast('clear-main');
			$rootScope.$broadcast('new-embeds');
		});

		iframeBuild.configButtons($('.mainIframeContainer .config-ctrl'), function(changedEmbed){
			createMainContent(changedEmbed);
			$rootScope.$broadcast('new-embeds');
		});

		$('#createEmbedButton').removeAttr('disabled');
		$scope.populatedIframe = true;
		$rootScope.$broadcast('new-embeds');

	}
	
	var clearMainIframe = function(){
		$scope.populatedIframe = false;
		$('.mainPlayerContainer').html('');
		$scope.YTURL = "";
	}

	$scope.getStream = function(){
		
		$('#createEmbedButton').attr('disabled', 'disabled');

		embedAPI.generateEmbed($scope.YTURL).then((video) => {
			if(video.totalEmbedsExceeded){

				alert('Total number of embeds exceeded, please delete some embeds.');
				$('#createEmbedButton').removeAttr('disabled');

			}else{
				createMainContent(video);
			}
		}, (e) => {
			$('#createEmbedButton').removeAttr('disabled');
			alert('Could not make Embed');
			console.log(e);
		});
		
	};

	$scope.$on('clear-main', function(event, args) {
		clearMainIframe();
	});

});

app.controller('userEmbedCtrl', function($scope) {
	$('#userEmbeds-tab').tab('show');
});