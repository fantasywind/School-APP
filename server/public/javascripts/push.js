

var map;
var marker;
var latlng;

//Templates
var TMPL = {};
TMPL.notificationVideo = _.template(document.querySelector("#notification-video-tmpl").innerHTML);
TMPL.notificationMap = _.template(document.querySelector("#notification-map-tmpl").innerHTML);

function initializeＭap(){
    latlng = new google.maps.LatLng(24.950266,121.373836);
    // deslatlng = new google.maps.LatLng(24.968718, 121.195924);
    var myOptions = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMA
    };
        
    map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
    
    marker = new google.maps.Marker({
        position: latlng,
        map: map,
        draggable:true
    });
}

$( document ).ready(function() {
  
    $('#dropdown').dropdown();
    google.maps.event.addDomListener(window, 'load', initializeＭap());
});

$(".parse-time").each(function () {
  var $this = $(this)
      time = new XDate($this.data('timestamp'));
  $this.text(time.toString('yyyy-MM-dd HH:mm'));
});
$("table").delegate('.positive', 'click', function (e) {
  e.preventDefault();
  var $this = $(this),
      tr = $this.parents('tr'),
      msgId = tr.data('id');

  $.ajax('/push/' + msgId, {
    type: 'POST',
    data: {},
    dataType: 'json',
    success: function (e) {
      if (e.status === 'pushed') {
        alert('訊息推送成功!')
        now = new XDate();
        tr.find('.push_time').text(now.toString('yyyy-MM-dd HH:mm'))
        $this.fadeOut(function(){
          $(this).remove();
        })
      } else {
        alert('推播訊息失敗，請重新登入系統再嘗試。')
      }
    }
  });
});

$("#popoutMap").click(function (e) {
    //initial map
    $('#map_pop').modal('show');
    google.maps.event.trigger(map, 'resize');
    marker.setPosition(map.center);
});

$("#popoutVideo").click(function (e) {
    $('#video_pop').modal('show');
});

$('.search').click(function() {
    
		var geocoder = new google.maps.Geocoder(); 
		geocoder.geocode({
				address : jQuery('input[name=address]').val(), 
				region: 'no' 
			},
		    function(results, status) {
		    	if (status.toLowerCase() == 'ok') {
					// Get center
					var coords = new google.maps.LatLng(
						results[0]['geometry']['location'].lat(),
						results[0]['geometry']['location'].lng()
					);
 
					map.setCenter(coords);
					map.setZoom(15);
 
					// Set marker also
					marker.setPosition(map.center);
 
		    	}
			}
		);
	});

$("#mapOK").click(function (e) {
    
     var src = "http://maps.googleapis.com/maps/api/staticmap?center=" + marker.position.lat() + ", "+ marker.position.lng() + "&zoom=13&size=320x370&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:red%7Ccolor:red%7Clabel:C%7C" + marker.position.lat() + ", "+ marker.position.lng() + "&sensor=false";
     var category = $('#mapSelection .text').text();
     var message = $('#mapMessage').val();
     var html = TMPL.notificationMap({src : src, category : category, message : message});
    
     var category_id = $('.selection input').val();
     
    $.ajax("/push/", {
      type: 'POST',
      data: {
          typeis: 'map',
          article: html,
          category : category_id,
          message: message
      },
      dataType: 'json',
      success: function (e) {
        
      },
      error: function (e) {
        console.error(e);
      }
    })
   
   
});

$("#videoOK").click(function (e) {
     var src = youtube_parser($('#videoLink').val());
     var category = $('#videoSelection .text').text();
     var message = $('#videoMessage').val();
    
     var html = TMPL.notificationVideo({videoLink : src, category : category, message : message});
      
     var category_id = $('#videoSelection input').val();
    
    $.ajax("/push/", {
      type: 'POST',
      data: {
          typeis: 'video',
          article: html,
          category : category_id,
          message: message
      },
      dataType: 'json',
      success: function (e) {
        
      },
      error: function (e) {
        console.error(e);
      }
    })
});

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7]){
        return match[7];
    }else{
        alert("Url incorrecta");
    }
}