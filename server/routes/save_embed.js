var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');
const User = require('./../models/user');

const streamF = require('./../lib/stream_fetch');
const userAuth = require('./../lib/user_authenticate');

var incrementTotalEmbeds = function(profileID, done){

    var searchQuery = {
        profileID: profileID
    };

    var updates = {
        $inc : {'totalEmbeds' : 1}
    };

    User.findOneAndUpdate(searchQuery, updates, function(err, user) {
        if(err) {
            done({error:true});
        }
        if (user === null) {
            done({notFound:true});
        } 
        else {
            done(user);
        }
    });

};

var createEmbed = function(profileID, url, title, done) {

    //TODO: set a max limit per user, do this by iterating a max var on the user doc
    Embed.create({ 
        profileID: profileID, 
        'embedUrl.extractorType':'youtube',
        'embedUrl.url':url,
        'embedUrl.title':title
    }, function (err, embed) {
        if (err){
            done({error:true});
        }else{
            incrementTotalEmbeds(profileID, function(user){
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
    userAuth.checkUser(true, req, res, function(exceededTotalEmbeds){
        if(exceededTotalEmbeds){
            res.json({totalEmbedsExceeded:true});
        }else{
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
                                console.log(req.user);
                                res.json('videoEmbed?id='+embed._id);
                            }
                        });
                    }
                });
            }else{
                res.status(404).send({message:'error'});
            }
        }
    })
});

module.exports = router;