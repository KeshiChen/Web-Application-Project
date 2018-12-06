let mongoose = require('mongoose');
let COURSES = require('../config/PublicSettings').COURSES;


let progressSchema = mongoose.Schema({
  coursename: {
    type: String,
    required: true
  },
  pageindex: {
    type: Number,
    required: true,
    default: 1
  },
  progress:{
    type: Number,
    default: 0
  }
});

let userSchema = mongoose.Schema({
  userpicture: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone:{
    type: Number,
    default: 0400000000
  },
  city:{
    type: String,
    default: "Sydney"
  },
  country:{
    type: String,
    default: "Australia"
  },
  description:{
    type: String,
    default: "Hello, I love data!"
  },
  rewardpoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number
  },
  portrait:{
    type: String,
    default: "/assets/images/default_portrait.png"
  },
  progress: [progressSchema],
  lastvisit: progressSchema,
  admin: {
    type: Boolean,
    default: false
  }
});


let Progress = mongoose.model('Progress', progressSchema);
let User = mongoose.model('User', userSchema);
let UserData = module.exports = {
  Progress: Progress,
  User: User
}
