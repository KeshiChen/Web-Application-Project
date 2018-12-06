let Article = require('../models/article');
let Reply = require('../models/reply');
let User = require('../models/user');
const { check, validationResult } = require('express-validator/check');

module.exports = function(app) {
    app.get('/replys', function(req, res) {
        Reply.find({}, function(err, replys) {
          res.render('show', {
            replys: replys
          });
        });
      })

  // this function is create the reply for the article
  // the database of reply include the article id that can connect their article.
    app.post('/replys/createreply', function(req, res) {
       req.user.rewardpoints = req.user.rewardpoints + 1
       req.user.save()

        let reply= new Reply(req.body);

        reply.author = req.user.username
        var sd = require('silly-datetime');
        reply.time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        reply.article_id = req.body.article_id
        console.log('countff',req.body.replycount);

        reply.save()
        res.redirect("/articles/" + reply.article_id)
      });



}
