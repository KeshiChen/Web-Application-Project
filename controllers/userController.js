let Course = require('../models/course');
let Page = require('../models/coursePage');
let UserData = require('../models/user');
let UserMethods = require('../methods/userMethods');
let PublicSettings = require('../config/PublicSettings');
let multer = require('../config/multer');
const { check, body, validationResult, checkSchema } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const passport = require('passport');
let User = UserData.User;
let Progress = UserData.Progress;


module.exports = function(app) {

  // get request for register page
  app.get('/register', function(req, res){
    res.render('Login');
  });

  //get request for login page
  app.get('/login', function(req, res){
    res.render('Login');
  });

  // get request for Logout
  app.get('/logout', function(req, res) {
    req.logout();
    //req.flash('success', 'You are logged out');
    res.redirect('/');
  });

  // get request to get top users
  app.get('/topusers', function(req, res){
  	User.find().sort({rewardpoints:-1}).exec(
 				function(err, rank){
 					data=[]
 					for(var i=0; i< 10; i++){
            if(rank[i]['portrait']){
              data.push({names: rank[i]['username'], portrait: rank[i]['portrait'], rewardpoints:rank[i]['rewardpoints'], description:rank[i]['description']})
            }else {
              data.push({names: rank[i]['username'], portrait: "/assets/images/default_portrait.png", rewardpoints:rank[i]['rewardpoints'], description:rank[i]['description']})
            }

 					}
 					console.log(data)
 					res.json({topusers:data});
 				}
 	 );
  })

  // Get lastvisited coursename and pageindex
  app.get('/lastvisit/:id', function(req, res, next){
    User.findById({_id: req.params.id}, 'lastvisit').then(function(doc){
      var data = {
        lastvisit: {
          coursename: doc.lastvisit.coursename,
          pageindex: doc.lastvisit.pageindex
        }
      };
      res.send(data);
    });
  });

  // Get progress of courses of the user
  app.get('/progress/:id', function(req, res, next){
    User.findById({_id: req.params.id}, 'progress').then(function(doc){
      var data = {
        progress: doc.progress
      };
      res.send(data);
    });
  });

  // Verificate the form of registration and create an account
  // First get each field e.g. username, email, password, etc. in the form and
  // validate them one by one, if error occurs, flash the error message to the browser.
  // Otherwise, create the account and redirect to login page.
  app.post('/register', function(req, res, next){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var passwordConf = req.body.passwordConf;
    var msg = [];
    msg.push.apply(msg, UserMethods.validateUsername(username));
    msg.push.apply(msg, UserMethods.validatePassword(password, passwordConf))
    msg.push.apply(msg, UserMethods.validateEmail(email));
    console.log(msg);
    if(msg.length>0){
      for(var i=0; i<msg.length; i++){
        switch(msg[i]){
          case UserMethods.PASSWORD_INVALID_MSG:
            req.flash("error", "Invalid password, minimum length: "+PublicSettings.PASSWORD_LENGTH);
            break;
          case UserMethods.PASSWORD_EMPTY_MSG:
            req.flash("error", "Invalid password, minimum length: "+PublicSettings.PASSWORD_LENGTH);
            break;
          case UserMethods.PASSWORD_LENGTH_FAILURE_MSG:
            req.flash("error", "Invalid password, minimum length: "+PublicSettings.PASSWORD_LENGTH);
            break;
          case UserMethods.PASSWORD_UNMATCH_MSG:
            req.flash("error", "Password confirmation does not match")
            break;
          case UserMethods.EMAIL_EMPTY_MSG:
            req.flash("error", "Email required")
            break;
          case UserMethods.EMAIL_INVALID_MSG:
            req.flash("error", "Invalid email format")
            break;
          case UserMethods.NAME_LENGTH_FAILURE_MSG:
            req.flash("error", "Invalid username, minimum length: "+PublicSettings.USERNAME_LENGTH);
            break;
          case UserMethods.NAME_EMPTY_MSG:
            req.flash("error", "Username required");
            break;
        };
      }
      res.redirect('register');
    } else{
      User.findOne({username:username}, function(err, doc){
        if(err){
          console.log("Find User Error: "+err);
        } else{
          if(doc){
            req.flash("error", "User name already exists")
            res.redirect('register');
          } else{
            let newUser = new User({
              username: username.trim(),
              email: email.trim(),
              password: password
            });

            bcrypt.genSalt(10, function(err, salt){
              bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                  res.redirect('register');
                }else{
                  newUser.password = hash;
                  var progresses = [];
                  Course.find({}, function(err, courses){
                    for(var i=0;i<courses.length;i++){
                      var courseProgress = {};
                      courseProgress.coursename = courses[i].coursename;
                      courseProgress.pageindex = 1;
                      courseProgress.progress = 0;
                      progresses.push(courseProgress);
                    }
                    newUser.progress = progresses;
                    newUser.save(function(err){
                      if(err){
                        console.log(err);
                        return;
                      }else{
                        req.flash("success", "Registration success!")
                        res.redirect('login');
                      }
                    });
                  });

                }
              });
            });
          }
        }
      });
    }
  });
  // Login authentication using Passport.js
  // First, authenticate the user, then redirect to previous page
  app.post('/login', function(req, res, next) {
    var redirectTo = PublicSettings.HOST+'/login';
    console.log(req.body.referrer);
    redirectTo = (req.body.referrer&&req.body.referrer!=redirectTo)?req.body.referrer:'/'
    passport.authenticate('local', {
      successRedirect: redirectTo,
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });



  // Verificate updating form and update user information
  // First get each field e.g. username, email, password, etc. in the form and
  // validate them one by one, if error occurs, flash the error message to the browser.
  // Otherwise, update the user info and redirect to profile page.
  app.post('/updateuser/:id', function(req, res, next){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var passwordConf = req.body.passwordConf;
    var phone = req.body.phone;
    var city = req.body.city;
    var country = req.body.country;
    var description = req.body.description;
    var msg = [];
    msg.push.apply(msg, UserMethods.validateUsername(username));
    msg.push.apply(msg, UserMethods.validatePassword(password, passwordConf));
    msg.push.apply(msg, UserMethods.validateEmail(email));
    msg.push.apply(msg, UserMethods.validatePhoneNumber(phone));
    console.log("msg"+msg);
    if(msg.length>0){
      for(var i=0; i<msg.length; i++){
        switch(msg[i]){
          case UserMethods.PASSWORD_INVALID_MSG:
            req.flash("error", "Invalid password");
            break;
          case UserMethods.PASSWORD_EMPTY_MSG:
            req.flash("error", "Password required");
            break;
          case UserMethods.PASSWORD_LENGTH_FAILURE_MSG:
            req.flash("error", "Invalid password, minimum length: "+PublicSettings.PASSWORD_LENGTH);
            break;
          case UserMethods.PASSWORD_UNMATCH_MSG:
            req.flash("error", "Password confirmation does not match");
            break;
          case UserMethods.EMAIL_EMPTY_MSG:
            req.flash("error", "Email address required");
            break;
          case UserMethods.EMAIL_INVALID_MSG:
            req.flash("error", "Invalid email format");
            break;
          case UserMethods.NAME_LENGTH_FAILURE_MSG:
            req.flash("error", "Invalid username, minimum length: "+PublicSettings.USERNAME_LENGTH);
            break;
          case UserMethods.NAME_EMPTY_MSG:
            req.flash("error", "Username required");
            break;
        };
      }
      console.log("update error: errors");
      res.redirect('/profile_setting/'+req.user.username);
    } else{
      User.findOne({username:username}, function(err, doc){
        var newUser = {};
        if(err){
          console.log("Find User Error: "+err);
        } else{
          if(doc){
            if(doc.username!=req.user.username){
              req.flash('error', 'Username already exists');
              console.log("update error:already exists");
              res.redirect('/profile_setting/'+req.user.username);
            }else{
              newUser = {
                email: email.trim(),
                password: password,
                phone: phone,
                city: city,
                country: country,
                description: description
              }
            }
          }else{
            newUser = {
              username : username,
              email: email.trim(),
              password: password,
              phone: phone,
              city: city,
              country: country,
              description: description
            }
          }
          console.log("user "+newUser);
          bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
              if(err){
                console.log("update error");
                res.redirect('/profile_setting/'+req.user.username);
              }else{
                newUser.password = hash;
                var progresses = [];
                User.findByIdAndUpdate({_id:req.params.id}, newUser, function(err){
                  if(err){
                    console.log("error!!!"+err);
                    return;
                  }else{
                    console.log("update success");
                    res.redirect('/profile_setting/'+newUser.username);
                  }
                });
              }
            });
          });
        }
      });
    }
  });

  // Update reward points
  // request body sends increment of reward points to the server, then server returns
  // updated reward points
  app.put('/reward/:id', function(req, res, next){
    User.findByIdAndUpdate({_id:req.params.id}, {$inc: { rewardpoints: req.body.rewardpoints}})
    .then(function(){
      User.findOne({_id:req.params.id}).then(function(user){
        var data = {
          rewardpoints: user.rewardpoints
        }
        res.send(data);
      });
    })
    .catch(next);
  });

  // Update user's progress of a single course, request body sends coursename and new pageindex
  // Then server returns updated progress data
  // Progress: An array of {coursename:, pageindex:}
  app.put('/progress/:id', function(req, res, next){
    User.findById({_id:req.params.id})
    .then(function(user){
      var progress = user.progress; //Array of progress schema(coursename :, pageindex:)
      var coursename = req.body.coursename;
      var pageindex = req.body.pageindex;
      var courseprogress = req.body.progress;
      console.log("progress "+courseprogress);
      var length = progress.length;
      for (var i = 0; i < length; i++) {
          if(progress[i].coursename === coursename){
            progress[i].pageindex = pageindex;
            progress[i].progress = courseprogress;
          }
      }
      var data = {
        progress: progress
      };
      User.findByIdAndUpdate({_id:req.params.id}, data)
      .then(function(){
        res.send(data);
      });
    })
    .catch(next);
  });

  // Update last visited page of the user
  // Request body: coursename, pageindex, which user last visited
  // Returns: Updated lastvisit
  app.put('/lastvisit/:id', function(req, res, next){
    var lastvisit = new Progress({
      coursename: req.body.coursename,
      pageindex: req.body.pageindex
    });

    User.findByIdAndUpdate({_id:req.params.id}, {lastvisit:lastvisit})
    .then(function(){
      User.findOne({_id:req.params.id}).then(function(user){
        var data = {
          lastvisit: {
            coursename: user.lastvisit.coursename,
            pageindex: user.lastvisit.pageindex
          }
        }
        res.send(data);
      });
    })
    .catch(next);
  });


}
