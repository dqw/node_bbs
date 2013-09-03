var Topic = require('../models/topic.js');
var config = require('../config.js');
var getPagination = require('../common/function').getPagination;

exports.index = function(req, res){
    var searchKey = '';
    if(typeof req.query.key === 'undefined') {
        var condition = {};
    } else {
        searchKey = req.query.key;
        var key = new RegExp(req.query.key);
        var condition = { title: key };
    }
    var currentPage = parseInt(req.query.page, 10) || 1;
    var skip = (currentPage - 1) * config.pageCount;
    Topic.list(condition, skip, config.pageCount, function(err, topics) {
        Topic.count(condition, function(err, count) {
            var totalPage = Math.ceil(count / config.pageCount);
            var pagination = getPagination(currentPage, totalPage, searchKey);
            res.render('index', {topics: topics, pagination: pagination, searchKey: searchKey});
        });
    });
};
