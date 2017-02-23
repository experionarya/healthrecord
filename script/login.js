
$(function() {
 
                if (localStorage.chkbx && localStorage.chkbx != '') {
                    $('#remember_me').attr('checked', 'checked');
                    $('#username').val(localStorage.username);
                    $('#password').val(localStorage.pass);
                } else {
                    $('#remember_me').removeAttr('checked');
                    $('#username').val('');
                    $('#password').val('');
                }
 
                $('#remember_me').click(function() {
 
                    if ($('#remember_me').is(':checked')) {
                        // save username and password
                        localStorage.username = $('#username').val();
                        localStorage.pass = $('#password').val();
                        localStorage.chkbx = $('#remember_me').val();
                    } else {
                        localStorage.username = '';
                        localStorage.pass = '';
                        localStorage.chkbx = '';
                    }
                });
            });



function load() {

	var httpObj = new XMLHttpRequest();
	httpObj.onreadystatechange = function() {
		
		if(this.readyState == 4 && this.status == 200) {

			var result = this.responseText;
			result = JSON.parse(result);
			console.log(result.type);
			localStorage.setItem('type',result.type);

			if(result.type == "admin") {
			 	
			 	localStorage.setItem('token',result.token);
				localStorage.setItem('userid',result.user_id);
				alert("login successfull");
				window.location = "admin_user.html";
			}

			else if(result.type == "user") {
				
				localStorage.setItem('token',result.token);
				localStorage.setItem('userid',result.user_id);
				alert("login successfull");
				window.location = "user_home.html";
			}
			
			else {
					
					alert("login failed");
				}
		}

		if(this.status == 403) {
			alert("invalid entry");
		}
	};

	var p_word = document.getElementById("password").value;
	console.log(p_word);

	var password = (Crypto.MD5(p_word)).toString();
	console.log(password);
	
	httpObj.open('POST','http://192.168.1.229:8081/login',true);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.send('username='+escape(document.getElementById("username").value)+'&password='+password);
}


function validate() {

	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	 
	if(username ==''&& password =='') {
		alert("Enter your username and password");
		return false;
	}

	else if(username =='') {
		alert("Enter your username");
		return false;
	}

	else if(password =='') {
		alert("Enter your password");
		return false;
	}

	else {
		load();
	}

}

function forgot_password(userid) {

	// var userid = escape(prompt("Please enter your username..New password will be sent to your emailid.."));
	var httpObj = new XMLHttpRequest();

   	httpObj.onreadystatechange=function() {
  
   		if(this.readyState == 4 && this.status == 200) {

	        // alert("added successfully");
	        // window.location="user_entry.html";
	        var result=this.responseText;
	        console.log(result);
			result=JSON.parse(result);
			if(result.message=="success") {
				alert("A link has been sent to your email id");
			}

			else if(result.message=="failed"){
				alert("Invalid username");
			}

      	} 
  	}

  httpObj.open('POST','http://192.168.1.229:8081/forgot_password',true);
  httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  httpObj.send('uid='+userid);
}

function validate_forgot_password() {

	var userid = escape(prompt("Please enter your username..Password reset link will be sent to your emailid.."));

	if(userid=="") {
		alert("Enter a valid username");
		return false;
	}
	else {
			forgot_password(userid);
	}
}





