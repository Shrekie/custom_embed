const ytdl = require('youtube-dl');
    
var getStream = function(url, done){

    //TODO: Look into this command and how to bind to client IP -source-address !!-6, -o !!
    ytdl.exec(url, ['-f best', '-o', '-s', '-g'], {}, function(err, output) {

        if (err) throw err;

        var stream = output[0];
        done(stream);

    });
        
};

module.exports = {getStream};