
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , git = require('./routes/git')
	, beta = require('./routes/beta')
  , http = require('http')
  , path = require('path')
	, sqlite3 = require('sqlite3')
	, db = new sqlite3.Database('beta-applicants.sqlite')
	, check = require('validator').check
	, sanitize = require('validator').sanitize
  , AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsconfig.json');
var ses = new AWS.SES();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + "/public/images/favicon.gif"));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/beta', beta.index);
app.post('/beta/apply', beta.apply(check, sanitize, db, ses));
app.get('/beta/thanks', beta.thanks);
app.post('/git/pushed', git.pushed);
app.get('/m', routes.index);
app.get("/app", function(req, res) { 
  res.redirect(301, "https://itunes.apple.com/us/app/doors-dots/id632302180?mt=8");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
