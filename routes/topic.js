var Topic = require('../models/topic.js');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;
var ObjectID = require('mongodb').ObjectID;
var timeFormat = require('../common/function').timeFormat;

//新话题保存
exports.newTopic = function(req, res){
    if(!req.body.title) {
        return res.json({result:false, message:'标题不能为空'});
    }

    if(!req.body.content) {
        return res.json({result:false, message:'正文不能为空'});
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
        if(err) {
            return res.json({result:false, message:'发布失败'});
        } else {
            return res.json({result:true, message:'发布成功', topic: topic});
        }
    });
};

//新话题保存
exports.newTopicComment = function(req, res){
    if(!req.body.topic_id) {
        return res.json({result:false, message:'参数错误'});
    }

    if(!req.body.content) {
        return res.json({result:false, message:'评论不能为空'});
    }

    var nickname = req.session.nickname;
    if(nickname === '') {
        nickname = '匿名用户';
    }

    var newComment = {
        commentId: ObjectID(),
        content: req.body.content,
        user: req.session.user, 
        nickname: nickname, 
        time: timeFormat(new Date())
    };

    var topicId = new BSON.ObjectID(req.body.topic_id);
    var condition = { _id: topicId  };

    Topic.update(condition, {"$inc": {"replyCount": 1}, "$push": {"comment": newComment}}, function(err, comment) {
        console.log(comment);
        if(err) {
            return res.json({result:false, message:'发布失败'});
        } else {
            return res.json({result:true, message:'发布成功', comment: newComment});
        }
    });
};

//话题详情
exports.detail = function(req, res){
    var topicId = new BSON.ObjectID(req.params.topicId);
    var condition = { _id: topicId  };
    Topic.get(condition, function(err, topic) {
        if(topic) {
            Topic.update(condition, {"$inc": {"viewCount": 1}});
            return res.render('topic', { topic: topic });
        } else {
            return res.send('不存在');
        }
    });
};

// 删除话题
exports.dropTopic = function(req, res){
    var topicId = new BSON.ObjectID(req.body.topic_id);
    var condition = { _id: topicId  };
    Topic.get(condition, function(err, topic) {
        if(topic) {
            if(topic.user === req.session.user) {
                Topic.drop(condition, function(err, result) {
                    if(result) {
                        return res.json({result:true, message:'删除成功'});
                    } else {
                        return res.json({result:false, message:'删除失败'});
                    }
                });
            } else {
                return res.json({result:false, message:'参数错误'});
            }
        } else {
            return res.json({result:false, message:'文章不存在'});
        }
    });
};

// 删除评论
exports.dropComment = function(req, res){
    var topicId = new BSON.ObjectID(req.body.topic_id);
    var commentId = new BSON.ObjectID(req.body.comment_id);
    var condition = { 
        "_id": topicId,
        "comment.commentId": commentId,
        "comment.user": req.session.user 
    };
    Topic.get(condition, function(err, topic) {
        if(topic) {
            var newValue = {"$inc": {"replyCount": -1}, "$pull": {"comment": {"commentId": commentId}}}; 
            Topic.update({"_id": topicId}, newValue, function(err, result) {
                if(result) {
                    return res.json({result:true, message:'删除成功'});
                } else {
                    return res.json({result:false, message:'删除失败'});
                }
            });
        } else {
            return res.json({result:false, message:'删除失败'});
        }
    });
};
