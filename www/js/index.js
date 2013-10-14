/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        // Detect iOS7
        if (parseFloat(window.device.version) >= 7.0) {
          $(document.body).addClass('ios7')
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

var SERVER = "http://school.infinitibeat.com/api";

// Templates
var TMPL = {};
TMPL.introduceObject = _.template(document.querySelector("#introduce-object-tmpl").innerHTML);

// ******** Main Page ********
$("#main-menu").delegate('.tile', 'click', function (ev, ui) {
  var target = $(this).data('target');
  
  if (target) {
    if (target === 'introduce-odd') {
      $('#introduce-odd').data('nextLevel', true);
    }
    $.mobile.changePage("#" + target)
  }
});

// ******** Introduce List ********
var introduceHistory = []
$(".introduce-list").on('pagebeforeshow', function (ev) {
  var $this, target, e, level;
  
  $this = $(this);
  
  if ($this.data('nextLevel')) {
    // 往下一層
    target = $this.data('list') || 0;
    introduceHistory.push(target);
  } else {
    // 返回
    introduceHistory.pop();
    target = introduceHistory[(introduceHistory.length - 1)];
    $this.data('list', target)
  }
  
  $this.data('nextLevel', false);
  
  $.mobile.loading('show')
  $.ajax(SERVER + '/introduce/' + target, {
    dataType: 'json',
    success: function (result) {
      var e;
      $.mobile.loading('hide')
      if (result.status === 'list') {
        e = new $.Event('listFetched');
        e.list = result.list;
        $this.trigger(e);
      } else {
        e = new $.Event('contentFetched');
        e.title = result.title;
        e.content = result.content;
        $("#introduce-content").trigger(e)
      }
    }
  });
  
});

$(".introduce-list").on('pagehide', function (ev) {
  $('.list', this).empty();
});

$(".introduce-list").on('listFetched', function (ev) {
  if (!ev.list) {
    return false;
  }
  
  var i, len, html;
  
  html = "";
  len = ev.list.length;
  
  for (i = 0; i < len; i += 1) {
    html += TMPL.introduceObject(ev.list[i]);
  }
  $('.list', this).html(html).listview('refresh');
});

$(".introduce-list").delegate('.list a', 'click', function (ev) {
  ev.preventDefault();
  
  var $this, target, newPage, nowPage;
  
  $this = $(this);
  nowPage = $(ev.delegateTarget);
  target = $this.data('target') || 0;
  
  if (nowPage.attr('id') === 'introduce-odd') {
    newPage = $("#introduce-even");
  } else {
    newPage = $("#introduce-odd");
  }
  
  newPage.data('list', target);
  newPage.data('nextLevel', true);
  
  $.mobile.changePage("#" + newPage.attr('id'));
});

$("#introduce-content").on('contentFetched', function (ev) {
  if (!ev.content || !ev.title) {
    return false;
  }
  
  $("h1", this).text(ev.title);
  $('.content', this).html(ev.content);
  history.replaceState(null, "SchoolAPP", "#introduce-content");
  $.mobile.changePage("#introduce-content", {transition: 'none'})
});