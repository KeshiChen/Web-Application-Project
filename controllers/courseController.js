// Import model schemas needed by the controller
let Course = require('../models/course');
let Page = require('../models/coursePage');
let Article = require('../models/article');
let UserData = require('../models/user');
let User = UserData.User;

module.exports = function(app) {
  // Let frontend be able to access home page of courses
  // response: Jump to home page of courses with a list of all courses
  app.get('/courses', function(req, res) {
    Course.find({}, function(err, courses) {
      res.render('Course_Homepage', {
        courses: courses
      });
    });
  });

  app.get('/', function(req, res) {
    Course.find({}, function(err, courses) {
      res.render('Homepage', {
        courses: courses
      });
    });
  });


  // search function (input format: form and get query, keyword and tags)
  // Search courses by level, then jump to result page
  app.get('/Course_Search/:level', function(req,res){
    var tags= req.params.level;
    Course.find({level: tags}, function(err, courses) {
       res.render('Course_Search', {courses:courses});
    });
  });

  // Search courses by keyword, level, category or tags, based on what user inputs
  // then jump to result page
  app.post('/Course_Search', function(req,res){
       console.log(req.body);
       if (req.body.keyword){
          var keyword= req.body.keyword;

          var regexp = new RegExp(keyword, "i");

          Course.find({description:regexp}, function(err, courses) {
           res.render('Course_Search', {courses:courses});
        });
      }

      else {
        var tags= req.body.tags;
        var category= req.body.category;
        var level= req.body.level;

        var query={};

        if (tags=="0" && level=="0" && category=="0"){
          query={};
        } else if (category=="0" && tags=="0"){
          query={"level": level};
        } else if (category=="0" && level=="0"){
          query={"tags": tags};
        } else if (tags=="0" && level=="0"){
          query={"category": category};
        } else if (tags=="0"){
          query={"category": category, "level":level};
        } else if (level=="0"){
          query={"category": category, "tags":tags};
        } else if (category=="0"){
          query={"level": level, "tags":tags};
        } else {
          query={"level": level, "tags":tags, "category":category};
        }

        Course.find(query, function(err, courses) {

         res.render('Course_Search', {courses:courses});
      });



      }


  });

  // Get the page count of a course
  app.get('/pagecount/:coursename', function(req, res){
    Page.CoursePage.count({coursename: req.params.coursename}, function(err, count){
      if(err){
        console.log(err);
      } else{
        res.json({pagecount:count});
      }
    });
  });

  // Go to selected course page
  // Find the course and all content of it by course name and jump to the course page
  app.get('/courses/:name', function(req, res) {
    Course.find({coursename: req.params.name}, function(err, course) {
      Page.CoursePage.find({coursename: req.params.name}, function(err, pages){
        if(err){
          console.log(err);
          render('/courses');
        }else{
          if(pages.length){
            Article.find({coursename: req.params.name, com_type: "course"}, function(err, articles){
              var data = {
                course: course,
                pages: pages,
                articles: articles
              };
              res.render('Course_Detail', {
                data: data
              });
            });
          }else{
            res.redirect("/courses/Machine Learning");
          }
        }
      });
    });
  });

  // Access the course editor tool
  app.get('/editor', function(req, res) {
      res.render('Course_Create');
  });

  // Generate a course from the form frontend submitted, save it into Mongodb
  app.post('/courses', function(req, res) {
    var data_course = {
      coursename: req.body.coursename,
      reference: req.body.reference,
      description:req.body.description,
      level: req.body.level,
      image:req.body.image
    }
    let course = new Course(data_course);
    course.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        User.update({username:req.user.username}, {$inc: { rewardpoints: 10}}, function(err){
          res.redirect('/');
        });

      };
    });
  });

  // Create one page of a course from the form frontend submitted, save it into Mongodb
  app.post('/pages', function(req, res) {
    var data_page = {
      coursename: req.body.coursename,
      index: req.body.index,
      pagetype: req.body.pagetype,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      mcq: {
        options: req.body.options,
        question: req.body.question,
        solution: req.body.solution,
        reward: req.body.reward
      }
    };
    let page = new Page.CoursePage(data_page);
    page.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.redirect('/');
      };
    });
  });

  // Update a course from the form frontend submitted, save it into Mongodb
  app.put('/pages', function(req, res) {
    let query = { coursename: req.body.querycoursename, index: req.body.queryindex}
    Page.CoursePage.updateOne(query, {$set: req.body}, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        //console.log(data);
        res.redirect('/');
      }
    });
  });

  // Upgrade content of a course from the form frontend submitted, save it into Mongodb
  app.put('/courses', function(req, res) {
    let query = { coursename: req.body.coursename }
    var data = {
      coursename: req.body.newcoursename,
      reference: req.body.reference
    }
    Course.update(query, data, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.redirect('/');
      }
    });
  })

}
