
var tablists;

$(document).bind('pageinit', function(){
  	$.mobile.buttonMarkup.hoverDelay = 0;
    $('.tab-page').hide();
  	$('.tab-container').find("div:first").show();
    var id = $('.tab-container').find("div:first").data('unitId');
      
    getTabList(id);
      
    $(document).delegate('.ui-navbar ul li > a', 'click', function () {
        $(this).closest('.ui-navbar').find('a').removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');
        $('#' + $(this).attr('data-href')).show().siblings('.tab-page').hide(); 
        getTabList($('#' + $(this).attr('data-href')).data('unitId'));	
    });
});


function getTabList(id) {  
    $.getJSON(SERVER + 'push/list/' + id, function(data) {
        $('#tabList' + id  +' li').remove();
   
        tablists = data.list;
        
        var html = "";

        $.each(tablists, function(index, tablists) {
            tablists.push_time = new XDate(tablists.push_time).toString("yyyy-MM-dd");
           
            html +=  '<li><a href="tablinkpage.html?id=' + tablists.id + '"'
            html +=  ' data-unit-id="' + tablists.id + '">'
            html +=  '<h1>'+'[ ' + tablists.category + ' ] '
            html +=  '' + tablists.message + '</h1>'
            html +=  '<p>' + tablists.push_time + '</p>'
            html +=  '</a></li>'
        });

        $('#tabList' + id).append(html);
        
        $('#tabList' + id).listview('refresh');
       
        notificationPushListen();
    });
}

function notificationPushListen(){ 
  if(localStorage.isPush === "isPush"){   
      localStorage.isPush = "noPush";  
      var id = localStorage.messageID;
      $('.tab-container a[data-unit-id="' + id + '"]:first()').trigger('click');
    }
}
$(function(){
  $(".backToIndex").on('click', function (event, ui) {
    event.preventDefault();
    location.href = 'index.html'
  });
})