var User = require('../models/user.js');
var sendEmail = require('../common/function').sendEmail;
var getHashPassword = require('../common/function').getHashPassword;

//新用户注册
exports.signup = function(req, res){
  res.render('signup');
};

//新用户保存
exports.save = function(req, res){

    var email = req.body.email;
    if(email === '') {
        req.session.message = '邮箱不能为空';
        return res.redirect('/signup');
    }

    var nickname = req.body.nickname;
    if(nickname === '' || nickname.length > 20) {
        req.session.message = '昵称不能为空且不能大于20个字';
        return res.redirect('/signup');
    }

    if(req.body.password.length < 6) {
        req.session.message = '密码最少6位';
        return res.redirect('/signup');
    }

    if(req.body.password != req.body.password2) {
        req.session.message = '密码不一致';
        return res.redirect('/signup');
    }

    var password = getHashPassword(req.body.password);

    User.get({}, function(err, result) {
        var isAdmin = false;
        if(!result) {
            isAdmin = true;
        }

        var newUser = new User({
            email: email,
            nickname: nickname,
            password: password,
            isAdmin: isAdmin
        });

        User.isExist(newUser.email, function(err, result) {
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
                return res.redirect('/');
            });
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
            req.session.isAdmin = user.isAdmin;
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
            return res.redirect("/account");
        }
    });
};

exports.checkLogin = function(req, res, next) {
    if(!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

//找回密码
exports.forgot_password = function(req, res){
  res.render('forgot_password');
};

//发送新密码
exports.sendNewPassword = function(req, res){
    User.isExist(req.body.email, function(err, result) {
        if(result) {
            var newPassword = Math.random().toString(36).substring(11);

            var password = getHashPassword(newPassword);
            var newValue = {password: password};
            User.update(req.body.email, newValue, function(result) {
                if(result) {
                    var email = {
                        email: req.body.email,
                        title: '新密码',
                        text: '新密码：' + newPassword
                    };
                    sendEmail(email);
                    req.session.message = '新的密码已经发送到您的邮箱';
                } else {
                    req.session.message = '密码找回失败，请稍后重试';
                }
                return res.redirect('/forgot_password');
            });
        } else {
            req.session.message = '用户不存在';
            return res.redirect('/forgot_password');
        }
    });
};




