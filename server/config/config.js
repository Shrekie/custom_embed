var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

if(env == 'development'){
	const secrets = require('./secrets.js');
	process.env.clientID = secrets.clientID;
	process.env.clientSecret = secrets.clientSecret;
	process.env.sessionSecret = secrets.sessionSecret;
}

process.env.PORT = 5000;

if(env === 'development'){
	process.env.MONGO_URL = 'mongodb://localhost:27017/custom-embed';
}

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL,{
});

module.exports = {env, mongoose};