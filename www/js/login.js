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