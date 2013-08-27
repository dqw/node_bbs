var mongodb = require('./db');

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

Topic.list = function(condition, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('topic', function(err, collection) {
            if(err){
                mongodb.close();
                return callback(err, null);
            }
            collection.find(condition).toArray(function(err, docs){
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


function timeFormat(time)
{
var year = time.getFullYear();
var month = time.getMonth()+1;
var date = time.getDate();
var hour = time.getHours();
var minute = time.getMinutes();
return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

