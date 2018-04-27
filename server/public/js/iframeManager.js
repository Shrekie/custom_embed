app.factory('iframeManager', function($http, $q, embedManager) {

	var createIframe = function(iframeContainer, iframeExampleContainer, videoID){

    iframeContainer.html($('<iframe src="/videoEmbed?id='+videoID+'"' +
    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"'+
    'class="embed-responsive-item videoPlayer mainPlayer"></iframe>'));

    iframeExampleContainer.text('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="560" height="315"' 
    + ' src="'+location.protocol+'//'+location.host+'/videoEmbed?id='+videoID+'"></iframe>');

    return {buttons:function(customizationControlContainer) {

      customizationControlContainer.html('');
      
      var copyB = function(){

        var copyButton = $('<a id="copy-embed-text" type="button" class="btn btn-default"><i class="fas fa-copy"></i></a>');
        console.log(customizationControlContainer);
        customizationControlContainer.append(copyButton);

        copyButton.on("click", function(){
          var $temp = $("<input>");
          customizationControlContainer.append($temp);
          $temp.val(iframeExampleContainer.text()).select();
          document.execCommand("copy");
          $temp.remove();
        });
      }

      var deleteB = function(done){

        var deleteButton = $('<a id="delete-embed-button" embed-id="'+videoID+'"'+
        'type="button" class="btn btn-default"><i class="fas fa-trash-alt"></i></a>');
        console.log(deleteButton);
        customizationControlContainer.append(deleteButton);

        deleteButton.on("click", function(){
          embedManager.deleteUserEmbed(videoID).then((response) => {
            done();
          }, (e) => {
            console.log(e);
          });
        });
      }

      return {copyB, deleteB};

    }};

  };

  return{
		createIframe
	}

});