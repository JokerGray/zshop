function getParams() {
  var url = location.search;
  var params = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return params;
}

//根据参数名获取地址栏URL里的参数
function getUrlParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    return decodeURI(decodeURIComponent(r[2]));
  }
  return "";
}

function load() {
  document.addEventListener('touchmove', touch, false);

  function touch(event) {
    var event = event || window.event;
    switch (event.type) {
      case "touchmove":
        event.preventDefault();
    }
  }
}

//window.addEventListener('load',load, false);


function reqAjax(cmd, data) {
  var apikey = sessionStorage.getItem('apikey') || 'test';
  var version = sessionStorage.getItem('version') || '1';
  var reData;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dateType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": data,
      "version": version
    },
    beforeSend: function (request) {
      request.setRequestHeader("apikey", apikey);
    },
    success: function (re) {
      reData = re;
    },
    error: function (re) {
      var str1 = JSON.stringify(re);
      re.code = 9;
      re.msg = str1;
      reData = re;
    }
  });
  return reData;
}

function reqAjaxAsync(cmd, data, async) {
  var apikey = sessionStorage.getItem('apikey') || 'test';
  var version = sessionStorage.getItem('version') || '1';
  var defer = $.Deferred();
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: async, //默认为异步
    data: {
      "cmd": cmd,
      "data": data || "",
      "version": version
    },
    beforeSend: function (request) {
      request.setRequestHeader("apikey", apikey);
    },
    success: function (data) {
      defer.resolve(data);
    },
    error: function (err) {
      console.log(err.msg);
    }
  });
  return defer.promise();
}


//分享代码
function share(title, desc, img) {
  var url = window.location.href;
  var apikey = sessionStorage.getItem('apikey') || 'test';
  var version = sessionStorage.getItem('version') || '1';
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dateType: "json",
    async: false,
    data: {
      "cmd": 'game/getSign',
      "data": '{"url":"' + url + '"}',
      "version": version
    },
    beforeSend: function (request) {
      request.setRequestHeader("apikey", apikey);
    },
    success: function (res) {
      wx.config({
        debug: false,
        appId: 'wxe50dd59beab1e644',
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      });
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: title,
          desc: desc,
          link: url,
          imgUrl: img
        });
        wx.onMenuShareAppMessage({
          title: title,
          desc: desc,
          link: url,
          imgUrl: img
        });
        wx.onMenuShareQQ({
          title: title,
          desc: desc,
          link: url,
          imgUrl: img
        });
        wx.onMenuShareWeibo({
          title: title,
          desc: desc,
          link: url,
          imgUrl: img
        });
        wx.onMenuShareQZone({
          title: title,
          desc: desc,
          link: url,
          imgUrl: img
        });
      })
    },
    error: function (res) {
      console.log(res);
    }
  });
}

//判断字段是否为空
function isNull(val) {
  if (val == null || val == "null" || val == undefined || val == '') {
    return '0';
  }
  return val;
}
