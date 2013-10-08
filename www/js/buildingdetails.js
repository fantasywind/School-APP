$('#detailsPage').on('pageshow', function(event) {
	var id = $(this).data("id");
	displaydepartment(id);
});

function displaydepartment(id) {
  $.getJSON(serviceURL +'/'+id, function(data) {
	var content = data.content;
	//console.log(employee);
	//$('#employeePic').attr('src', 'pics/' + employee.picture);
	//$('#fullName').text(employee.firstName + ' ' + employee.lastName);
	//$('#employeeTitle').text(employee.title);
	$('#detail').html(content);
	
  });
}
