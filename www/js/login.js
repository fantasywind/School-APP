$(".login-form").delegate('.actions > button', 'click', function (e){
  var loginForm = $(e.delegateTarget),
      stuNum = $(loginForm).find("input[name='student_id']").val(),
      stuPass = $(loginForm).find("input[name='passwd']").val(),
      anonyMail = $(loginForm).find("input[name='mail']").val();

  if (stuNum != '' && stuPass != '') {
    $.ajax(SERVER + "login", {
      method: 'POST',
      dataType: 'json',
      data: {
        account: stuNum,
        password: stuPass
      },
      success: function (result) {
        switch (result.status) {
          case 'logined':
            location.href = "index.html";
            break;
          case 'not found':
            alert('找不到帳號! 請確認後再登入');
            break;
          case 'failed':
            alert('密碼錯誤!');
            break;
          default:
            alert('系統異常，請回報相關單位或檢查您的網路連線');
            break;
        }
      }
    });
  } else if (anonyMail != ''){
    $.ajax(SERVER + "login/anonymous", {
      method: 'POST',
      dataType: 'json',
      data: {
        mail: anonyMail
      },
      success: function (result) {
        
      }
    });
  } else {
    console.info('Please input login data.')
  }
});