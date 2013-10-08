$('#SecListPage').on('pageshow', function(event) {
 // alert($('#SecListPage').("id");
  var id =$(this).data("id");
  getSecList(id);
});

function getSecList(id) {
	$.getJSON(serviceURL +'/'+id, function(data) {
    
              $('#buildingsecList li').remove();
              var secbuildings = data.list;
              $.each(secbuildings, function(index, secbuildings) {
                     $('#buildingsecList').append('<li><a href="#detailsPage" data-unit-id="' + secbuildings.id + '" data-name="' + secbuildings.name + '">' +
                                               '<img src="' + secbuildings.photo + '"/>' +
                                               '<h4>' + secbuildings.name + '</h4></span></a></li>');

                     });
                      
                      $('#buildingsecList a').on('click', function(e) {
                          $("h1", $("#detailsPage")).text($(this).data('name'));
                          $("#detailsPage").data("id",$(this).data('unitId'));
                         
                      });
              $('#buildingsecList').listview('refresh');
              });
}

/*function getBuildingList2() {
  
  $.getJSON(serviceURL + 'getemployees.php', function(data) {
    $('#buildingsecList li').remove();
    
    buildings = data.items;
    $.each(buildings, function(index, buildings) {
      $('#buildingsecList').append('<li><a href="buildingdetials.html?id=' + buildings.id + '">' +
          '<img src="pics/' + buildings.picture + '"/>' +
          '<h4>' + buildings.firstName + ' ' + buildings.lastName + '</h4>' +
          '<p>' + buildings.title + '</p>' +
          '<span class="ui-li-count">' + buildings.reportCount + '</span></a></li>');
    });
    $('#buildingsecList').listview('refresh');
  });
}*/
