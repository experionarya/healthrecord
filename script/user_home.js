
var get_token = localStorage.getItem('token');
var get_id = localStorage.getItem('userid');
var get_type = localStorage.getItem('type');

var key = {
             'token':get_token,
             'userid':get_id,
          };

key = JSON.stringify(key);

if(get_token == null || get_id == null || get_type == 'admin') {
  window.location="index.html";
}

$(document).ready(function(){
    $("#p2").click(function(){
    	
        $("#div5").show();
    });
   
});

var httpObj = new  XMLHttpRequest();
httpObj.onreadystatechange = function() {
  
  if(this.readyState == 4 && this.status == 200) {
        var result = this.responseText;
        result = JSON.parse(result);
        document.getElementById("fetch_name").innerHTML = result[0].name;
        document.getElementById("p1").innerHTML = "Welcome      "+result[0].name;
        var content="<img id='pics'src='uploads/"+result[0].image+"'>";
        document.getElementById('dp').innerHTML=content;
    } 
}

httpObj.open('POST','http://192.168.1.229:8081/fetch_name/'+key,true);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send('id='+get_id);

 
function user_insertion() {

  var httpObj = new	XMLHttpRequest();
  httpObj.onreadystatechange = function() {

  	if(this.readyState == 4 && this.status == 200) {
          var result=this.responseText;
          result=JSON.parse(result);
          alert("details added successfully");
          window.location="user_home.html";
  		    console.log("inserted successfully");
  	}	
  }

  var address = document.getElementById("address").value;
  var dob = document.getElementById("dob").value;
  var newdob = dob.split("-").reverse().join("-");
  // console.log(myDate);
  var bg = document.getElementById("bg").value;
  var date = document.getElementById("date").value;
  var newdate = date.split("-").reverse().join("-");
  var height = document.getElementById("height").value;
  var hid = document.getElementById("hid").value;
  var weight = document.getElementById("weight").value;
  var wid = document.getElementById("wid").value;
  var height = height+''+hid;
  var weight = weight+''+wid;

  httpObj.open('POST','http://192.168.1.229:8081/insert_user/'+key,true);
  httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  httpObj.send('id1='+get_id+'&address1='+address+'&dob1='+newdob+'&bg1='+encodeURIComponent(bg)+'&date='+newdate+'&height1='+height+'&weight1='+weight);
}


function validate_user_entry() {

  var address = document.getElementById("address").value;
  var dob = document.getElementById("dob").value;
  var regdate =  /^[0-3]?[0-9]\-[01]?[0-9]\-[12][90][0-9][0-9]$/;
  var bg = document.getElementById("bg").value;
  var date = document.getElementById("date").value;
  var height = document.getElementById("height").value;
  var hid = document.getElementById("hid").value;
  var weight = document.getElementById("weight").value;
  var wid = document.getElementById("wid").value;

    if(address =="" && dob =="" && bg =="" && p_word =="" &&  date =="" && height =="" && hid =="" && weight =="" && wid =="") {
      alert("Enter essential credential");
      return false;
    }

    else if(address =="" ) {
      alert("Enter a valid address");
      return false;
    }

    else if(dob =="" ||dob.search(regdate)==-1) {
        alert("Not a valid dob");
        return false;
    }

    else if(bg =="" ){
      alert("Enter a valid blood group");
      return false;
    }

    else if(date =="" ) {
        alert("Select the date");
        return false;
    }

    else if(weight =="" || isNaN(weight)) {
      alert("Enter a valid weight");
      return false;
    }
    
    else if(height =="" || isNaN(height)) {
      alert("Enter a valid height");
      return false;
    }

    else {
          user_insertion();
    }
}


function reset_password() {

  var httpObj = new XMLHttpRequest();
  httpObj.onreadystatechange = function() {

    if(this.readyState == 4 && this.status == 200) {
          var result = this.responseText;
          result = JSON.parse(result);
          alert("Password changed Successfully");
          window.location="user_home.html";
          
    }  
  }
  
  var old_p = document.getElementById("p_word").value;
  var new_p = document.getElementById("p_word1").value;
  var confirm_p = document.getElementById("p_word2").value;
  
  if (old_p == "" || new_p == "" || confirm_p == "") {
            alert('Please fill all the details');
  }

  else if (old_p == new_p) {
            alert("Old password and New Password cannot be same");
  }
        
  else if (new_p != confirm_p) {
            alert("password mismatch");
  }

  else {
        new_p = (Crypto.MD5(new_p)).toString();
  
        httpObj.open('PUT','http://192.168.1.229:8081/reset_password/'+key,true);
        httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
        httpObj.send('id1='+get_id+'&p_word='+new_p);
  }

}


function password() {

  var modal = document.getElementById('myModal');
  var btn = document.getElementById("reset");
  var span = document.getElementsByClassName("close")[0];
  btn.onclick = function() {
      modal.style.display = "block";
  }

  span.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
             modal.style.display = "none";
      }
  }
}


function fileupload() {

   var httpObj = new XMLHttpRequest();

    httpObj.onreadystatechange = function() {
      
      if(this.readyState == 4 && this.status == 200) {
            var result = this.responseText;
          result = JSON.parse(result);
          alert("Photo uploaded Successfully");
              location.reload();

      } 
    }

    var formData = new FormData(document.getElementById('uploadForm'));
    formData.append('id',get_id);
    httpObj.open('POST','http://192.168.1.229:8081/upload_photo/'+key,true);
    // httpObj.setRequestHeader('content-type','multipart/form-data');
    httpObj.send(formData);
    return false;

}

function log_out() {

    if(confirm("Are you sure you want to logout?")) {
       
       localStorage.removeItem('token');
       localStorage.removeItem('userid');
       localStorage.removeItem('type');
       window.location = "index.html";
       return true;
    }

    else {
      return false;
    }

}

