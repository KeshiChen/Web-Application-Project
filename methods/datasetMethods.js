var datasetMethods = {
  SUCCESS_MSG: 0,
  TITLE_LENGTH_FAILURE_MSG: 1,
  TITLE_EMPTY_MSG: 2,
  TITLE_TAKEN_MSG: 3,
  TYPE_INVALID_MSG: 4,
  DES_EMPTY_MSG: 5,
  validateTitle: function(title){
    title = title.trim();
    var msg = [];
    if(title === ''||typeof(title) == 'undefined'){
      msg.push(this.TITLE_EMPTY_MSG);
    }
    return msg;
  },
  validateType: function(mimetype){
    var msg = [];
    if(mimetype != "application/vnd.ms-excel" && mimetype != "text/csv"){
      msg.push(this.TYPE_INVALID_MSG);
    }
    return msg;
  },
  validateDescription: function(description){
    var msg = [];
    if(description === ''||typeof(description) == 'undefined'){
      msg.push(this.DES_EMPTY_MSG);
    }
    return msg;
  }
};

module.exports = datasetMethods;
