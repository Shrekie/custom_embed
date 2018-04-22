var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');

const streamF = require('./../lib/stream_fetch');
const userAuth = require('./../lib/user_authenticate');

var createEmbed = function(profileID, url, done) {

    Embed.create({ 
        profileID: profileID, 
        'embedUrl.extractorType':'youtube',
        'embedUrl.url':url
    }, function (err, embed) {
        if (err){
            done({error:true});
        }else{
            done(embed);
        }
    })

};

router.post('/generateEmbed', (req, res)=>{
    userAuth.checkUser(req, res, function(){
        var url = req.body.YTURL;
        //TODO: validate before saving.
        createEmbed(req.user.profileID, url, function(embed){
            //TODO: Check for error
            res.json('videoEmbed?id='+embed._id);
        });
    })
});

module.exports = router;