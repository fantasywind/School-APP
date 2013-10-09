var serviceURL = "http://school.infinitibeat.com/api/introduce";
//var serviceURL = "http://localhost/services/";

var buildings;

$('#buildingListPage').on('pageinit', function(event) 
{
      getBuildingList();
});

function getBuildingList() {
	$.getJSON(serviceURL, function(data) {
              $('#buildingList li').remove();
              buildings = data.list;



              $.each(buildings, function(index, buildings) {
                     $('#buildingList').append('<li><a href="#SecListPage" data-unit-id="' + buildings.id + '" data-name="' + buildings.name + '">' +
                                               '<img src="' + buildings.photo + '"/>' +
                                               '<h4>' + buildings.name + '</h4></span></a></li>');
                      

                      $('#buildingList a').on('click', function(e) {
                      	    $("h1", $("#SecListPage")).text($(this).data('name'));
					        $("#SecListPage").data("id",$(this).data('unitId'));
					       
					    });
                       
                     });

              
             
              $('#buildingList').listview('refresh');
              });
}

$("#SecListPage").bind("pagebeforeshow", function (e, data) {
    $.mobile.silentScroll(0);
    $.mobile.changePage.defaults.transition = 'slide';
});
/*function getBuildingList() {
	$.getJSON(serviceURL, function(data) {
              $('#buildingList li').remove();
              buildings = data.list;



              $.each(buildings, function(index, buildings) {
                     $('#buildingList').append('<li><a href="#SecListPage" data-unit-id="' + buildings.id + '" rel=false>' +
                                               '<img src="pics/' + buildings.picture + '"/>' +
                                               '<h4>' + buildings.name + '</h4></span></a></li>');                
                       
                     });

              
             
              $('#buildingList').listview('refresh');
              });*/
//local test
/*function getBuildingList() {
	
	$.getJSON(serviceURL + 'getemployees.php', function(data) {
		$('#buildingList li').remove();
		
		buildings = data.items;
		$.each(buildings, function(index, buildings) {
			$('#buildingList').append('<li><a href="buildingsec.html?id=' + buildings.id + '">' +
					'<img src="pics/' + buildings.picture + '"/>' +
					'<h4>' + buildings.firstName + ' ' + buildings.lastName + '</h4>' +
					'<p>' + buildings.title + '</p>' +
					'<span class="ui-li-count">' + buildings.reportCount + '</span></a></li>');
		});
		$('#buildingList').listview('refresh');
	});
}*/

