var checkUser = function(req, res, done){

    if(req.isAuthenticated()){
        done();
    }else{
        res.redirect('/');
    }
        
};

module.exports = {checkUser};