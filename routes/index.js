
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log(req.session.user);
  res.render('index');
};
