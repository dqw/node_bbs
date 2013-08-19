var User = require('../models/user.js');
//新用户注册
exports.signup = function(req, res){
  res.render('signup', { title: '注册' });
};
var crypto = require('crypto');

//新用户保存
exports.save = function(req, res){
    if(req.body.password.length < 6) {
        return res.send("密码最少为6位");
    }

    if(req.body.password != req.body.password2) {
        return res.send("密码不一致");
    }

    var md5sum = crypto.createHash('md5');
    var password = md5sum.update(req.body.password).digest('hex');

    var newUser = new User({
        email: req.body.email,
        password: password,
        nickname: ''
    });

    User.isExist(newUser.email, function(result) {
        if(result) {
            return res.send("用户已存在");
        }
        newUser.save(function(err) {
            if(err) {
                return res.redirect('/signup');
            }
            req.session.email = newUser.email;
            req.session.nickname = newUser.nickname;
            res.send("注册成功");
        });
    });
};

exports.check_email = function(req, res) {
    User.isExist(req.query.email, function(result) {
        if(result) {
            res.send("false");
        } else {
            res.send("true");
        }
    });
}

//登录
exports.login = function(req, res){
  res.send("登录");
};

//退出
exports.logout = function(req, res){
  res.send("退出");
};

//账号设置
exports.account = function(req, res){
  res.send("账号设置");
};
