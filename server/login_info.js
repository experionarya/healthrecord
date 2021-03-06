
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var nodemailer = require('nodemailer');
var loginRouter = express.Router();
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




loginRouter.route('/login').post(function (req, res) {

    
	var u_name = req.body.username;
	var pass = req.body.password;
    console.log(u_name);
    console.log("p1....."+pass);
	if(u_name == ""||pass == ""||u_name.length>20||pass.length>32) {
		
		console.log("error");
	    return false;

		var js = {
			      "status":"403",
			      "message":"Invalid entry"
			    };
		
		res.send(js);
	}

	else {

  	conn.query("select * from user where username='"+u_name+"'",function (err,rows) {

	var js = {
		      "status":"",
		      "message":"",
		      "type":null
		    };

	if(err)	 {
				console.log(err);
				return res.send(js);
    }
	
    if(rows.length > 0) {

		var data = JSON.stringify(rows);
		var json = JSON.parse(data);
		console.log("server :"+json[0].username+u_name+json[0].password+"   "+pass);

		if(u_name == json[0].username && pass == json[0].password) {
						
		    js.status = '200';
			js.message = "success";
					
			if(json[0].status == true) {
								         js.type = "admin";
			}

			else {
					js.type = "user";
					console.log(js.type);
				}
					     
					
		}
	
		else {
				js.status = '403';
				js.message = "failed";
					    
		}

		js.user_id = json[0].uid;
		var token = jwt.sign({ userid: json[0].uid}, 'arya',{expiresIn:60*10000});
		js.token = token;
		console.log(js);
		 
    }
       
    else {
        	js.status = '403';
		    js.message = "failed";
    }
		
	res.send(js);
		
	});
  }
});

loginRouter.route('/forgot_password').post(function (req,res) {
	var user_id = req.body.uid;
	console.log(user_id);
	// var password = generatePassword();
	// var p_word = (md5(password)).toString();
	var js = {"message":""};
    
    conn.query("select uid,emailid from user where username=?",[user_id],function (err,results) {


    	if(err) {
    	 	console.log(err);
    	}

    	else { 
    	 	    if(results.length==0) {
    	 
						js.message = "failed";
	    	 	       	console.log(js.message);
	    	 	       	res.send(js);
    	 	    }

    	 	    else {
    	 	    	    var data = JSON.stringify(results);
						var json = JSON.parse(data);

    	 	    		var token = jwt.sign({userid:json[0].uid},'arya',{expiresIn:60*10000});
    	 	    		var text = "http:/192.168.1.229:8081/healthrecord/forgot.html?"+token;
			    	 	sendMail(results.emailid,user_id,text);
			    	 
			    	 	js.message="success";
			    	 	res.send(js);
			    	}
    	 	}
    });
    
});

var sendMail = function(toAddress,u_name,text) {

    return new Promise(function(resolve,reject) {
         
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'health_record'
    });

    conn.connect(function(err) {

        if (!err) {
                    console.log("database connected");
                    conn.query("select emailid from user where username=?", [u_name], function(err, rows) {
                    	if(rows.length>0) {
	                    var to = rows[0].emailid;
	                    console.log(to);
	     
	                    var transporter = nodemailer.createTransport({
					        service: 'Gmail',
					        auth: {
						            user: 'healthrecord123safelife@gmail.com', // Your email id
						            pass: 'health_record@2017' // Your password
					              }   
	          			});
	                    
	                    
	                    var mailOptions = {
									        from: 'healthrecord123safelife@gmail.com',
									        to: to,
									        subject: 'New Password',
									        html:text,
									        text: text
					    				  };

					    transporter.sendMail(mailOptions, function(error, info) {

					            if(!error) {

								             console.log(info);
								             resolve();
					        	}

					        	else {
					           		 	reject();
					        	}
					    });

                       }
                    });
				 
				}
        });

    });
 }


loginRouter.route('/reset_password').put(function (req, res) {
    
    var password = req.body.newPassword;
    var token = req.body.token;
    var js = {"status":"","message":""};

    if( password.length == ""|| password.length > 32 ){

        console.log("error");
        js.status=403;
        res.send(js);
        js.message = "Password Change Failed";
        return false;
    }
    else{

        var decoded = jwt.verify(token,'arya',function(err,decoded){

            if(err){
                console.log("token expired");
                js.message = "token expired";
            }

            else {
                   conn.query('UPDATE user set password=? where uid=?',[password,decoded.userid],function(err,rows){
                    
	                    var data = JSON.stringify(rows);
	                    var json = JSON.parse(data);
	                    js.status = 200;
	                    js.message = "Password Changed Successfully";
	                    res.send(js);
                	});
            	}
        });
    }
});

module.exports = loginRouter;
