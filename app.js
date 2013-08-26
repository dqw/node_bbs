
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , topic = require('./routes/topic')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req, res, next){
  res.locals.title = config.title;
  res.locals.user = req.session.user;
  res.locals.nickname = req.session.nickname;
  res.locals.message = req.session.message;
  req.session.message = null;
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/signup', user.signup);
app.post('/signup', user.save);

app.get('/check_email', user.checkEmail);

app.get('/login', user.login);
app.post('/login', user.checkPassword);

app.get('/logout', user.logout);

app.get('/account', user.checkLogin);
app.get('/account', user.account);

app.post('/modify_account', user.checkLogin);
app.post('/modify_account', user.modifyAccount);

app.post('/change_password', user.checkLogin);
app.post('/change_password', user.changePassword);

app.get('/forgot_password', user.forgot_password);
app.post('/forgot_password', user.send_new_password);

app.post('/new_topic', user.checkLogin);
app.post('/new_topic', topic.new_topic);

app.get('/topic/:topicId', topic.detail);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
