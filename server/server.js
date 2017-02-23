

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var nodemailer = require('nodemailer');
var admin = require('./admin.js');
var user = require('./user.js');
var login = require('./login_info.js')
var conn = mysql.createConnection({
	                               host:"localhost",
	                               user:"root",
	                               password:"admin",
	                               database:"health_record"
	                             });
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/healthrecord',express.static(__dirname+'./../'));
app.use('/',admin);
app.use('/',user);
app.use('/',login);
var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Listening at %s on port %s", host, port);
});



