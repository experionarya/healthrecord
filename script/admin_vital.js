
var get_token = localStorage.getItem('token');
var get_id = localStorage.getItem('userid');
var get_type = localStorage.getItem('type');

var key = {
             'token':get_token,
             'userid':get_id,
          };

key = JSON.stringify(key);

if(get_token == null || get_id == null || get_type == 'user') {
  window.location="index.html";
}


$(document).ready(function() {

    $("#p3").click(function() {
    	$("#div5").hide();
        $("#div4").show();
        
    });

    $("#p4").click(function() {
    	$("#div4").hide();
        $("#div5").show();
        remove_vitals();

    });
});


function validate_vitals() {

    var type = document.getElementById("type").value;
    var unit = document.getElementById("unit").value;
    var nr = document.getElementById("nr").value;
    // var reg = /^([0-9.]{2,4}-[0-9.]{2,4})$/;

    if(type == "" && unit == "" && nr == "") {

         alert("Enter essential credential");
         return false;
    }

    else if(type == "" || !isNaN(type)) {

         alert("Enter a valid vital type");
         return false;
    }

    else if(unit == "" || !isNaN(unit)) {

         alert("Enter a valid vital unit");
         return false;
    }
    
    // else if(nr == ""|| !reg.test(nr)) {

    else if(nr == "") {

         alert("Enter a valid range for vital");
         return false;
    }

    else {

         add_vital();
    }
}

function add_vital() {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
       
        if(this.readyState == 4 && this.status == 200) {
            
            console.log("inserted successfully");
            alert("added successfully");
            window.location = "admin_vital.html";
        }
    }

    var type = document.getElementById("type").value;
    var unit = document.getElementById("unit").value;
    var nr = document.getElementById("nr").value;

    httpObj.open('POST','http://192.168.1.229:8081/addvitals/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send('v_type='+type+'&v_unit='+unit+'&v_nr='+nr);
}



function remove_vitals() {

     var httpObj = new XMLHttpRequest();
     httpObj.onreadystatechange = function() {
    
         if(this.readyState == '4' && this.status == '200') {
            
             var result = this.responseText;
             result = JSON.parse(result);

             content = "<div><table id='table1'><thead><tr><th>No.</th><th>Vital ID</th><th>Type</th><th>Unit</th><th>Normal Range</th><th>ACTION</th></tr></thead><tbody>";
             var i = 1;
             result.forEach(function(element) {
               
                content += "<tr><td>" + i + "</td><td>" + element.vital_id + "</td><td>" + element.type + "</td><td>" + element.unit + "</td><td>" + element.normal_range + "</td><td><button onclick='delete1("+element.vital_id+");'>DELETE</BUTTON></td></tr>";
                i++;

            });

            content += "</tbody> </table> </div>";
            document.getElementById('div5').innerHTML = content;
        }
    }

    httpObj.open('GET','http://192.168.1.229:8081/getvitals/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send("");
}


function delete1(vital_id) {

        var httpObj = new XMLHttpRequest();
        if(confirm("Are you sure do you want to remove?")) {
        httpObj.onreadystatechange = function() {

            if(this.readyState == '4' && this.status == '200') {

                    console.log("deleted successfully");
                    alert("deleted successfully");
                    window.location.reload();
                }
            }
        

        httpObj.open('DELETE','http://192.168.1.229:8081/removevitals/'+key,true);
        httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
        httpObj.send('vitalid='+vital_id); 
    }
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
   
       window.location = "admin_user.html";
    
}