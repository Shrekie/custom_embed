app.factory('videoLinkModal', function($http, $q, embedManager, iframeManager, $rootScope) {

	return function(isAuthenticated){
		
		$(document).on("shown.bs.modal", "#iframeModal", function(e) {

			$('.iframeModal-modal-title').text($(e.relatedTarget).text());
			var iframeBuild = iframeManager.createIframe($('.iframeModal-modal-body'), $('.modalIframeExample'), $(e.relatedTarget).attr('embed-id'))
			.buttons($('.modal-body .customization-ctrl'));

			iframeBuild.copyB();

			if(isAuthenticated){
				iframeBuild.deleteB(function(){
					$('#iframeModal').modal('hide');
					$rootScope.$broadcast('new-embeds');
				});
			}

		});

		$(document).on("hide.bs.modal", "#iframeModal", function() {
			$('.iframeModal-modal-body').html('');
		})

	};

});