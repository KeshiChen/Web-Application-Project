var multer=require('multer');

var storage = multer.diskStorage({

    //define the path of dataset upload

    destination: function (req, file, cb) {

        cb(null, './upload')

    },

    //rename the path of path

    filename: function (req, file, cb) {
        var date = (Date.now()).toString().substr(0, Date.now().length-3);
        var uname = req.user.username;
        var rename = uname+date+file.originalname;
        cb(null, rename);

    }

});

//添加配置文件到muler对象。

var upload = multer({

    storage: storage

});


module.exports = upload;
