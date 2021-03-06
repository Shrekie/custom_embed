var express = require('express');
var router = express.Router();

const Embed = require('./../models/embed');
const User = require('./../models/user');

const userAuth = require('./../lib/user_authenticate');

var deleteEmbed = function(uuid_code, profileID, done){

    var searchQuery = {
        '_id': uuid_code,
        'profileID': profileID
    };

    Embed.remove(searchQuery, function (err, embed) {
        if (err){
            done({error:true});
        };
        if (embed.n == 0) {
            done({notFound:true});
        }else{
            userAuth.changeTotalEmbeds(profileID, false, function(user){
                if(user.error || user.notFound){
                    res.status(404).send({message:'error'});
                }else{
                    done(embed);
                }
            });
        }
    });

};

var changeEmbed = function(uuid_code, profileID, configOptions, done){

    var searchQuery = {
        '_id': uuid_code,
        'profileID': profileID
    };

    var updates = {
        configuration: configOptions
    };

    var options = {
        new: true,
        upsert: false
    };

    Embed.findOneAndUpdate(searchQuery, updates, options, function (err, embed) {
        if (err){
            console.log(err);
            done({error:true});
        };
        if (embed == null) {
            console.log(embed == null);
            done({notFound:true});
        }else{
            done(embed);
        }
    });

};


router.post('/changeConfig', (req, res) => {
    userAuth.checkUser(false, req, res, function(){
        var videoID = req.body.id;
        var configOptions = req.body.configOptions;
        changeEmbed(videoID, req.user.profileID, configOptions, function(embed){
            if(embed.error || embed.notFound){
                res.status(404).send({message:'error'});
            }else{
                res.json(embed);
            }
        });
    });
});


router.post('/deleteEmbed', (req, res)=>{
    userAuth.checkUser(false, req, res, function(){
        var videoID = req.body.id
        deleteEmbed(videoID, req.user.profileID, function(embed){
            if(embed.error || embed.notFound){
                res.status(404).send({message:'error'});
            }else{
                res.json({removedVideo:true});
            }
        });
    });
});

module.exports = router;