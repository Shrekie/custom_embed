var playerConfig = function(video) {

    var videoPlayer = $('<video class="Flexible-container"' +
    ' controls="" src="'+video.stream+'" name="media"></video>'
    );

    var setOptions = function(){
            if(video.configuration[0].autoplay)videoPlayer[0].autoplay = true;
            $('body').html(videoPlayer);
        };

    return {setOptions}
};