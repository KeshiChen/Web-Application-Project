const fs = require('fs');
let multer = require('../config/multer');
let Dataset = require('../models/dataset');
let UserData = require('../models/user');
let DatasetMethods = require('../methods/datasetMethods');
let User = UserData.User;
var csv = require("fast-csv");
var Type = require('type-of-is');

module.exports = function(app){


  // Show all the datasets on the dataset homepage
  app.get('/datasets_firstpage', function(req, res) {
    Dataset.find({}, function(err, datasets) {
      for (data in datasets){
      }
      res.render('Dataset_Homepage', {
        datasets : datasets
      });
    });
  })

  //Show users' own datasets according on users' profile
  app.get('/datasets_firstpage/checkdataset/mydataset', function(req, res) {

    Dataset.find({}, function(err, datasets) {
      res.render('mydataset', {
        datasets: datasets,
        username:req.user.username
      });
    });
  })

  //This function is to upload the dataset, the user input the dataset title, description and sumbmit the dataset file
  app.post('/datasets_firstpage/upload/:id', multer.any(), function(req, res) {
      User.findById(req.params.id, function(err, user) {

          var Author = user;
          var title = req.body.Title;
          var description = req.body.Description;
          var datatype = req.files[0].mimetype;
          var msg = [];
          msg.push.apply(msg, DatasetMethods.validateTitle(title));
          msg.push.apply(msg, DatasetMethods.validateDescription(description));
          msg.push.apply(msg, DatasetMethods.validateType(datatype));
          console.log(msg);
          if(msg.length>0){
            for(var i=0; i<msg.length; i++){
              switch(msg[i]){
                case DatasetMethods.TITLE_EMPTY_MSG:
                  req.flash('error', 'Title is empty');
                  break;
                case DatasetMethods.TITLE_TAKEN_MSG:
                  break;
                case DatasetMethods.TYPE_INVALID_MSG:
                  req.flash('error', 'Invalid data type');
                  break;
                case DatasetMethods.DES_EMPTY_MSG:
                  req.flash('error', 'Description is empty')
                  break;
              };
            }
            res.redirect('/datasets_firstpage');
          } else{
            Dataset.findOne({title: title}, function(err, doc){
              if(err){
                console.log("Find Dataset Error: "+err);
              } else{
                if(doc){
                  req.flash('error', 'Dataset name already exists');
                  //console.log('9');
                  res.redirect('/datasets_firstpage');
                } else{
                  //console.log('10');
                  var date = (Date.now()).toString().substr(0, Date.now().length-3);
                  var uname = req.user.username;
                  var filename = uname+date+req.files[0].originalname;
                  var datasetSize = Math.ceil(req.files[0].size * 0.00098) + "KB";
                  console.log(datasetSize);
                  var datasetPath = __dirname + "/" + req.files[0].path;
                  console.log(description);
                  let newDataset = new Dataset({
                    title: title,
                    Description: description,
                    author: Author,
                    filename : filename,
                    datatype : datatype,
                    datasetSize : datasetSize,
                    datasetPath : datasetPath
                  });
                  newDataset.save(function(err){
                    if (err) { console.log("Error:" + err);req.flash("error", "Dataset Uploaded"); res.redirect("")}
                    else {
                      req.user.rewardpoints = req.user.rewardpoints + 1
                      req.user.save()
                      req.flash("success", "Dataset Uploaded");
                      res.redirect('/datasets_firstpage')
                     }
                  });
                }
              }
            });
          }
    })

  }
)

  //This function is to show the detail of the dataset while the user click the dataset link
  //The details shown including dataset title, dataset description, dataset size, the name of the one who upload the dataset
  //Also this function will parse the dataset uploaded and show all the columns and first 50 rows of the dataset
  app.get('/datasets_firstpage/checkdataset/:id',function(req, res) {
    Dataset.findById(req.params.id, function(err, dataset) {
      var datasetPath = dataset.filename;
      var index = 1;
      var row = [];
      var rows = [];
      var title_list = []
      var loop = 0
      csv.fromPath("./upload/" + datasetPath,{headers : true})
          .on("data", function(data){

            if (loop == 0){
              for (element in data){
                title_list.push(element);}}
            loop = loop + 1 ;
            row = []
            for (element in data){

              row.push(data[element])

            }

            rows.push(row)

          })
          .on("end", function(){
              res.render("Dataset_Detail",{dataset : rows.slice(0,50),title : title_list,datasetdetail : dataset,datasetid:req.params.id})

          });
    })
  })

  // This funciton is to delete the datasets and only the user can only delete their own dataset
  app.delete('/datasets_firstpage/checkdataset/:id', function(req, res) {
    let query = { _id: req.params.id };

    Dataset.remove(query, function(err) {
      if (err) {
        console.log(err);
      }

      res.send('Success');
    })
  })

 // This function is to download the corresponding dataset when user click the download link of dataset
  app.post('/download', function(req, res){
  console.log(req.body.datasetpath);
  req.user.rewardpoints = req.user.rewardpoints - 1
  req.user.save()
  var datasetpath = req.body.datasetpath
  datasetpath  = datasetpath.replace("controllers/", "");
  res.download(datasetpath);
});



}
