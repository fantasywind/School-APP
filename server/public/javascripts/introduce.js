$("tbody").delegate('td', 'mouseenter', function (e) {
  $(this).parents('tr').addClass('hover');
});
$("tbody").delegate('td', 'mouseleave', function (e) {
  $(this).parents('tr').removeClass('hover');
});
$("tbody").delegate('td', 'click', function (e) {
  var $this = $(this),
      targetId = $this.parents('tr').data('id'),
      targetDOM = $(e.target);

  if (targetDOM.hasClass('transform')) {
    location.href = '/introduce/new/' + targetId;
  } else if (targetDOM.hasClass('delete')) {
    $.ajax("/introduce/" + targetId, {
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
  } else {
    location.href = '/introduce/' + targetId;
  }
});
$('#back').on('click', function (e) {
  var targetId = $("table").data('prev');
  location.href = '/introduce/' + targetId;
});