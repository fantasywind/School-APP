var intros;

$('#introListPage').on('pageinit', function(event) { 
  getIntroList();
});

$('#introList').delegate('a', 'click', function(e) {
    $("h1", $("#SecListPage")).text($(this).data('name'));
    $("#SecListPage").data("id",$(this).data('unitId'));
});

function getIntroList() {
	
  $.getJSON(SERVER + 'introduce/', function(data) {
      $('#introList li').remove();
          intros = data.list;

      var html = "";

      $.each(intros, function(index, intros) {
          html += '<li><a href="#SecListPage" data-unit-id="' + intros.id + '"'
          html += 'data-name="' + intros.name + '">'
          html += '<img src="' + intros.photo + '"/>'
          html += '<h4>' + intros.name + '</h4></span></a></li>'                
      });

      $('#introList').append(html);

      $('#introList').listview('refresh');
  });
}

$("#SecListPage").on("pagebeforeshow", function (e, data) {
  $.mobile.silentScroll(0);
  $.mobile.changePage.defaults.transition = 'slide';
});

$('#SecListPage').on('pageshow', function(event) {
  var id =$(this).data("id");
  getSecList(id);
});

$('#introsecList').delegate('a', 'click', function(e) {
    $("h1", $("#detailsPage")).text($(this).data('name'));
    $("#detailsPage").data("id",$(this).data('unitId'));
});

function getSecList(id) {
    $.getJSON(SERVER + 'introduce/'+id, function(data) {
        $('#introsecList li').remove();
        var secintros = data.list;
        
        var html = "";

        $.each(secintros, function(index, secintros) {

            html += '<li><a href="#detailsPage" data-unit-id="' + secintros.id + '"'
            html += 'data-name="' + secintros.name + '">'
            html += '<img src="' + secintros.photo + '"/>'
            html += '<h4>' + secintros.name + '</h4></span></a></li>'
        });

        $('#introsecList').append(html);    
            
        $('#introsecList').listview('refresh');
    });
}

$('#detailsPage').on('pagebeforeshow', function(event) {
  $.mobile.silentScroll(0);
  $.mobile.changePage.defaults.transition = 'slide';
});

$('#detailsPage').on('pageshow', function(event) {
  var id = $(this).data("id");
  displaydepartment(id);
});

function displaydepartment(id) {
  $.getJSON(SERVER + 'introduce/'+id, function(data) {
    var content = data.content;
    $('#detail').html(content);
  });
}