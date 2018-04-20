var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');

const ytdl = require('youtube-dl');

var addEmbed = function(profileID, url, done) {

    var searchQuery = {
        profileID: profileID
    };

    var updates = {
        $push: { embedUrl: {extractorType:'youtube', url:url}  }
    };

    var options = {
        upsert: true,
        new: true
    };

    Embed.findOneAndUpdate(searchQuery, updates, options, function(err, embed) {
        if(err) {
            throw err;
        } else {
            done(url)
        }
    });

};

router.post('/getStream', (req, res)=>{
    if(req.isAuthenticated()){
        var link = req.body.YTURL;

        const ytdl = require('youtube-dl');

        ytdl.exec(link, ['-f best', '-s', '-g'], {}, function(err, output) {

            if (err) throw err;

            var url = output[0];
            console.log(url);
            addEmbed(req.user.profileID, url, function(url){
                res.json(url);
            });

        });
    }else{
        res.json({logged:false});
    }
});

module.exports = router;