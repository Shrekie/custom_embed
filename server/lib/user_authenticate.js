const User = require('./../models/user');

const TOTALEMBEDSALLOWED = 100;

var changeTotalEmbeds = function(profileID, isIncrementing, done){
    // TODO: add this on presave of the embed model.
    var searchQuery = {
        profileID: profileID
    };

    var updates;
    if (isIncrementing){
        var updates = {$inc : {'totalEmbeds' : 1}};
    }else{
        var updates = {$inc : {'totalEmbeds' : -1}};  
    }

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


var checkUser = function(isGenerating, req, res, done){
    if(req.isAuthenticated()){
        if(req.user.totalEmbeds >= TOTALEMBEDSALLOWED){
            res.json({totalEmbedsExceeded:true});
        }else{
            done();
        }
    }else{
        res.status(404).send({message:'error'});
    }
};

module.exports = {checkUser, changeTotalEmbeds};