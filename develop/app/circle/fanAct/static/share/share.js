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