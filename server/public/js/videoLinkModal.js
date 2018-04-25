app.factory('videoLinkModal', function($http, $q, embedStream, $rootScope) {

	/*
		#TODO: Enable videoLinkModal to be initialized without delete button or 
		user customization.
	*/
	
	$("#iframeModal").on("click", ".customization-ctrl a#delete-embed-button", function(){
		console.log($(this).attr('embed-id'));
		embedStream.deleteUserEmbed($(this).attr('embed-id')).then((response) => {
			console.log(response)
			$('#iframeModal').modal('hide');
			$rootScope.$broadcast('new-embeds');
		}, (e) => {
			console.log(e);
		});
	});

	$("#iframeModal").on("click", ".customization-ctrl a#copy-embed-text", function(){
		var $temp = $("<input>");
		$("#iframeModal").append($temp);
		$temp.val($('.modalIframeExample').text()).select();
		document.execCommand("copy");
		$temp.remove();
	});
	
	$('#iframeModal').on('shown.bs.modal', function (e) {
		$('.iframeModal-modal-title').text($(e.relatedTarget).html());
		$('.iframeModal-modal-body').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
		+ 'src="'+location.protocol+'//'+location.host+'/videoEmbed?id='+$(e.relatedTarget).attr('embed-id')+'"></iframe>');
		
		$('.iframeContainer').html(
		$('<iframe src="/videoEmbed?id='+$(e.relatedTarget).attr('embed-id')+'"' +
		'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"'+
		'class="embed-responsive-item videoPlayer"></iframe>'));
		//TODO: Change this to an icon.
		$('#iframeModal .customization-ctrl').append($('<a id="delete-embed-button" embed-id="'+$(e.relatedTarget).attr('embed-id')+'" type="button" class="btn btn-default"><i class="fas fa-trash-alt"></i></a>'));
	})
	
	$('#iframeModal').on('hide.bs.modal', function (e) {
		$('.iframeContainer').html('');
		$('#iframeModal .customization-ctrl a#delete-embed-button').remove();
	})

	return {};
});