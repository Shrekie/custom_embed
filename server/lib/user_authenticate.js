const TOTALEMBEDSALLOWED = 10;

var checkUser = function(isGenerating, req, res, done){

    if(isGenerating){
        console.log(req.user.totalEmbeds);
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