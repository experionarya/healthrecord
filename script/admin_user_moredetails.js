
var get_token = localStorage.getItem('token');
var get_id = localStorage.getItem('userid');
var get_type = localStorage.getItem('type');

var key={
             'token':get_token,
             'userid':get_id,
        };

key=JSON.stringify(key);

if(get_token==null || get_id==null || get_type=='user') {
  window.location="index.html";
}

 
var u_id = sessionStorage.getItem("userid1");

function fetch_data() { 

  var filter = document.getElementById("filter").value;
  if(filter=="result") {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
       
    if(this.readyState==4 && this.status==200) {
           
        var result = this.responseText;
        result = JSON.parse(result);
        content = "<div><table id='table1'><thead><tr><th>No.</th><th>UID</th><th>Date</th><th>Type</th><th>Unit</th><th>Reading1</th><th>Reading2</th><th>Normal Range</th</tr></thead><tbody>";
        var i = 1;
        result.forEach(function(element) {

            console.log(content);
            content += "<tr><td>" + i + "</td><td>" + element.uid+ "</td><td>" + element.date + "</td><td>" + element.type+ "</td><td>" + element.unit+ "</td><td>" + element.reading1+ "</td><td>" + element.reading2+ "</td><td>" + element.normal_range+"</td></tr>";
            i++;

        });

            content += "</tbody> </table> </div>";
            document.getElementById('div1').innerHTML = content;
        }
    }

     console.log("user id: "+ u_id);
     httpObj.open('GET','http://192.168.1.229:8081/more_results/'+u_id+'/'+key,true);
     httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
     httpObj.send();

  }
 
  else if(filter =="medication") {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange=function() {
        
      if(this.readyState==4 && this.status==200) {
              
        var result = this.responseText;
        result = JSON.parse(result);
        content = "<div><table id='table1'><thead><tr><th>No.</th><th>UID</th><th>Date</th><th>Reason</th><th>Medication</th><th>Dosage</th</tr></thead><tbody>";
        var i = 1;

        result.forEach(function(element) {
            console.log(content);
            content += "<tr><td>" + i + "</td><td>" + element.uid+ "</td><td>" + element.date + "</td><td>" + element.reason+ "</td><td>" + element.medication+ "</td><td>" + element.dosage+"</td></tr>";
            i++;

        });

        content += "</tbody> </table> </div>";
        document.getElementById('div1').innerHTML = content;
      }
   }
  
  httpObj.open('GET','http://192.168.1.229:8081/medication/'+u_id+'/'+key,true);
  httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
  httpObj.send();

}

  else if(filter =="measurements") {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
      
      if(this.readyState ==4 && this.status ==200) {
            
          var result = this.responseText;
          result = JSON.parse(result);
          content = "<div><table id='table1'><thead><tr><th>No.</th><th>UID</th><th>Date</th><th>Height</th><th>Weight</th</tr></thead><tbody>";
          var i = 1;
            
          result.forEach(function(element) {

            content += "<tr><td>" + i + "</td><td>" + element.uid+ "</td><td>" + element.date+ "</td><td>" + element.height + "</td><td>" + element.weight+"</td></tr>";
            i++;

          });

           content += "</tbody> </table> </div>";
           document.getElementById('div1').innerHTML = content;
        }
    }
  
    httpObj.open('GET','http://192.168.1.229:8081/measurements/'+u_id+'/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send();

}

  else if(filter =="allergy") {

    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {

      if(this.readyState==4 && this.status==200) {

            var result=this.responseText;
            result=JSON.parse(result);
            content = "<div><table id='table1'><thead><tr><th>No.</th><th>UID</th><th>Name</th><th>Allergen</th><th>Allergy</tr></thead><tbody>";
            var i = 1;

            result.forEach(function(element) {

                console.log(content);
                content += "<tr><td>" + i + "</td><td>" + element.uid+ "</td><td>" + element.name + "</td><td>" + element.allergen+ "</td><td>" + element.allergy+"</td></tr>";
                i++;

            });

            content += "</tbody> </table> </div>";
            document.getElementById('div1').innerHTML = content;
        }
    }
  
    httpObj.open('GET','http://192.168.1.229:8081/allergy/'+u_id+'/'+key,true);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send();

  }
}


function back(){

        window.location = "admin_userdetails.html";
    
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

