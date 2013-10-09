$(function () {
  var page = $("#content").data('content');
  $(".item[data-page='" + page + "']").addClass('active');
});
window.HOST = "http://school.infinitibeat.com";