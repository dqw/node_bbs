var mongodb = require('./db');
var timeFormat = require('../common/function').timeFormat;

function Topic(topic) {
    this.title = topic.title;
    this.content = topic.content;
    this.user = topic.user;
    this.nickname = topic.nickname;
    this.time = topic.time;
    this.viewCount = topic.viewCount;
    this.replyCount = topic.replyCount;;
}

module.exports = Topic;

Topic.prototype.save = function(callback) {

    var topic = {
        title: this.title,
        content: this.content,
        user: this.user,
        nickname: this.nickname,
        time: this.time,
        viewCount: this.viewCount,
        replyCount: this.replyCount
    };

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(topic, {safe: true}, function(err, topic){
                mongodb.close();
                topic = topic[0];
                topic.time = timeFormat(topic.time);
                callback(err, topic);
            });
        });
    });
};

Topic.update = function(condition, newValue, callback) {
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.update(condition, newValue, function(err){
                mongodb.close();
                if(err) {
                    callback(err, false);
                } else {
                    callback(err, true);
                }
            });
        });
    });
};


Topic.list = function(condition, skip, limit, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection) {
            if(err){
                mongodb.close();
                return callback(err, null);
            }
            collection.find(condition).skip(skip).limit(limit).sort({time: -1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err, null);
                }

                var topics = [];
                docs.forEach(function(doc, index){
                    var time = timeFormat(doc.time);
                    var topic = {
                        _id: doc._id,
                        title: doc.title,
                        content: doc.content,
                        user: doc.user,
                        nickname: doc.nickname,
                        time: time,
                        viewCount: doc.viewCount,
                        replyCount: doc.replyCount
                    };
                    topics.push(topic);
                });
                callback(null, topics);
            });
        });
    });
};

Topic.get = function(condition, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection) {
            if(err){
                mongodb.close();
                return callback(err, null);
            }
            collection.findOne(condition, function(err, topic){
                mongodb.close();
                if(topic) {
                    topic.time = timeFormat(topic.time);
                    callback(err, topic);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

Topic.count = function(condition, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection) {
            if(err){
                mongodb.close();
                return callback(err, null);
            }
            collection.count(condition, function(err, count){
                mongodb.close();
                if(!err) {
                    callback(err, count);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

Topic.drop = function(condition, callback) {
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection) {
            if(err){
                mongodb.close();
                return callback(err, null);
            }
            collection.remove(condition, function(err){
                mongodb.close();
                if(err) {
                    callback(err, false);
                } else {
                    callback(err, true);
                }
            });
        });
    });
};
