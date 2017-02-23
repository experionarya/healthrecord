

var get_token = localStorage.getItem('token');
var get_id = localStorage.getItem('userid');
var get_type = localStorage.getItem('type');

var key = {
             'token':get_token,
             'userid':get_id,
          };

key = JSON.stringify(key);

if(get_token == null || get_id == null ||get_type == 'admin') {
  window.location = "index.html";
}



$(document).ready(function() {
    
    $("#p2").click(function() {
    	  $("#div5").hide();
        $("#div6").hide();
        $("#div4").show();
    });
   
    $("#p3").click(function() {
    	  $("#div4").hide();
        $("#div6").hide();
        $("#div5").show();
        
    });

    $("#p8").click(function() {
        $("#div4").hide();
        $("#div5").hide();
        $("#div6").show();
        
    });
    
});


var httpObj = new XMLHttpRequest();
httpObj.onreadystatechange = function() {
  
  if(this.readyState == 4 && this.status == 200) {
     
     var result = this.responseText;
     result = JSON.parse(result);
     var html = ""; 

     result.forEach(function (element) {
        
        html += "<option value='"+element.vital_id+"'>"+element.type+"</option>";
 
     });

     document.getElementById('type').innerHTML = html;
     fetch_unit();
   
  }
}

httpObj.open('GET','http://192.168.1.229:8081/vital_type/'+key,true);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send("");


function validate_results() {

  var date = document.getElementById("date1").value;
  var type = document.getElementById("type").value;
  var unit = document.getElementById("unit").value;
  var read1 = document.getElementById("read1").value;
  var read2 = document.getElementById("read2").value;
  var regdate =  /^[0-3]?[0-9]\-[01]?[0-9]\-[12][90][0-9][0-9]$/;

  if(date == "" && type == "" && unit == "" && read1 == "" && read2 == "") {

         alert("Enter essential credential");
         return false;
  }
  
  else if(date == "" || date.search(regdate)==-1) {

         alert("Invalid date format");
         return false;
  }

  else if(read1 == "" ||isNaN(read1)) {

          alert("Enter a valid reading ");
          return false;
  }

  else if(read2 =="" ||isNaN(read2)) {

          alert("Enter a valid reading ");
          return false;
  }

  else {

         add_results();
    }

}

function add_results() {

   var get_id = localStorage.getItem('userid');
   var httpObj = new XMLHttpRequest();

   httpObj.onreadystatechange=function() {
  
   if(this.readyState == 4 && this.status == 200) {

        alert("added successfully");
        window.location="user_entry.html";
      } 
  }

  var select = document.getElementById("type");
  var vitalid = select.options[select.selectedIndex].value;
  var date = document.getElementById("date1").value;
  var newdate = date.split("-").reverse().join("-");
  // var myDate = new Date(date);
  console.log(newdate);
  var type = document.getElementById("type").value;
  var unit = document.getElementById("unit").value;
  var read1 = document.getElementById("read1").value;
  var read2 = document.getElementById("read2").value;
  var type_unit = type+''+unit;

  httpObj.open('POST','http://192.168.1.229:8081/add_results/'+key,true);
  httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  httpObj.send('uid='+get_id+'&vital_id='+vitalid+'&date='+newdate+'&type='+type_unit+'&read1='+read1+'&read2='+read2);

}

function validate_medication() {

      var date = document.getElementById("date2").value;
      var reason = document.getElementById("reason").value;
      var medication = document.getElementById("medication").value;
      var dosage = document.getElementById("dosage").value;
      var regdate =  /^[0-3]?[0-9]\-[01]?[0-9]\-[12][90][0-9][0-9]$/;

      if(date == "" && reason == "" && medication == "" && dosage == "") {

           alert("Enter essential credential");
           return false;
      }

      else if(date == "" || date.search(regdate)==-1) {

         alert("Invalid date format");
         return false;
      }
      
      else if(reason == "" || !isNaN(reason)) {

            alert("Wrong entry");
            return false;
      }

      else if(medication == "" || !isNaN(medication)) {

            alert("Wrong entry");
            return false;
      }

      else {

             add_medication();
      }

}


function validate_allergy() {

    var allergen = document.getElementById("allergen").value;
    var allergy = document.getElementById("allergy").value;

    if(allergen=="" && allergy == "") {

       alert("Enter essential credential");
       return false;
    }

    else if(allergen == "" || !isNaN(allergen)) {

            alert("Wrong entry");
            return false;
    }

    else if(allergy == "" || !isNaN(allergy)) {

            alert("Wrong entry");
            return false;
    }

    else {
            add_allergy();
    }
}

function add_allergy() {

    var get_id = localStorage.getItem('userid');
    var httpObj = new XMLHttpRequest();

    httpObj.onreadystatechange = function() {
    
      if(this.readyState == 4 && this.status == 200) {
            alert("added successfully");
            window.location.reload();
      } 
    }

    var allergen = document.getElementById("allergen").value;
    var allergy = document.getElementById("allergy").value;

    httpObj.open('POST','http://192.168.1.229:8081/add_allergy/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send('uid='+get_id+'&allergen='+allergen+'&allergy='+allergy);
}

function add_medication() {
  
    var get_id = localStorage.getItem('userid');
    var httpObj = new XMLHttpRequest();

    httpObj.onreadystatechange = function() {
    
    if(this.readyState == 4 && this.status == 200) {
          alert("added successfully");
          window.location.reload();
    } 
  }

  var date = document.getElementById("date2").value;
  var newdate = date.split("-").reverse().join("-");
  var reason = document.getElementById("reason").value;
  var medication = document.getElementById("medication").value;
  var dosage = document.getElementById("dosage").value;

  httpObj.open('POST','http://192.168.1.229:8081/add_medication/'+key,true);
  httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  httpObj.send('uid='+get_id+'&date1='+newdate+'&reason='+reason+'&medication='+medication+'&dosage='+dosage);
}

function fetch_unit() {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
      
       if(this.readyState == 4 && this.status == 200) {

          var result = this.responseText;
          result = JSON.parse(result);
          var html1 = "";

          result.forEach(function (element){

              html1 += "<option value='"+element.vital_id+"'>"+element.unit+"</option>";

          });

         document.getElementById("unit").innerHTML = html1;
        }
          
    } 

    var select = document.getElementById("type");
    var vitalid = select.options[select.selectedIndex].value;

    httpObj.open('POST','http://192.168.1.229:8081/fetch_unit/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send('vid='+vitalid);
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

  
function back() {

          window.location = "user_home.html";
    
}