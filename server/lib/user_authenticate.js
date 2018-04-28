const TOTALEMBEDSALLOWED = 100;

var checkUser = function(isGenerating, req, res, done){

    if(isGenerating){
        if(req.user.totalEmbeds >= TOTALEMBEDSALLOWED){done(true)}else{done(false)};
    }else{
        if(req.isAuthenticated()){
            done();
        }else{
            res.redirect('/');
        }
    }
        
};

module.exports = {checkUser};