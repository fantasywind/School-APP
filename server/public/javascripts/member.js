$("#add").click(function (e) {
  e.preventDefault();
  $("form input").trigger('click');
});
$("form input").on('change', function (e) {
  $("form").submit();
});