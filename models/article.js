let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
},
  body: {
    type: String,
    required: true
  },
  popular: {
    type: Number,
    default: 0

  },
  com_type: {
    type: String

  },
  time: {
    type: String,
    required: true
  },
  coursename: {
    type: String
  },
  coursepage: {
    type: String
  },
  datasetid:{
    type: String
  },
  replycount: {
    type: Number,
    default: 0

  },
  month: {
    type: String
  },
  day: {
    type: String
  },
  reply_count: {
    type: Number,
    default: 0
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
