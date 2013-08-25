var Topic = require('../models/topic.js');

exports.index = function(req, res){
    Topic.list({}, function(err, topics) {
        res.render('index', {topics: topics});
    });
};
