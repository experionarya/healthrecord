

var express =   require("express");
var bodyParser = require('body-parser');
var multer  =   require('multer');
var app     =   express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname+'./../uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage});

// app.get('/',function(req,res){
//       res.sendFile(__dirname + "/file_upload.html");
// });

app.post('/upload',upload.single('userPhoto'),function(req,res){
  console.log("hjjjj");
   var photo=req.file;
   console.log(photo);
    
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});