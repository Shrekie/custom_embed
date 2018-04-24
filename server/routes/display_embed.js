var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');

const streamF = require('./../lib/stream_fetch');
const userAuth = require('./../lib/user_authenticate');

findUserStreams = function(profileID, done){

    var searchQuery = {
        'profileID': profileID
    };

    var fields = '_id embedUrl'

    Embed.find(searchQuery, fields, function (err, embeds) {
        console.log(embeds);
        if (err){
            done({error:true});
        };
        if (embeds[0] === undefined || embeds[0].length == 0) {
            done({notFound:true});
        }else{
            console.log(embeds);
            done(embeds);
        }
      });

};

var findStream = function(uuid_code, done){

    var searchQuery = {
        '_id': uuid_code
    };

    Embed.findOne(searchQuery, function (err, embed) {
        if (err){
            done({error:true});
        };
        if (!embed.embedUrl) {
            done({notFound:true});
        }else{
            console.log(embed.embedUrl.url);
            done({url:embed.embedUrl.url});
        }
      });

};

router.get('/videoEmbed', (req, res)=>{
    var videoID = req.param('id');
    console.log(videoID);

    findStream(videoID, function(embed){
        if(embed.error || embed.notFound){
            res.status(404).send({message:'error'});
        }else{
            streamF.getStream(embed.url, function(result){
                console.log(result);
                if(result.error){
                    res.status(404).send({message:'error'});
                }else{
                    res.render('templates/plainVideo', {
                        video: {stream:result.stream},
                    });
                }
            });
        }
    });
    
});

router.get('/getUserEmbeds', (req, res)=>{
    userAuth.checkUser(req, res, function(){
        console.log(req.user.profileID);
        findUserStreams(req.user.profileID, function(embeds){
            if(embeds.error || embeds.notFound){
                res.status(404).send({message:'error'});
            }else{
                res.json(embeds);
            }
        })
    })
});

module.exports = router;