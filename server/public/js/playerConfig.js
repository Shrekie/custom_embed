var playerConfig = function(videoEmbed) {

    var getVideo = function(done){
        $.ajax({
            url: "getVideoStream",
            method: "GET",
			data: { 
				id:videoEmbed.videoID
			},
            success: function(success){
                done(success.video);
            }
        });
    };

    var createVideo = function(){

        getVideo(function(video){
            console.log(video);
            var videoPlayer = $('<video class="Flexible-container"' +
            ' controls="" src="'+video.stream+'" name="media"></video>'
            );

            if(videoEmbed.configuration[0].autoplay){
                videoPlayer[0].autoplay = true;
            }

            $('body').html(videoPlayer);
        });
        
    };

    return {createVideo}
};