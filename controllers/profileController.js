let UserData = require('../models/user');
let Dataset = require('../models/dataset');
let Post = require('../models/article');
let User = UserData.User;
let Progress = UserData.Progress;
let Course = require('../models/course');

//exports all the inner functions into main controller: app.js
module.exports = function(app) {

  //receive get request to return a profile page with user courses and user information
  app.get('/profile/:username', function(req, res){

    //connect to User database to search for user's inforamtion about courses taken
    User.findOne({username: req.params.username}, function(err, user){
      var enrolled = [];
      var progress = user.progress;
      for(var i=0; i< progress.length; i++){
        console.log(progress[i].progress)
        if(progress[i].progress!=0){
          enrolled.push(progress[i].coursename);
        }
      }

      //connect to Courses database, with the coursename, find out the course information and render profile page
      Course.find({coursename: {$in: enrolled}}, function(err, courses){
        var data = {
          courses: courses
        }
        res.render('Profile_Homepage', data);
      });
    });
  });


  //receive a get request to return profile page with all user's posts information
  app.get('/profile_posts/:username', function(req, res){

    //connect to the Post database to find all articles
    Post.find({author:req.params.username}, function(err, articles){
        res.render('Profile_Mypost', {
          articles: articles
        });
    });
  });

  //receive a GET request to return profile page with all user's stored datasets information
  app.get('/profile_datasets/:username', function(req, res){
    Dataset.find({}, function(err, datasets){

        res.render('Profile_Dataset',{
          datasets: datasets
        })
    });
  });


  // receive a get request to return profile page with the sorted ranking information  (ranking, username and points)
 app.get('/leaderboard', function(req, res){

  //connect to User database to retrieve all the rewardpoints, sort them and render a leaderboard page with the sorted ranking of user's rewardpoints
  User.find().sort({rewardpoints:-1}).exec(
        function(err, rank){
          data=[]
          for(var i=0; i< rank.length; i++){
            data.push({names: rank[i]['username'], points: rank[i]['rewardpoints']})
          }
          console.log(data)
          res.render('Profile_Leaderboard', data);
        }
   );
 })


  //receive a get request to return a profile page which let the user change their user information. render a page with the edit form pre-filled with user's current information
  app.get('/profile_setting/:username', function(req, res){

    //connect to User database to fetch out all the user information and pass it to the rendered page
    User.findOne({username: req.params.username}, function(err, user){
      res.render('Profile_Setting');
    });
  });



}
