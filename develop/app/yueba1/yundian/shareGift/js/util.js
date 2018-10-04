//从url获取参数
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
  var apikey = sessionStorage.getItem('apikey') || "test";	//获取缓存 通行证码
  var version = sessionStorage.getItem('version') || "1";	//获取缓存 版本号
  var reData;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": data,
      "version": version
    },
    beforeSend: function (request) {
      /*layer.load(0, {shade: [0.1, '#fff']});*/
      request.setRequestHeader("apikey", apikey);
    },
    success: function (re) {
      /*layer.closeAll('loading');*/
      reData = re;
    },
    error: function (re) {
      /*layer.closeAll('loading');*/
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
      request.setRequestHeader("apikey", apikey);
    },
    success: function (data) {
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
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dateType: "json",
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

//手机正则匹配
function is_mobile(val) {
  var reg = /^1[3,5,7-8][0-9]{9}$/i;
  return reg.test(val);
}
