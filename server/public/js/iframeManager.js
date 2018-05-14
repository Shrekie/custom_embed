app.factory('iframeManager', function ($http, $q, embedAPI) {

	var createIframe = function (iframeContainer, iframeExampleContainer, embed) {

		var videoID = embed._id;

		iframeContainer.html($('<iframe src="/videoEmbed?id=' + videoID + '"' +
			'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"' +
			'class="embed-responsive-item videoPlayer mainPlayer"></iframe>'));

		iframeExampleContainer.text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"'
			+ ' src="' + location.protocol + '//' + location.host + '/videoEmbed?id=' + videoID + '"></iframe>');

		return {
			buttons: function (customizationControlContainer) {

				var copyB = function () {

					var copyButton = customizationControlContainer.find('#copy-embed-text');

					copyButton.off('click').on("click", function () {
						console.log('copy')
						var $temp = $("<input>");
						customizationControlContainer.append($temp);
						$temp.val(iframeExampleContainer.text()).select();
						document.execCommand("copy");
						$temp.remove();
					});

				}

				var deleteB = function (done) {

					var deleteButton = customizationControlContainer.find('#delete-embed-button');

					deleteButton.off('click').on("click", function () {
						console.log('delete')
						embedAPI.deleteUserEmbed(videoID).then((response) => {
							done();
						}, (e) => {
							console.log(e);
						});
					});

				}

				var configButtons = function(configControlContainer, done){

					var currentConfigOptions = embed.configuration[0];

					var autoPlayOption = configControlContainer.find('#autoPlayOption');
					autoPlayOption.prop('checked', currentConfigOptions.autoplay);

					//TODO: combine all settings elements
					// autoPlayOption.add(controlBarOption)
					autoPlayOption.off('change').on('change', function () {

						var configOptions = {
							autoplay:autoPlayOption.is(':checked')
						}

						embedAPI.editUserEmbed(videoID, configOptions).then((embed) => {
							done(embed);
						}, (e) => {
							console.log(e);
						});

					});
				}

				return { copyB, deleteB, configButtons }

			}
		}

	};

	return {
		createIframe
	}

});