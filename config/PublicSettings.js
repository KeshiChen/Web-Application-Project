const COURSES = [
  "Data Science Introduction",
  "Python Programming Skills",
  "Linear Regression",
  "Linear Classification",
  "Tree Learning",
  "SVM Classification",
  "Perceptron",
  "Neural Network"];
const LEVELS = [
  "Basic",
  "Intermediate",
  "Advanced"
];

var makeid = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
module.exports = {
  COURSES: COURSES,
  USERNAME_LENGTH: 1,
  PASSWORD_LENGTH: 6,
  HOST: 'http://localhost:5000',
  makeid: makeid,
}
