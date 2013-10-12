//var servicepushURL = "http://school.infinitibeat.com/api/push";
//var serviceURL = "http://localhost/services/"
var tablists;
$(document).bind('pageinit', function(){
    //tabpageHeight = $('.ui-page-active').height() - $('.ui-page-active').children('div[data-role=header]').height();
    //$('.tab-page').css('height', tabpageHeight);
    //alert(document);
   //if() 
   //{
    	$.mobile.buttonMarkup.hoverDelay = 0;
        $('.tab-page').hide();
    	$('.tab-container').find("div:first").show();
        //alert($('.tab-container').find("div:first").attr('data-href'));
        var id = $('.tab-container').find("div:first").data('unitId');
        
        getTabList(id);
        
        $(document).delegate('.ui-navbar ul li > a', 'click', function () {
            $(this).closest('.ui-navbar').find('a').removeClass('ui-btn-active');
            $(this).addClass('ui-btn-active');
            $('#' + $(this).attr('data-href')).show().siblings('.tab-page').hide();
            
            getTabList($('#' + $(this).attr('data-href')).data('unitId'));
            	//$(this).closest('.ui-navbar').find('a').removeClass('ui-bar-c')
            	//$(this).addClass('ui-bar-c');
        });
   //}  
});

/*function getTabList(id) {
            $.getJSON(serviceURL, function(data) {
                      $('#tabList' + id  +' li').remove();
                      buildings = data.list;



                      $.each(buildings, function(index, buildings) {
                             $('#tabList' + id).append('<li><a href="#SecListPage" data-unit-id="' + buildings.id + '" data-name="' + buildings.name + '">' +
                                                       '<img src="' + buildings.photo + '"/>' +
                                                       '<h4>' + buildings.name + '</h4></span></a></li>');
                              

                              $('#tabList' + id + 'a').on('click', function(e) {
                                    $("h1", $("#tabdeatilPage")).text($(this).data('name'));
                                    $("#tabdeatilPage").data("id",$(this).data('unitId'));
                                   
                                });
                               
                             });

                      
                     
                      $('#tabList1').listview('refresh');
                      });
        }
*/

function getTabList(id) {
      
    $.getJSON(SERVER + 'push/list/' + id, function(data) {
        $('#tabList' + id  +' li').remove();
        
        tablists = data.list;

        //tablists.push_time = new XDate(tablists.push_time).toString("MMM d, yyyy");
        $.each(tablists, function(index, tablists) {
          tablists.push_time = new XDate(tablists.push_time).toString("yyyy-MM-dd");
           
            $('#tabList' + id).append('<li><a href="tablinkpage.html?id=' + tablists.id + '">' +
                    '<h1>'+'[ ' + tablists.category + ']' + ' ' + tablists.message + '</h1>' +
                    '<p>' + tablists.push_time + '</p>' +
                    '</a></li>');

             $('#tabList' + id + 'a').on('click', function(e) {
                                    $("h1", $("#tabdeatilPage")).text($(this).data('name'));
                                    $("#tabdeatilPage").data("id",$(this).data('unitId'));
                                    $.mobile.changePage("#tabdeatilPage");
                                });
                               
                             

        });
        $('#tabList' + id).listview('refresh');
        //push();
    });
}

function push(){

  //alert($("#buildingList a[data-unit-id='1']").trigger('click'));
  //alert($('#buildingList').find("a[data-unit-id='1']").length);
  $("#buildingList a[data-unit-id='1']").trigger('click');

}
