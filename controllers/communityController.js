let PublicSettings = require('../config/PublicSettings');
let Article = require('../models/article');
let User = require('../models/user');
let Reply = require('../models/reply');
const { check, validationResult } = require('express-validator/check');

module.exports = function(app) {
  app.get('/articles', function(req, res) {
    Article.find({}, function(err, articles) {
      res.render('index', {
        articles: articles
      });
    });
  })
  // create the new the type of other post
  app.get('/articles/new', function(req, res){
    res.render('Post_Create');
  });
  // create the new type of course post
  app.get('/coursecomment', ensureAuthenticated,function(req, res) {
    res.render('Course_Comment', {
      coursename: req.query.coursename,
      coursepage: req.query.coursepage
    });
  });
  // create the new type of dataset post
  app.get('/datasetcomment', ensureAuthenticated,function(req, res) {
    console.log('ddd',req.query.datasetid);
    res.render('Dataset_Comment', {
      datasetid: req.query.datasetid,

    });
  });
// get the page of community home page
  app.get('/community_home', function(req, res) {
    Article.find({}, function(err, articles) {

      res.render('Post_Homepage', {
        articles: articles
      });
    });
  })
// find the post of course
  app.get('/articles/type_course', function(req, res) {
    Article.find({}, function(err, articles) {
      res.render('type_course', {
        articles: articles
      });
    });
  })
// find all  post for the user
  app.get('/articles/userartic', function(req, res) {
    Article.find({}, function(err, articles) {
      res.render('Profile_Mypost', {
        articles: articles
      });
    });
  })
// post  search.
// this function include two part.
// the first part, search by type,the second part, search by the key word.
// First i will judege the content of search ， if the content is empty , the program will judege the post type.
// Second, if the content is not empty, the program will find all title that include the key word in database,and then
// base these articles that include key word, the program will continue to find the post type.
// this function will return the list to front end.

  app.get('/articles/search', function(req, res) {
    console.log('dfdfdfdf',req.query.search)

    if(req.query.search){

    Article.find({title:eval("/"+req.query.search+"/i") }, function(err, articles) {

      var art = []

      for(i = 0; i < articles.length;i++){
        if(req.query.com_type == articles[i].com_type && req.query.com_type != "0"){
          art.push(articles[i])
      }
    }
    if(art.length == 0 ){
      for(i = 0; i < articles.length;i++){
          art.push(articles[i])
    }

    }
    res.render('Post_Homepage', {

      articles: art,
      search : req.query.search,
      type : req.query.com_type

    });
    });
  }
  else{
    Article.find({}, function(err, articles) {

        var art = []

        for(i = 0; i < articles.length;i++){
          if(req.query.com_type == articles[i].com_type && req.query.com_type != "0"){
            art.push(articles[i])
        }
      }
      if(art.length == 0 ){
        for(i = 0; i < articles.length;i++){
            art.push(articles[i])
      }

      }
      res.render('Post_Homepage', {

        articles: art,
        search : req.query.search,
        type : req.query.com_type

      });
    });
  }
  })

// find the type of dataset

  app.get('/articles/type_dataset', function(req, res) {
    console.log('yyyy',req.query.datasetid);
    Article.find({}, function(err, articles) {
      res.render('type_dataset', {
        articles: articles,
        dataset_id:req.query.datasetid

      });
    });
  })
  app.get('/articles/Post_Datasets', function(req, res) {
    console.log('eeee',req.query.datasetid);

    Article.find({}, function(err, articles) {
      res.render('Post_Datasets', {
        articles: articles,
        datasetid: req.query.datasetid



      });
    });
  })
  // find the post of other type
  app.get('/articles/type_other', function(req, res) {
    Article.find({}, function(err, articles) {
      res.render('type_other', {
        articles: articles
      });
    });
  })

// delete the post function
  app.delete('/articles/:id', function(req, res) {
    let query = { _id: req.params.id };

    Article.remove(query, function(err) {
      if (err) {
        console.log(err);
      }

      res.send('Success');
    })
  })
// the post show function
// the article has reply , so this function need to find the reply ID.
// this function need to compute the count of view, and the count of reply

  app.get('/articles/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      Reply.find({article_id:req.params.id},function(err,replys) {
        article.popular=article.popular + 1
        var count_reply = 0
        for(re in replys){
          count_reply += 1;
          console.log(count_reply)
        }
        article.reply_count = count_reply;
        article.save()
        res.render('Post_Detail', {


        articletitle: article.title,
        articlebody: article.body,
        articleauthor: article.author,
        articlepopular: article.popular,
        articleid: article.id,
        article_id: article._id,
        articletype: article.com_type,
        articletime: article.time,
        replys: replys,
        month :article.month,
        day :article.day,
        reply_count:article.reply_count
      })
    })


    })

  })
// edit the post
  app.get('/articles/:id/edit', ensureAuthenticated,function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      console.log(article.author);
      console.log(req.user._id);
      if (article.author != req.user.username) {
        return res.redirect('/');
      }
      res.render('Post_Edit', {
        title: 'Edit Article',
        article: article
      })
    })
  })
// this funcration is create new post
// when the user create the post, this function record the create time
// this function record two way of time . 1. month and year, 2. time,month and year
  app.post('/articles/create', [
  check('title').isLength({ min: 1 }).withMessage('Title is required'),
  check('body').isLength({ min: 1 }).withMessage('Body is required'),
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('Post_Create', {
      title: 'Add Article',
      errors: errors.array()
    })
  } else {
    var redirectTo = PublicSettings.HOST+'/community_home';
    console.log("referrer "+req.body.referrer);
    redirectTo = (req.body.referrer&&req.body.referrer!=redirectTo)?req.body.referrer:'/community_home'
    let article = new Article(req.body);
    article.author = req.user.username


    var list = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var myDate = new Date();
    var month = list[parseInt(myDate.getMonth())];
    var day = myDate.getDate();
    article.month = month;
    article.day = day;
    var sd = require('silly-datetime');
    article.time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log('aaa',month);
    article.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.redirect(redirectTo)
      }
    })
  }
})

  app.post('/articles/update/:id', function(req, res) {
    let query = { _id: req.params.id }

    Article.update(query, req.body, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.redirect("/articles/" + query._id)
      }
    })
  })
// delete the post
  app.delete('/:id', function(req, res) {
  if (!req.user._id) {
    return res.status(500).send();
  }

  let query = { _id: req.params.id };

  Article.findById(req.params.id, function(err, article) {
    if (article.author != req.user.username) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err) {
        if (err) {
          console.log(err);
        }

        res.send('Success');
      })
    }
  })
})
// this function is create the post of dataset
app.post('/articles/createdataset', [
  check('title').isLength({ min: 1 }).withMessage('Title is required'),
  check('body').isLength({ min: 1 }).withMessage('Body is required'),
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('newdataset', {
      title: 'Add Article',
      errors: errors.array()
    })
  } else {
    let article = new Article(req.body);

    article.author = req.user.username



    //console.log(req.user.rewardpoints);
    var sd = require('silly-datetime');
    article.time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    article.com_type = 'dataset'
    article.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        //req.flash("success", "Article Added");
        res.redirect('/community_home')
      }
    })
  }
})
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      //req.flash('danger', 'Please login');
      res.redirect('/login');
    }
  }

}
