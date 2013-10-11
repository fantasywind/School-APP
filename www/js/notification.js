document.addEventListener('deviceready', function(){
  

  var pushNotification;
  pushNotification = window.plugins.pushNotification;

  //alert("Device: "+ Device);
  if ( Device.platform == 'android' || Device.platform == 'Android' )
  {
      pushNotification.register(
          successHandler,
          errorHandler, {
              "senderID":"replace_with_sender_id",
              "ecb":"onNotificationGCM"
          });
  }
  else
  {
    
      pushNotification.register(
          tokenHandler,
          errorHandler, {
              "badge":"true",
              "sound":"true",
              "alert":"true",
              "ecb":"onNotificationAPN"
          });
  }

  // result contains any message sent from the plugin call
  function successHandler (result) {
      alert('result = ' + result);
  }

  // result contains any error description text returned from the plugin call
  function errorHandler (error) {
      alert('error = ' + error);
  }

  function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    alert('device token = ' + result);

    $.post(SERVER + 'push/register', { token: result, type: "ios" },
     function(data){
       alert("Data Loaded: " + data);
     },'json');

    
  }

  function onNotificationAPN (event) {
   
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
  }
});