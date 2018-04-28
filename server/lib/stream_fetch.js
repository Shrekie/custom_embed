const ytdl = require('youtube-dl');
    
var getStream = function(url, done){

    //TODO: Look into this command and how to bind to client IP -source-address !!-6, -o !!
    ytdl.exec(url, ['-f best', '-o', '-s', '-g'], {}, function(err, output) {

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