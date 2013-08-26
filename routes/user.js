var User = require('../models/user.js');
var crypto = require('crypto');
var config = require('../config.js');
var nodemailer = require("nodemailer");


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

    User.get({}, function(err, result) {
        var isAdmin = false;
        if(!result) {
            isAdmin = true;
        }

        var newUser = new User({
            email: req.body.email,
            password: password,
            nickname: '',
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
exports.send_new_password = function(req, res){
    User.isExist(req.body.email, function(result) {
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

function sendEmail(mail) {
    var transport = nodemailer.createTransport("SMTP", {
        host: config.system_email_smtp, // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: config.system_email,
            pass: config.system_email_password 
        }
    });

    var mailOptions = {
        from: config.title + "<" + config.system_email +">", // sender address
        to: mail.email, // list of receivers
        subject: mail.title, // Subject line
        text: mail.title + mail.text // plaintext body
    }

    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        transport.close(); // shut down the connection pool, no more messages
    });
}

function getHashPassword(password) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(password).digest('hex');
}




