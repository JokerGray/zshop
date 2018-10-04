//获取url参数
function getUrlParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    return decodeURI(decodeURIComponent(r[2]));
  }
  return "";
}

//同步ajax
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

//异步ajax
function reqAjaxAsync(cmd, data) {
  var apikey = sessionStorage.getItem('apikey') || 'test';
  var version = sessionStorage.getItem('version') || '1';
  var defer = $.Deferred();
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    data: {
      "cmd": cmd,
      "data": data || "",
      "version": version
    },
    beforeSend: function (request) {
      /*layer.load(0, {time: 10 * 1000});*/
      request.setRequestHeader("apikey", apikey);
    },
    success: function (data) {
      layer.closeAll('loading');
      defer.resolve(data);
    },
    error: function (err) {
      layer.closeAll('loading');
      layer.open({
        content: '系统繁忙,请稍后再试!',
        skin: 'msg',
        time: 2
      });
      console.log(err.status + ":" + err.statusText);
    }
  });
  return defer.promise();
}

//分享代码
function share(title, desc, img) {
  var url = window.location.href;
  var apikey = sessionStorage.getItem('apikey') || 'test';
  var version = sessionStorage.getItem('version') || '1';
  var $meta1 = $('<meta itemprop="name" content="' + title + '" />');
  var $meta2 = $('<meta itemprop="description" name="description"  content="' + desc + '" />');
  var $meta3 = $('<meta itemprop="image" content="' + img + '" />');

  $('head').append($meta1).append($meta2).append($meta3);
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

//返回时分
function formatDateTime(now) {
  var date_format = now.split('-').join('/')
  var d = new Date(date_format);
  var hour = parseInt(d.getHours());
  var minute = parseInt(d.getMinutes());
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return hour + ":" + minute;
}

//返回月日
function formatDate(now) {
  var date_format = now.split('-').join('/')
  var d = new Date(date_format);
  var month = parseInt(d.getMonth()) + 1;
  var day = parseInt(d.getDate());
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return month + "-" + day;
}