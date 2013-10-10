var apns = require("apn"),
    errorCallback = function (err, notification) {
      console.error("Error: " + err);
    },
    options = {
      cert: "./cert/cert.pem",
      key: "./cert/key.pem",
      gateway: 'gateway.sandbox.push.apple.com',
      port: 2195,
      errorCallback: errorCallback
    };

var apnsConnection = new apns.Connection(options);

var token = "afhowedvao9ef23rewjdfl";
var myDevice = new apns.Device(token);
var note = new apns.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600 // 1hr
note.badge = 1;
note.sound = "ping.aiff"
note.alert = "Test Message"
note.payload = {
  messageFrom: 'Yoyo'
}
note.device = myDevice;

apnsConnection.sendNotification(note);