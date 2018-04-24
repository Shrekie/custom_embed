app.factory('videoLinkModal', function($http, $q) {

	$('#iframeModal').on('shown.bs.modal', function (e) {
		console.log($('.iframeModal-modal-title'));
		$('.iframeModal-modal-title').text($(e.relatedTarget).html());
		$('.iframeModal-modal-body').text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315" ' 
		+ 'src="'+location.protocol+'//'+location.host+'/videoEmbed?id='+$(e.relatedTarget).attr('embed-id')+'"></iframe>');
		
		$('<iframe src="/videoEmbed?id='+$(e.relatedTarget).attr('embed-id')+'"' +
		'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"'+
		'class="embed-responsive-item videoPlayer"></iframe>')
		.appendTo('.iframeContainer');

	})
	
	$('#iframeModal').on('hide.bs.modal', function (e) {
		$('.iframeContainer').html('');
	})

	return {};
});