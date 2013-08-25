var Topic = require('../models/topic.js');

//新用户保存
exports.new_topic = function(req, res){
    if(!req.body.title) {
        return res.send('标题不能为空');
    }

    if(!req.body.title) {
        return res.send('正文不能为空');
    }

    var newTopic = new Topic({
        title: req.body.title,
        content: req.body.content,
        user: req.session.user, 
        time: new Date(),
        viewCount: 0,
        replyCount: 0
    });

    newTopic.save(function(err) {
        if(err) {
            return res.json({result:false, message:'发布失败'});
        } else {
            return res.json({result:true, message:'发布成功', topic: newTopic});
        }
    });
};
