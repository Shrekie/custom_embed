const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const secrets = require('./../config/secrets.js');
const User = require('./../models/user');

// passportjs initialization and strategy call.
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
	clientID: secrets.clientID,
	clientSecret: secrets.clientSecret,
	callbackURL: "/auth/google/callback"
},
	function(accessToken, refreshToken, profile, done) {

	    var searchQuery = {
	    	profileID: profile.id
	    };

	    var updates = {
			name: profile.displayName,
			profileID: profile.id,
			accessToken: accessToken
	    };

	    var options = {
	    	upsert: true,
	    	new: true
	    };

	    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
			if(err) {
				return done(null, err);
			} else {
				return done(null, user);
			}
	    });
	  
	}
));

// Authentication routes
router.get('/auth/google', 
	passport.authenticate('google', 
		{ scope: ['https://www.googleapis.com/auth/plus.login'] }));


router.get('/auth/google/callback', 
passport.authenticate('google', { 
	failureRedirect: '/error',
	successRedirect: '/userLogin'
}));

//Check authentication
//TODO: Create a server wide function to deal with request to routes without user being signed in.
// ex: return log in page like /index
router.get('/checkLogin', (req, res)=>{
	if(req.isAuthenticated())res.json({logged:true});
	else res.json({logged:false});
});

// Serialize user information <->
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = router;