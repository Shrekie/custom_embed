const ytdl = require('youtube-dl');
    
var getStream = function(url, done){

    ytdl.exec(url, ['-f best','-s', '-g'], {}, function(err, output) {

        if (err){done({error:err})}else{
            var stream = output[0];
            done({stream});
        }


    });
        
};

var getInfo = function(url, done){
    ytdl.exec(url, ['-s', '-e'], {}, function(err, output) {

        if (err){done({error:err})}else{
            var title = output[0];
            done({title});
        }


    });
}

module.exports = {getStream, getInfo};