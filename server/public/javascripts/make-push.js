var opts = {
  lang         : 'zh_TW',   // set your language
  styleWithCSS : false,
  height       : 400,
  toolbar      : 'normal'
};
$('#editor').elrte(opts);
$('#editor').elrte('val', $('#editor').val());
$('.ui.selection.dropdown').dropdown();