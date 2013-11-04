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

// Server Constant
var SERVER = "http://school.infinitibeat.com/api";
var SOCKET = "http://school.infinitibeat.com";

// On Push Notification
window.onNofiticationAPN = function (event) {

  if (event.alert) {
    
  }
  
  if (event.sound) {
    
  } 
  
  if (event.badge) {
    window.plugins.pushNotification.setApplicationIconBadgeNumber(function () {
      console.info('Set Badge.');
    }, function (err) {
      console.error('Set Badge Number Error: ' + err);
    }, event.badge);
  }
  
  localStorage.notificationTarget = event.messageId;
}

window.onNofiticationGCM = function (e) {
  switch (e.event) {
    case 'registered':
      if (e.regid.length > 0) {
        // Registed token
        $.ajax(SERVER + '/push/register', {
          type: 'post',
          data: {
            type: 'android',
            token: e.regid
          },
          dataType: 'json',
          error: function (err){
            console.error('Cannot Registed Android Token with server fault.')
          },
          success: function (result) {
            console.info('Registed Android Token: ' + e.regid);
            localStorage.pushRegisted = true;
          }
        });
      }
      break;
    case 'message':
      if (e.foreground) {
        // 前景執行中
      } else {
        // 背景執行
        if (e.coldstart) {
          localStorage.notificationTarget = e.payload.pushId
        } else {
          localStorage.notificationTarget = e.payload.pushId
        }
      }
      break;
    case 'error':
      console.error('Android Notification Error: ' + e.msg);
      break;
    default:
      console.info('Unknown Android Notification Status');
      break;
  }
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        // Initial Weather Box 
        $("#weather-region").text(CITY_NAME)

        $("#weather-box").trigger('fetchData')
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

        // Detect Login Status
        $(document).trigger('loginCheck');
        
        // Detect iOS7
        if (parseFloat(window.device.version) >= 7.0) {
          $(document.body).addClass('ios7')
        }

        // Initial Socket.io
        window.socket = io.connect(SOCKET);

        window.socket.on('message', function (data) {
          nowGroupId = $("#chat-window").data('groupId')
          console.dir(JSON.stringify(data))
          if (data.groupId == nowGroupId) {
            $("#chat-window ul").append(TMPL.chatMessage(data))
          }
        });
        
        // Fetch Notification Category
        $.ajax(SERVER + '/push/category', {
          dataType: 'json',
          error: function (err) {
            console.error('Norification Category Fetch Failed');
            $.mobile.changePage('#serverFault')
          },
          success: function (result) {
            if (result.status === 'success') {
              var e = new $.Event('fetchedCategory');
              e.category = result.category;
              $("#notification-category").trigger(e);
            }
          }
        });
        
        // Bind Resume Event
        $(document).on('resume', function (e) {
          if (localStorage.notificationTarget) {
            var e = $.Event('showContent');
            e.pushId = localStorage.notificationTarget;
            delete localStorage.notificationTarget;
            $("#notification-content").trigger(e);
          }
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

// Push Register
var pushRegister = function () {
  var pushNotification = window.plugins.pushNotification;
  
  if (device.platform.match(/android/gi) !== null) {
    // Android
    pushNotification.register(function (msg) {
      console.info('Registed Android Notification.');
      localStorage.pushRegisted = true;
    }, function (err) {
      console.error('Registed Android Notification Failed: ' + err);
    }, {
      senderID: "1033044943941",
      ecb: "onNofiticationGCM"
    });
  } else {
    // iOS
    pushNotification.register(function (token) {
      console.info('Registed iOS Notification');
      
      // Registed token
      $.ajax(SERVER + '/push/register', {
        type: 'post',
        data: {
          type: 'ios',
          token: token
        },
        dataType: 'json',
        error: function (err){
          console.error('Cannot Registed iOS Token with server fault.')
        },
        success: function (result) {
          console.info('Registed Token: ' + token);
          localStorage.pushRegisted = true;
        }
      });
      
    }, function (err) {
      console.error('Registed Android Notification Failed: ' + err);
    }, {
      badge: true,
      sound: true,
      alert: true,
      ecb: "onNofiticationAPN"
    });
  }
}

// templates
var TMPL = {};
TMPL.introduceObject = _.template(document.querySelector("#introduce-object-tmpl").innerHTML);
TMPL.notificationCategory = _.template(document.querySelector('#notification-category-tmpl').innerHTML);
TMPL.notificationList = _.template(document.querySelector('#notification-list-tmpl').innerHTML);
TMPL.notificationContent = _.template(document.querySelector("#notification-content-tmpl").innerHTML);
TMPL.chatGroupList = _.template(document.querySelector("#chat-group-list-tmpl").innerHTML);
TMPL.chatMessage = _.template(document.querySelector("#chat-message-tmpl").innerHTML);

// ******** Main Page ********
$("#main-menu").delegate('.tile', 'click', function (ev, ui) {
  var $this = $(this),
      target = $this.data('target');
  
  if (target && !$this.hasClass('disabled')) {
    if (target === 'introduce-odd') {
      $('#introduce-odd').data('nextLevel', true);
    }
    $.mobile.changePage("#" + target);
  }
});

// ******** Login Page ********
$(document).on('loginCheck', function (e) {
  if (localStorage.memberID) {
    var btn = $("#login-btn").addClass('logined');
    $("a", btn)
      .attr('href', '#')
      .text('帳號: ' + localStorage.name);
    
    // Login
    $.ajax(SERVER + '/login', {
      type: 'post',
      data: {
        account: localStorage.account,
        password: localStorage.password
      },
      dataType: 'json',
      error: function (err) {
        console.error('Login Error: ' + err);
        alert('伺服器錯誤，請回報系統管理員。')
      },
      success: function (result) {
        switch (result.status) {
          case 'logined':
            localStorage.memberID = result.id;
            localStorage.name = result.name;
            localStorage.account = account;
            localStorage.password = password;
            $(document).trigger('loginCheck');
            $.mobile.changePage("#main-menu");
            break;
          case 'failed':
            alert('帳號或密碼錯誤！\n請檢查後再嘗試。')
            break;
          case 'not found':
          default:
            alert('找不到這個帳號')
            break;
        }
        $("input", $form).val('');
      }
    });

    // Register Notification
    pushRegister();

    // Enable Chat Page
    $("[data-target='chat-group']").removeClass('disabled');
  }
  else
  {
    var btn = $("#login-btn").removeClass('logined');
    $("a", btn)
      .attr('href', '#login')
      .text('登入');
  }
});
$("#login .submit-btn").on('click', function(ev){
  var $form, account, password, mail;
  
  ev.preventDefault();
  
  $form = $(this).parents('form');
  account = $("input[name='account']", $form).val();
  password = $("input[name='password']", $form).val();
  mail = $("input[name='mail']", $form).val();
  
  if (account !== '' && password !== '') {
    $.ajax(SERVER + '/login', {
      type: 'post',
      data: {
        account: account,
        password: password
      },
      dataType: 'json',
      error: function (err) {
        console.error('Login Error: ' + err);
        alert('伺服器錯誤，請回報系統管理員。')
      },
      success: function (result) {
        switch (result.status) {
          case 'logined':
            localStorage.memberID = result.id;
            localStorage.name = result.name;
            localStorage.account = account;
            localStorage.password = password;
            $(document).trigger('loginCheck');
            $.mobile.changePage("#main-menu");
            break;
          case 'failed':
            alert('帳號或密碼錯誤！\n請檢查後再嘗試。')
            break;
          case 'not found':
          default:
            alert('找不到這個帳號')
            break;
        }
        $("input", $form).val('');
      }
    })
  } else if (mail !== '') {
    
  } else {
    alert('資料不完全！\n請檢查後再嘗試登入。')
  }
});
// ******** Weather Box ********
$("#weather-box").on('fetchData', function (ev) {
  $.ajax({
    url: 'http://query.yahooapis.com/v1/public/yql',
    data: {
      q: "select * from weather.forecast where woeid = " + YAHOO_WOEID,
      format: 'json'
    },
    dataType: 'json',
    crossDomain: true,
    success: function (data) {
      console.dir (data)
      tempF = parseInt(data.query.results.channel.item.condition.temp, 10)
      tempC = Math.round((tempF-32) * 50 / 9) / 10
      $("#weather-temperture .value").text(tempC)
    }
  })
});

// ******** Loginout function ********
$("#login-btn").on('click', function (ev) {
  if(localStorage.memberID)
  {
    alert("已登出系統!");
    window.localStorage.clear();
    $.ajax(SERVER + '/logout', {
      type: 'post',
      error: function (err) {
        console.error('Logout Error: ' + err);
        alert('伺服器錯誤，請回報系統管理員。')
      },
      success: function () {
        // Detect Login Status
        $(document).trigger('loginCheck');
      }
    
    })
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

// ******** Push Notification List ********
$("#notification-category").on('fetchedCategory', function (ev) {
  if (ev.category === undefined) {
    return false;
  }  
  var categoryCount, i, html;
  
  ev.category.unshift({
    name: '全部',
    id: -1
  });
  categoryCount = Math.max(4, ev.category.length);
  html = ""
  
  for (i = 0; i < categoryCount; i += 1) {
    html += TMPL.notificationCategory(ev.category[i]);
  }
  
  $("ul", this).html(html);
  $("ul a", this).first().trigger('click');
});

$("#notification-category").delegate('a:not(.active)', 'click', function (ev) {
  ev.preventDefault();
  var $this = $(this), e;
  
  // Active Button
  $(".active").removeClass('active');
  $this.addClass('active');
  
  // Change Tab
  e = new $.Event('changeTab');
  e.target = $this.data('category');
  $("#notification-list").trigger(e);
});

$("#notification-list").on('changeTab', function (ev) {
  ev.target = ev.target || -1;
  
  var $this = $(this);
  
  $.ajax(SERVER + '/push/list/' + ev.target, {
    dataType: 'json',
    success: function (result) {
      if (result.status === 'success') {
        var i, html = ""
        
        for (i = 0; i < result.list.length; i += 1) {
          html += TMPL.notificationList(result.list[i]);
        }
        
        $(".list", $this).html(html).listview('refresh');
      }
    } 
  })
});

$("#notification-list").delegate('.list a', 'click', function (ev) {
  ev.preventDefault();

  var e = $.Event('showContent');
  e.pushId = $(this).data('id');
  $("#notification-content").trigger(e);
});

$("#notification-content").on('showContent', function (ev) {
  if (ev.pushId === undefined) {
    return false;
  }
   
  var $this = $(this);
  
  $.ajax(SERVER + '/push/' + ev.pushId, {
    dataType: 'json',
    error: function (err){
      console.error('Fetch Push Content Failed.');
    },
    success: function (result) {
      if (result.status === 'msg') {
        
        $(".content", $this).html(result.message.article);
        $.mobile.changePage("#notification-content");
        $("#navi > a", $("#notification-content")).button();
      }  
    }
  });
});

$("#notification-content").delegate('#navi a', 'click', function (ev) {

    navigator.geolocation.getCurrentPosition(function(position){

        var href = "http://maps.apple.com/maps?daddr="
                 + $("img").attr("data-lat") + ", "
                 + $("img").attr("data-lng") 
                 + "&saddr=" + position.coords.latitude
                 + "," + position.coords.longitude;

       //window.open need to add InAppbrowser plugin
       window.open(href, '_system','location=yes');
      
    }, function(){
        alert("Error");
       }
    );                 
});
/******** 聊天 ********/
$("#chat-group").on('pagebeforeshow', function (ev) {
  $this = $(this)

  $.ajax(SERVER + "/chat/list", {
    dataType: 'json',
    data: {uid: localStorage.memberID},
    error: function (err) {
      console.error('Fetch Chat List Failed.');
    },
    success: function (result) {
      if (result.status === 'success') {
        html = ""
        for (var i = 0; i < result.list.length; i += 1) {
          _.extend(result.list[i], {
            userCount: 0
          });
          html += TMPL.chatGroupList(result.list[i])
        }
        content = $(".content", $this)
        content.find('h2').fadeOut(function(){
          $(this).remove()
        });
        content.find('ul').html(html).listview('refresh');
      }
    }
  });
});

$("#chat-group-list").delegate('a', 'click', function (e) {
  e.preventDefault();
  $this = $(this)

  groupId = $(this).data('id');
  $("#chat-window")
    .data('groupId', groupId)
    .find('h1').text($this.text())
  $.mobile.changePage("#chat-window");
});

$("#chat-window").on('pagebeforeshow', function (e) {
  $this = $(this)
  groupId = $this.data('groupId')

  $.ajax(SERVER + "/chat/" + groupId, {
    dataType: 'json',
    error: function (err) {
      console.error(err);
    },
    success: function (result) {
      if (result.status === 'success') {
        html = ''
        for (var i = 0; i < result.message.length; i += 1) {
          html += TMPL.chatMessage(result.message[i])
        }
        $("h2", $this).fadeOut(function () {
          $(this).remove();
        });
        $("ul", $this).html(html)
      }
    }
  });

});

$("#chat-window .footer").on('click', function (e) {
  e.preventDefault();
  $("input", this).focus();
});

$("#submit-chat").on('submit', function (e) {
  e.preventDefault();
  groupId = $("#chat-window").data('groupId')
  input = $("#message-sender")

  socket.emit('message', {
    groupId: groupId,
    msg: input.val(),
    memberId: parseInt(localStorage.memberID, 10),
    memberName: localStorage.name
  });

  input.val('')

  return false
});
