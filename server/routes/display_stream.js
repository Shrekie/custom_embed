var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');
const streamF = require('./../lib/stream_fetch');

var findStream = function(uuid_code, done){

    var searchQuery = {
        '_id': uuid_code
    };

    Embed.findOne(searchQuery, function (err, embed) {
        if (err) throw err;
        if (!embed) {
            done({notFound:true});
        }
            console.log(embed.embedUrl.url);
            done(embed.embedUrl.url);
      });

};

router.get('/videoStream', (req, res)=>{
    var videoID = req.param('id');
    console.log(videoID);

    findStream(videoID, function(url){
        streamF.getStream(url, function(stream){
            console.log(stream);
            res.render('templates/templateOne', {
                video: {stream:stream},
            });
            //res.send(stream);
        });
    });
    
});

module.exports = router;