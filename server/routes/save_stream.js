var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');

const streamF = require('./../lib/stream_fetch');

var createEmbed = function(profileID, url, done) {

    Embed.create({ 
        profileID: profileID, 
        'embedUrl.extractorType':'youtube',
        'embedUrl.url':url
    }, function (err, embed) {
        if (err) throw err;
        done(embed);
    })

};

router.post('/generateEmbed', (req, res)=>{
    if(req.isAuthenticated()){
        var url = req.body.YTURL;
        createEmbed(req.user.profileID, url, function(embed){
            res.json('videoStream?id='+embed._id);
        });
    }else{
        res.json({logged:false});
    }
});

module.exports = router;