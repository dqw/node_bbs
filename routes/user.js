exports.signup = function(req, res){
  res.render('signup', { title: '注册' });
};
var crypto = require('crypto');

exports.save = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var md5sum = crypto.createHash('md5');
    md5sum.update(password);
    password = md5sum.digest('hex');
    var email = req.body.email;

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if (err) throw err;
        var user = {username: username, password:password, email:email};
        db.collection('user').insert(user, function(err, records) {
            if (err) throw err;
            console.log("new user " + username);
        });
    });
    res.send("注册成功");
};

exports.login = function(req, res){
  res.send("respond with a resource");
};

exports.logout = function(req, res){
  res.send("respond with a resource");
};
