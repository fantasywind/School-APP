//var serviceURL = "http://school.infinitibeat.com/api/introduce";
var serviceURL = "http://localhost/services/"
var buildings;
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
      
    $.getJSON(serviceURL + 'getemployees.php', function(data) {
        $('#tabList' + id  +' li').remove();
        //alert(data.items);
        buildings = data.items;
        $.each(buildings, function(index, buildings) {
            $('#tabList' + id).append('<li><a href="tablinkpage.html?id=' + buildings.id + '">' +
                    '<img src="pics/' + buildings.picture + '"/>' +
                    '<h4>' + buildings.firstName + ' ' + buildings.lastName + '</h4>' +
                    '<p>' + buildings.title + '</p>' +
                    '<span class="ui-li-count">' + buildings.reportCount + '</span></a></li>');

             $('#tabList' + id + 'a').on('click', function(e) {
                                    $("h1", $("#tabdeatilPage")).text($(this).data('name'));
                                    $("#tabdeatilPage").data("id",$(this).data('unitId'));
                                    $.mobile.changePage("#tabdeatilPage");
                                });
                               
                             

        });
        $('#tabList' + id).listview('refresh');
    });
}
