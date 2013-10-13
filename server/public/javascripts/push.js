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