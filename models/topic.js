var mongodb = require('./db');

function Topic(topic) {
    this.title = topic.title;
    this.content = topic.content;
    this.user = topic.user;
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
                callback(err, topic);
            });
        });
    });
};

Topic.list = function(condition, callback){
    console.log(1);
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
                if(err){
                    return callback(err, null);
                }

                var topics = [];
                docs.forEach(function(doc, index){
                    var topic = {
                        title: doc.title,
                        content: doc.content,
                        user: doc.user,
                        time: doc.time,
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

