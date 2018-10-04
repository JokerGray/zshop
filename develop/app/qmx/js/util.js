/**
 * 获取地址栏URL里的参数集
 */
function getParams(url) {
    // var url = location.search;
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

/**
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
// ajax获取参数
function reqAjaxAsync(cmd, data, callback) {
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
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
        success: function (res) {
            // console.log(res);
            callback(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
// 微信内部分享
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

/**
 * 传入参数对象后输出传出的字符串
 */
function toadverHtml(){
    var yw=GetQueryString('yw'),
        sn=GetQueryString('sn');
    outstrHtml= "/24hours/share24/getPackage.html?yw="+yw+'&sn='+sn+'&cp=1';
    return outstrHtml;
}

    /**
     * 跳转到h5领取券页面
     */
    function getCoupon(){
    var outLink=toadverHtml();
    var jumpParams=GetQueryString("jumpParams")||"";
    // app跳转地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;	
    //判断为android
        if (navigator.userAgent.match(/android/i)) {
            //android非微信
            if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
            var last = Date.now();
            var doc = window.document;
            var ifr = doc.createElement('iframe');
            ifr.src = $android_app;
            ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
            doc.body.appendChild(ifr);

            setTimeout(function () {
                doc.body.removeChild(ifr);
                //setTimeout回小于2000一般为唤起失败
                if (Date.now() - last <4000) {
                window.location.href = outLink;
                }
            }, 3000);
            } else {
            //android微信
                $(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
                $(".model").show();
                $(".model").on("click",function(){
                    $(this).hide();
                });
                $(".model_cont").on("click",function(event){
                    event.stopPropagation();
                });
            }
            //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                $(".model").show();
                $(".model").on("click",function(){
                    $(this).hide();
                });
                $(".model_cont").on("click",function(event){
                    event.stopPropagation();
                });	
            //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $(".model").show();
                $(".model").on("click",function(){
                    $(this).hide();
                });
                $(".model_cont").on("click",function(event){
                    event.stopPropagation();
                });
            } else {
            window.location.href = $ios_app;
            setTimeout(function () {
                window.location.href =outLink;
            },3000);
            }
        } else {
            //判断为pc
            window.location.href =outLink;
        }	
}
// 跳转到视频页
function toHtml($dom){
    $dom.on('click',function(){
        var dazzleid=$(this).attr('data-dazzleid'),
            userid=$(this).attr('data-userid');
        var sn=GetQueryString('sn'),
            yw=GetQueryString('yw'),
            cp=1,
            jumpParams=GetQueryString('jumpParams');
        var htmlurl='qmxvd.html?dazzleid='+dazzleid+'&userid='+userid+'&sn='+sn+'&yw='+yw+'&cp='+cp+'&jumpParams='+jumpParams;
        console.log(htmlurl);
        window.location.href=htmlurl;
    })
}
function toAds(){
    var outLink=toadverHtml();
    window.location.href=outLink;
}