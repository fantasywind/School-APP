//刪除帳號
$("tbody").delegate('td', 'click', function (e) {
  
      var $this = $(this),
      accountId = $this.parents('tr').data('id');

      $.ajax("/setting/" + accountId, {
      type: 'delete',
      data: {},
      dataType: 'json',
      success: function (e) {
        $this.parents('tr').fadeOut(function (){
          $(this).remove();
        })
      },
      error: function (e) {
        console.error(e);
      }
    })

});
