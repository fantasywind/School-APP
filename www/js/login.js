$("button").on('click', function (e){
  e.preventDefault();
  $("form").trigger('autologin')
})

$("form").on('submit autologin', function (e){
  e.preventDefault(); 
  var stuNum = $("input[name='student_id']").val(),
      stuPass = $("input[name='passwd']").val(),
      anonyMail = $("input[name='mail']").val();

  if (stuNum != '' && stuPass != '') {
    $.ajax(SERVER + "login", {
      type: 'POST',
      dataType: 'json',
      data: {
        account: stuNum,
        password: stuPass
      },
      success: function (result) {
        $("#autologin").fadeOut(function () {
          $(this).remove();
        });
        switch (result.status) {
          case 'logined':
            location.href = "index.html";
            localStorage.mode = 'normal';
            localStorage.account = stuNum;
            localStorage.password = stuPass;
            break;
          case 'not found':
            alert('找不到帳號! 請確認後再登入');
            break;
          case 'failed':
            alert('密碼錯誤!');
            break;
          default:
            alert('系統異常，請回報相關單位或檢查您的網路連線');
            alert(result.status);
            break;
        }
      },
      error: function (err) {
        alert('系統異常，請回報相關單位或檢查您的網路連線');
        
      }
    });
  } else if (anonyMail != ''){
    $.ajax(SERVER + "anonymous", {
      type: 'POST',
      dataType: 'json',
      data: {
        mail: anonyMail
      },
      success: function (result) {
        switch (result.status) {
          case 'added':
          case 'existed':
            location.href = "index.html";
            localStorage.mode = 'anonymous'
            localStorage.anonymous = anonyMail
            break;
          default:
            alert('系統異常，請回報相關單位或檢查您的網路連線');
            break;
        }
      },
      error: function (err) {
        alert('系統異常，請回報相關單位或檢查您的網路連線');
      }
    });
  } else {
    console.info('Please input login data.')
  }
  return false;
});

document.addEventListener('deviceready', function(){
  var pushNotification;
  pushNotification = window.plugins.pushNotification;

  if ( Device.platform == 'android' || Device.platform == 'Android' )
  {
      pushNotification.register(
          successHandler,
          errorHandler, {
              "senderID":"1033044943941",
              "ecb":"onNotificationGCM"
          });
  }
  else
  {
    // iOS7 Compatible
    if (parseFloat(window.device.version) === 7.0) {
      document.body.style.marginTop = "20px !important"
    }

    pushNotification.register(
        tokenHandler,
        errorHandler, {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
        });
  }
});

// result contains any message sent from the plugin call
function successHandler (result) {
    //alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    //alert('error = ' + error);
}

function tokenHandler (result) {
  // Your iOS push server needs to know the token before it can push to this device
  // here is where you might want to send it the token for later use.
  $.post(SERVER + 'push/register', { token: result, type: "ios" },
   function(data){
     //alert("Data Loaded: " + data);
  },'json');
}

if (localStorage.account && localStorage.password) {
  $("<div id='autologin'>自動登入中</div>").appendTo(document.body);
  $("input[name='student_id']").val(localStorage.account);
  $("input[name='passwd']").val(localStorage.password);
  $("form").trigger('autologin');
} else if (localStorage.anonymous) {
  $("<div id='autologin'>自動登入中</div>").appendTo(document.body);
  $("input[name='mail']").val(localStorage.anonymous);
  $("form").trigger('autologin');
}