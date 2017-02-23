

function fileupload() {

	 var httpObj = new XMLHttpRequest();

    httpObj.onreadystatechange = function() {
    	
    	if(this.readyState == 4 && this.status == 200) {

    		

    	}	
    }

    

    var formData = new FormData(document.getElementById('uploadForm'));
    
    httpObj.open('POST','http://192.168.1.229:3000/upload',true);
    //httpObj.setRequestHeader('content-type','multipart/form-data');
    httpObj.send(formData);
   return false;

}