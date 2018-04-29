var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');

const streamF = require('./../lib/stream_fetch');
const userAuth = require('./../lib/user_authenticate');

var createEmbed = function(profileID, url, title, done) {
    
    Embed.create({ 
        profileID: profileID, 
        'embedUrl.extractorType':'youtube',
        'embedUrl.url':url,
        'embedUrl.title':title
    }, function (err, embed) {
        if (err){
            done({error:true});
        }else{
            userAuth.changeTotalEmbeds(profileID, true, function(user){
                if(user.error || user.notFound){
                    res.status(404).send({message:'error'});
                }else{
                    done(embed);
                }
            });
        }
    })

};

router.post('/generateEmbed', (req, res)=>{
    userAuth.checkUser(true, req, res, function(){
        var ytRegxVal = new RegExp('^(http(s)?:\/\/)?((w){3}.)?'+
        'youtu(be|.be)?(\.com)?\/.+');
        var url = req.body.YTURL;
        if(ytRegxVal.test(url)){
            streamF.getInfo(url, function(result){
                if(result.error){
                    res.status(404).send({message:'error'});
                }else{
                    createEmbed(req.user.profileID, url, result.title, function(embed){
                        if(embed.error){
                            res.status(404).send({message:'error'});
                        }
                        else{
                            res.json({_id:embed._id});
                        }
                    });
                }
            });
        }else{
            res.status(404).send({message:'error'});
        }
    });
});

module.exports = router;