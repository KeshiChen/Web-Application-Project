const PublicSettings = require('../config/PublicSettings');

var UserMethods = {
  SUCCESS_MSG: 0,
  NAME_LENGTH_FAILURE_MSG: 1,
  NAME_EMPTY_MSG: 2,
  NAME_TAKEN_MSG: 3,
  EMAIL_INVALID_MSG: 4,
  EMAIL_EMPTY_MSG: 5,
  PASSWORD_LENGTH_FAILURE_MSG: 6,
  PASSWORD_UNMATCH_MSG: 7,
  PASSWORD_INVALID_MSG:8,
  PASSWORD_EMPTY_MSG:9,
  TEL_INVALID_MSG:10,
  validateUsername: function(username){
    username = username.trim();
    var msg = [];
    if(username === ''||typeof(username) == 'undefined'){
      msg.push(this.NAME_EMPTY_MSG);
    }else if(username.length < PublicSettings.USERNAME_LENGTH){
      msg.push(this.NAME_LENGTH_FAILURE_MSG);
    }
    return msg;
  },
  validateEmail: function(email){
    email = email.trim();
    var msg = [];
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email === ''||typeof(email) == 'undefined'){
      msg.push(this.EMAIL_EMPTY_MSG);
    }else if(!re.test(email)){
      console.log("email validation failed")
      msg.push(this.EMAIL_INVALID_MSG);
    }
    return msg;
  },
  validatePassword: function(password, confirm){
    var msg = [];
    console.log(typeof(password));
    if(password === ''||typeof(password) == 'undefined'){
      msg.push(this.PASSWORD_EMPTY_MSG);
      console.log("password: " + password);
    } else if(password.trim() !== password){
      msg.push(this.PASSWORD_INVALID_MSG);
    } else if(password.length < PublicSettings.PASSWORD_LENGTH){
      msg.push(this.PASSWORD_LENGTH_FAILURE_MSG);
    } else if(password !== confirm){
      msg.push(this.PASSWORD_UNMATCH_MSG);
    }
    return msg;
  },
  validatePhoneNumber: function(phone){
    var msg = [];
    if(phone !== '' && typeof(phone) != 'undefined'){
      var isnum = /^\d+$/.test(phone);
      if(!isnum){
        msg.push(this.TEL_INVALID_MSG);
      }
    }
    return msg;
  }
};

module.exports = UserMethods;
