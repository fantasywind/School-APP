var opts = {
  lang         : 'zh_TW',   // set your language
  styleWithCSS : false,
  height       : 400,
  toolbar      : 'normal'
};
$('#editor').elrte(opts);
$('#editor').elrte('val', $('#editor').val());
$("#update").click(function (e) {
  var html = $('#editor').elrte('val'),
      title = $("#title").val(),
      $this = $(this),
      icon = $this.find('i:not(.loading)');

  if (icon.length) {
    icon.removeClass('save red remove check').addClass('loading');

    $.ajax(location.href, {
      type: 'post',
      data: {
        article: html,
        title: title
      },
      dataType: 'json',
      success: function (result) {
        icon.removeClass('loading').addClass('check');
      }, 
      error: function (err) {
        console.error('server error');
        icon.removeClass('loading').addClass('remove').addClass('red')
      }
    });
  }
});
$("#add").click(function (e) {
  var html = $('#editor').elrte('val'),
      title = $("#title").val(),
      $this = $(this),
      icon = $this.find('i:not(.loading)');

  if (icon.length) {
    icon.removeClass('add red remove check').addClass('loading');

    $.ajax(location.href, {
      type: 'post',
      data: {
        article: html,
        title: title
      },
      dataType: 'json',
      success: function (result) {
        icon.removeClass('loading').addClass('check');
        location.href = location.origin + "/introduce/" + location.pathname.split('/')[3];
      }, 
      error: function (err) {
        console.error('server error');
        icon.removeClass('loading').addClass('remove').addClass('red')
      }
    });
  }
});