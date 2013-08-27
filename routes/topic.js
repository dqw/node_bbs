var Topic = require('../models/topic.js');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

//新话题保存
exports.new_topic = function(req, res){
    if(!req.body.title) {
        return res.send('标题不能为空');
    }

    if(!req.body.title) {
        return res.send('正文不能为空');
    }

    var nickname = req.session.nickname;
    if(nickname === '') {
        nickname = '匿名用户';
    }

    var newTopic = new Topic({
        title: req.body.title,
        content: req.body.content,
        user: req.session.user, 
        nickname: nickname, 
        time: new Date(),
        viewCount: 0,
        replyCount: 0
    });

    newTopic.save(function(err, topic) {
        console.log(topic);
        if(err) {
            return res.json({result:false, message:'发布失败'});
        } else {
            return res.json({result:true, message:'发布成功', topic: topic});
        }
    });
};

exports.detail = function(req, res){
    console.log(req.params.topicId);
    var topicId = new BSON.ObjectID(req.params.topicId);
    var condition = { _id: topicId  };
    Topic.get(condition, function(err, topic) {
        if(topic) {
            return res.render('topic', { topic: topic });
        } else {
            return res.send('不存在');
        }
    });
};
