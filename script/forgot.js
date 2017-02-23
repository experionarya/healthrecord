

function validate_password() {

	var newPassword = document.getElementById("p_word1").value;
	var confirmPassword = document.getElementById("p_word2").value;
	var passreg = newPassword.match(/^.*(?=.{7,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/);

	if(newPassword=="" && confirmPassword=="") {
		 alert("Enter all the feilds");
		 return false;
	}

	else if(newPassword!=confirmPassword) {
		 alert("Password mismatch");
		 window.location="forgot.html";
		 return false;
	}
    else if(passreg==null || newPassword.length<7) {
         alert("password is not strong (should contain atleast 7 characters including a special character,an uppercase letter and a number)");
         window.location="forgot.html";
         return false;
    }

	else {  
		   newPassword = (Crypto.MD5(newPassword)).toString();
		   forgot_password(newPassword);
	}
}

function forgot_password(newPassword) {

	var httpObj = new XMLHttpRequest();

   	httpObj.onreadystatechange = function() {
  
   		if(this.readyState == 4 && this.status == 200) {

   			var result = this.responseText;
	        console.log(result);
			result = JSON.parse(result);
			
			if (result.message == "Password Change Failed") {

				alert("Wrong Password..Password change failed");
				window.location = "forgot.html";
			} 

			else if (result.message == "Password Changed Successfully") {

			 	alert("Password is changed successfully");
			 	window.location = "index.html";
			}
		} 
  	}

  	var split = window.location.href.split("?");
    var token = split[1];
  
  	httpObj.open('PUT','http://192.168.1.229:8081/reset_password',true);
  	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  	httpObj.send('token='+token+'&newPassword='+newPassword);
}



