$('#tabdeatilPage').live('pageshow', function(event) {
  	var id = getUrlVars()["id"];
  	
  	displaypushmessage(id);
});

function displaypushmessage(id) {
    $.getJSON(SERVER + 'push/' + id, function(data) {
      
      	var pushmessage = data.message;
      	var content = pushmessage.message;

        $('#detail').html(content);
    
    });
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}