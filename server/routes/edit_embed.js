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

router.post('/deleteEmbed', (req, res)=>{
    userAuth.checkUser(false, req, res, function(){
        var videoID = req.body.id
        deleteEmbed(videoID, req.user.profileID, function(embed){
            //TODO: do not return notFound as error
            if(embed.error || embed.notFound){
                res.status(404).send({message:'error'});
            }else{
                res.json({removedVideo:true});
            }
        });
    });
});

module.exports = router;