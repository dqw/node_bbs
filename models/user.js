var mongodb = require('./db');

function User(user) {
    this.email = user.email;
    this.password = user.password;
    this.nickname = user.nickname;
}

module.exports = User;

User.prototype.save = function(callback) {

    var user = {
        email: this.email,
        password: this.password,
        nickname: this.nickname
    };

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('user', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(user,{safe: true}, function(err, user){
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

User.get = function(condition, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }

    db.collection('user', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }

      collection.findOne(condition, function(err, doc){
        mongodb.close();
        if(doc) {
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

User.isExist = function(email, callback) {
    var condition = {email: email};
    User.get(condition, function(err, user) {
        if(err || user) {
            callback(true)
        } else {
            callback(false)
        }
    });
};

User.checkPassword = function(user, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }

    db.collection('user', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }

      collection.findOne(user, function(err, doc){
        mongodb.close();
        if(doc) {
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

User.update = function(email, newValue, callback) {

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('user', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.update({email: email} ,{"$set": newValue}, function(err){
                mongodb.close();
                if(err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        });
    });
};


