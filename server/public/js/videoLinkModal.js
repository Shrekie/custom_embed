app.factory('videoLinkModal', function($http, $q, iframeManager, $rootScope) {

	var createModalContent = function(isAuthenticated, embed){

		$('.iframeModal-modal-title').text(embed.embedUrl.title);
		var iframeBuild = iframeManager.createIframe($('.iframeModal-modal-body'), $('.modalIframeExample'), embed)
		.buttons($('.modal-body .customization-ctrl'));

		iframeBuild.copyB();

		if(isAuthenticated){

			iframeBuild.deleteB(function(){
				$('#iframeModal').modal('hide');
				$rootScope.$broadcast('new-embeds');
			});

			iframeBuild.configButtons($('.modal-body .config-ctrl'), function(embed){
				createModalContent(isAuthenticated, embed);
				$rootScope.$broadcast('new-embeds');
			});

		}

		$('#iframeModal').modal('show');

	};

	$(document).on("hide.bs.modal", "#iframeModal", function() {
		$('.iframeModal-modal-body').html('');
	})

	return {createModalContent}

});