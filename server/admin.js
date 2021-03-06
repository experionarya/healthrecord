

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var nodemailer = require('nodemailer');
var adminRouter = express.Router();
var conn=mysql.createConnection({
	                              host:"localhost",
	                              user:"root",
	                              password:"admin",
	                              database:"health_record"
	                            });
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var sendMail = function(toAddress,u_name,password) {

    return new Promise(function(resolve,reject){
         
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
	                    var to = rows[0].emailid;
	                    console.log(to);
	     
	                    var transporter = nodemailer.createTransport({
					        service: 'Gmail',
					        auth: {
						            user: 'healthrecord123safelife@gmail.com', // Your email id
						            pass: 'health_record@2017' // Your password
					              }   
	          			});

	                    var text = 'your username and password is successfull generated. username is '+u_name+' password is '+password;

					    var mailOptions = {
									        from: 'healthrecord123safelife@gmail.com',
									        to: to,
									        subject: 'Your username and Password',
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

                    });

                }
        });

    });
}

adminRouter.route('/insert/:key').post(function(req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token =="") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {
				console.log(req.body);
				var name = req.body.name1;
				console.log("name is:"+name);
				var email = req.body.email1;
				console.log("email is:"+email);
				var age = req.body.age1;
				var gender = req.body.gender1;
				var location = req.body.location1;
				var num = req.body.num1;
				var password = generatePassword();
				var p_word = (md5(password)).toString();
			
				var new_name = name.replace(/\s/g, "");
				var u_name = new_name+''+age;

				function generatePassword() {
					    
					var length = 8,
					charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$&%",
					retVal = "";
					length = Math.random() * (15 - 7) + 7;
					for (var i = 0, n = charset.length; i < length; ++i) {
						retVal += charset.charAt(Math.floor(Math.random() * n));
					}

						return retVal;
				}
						
				if(name ==''||age ==''||location ==''||num =='') {

					console.log("error");
					var js = {
					        	"status":"403",
					            "message":"Invalid entry"
					         };
					res.send(js);
					return false;
				}

				else {
                        console.log("hiiiiii:"+p_word);
					    conn.query ("insert into user (username,emailid,password) values('"+u_name+"','"+email+"','"+p_word+"')",
					        function(err,results) {

								if(err) {
										 	console.log(err);
										}

								else {
										//sendMail(email,u_name,password);
									    var user_obj = {uid : results.insertId,name :name, age : age, gender : gender, location : location, contact_no : parseInt(num)};
									    var query = "insert into user_details set ?";
										conn.query (query,[user_obj],function (err, results) {

					                        if(err) {
														console.log(err);
													}

											else {
																		
													res.send(js);
													console.log(results);
												}
										});
									}
						});
				}
			}
		}
});


adminRouter.route('/remove/:key').delete(function (req,res) {
			

	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var id = req.body.uid;
					conn.query("delete from user where uid=?",[id],function (err,results) {

						if(err) {
									console.log(err);
						}

						else {
								console.log(results);
								res.send(results);
					    }
					});
			}
		}
});


adminRouter.route('/addvitals/:key').post(function (req,res) {
    

    var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var vital_type = req.body.v_type;
					var vital_unit = req.body.v_unit;
					var vital_nr = req.body.v_nr;
					var postobj = {type:vital_type,unit:vital_unit,normal_range:vital_nr};
					conn.query("insert into vitals set ?",postobj,function (err,results) {

						if(err) {
									console.log(err);
						}

						else {
								console.log(results);
								res.send(results);
						}
					});
			}
		}
});


adminRouter.route('/getvitals/:key').get(function (req,res) {
	
    var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {
				    
				var v_id = req.body.vitalid;
				conn.query("select vital_id,type,unit,normal_range from vitals",function (err,results) {

				   	if(err) {
				   	  			console.log(err);
				   	}

				   	else {
					   	  	console.log(results);
					   	  	var results = JSON.stringify(results);
					   	  	res.send(results);

				   	    }
				});
			}
		}
});


adminRouter.route('/removevitals/:key').delete(function (req,res) {

	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				 var v_id = req.body.vitalid;
				 conn.query("delete from  vitals where vital_id=?",[v_id],function (err,results) {

						if(err) {
								console.log(err);
						}

						else {
								console.log(results);
								res.send(results);
						}
					});
			}
		}	 
});


adminRouter.route('/user_details/:key').get(function (req,res) {


    var token = req.params.key;
	token = JSON.parse(token);

	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {
				conn.query("select uid,name,age,gender,CONCAT(EXTRACT(DAY FROM dob),'/',EXTRACT(MONTH FROM dob),'/',EXTRACT(YEAR FROM dob)) dob,blood_group,address,location,contact_no from user_details",function (err,results) {
					
			      if(err) {
			      			console.log(err);
			      }

			      else {
			      		console.log(results);
			      		var results = JSON.stringify(results);
						res.send(results);
			        }
				});
			}
		}
});




adminRouter.route('/more_results/:uid/:key').get(function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	console.log(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				var uid_v = req.params.uid;
				conn.query("select uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,type,unit,reading1,reading2,normal_range from results,vitals where results.vital_id=vitals.vital_id and results.uid=?",[uid_v],
					function (err,results) {
						
						if(err) {
									console.log(err);
						}

						else {
								console.log(results);
				           		var results = JSON.stringify(results);
				          		res.send(results);
						}
					});
			}
		}
});


adminRouter.route('/medication/:uid/:key').get(function (req,res) {
	

	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token=="") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				var uid_v = req.params.uid;
				conn.query("select uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,reason,medication,dosage from medication where medication.uid=?",[uid_v],
					function (err,results) {

						if(err) {
			          	     		console.log(err);
			            }
			          
			            else {
					          	console.log(results);
					          	var results = JSON.stringify(results);
					          	res.send(results);
			            }
			     });
			}
		}
});



adminRouter.route('/measurements/:uid/:key').get(function (req,res) {

	var token = req.params.key;
	token=JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var uid_v = req.params.uid;
					conn.query("select uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,height,weight from measurements where measurements.uid=?",[uid_v],function (err,results) {
					
							if(err) {
				          	    		console.log(err);
				            }
				          
				            else {
						          	console.log(results);
						          	var results = JSON.stringify(results);
						          	res.send(results);
				            }
				      });
			 }
		}
});


adminRouter.route('/allergy/:uid/:key').get(function (req,res) {

	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				var uid_v = req.params.uid;
				conn.query("select allergy.uid,name,allergen,allergy from user_details,allergy where user_details.uid=allergy.uid and allergy.uid=?",[uid_v],function (err,results) {
				
						if(err) {
			          			  console.log(err);
			            }
			          
			            else {
					          	console.log(results);
					          	var results = JSON.stringify(results);
					          	res.send(results);
			            }
			      });
			}
		}
});


module.exports = adminRouter;
