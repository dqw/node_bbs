var User = require('../models/user.js');
var crypto = require('crypto');

//新用户注册
exports.signup = function(req, res){
  res.render('signup');
};

//新用户保存
exports.save = function(req, res){
    if(req.body.password.length < 6) {
        req.session.message = '密码最少6位';
        return res.redirect('/signup');
    }

    if(req.body.password != req.body.password2) {
        req.session.message = '密码不一致';
        return res.redirect('/signup');
    }

    var password = getHashPassword(req.body.password);

    var newUser = new User({
        email: req.body.email,
        password: password,
        nickname: ''
    });

    User.isExist(newUser.email, function(result) {
        if(result) {
            req.session.message = '用户已存在';
            return res.redirect('/signup');
        }
        newUser.save(function(err) {
            if(err) {
                return res.redirect('/signup');
            }
            req.session.user = newUser.email;
            req.session.nickname = newUser.nickname;
            return res.redirect('/index');
        });
    });
};

exports.checkEmail = function(req, res) {
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
  res.render('login');
};

exports.checkPassword = function(req, res){

    var password = getHashPassword(req.body.password);

    var user = {
        email: req.body.email,
        password: password
    };

    User.checkPassword(user, function(err, user) {
        if(user) {
            req.session.user = user.email;
            req.session.nickname = user.nickname;
            return res.redirect("/");
        } else {
            req.session.message = '登录失败';
            return res.redirect('/login');
        }
    });
};

//退出
exports.logout = function(req, res){
    req.session.user = null;
    req.session.nickname = null;
    return res.redirect("/");
};

//账号设置
exports.account = function(req, res){
  res.render('account');
};

//修改用户昵称
exports.modifyAccount = function(req, res){

    var newValue = {nickname: req.body.nickname};

    User.update(req.session.user, newValue, function(result) {
        if(result) {
            req.session.nickname = req.body.nickname;
            req.session.message = '修改成功';
        } else {
            req.session.message = '修改失败';
        }
        return res.redirect("/account");
    });
};

//修改用户昵称
exports.changePassword = function(req, res){
    if(req.body.password !== req.body.password2) {
        req.session.message = '密码不一致';
        return res.redirect("/account");
    }

    var old_password = getHashPassword(req.body.old_password);

    var user = {
        email: req.session.user,
        password: old_password
    };

    User.checkPassword(user, function(err, user) {
        if(user) {

            var password = getHashPassword(req.body.password);
            var newValue = {password: password};

            User.update(req.session.user, newValue, function(result) {
                if(result) {
                    req.session.message = '密码修改成功';
                } else {
                    req.session.message = '密码修改失败';
                }
                return res.redirect("/account");
            });

        } else {
            req.session.message = '密码错误';
        }
        return res.redirect("/account");
    });
};

exports.checkLogin = function(req, res, next) {
    if(!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

function getHashPassword(password) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(password).digest('hex');
}




