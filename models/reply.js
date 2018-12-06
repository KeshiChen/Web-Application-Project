let mongoose = require('mongoose');

let replySchema = mongoose.Schema({
  author: {
    type: String
    
},
  body: {
    type: String,
    required: true
  },
  time: {
    type: String
  
  },

  article_id:{
    type: String,
    required: true
  }
});

let Reply = module.exports = mongoose.model('Reply', replySchema);
