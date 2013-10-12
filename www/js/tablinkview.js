//var serviceURL = "http://school.infinitibeat.com/api/introduce";
$('#tabdeatilPage').live('pageshow', function(event) {
	//var id = $(this).data("id");
	var id = getUrlVars()["id"];
	//alert(id);
	displaypushmessage(id);
});

/*function displaydepartment(id) {
  $.getJSON(serviceURL +'/'+id, function(data) {
	var content = data.content;
	//console.log(employee);
	//$('#employeePic').attr('src', 'pics/' + employee.picture);
	//$('#fullName').text(employee.firstName + ' ' + employee.lastName);
	//$('#employeeTitle').text(employee.title);
	$('#detail').html(content);
	
  });
}*/

function displaypushmessage(id) {
  $.getJSON(SERVER + 'push/' + id, function(data) {
    
		var pushmessage = data.message;
	var content = pushmessage.message;

  $('#detail').html(content);
  
  });
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}