const config = require('./config/config.js');

// Package imports
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

// Custom route imports
const oAuthRoute = require('./routes/google-oauth');
const save_embed = require('./routes/save_embed');
const display_embed = require('./routes/display_embed');
const edit_embed = require('./routes/edit_embed');

var app = express();
app.set('trust proxy', true);

//Session storage settings
var store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    databaseName: 'custom-embed',
    collection: 'mySessions'
});

store.on('error', function(error) {
    throw error;
});


var cookieSecurity = false;
if(config.env != 'development'){
    cookieSecurity = true;
}

app.use(require('express-session')({
    secret: process.env.sessionSecret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: cookieSecurity }
}));

// Route encoding settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path sources
app.use(express.static(__dirname + '/public/'));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')))
app.use('/assets', express.static(path.join(__dirname, '/../assets')));

//Routes
app.use(oAuthRoute);
app.use(save_embed);
app.use(display_embed);
app.use(edit_embed);

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/html/'));

app.get('/error', (req, res) => {
	res.sendFile(__dirname + '/public/html/information.html');
});

app.get('/userLogin', (req, res) => {
	res.sendFile(__dirname + '/public/html/userLogin.html');
});

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
})

// Create server
if(config.env == 'development'){
	require('./config/development.js').createDevServer(app).listen(process.env.PORT, () => {
        console.log("Development server started at "+process.env.PORT);
    });
}else{
	app.listen(process.env.PORT, '0.0.0.0', () => {
		console.log('Started on port ', process.env.PORT);
	});
}