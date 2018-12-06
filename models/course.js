let mongoose = require('mongoose');
let COURSES = require('../config/PublicSettings').COURSES;
let LEVELS = require('../config/PublicSettings').LEVELS;

let courseSchema = mongoose.Schema({
  coursename: {
    type: String,
    required: true,
    unique:true
  },
  reference: {
    type: String,
    required: false
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  level: {
    type: String,
    enum: LEVELS,
    required: true
  },
  timecost: {
    type: String
  },
  popularity: {
    type: Number
  }
});

let Course = module.exports = mongoose.model('Course', courseSchema);
