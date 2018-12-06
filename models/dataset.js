let mongoose = require('mongoose');

let datasetSchema = mongoose.Schema({
  author: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: false
  },
  filename :{
    type : String,
    required: false
  },
  datatype : {
    type : String,
    required : false
  },
  datasetSize:{
    type: String,
    required: false

  },

  datasetPath:{
    type : String,
    required : false
  }


});

let dataset = module.exports = mongoose.model('Dataset', datasetSchema);
