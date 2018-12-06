const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const app = express();
const { check, validationResult } = require('express-validator/check');

//Initial setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//mongoose.connect("mongodb://localhost/nodejs-blog");
mongoose.connect(config.database, { useNewUrlParser: true })
let db = mongoose.connection;
db.once('open', function() {
  console.log('Connected to Mongodb');
})
db.on('error', function(err) {
  console.log(err);
});
app.listen(5000, function() {
  console.log("Server started on port 5000...");
})



// Input Different cotroller
var communityController = require('./controllers/communityController');
var courseController = require('./controllers/courseController');
var userController = require('./controllers/userController');
var datasetsController = require('./controllers/datasetsController');
var replyController = require('./controllers/replyController');
var profileController = require('./controllers/profileController');

communityController(app);
courseController(app);
userController(app);
datasetsController(app);
replyController(app);
profileController(app);
