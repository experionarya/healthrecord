

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var multer  =   require('multer');
var nodemailer = require('nodemailer');
var userRouter = express.Router();
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

var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname+'./../uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage});

userRouter.route('/upload_photo/:key').post(upload.single('userPhoto'),function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	console.log(req.body);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
			   
			if(decoded.userid == token.userid) {
					
			    var id = req.body.id;
			    var photo = req.file.originalname;
			    conn.query('update user_details set image=? where user_details.uid=?',[photo,id],function (err,results) {
				   	 
				   	if(err) {
				   	 	console.log(err);
				   	}

				   	else {
				   	 	  console.log(results);
				   	 	  res.send(results);
				   	}
			   	});
			}

			else {
					console.log("invalid user");
			}
	}
});

userRouter.route('/insert_user/:key').post(function (req,res) {

	var token = req.params.key;
	token=JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
			   
			if(decoded.userid == token.userid) {
		        
			    console.log("valid user");
			    var id = req.body.id1;
				var address = req.body.address1;
				var dob = req.body.dob1;
				var bg = req.body.bg1;
				var date = req.body.date;
				var height = req.body.height1;
				var weight = req.body.weight1;
				var postobj = {address:address, dob:dob ,blood_group:bg };
				var postobj1 = {uid:id ,date:date, height:height, weight:weight};
						
				conn.query('update user_details set address=?,dob=?,blood_group=? where user_details.uid=?',[address,dob,bg,id],
					function (err,results) {

						if(err) {
									console.log(err);
						}
										
						else {
								console.log(results);
							 }
				});
												
				conn.query('insert into measurements set ?',postobj1,function (err,results) {
									
					if(err) {
								console.log(err);
					}

					else {
							console.log(results);
							res.send(results);
					}
				});
			}
				
			else {
				    console.log("invalid user");
			}
	}
	
	
});


userRouter.route('/fetch_name/:key').post(function (req,res) {
        
    var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token == "") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
			   
			if(decoded.userid == token.userid) {
					
			    var uid_v = req.body.id;
				conn.query("select name,image from user_details where uid=?",[uid_v],function (err,results) {

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


userRouter.route('/add_results/:key').post(function (req,res) {


    var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token=="") {
						console.log("invalid user");
	}

	else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var uid_v = req.body.uid;
					var vitalid_v = req.body.vital_id;
					var date_v  = req.body.date;
					var type_v = req.body.type;
					var read1_v = req.body.read1;
					var read2_v = req.body.read2;
					var result_obj = {uid:uid_v,vital_id:vitalid_v,reading1:read1_v,reading2:read2_v,date:date_v};

					conn.query("insert into results set ?",result_obj,function (err,results) {

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


userRouter.route('/add_medication/:key').post(function (req,res) {

      var token = req.params.key;
	  token = JSON.parse(token);
	
	  if(token.token=="") {
						console.log("invalid user");
	  }

	  else {

		     var decoded = jwt.verify(token.token, 'arya'); 
				   
			 if(decoded.userid == token.userid) {

					var uid_v = req.body.uid;
					var date_v = req.body.date1;
					var reason_v = req.body.reason;
					var medication_v = req.body.medication;
					var dosage_v = req.body.dosage;
					var medication_obj = {uid:uid_v,date:date_v,reason:reason_v,medication:medication_v,dosage:dosage_v};
					
					
					conn.query("insert into medication set ?",medication_obj,function (err,results) {

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


userRouter.route('/add_allergy/:key').post(function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token=="") {
						console.log("invalid user");
	}

	else {

		    var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var uid_v = req.body.uid;
					var allergen = req.body.allergen;
					var allergy = req.body.allergy;
					var allergy_obj = {uid:uid_v,allergy:allergy,allergen:allergen};

					conn.query("insert into allergy set ?",allergy_obj,function (err,results) {

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


userRouter.route('/user_results/:key').post(function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token=="") {
						console.log("invalid user");
	}

	else {

		    var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var uid_v = req.body.uid;
					conn.query("select uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,type,unit,reading1,reading2,normal_range from results,vitals where results.vital_id=vitals.vital_id and results.uid=?",[uid_v],
						function (err,results) {

						    if(err) {
						          		console.log(err);
						    }
						          
							else {
								    console.log(results);
								    var results=JSON.stringify(results);
								    res.send(results);
							}
				    });
			}
		}
});


userRouter.route('/user_medication/:key').post(function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token =="") {
						console.log("invalid user");
	}

	else {

		    var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				var uid_v = req.body.uid;
				conn.query("select medication.uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,reason,medication,dosage from medication where medication.uid=?",[uid_v],
					function (err,results) {

						 if(err) {
			          				console.log(err);
			             }
			          
				          else {
					          	console.log(results);
					          	var results=JSON.stringify(results);
					          	res.send(results);
				          }
			        });
			}
		}
});


userRouter.route('/user_allergy/:key').post(function (req,res) {
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token =="") {
						console.log("invalid user");
	}

	else {

		    var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

				var uid_v = req.body.uid;
				conn.query("select allergy.uid,allergen,allergy from allergy where allergy.uid=?",[uid_v],
					function (err,results) {

						 if(err) {
			          				console.log(err);
			             }
			          
				          else {
					          	console.log(results);
					          	var results=JSON.stringify(results);
					          	res.send(results);
				          }
			        });
			}
		}
});
 userRouter.route('/reset_password/:key').put(function (req,res) {
    

            var token = req.params.key;
			token = JSON.parse(token);
	
			if(token.token=="") {
						console.log("invalid user");
			}

			else {

				   var decoded = jwt.verify(token.token, 'arya'); 
				   
				   if(decoded.userid == token.userid) {

					    var id = req.body.id1;
					    var p_word = req.body.p_word;
					    conn.query("update user set password=? where uid=?",[p_word,id],function (err,results) {

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

userRouter.route('/user_measurements/:key').post(function (req,res){
	
	var token = req.params.key;
	token = JSON.parse(token);
	
	if(token.token=="") {
						console.log("invalid user");
	}

	else {

		     var decoded = jwt.verify(token.token, 'arya'); 
				   
			 if(decoded.userid == token.userid) {

					var uid_v = req.body.uid;
					conn.query("select uid,CONCAT(EXTRACT(DAY FROM date),'/',EXTRACT(MONTH FROM date),'/',EXTRACT(YEAR FROM date)) date,height,weight from measurements where measurements.uid=?",[uid_v],
						function (err,results) {

								 if(err) {
					          				console.log(err);
					             }
					          
						          else {
							          	console.log(results);
							          	var results=JSON.stringify(results);
							          	res.send(results);
					              }
				        });
			  }
		}
});


userRouter.route('/vital_type/:key').get(function (req,res) {

     var token = req.params.key;
	 token = JSON.parse(token);
	
	 if(token.token=="") {
						console.log("invalid user");
	 }

	 else {

		    var decoded = jwt.verify(token.token, 'arya'); 
				   
		    if(decoded.userid == token.userid) {

					conn.query("select vital_id,type,unit from vitals",function (err,results) {

					if(err) {
							console.log(err);
					}

					else {
						var results=JSON.stringify(results);
						console.log(results);
						res.send(results);
					}
               });
			}
       }			
});


userRouter.route('/fetch_unit/:key').post(function (req,res) {

	 var token = req.params.key;
	 token = JSON.parse(token);
	
	 if(token.token=="") {
						console.log("invalid user");
	 }

	 else {

			var decoded = jwt.verify(token.token, 'arya'); 
				   
			if(decoded.userid == token.userid) {

					var vid = req.body.vid;
					conn.query("select unit from vitals where vital_id=?",[vid],function (err,results) {
						if(err){
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
module.exports = userRouter;