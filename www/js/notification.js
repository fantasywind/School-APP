SERVER = "http://school.infinitibeat.com/api/"

function onNotificationAPN (event) {

  if ( event.alert )
  {
      //navigator.notification.alert(event.alert);
  }

  if ( event.sound )
  {
      //var snd = new Media(event.sound);
      //snd.play();
  }

  if ( event.badge )
  {
      //window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }

  if ( event.messageId )
  {
      localStorage.isPush = "isPush";
      localStorage.messageID = event.messageId;
  }

}

document.addEventListener("resume", pushrevoke, false);

function pushrevoke(){
  if(localStorage.isPush === "isPush"){
    if(location.href.match(/news\.html/gi) !== null){
      $(document).trigger("pageinit");
    }
    else {
      location.href = "news.html";
    }
  }
}