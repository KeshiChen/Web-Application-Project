let mongoose = require('mongoose');

let mcqSchema = mongoose.Schema({
  options: { // MCQ options
    type: String // text
  },
  question: {
    type: String
  },
  images: { // corresponding images
    type: String // url of images
  },
  solution: { // solution(s) of MCQ or blank
    type: String
  },
  reward: {
    type: Number
  }
});

let pageSchema = mongoose.Schema({
  coursename: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  pagetype: {
    type: String, // lecture, MCQ, blank, code
    default: "lecture"
  },
  title: {
    type: String
  },
  description:{
    type: String
  },
  content: { // Main text of the page
    type: String,
    default: "Add content"
  },
  image: {
    type: String // url of image of the content
  },
  mcq: mcqSchema // schema of MCQ and blank-filling quizes
});

pageSchema.index({ coursename: 1, index: 1}, {unique: true});

let CoursePage = mongoose.model('CoursePage', pageSchema);
let MCQSchema = mongoose.model('MCQSchema', mcqSchema);
let Page = module.exports = {
  CoursePage: CoursePage,
  mcqSchema: MCQSchema
};
