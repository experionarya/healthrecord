
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

var uid;
var httpObj = new XMLHttpRequest();

httpObj.onreadystatechange=function() {
    
    if(this.readyState == '4' && this.status == '200') {
        
          var result = this.responseText;
          result = JSON.parse(result);
          content = "<div><table id='table1'><thead><tr><th>No.</th><th>UID</th><th>Name</th><th>Age</th><th>Gender</th><th>DOB</th><th>Blood Group</th><th>Address</th><th>Location</th><th>Contact No</th><th>ACTION</th><th>ACTION</th></tr></thead><tbody>";
          var i = 1;

          result.forEach(function(element) {
            
              uid = element.uid;
              content += "<tr><td>" + i + "</td><td>" + element.uid + "</td><td>" + element.name + "</td><td>" + element.age + "</td><td>" + element.gender + "</td><td>" + element.dob + "</td><td>" + element.blood_group + "</td><td>" + element.address+ "</td><td>" + element.location + "</td><td>" + element.contact_no + "</td><td><button onclick='more1("+element.uid+");'>MORE</button></td><td><button onclick='delete1("+element.uid+");'>DELETE</button></td></tr>";
              i++;

          });

          content += "</tbody> </table> </div>";
          document.getElementById('div1').innerHTML = content;
    }
}

httpObj.open('GET','http://192.168.1.229:8081/user_details/'+key,true);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send("");


function more1(userid) {

    sessionStorage.setItem("userid1",userid);
    window.location = "admin_user_moredetails.html";
}

function delete1(userid) {
    
    sessionStorage.setItem("userid1",userid);
    id = sessionStorage.getItem("userid1");
    var httpObj1 = new XMLHttpRequest();
    if(confirm("Are you sure do you want to remove?")) {
      httpObj1.onreadystatechange = function() {

        if(this.readyState == 4 && this.status == 200) {

            
             console.log("removed successfully");
                alert("removed successfully");
                window.location.reload();
          }
        }

      httpObj1.open('DELETE','http://192.168.1.229:8081/remove/'+key,true);
      httpObj1.setRequestHeader('content-type','application/x-www-form-urlencoded');
      httpObj1.send('uid='+id);
  }
}


function back() {

          window.location = "admin_vital.html";
    
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
