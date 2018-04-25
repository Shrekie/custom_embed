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

app.controller('appConstructor', function($scope, videoLinkModal) {

});

app.controller('loginController', function($scope, $http, $route, googleApi) {
	$scope.userAuthenticated = false;
	console.log(googleApi);

	googleApi.checkAuthentication().then((response)=>{
		console.log(response);
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
});

app.controller('embedFetchController', function($scope, embedStream) {
	$scope.newEmbeds = {};
	$scope.embeds = {};

	var getEmbeds = function(){
		embedStream.getUserEmbeds().then((embeds) => {
			if (embeds.notFound == true){
				//TODO: do more if none is found
				$scope.embeds = []
				$scope.newEmbeds = []
			}else{
				$scope.embeds = embeds.reverse();
				$scope.newEmbeds = embeds.reverse().slice(0, 4);
			}
		}, (e) => {
			console.log(e);
		});
	}

	$scope.$on('new-embeds', function(event, args) {
		getEmbeds();
	});

	$("#iframeModal").on("click", ".deleteEmbedLink-modal button", function(){
		console.log($(this).attr('embed-id'));
		embedStream.deleteUserEmbed($(this).attr('embed-id')).then((response) => {
			console.log(response)
			$('#iframeModal').modal('hide');
			getEmbeds();
		}, (e) => {
			console.log(e);
		});
	});

	getEmbeds();

});

app.controller('mainController', function($scope, $rootScope, $http, embedStream) {
	$scope.populatedIframe = false;

	$scope.getStream = function(){
		$('#createEmbedButton').attr('disabled', 'disabled');
		embedStream.generateEmbed($scope.YTURL).then((streamUrl) => {
			if(streamUrl.totalEmbedsExceeded){
				$scope.populatedIframe = true;
				$('.mainPlayerContainer').html('Total number of embeds exceeded, please delete some embeds.');
				$('.mainIframeExample').text('');
				$('#createEmbedButton').removeAttr('disabled');
			}else{
				$('.mainPlayer').attr('src', streamUrl);
				$('.mainPlayerContainer').html(
				$('<iframe src="'+streamUrl+'"' +
				'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"'+
				'class="embed-responsive-item videoPlayer mainPlayer"></iframe>'));
				$('.mainIframeExample').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
				+ 'src="'+location.protocol+'//'+location.host+'/'+streamUrl+'"></iframe>');
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