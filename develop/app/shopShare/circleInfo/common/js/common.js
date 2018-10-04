/**
 * Created by Administrator on 2018/8/31.
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
var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

//ajax验证是否匹配key值
function isApikey(res) {
    if (res.code == 8) {
        console.log(res.msg)
    }
}

/**
 * 根据参数名获取地址栏URL里的参数
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址
 * @param data 接入参数
 */
function reqNewAjax(cmd, d) {
    var reData;
    $.ajax({
        type: "POST",
        url: '/zxcity_restful/ws/rest',
        dataType: "json",
        async: false,
        data: {
            cmd: "cms_new/" + cmd,
            data: JSON.stringify(d),
            version: version
        },
        beforeSend: function(request) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            layer.closeAll('loading');
            reData = re;
            if (re.code == "401") {
                layer.msg(re.msg);
//              location.href = "login.html";
            }
        },
        error: function(re) {
            layer.closeAll('loading');
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}

function reqAjax(cmd, data) {
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
        beforeSend: function(request) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            layer.closeAll('loading');
            isApikey(re);
            reData = re;
            if (reData.code != 1) {
                layer.msg(reData.msg);
            }
        },
        error: function(re) {
            layer.closeAll('loading');
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}

function reqAjaxAsync(cmd, data, async, successfn) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
//          layer.load(0, {
//              shade: [0.1, '#fff']
//          });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
//          layer.closeAll('loading');
            isApikey(data);
            defer.resolve(data);
        },
        error: function(err) {
//          layer.closeAll('loading');
//          layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}


//判断进入app还是应用商品方法
function openApp(){

    //跳转app商品详情页地址
    var jumpParams = getUrlParams("jumpParams") || "";
    var $ios_app = "smartCity://iOS/gateway?jumpParams=" + jumpParams,
        $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams,
        $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782",
        $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //页面跳转app or 商店

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
                    if (Date.now() - last < 2000) {
                        window.location.href = $android_url;
                    }
                }, 1000);
            } else {
                //android微信
                $(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            }
            //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
                //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href = $ios_url;
                }, 250);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        } else {
            //判断为pc
            window.location.href = $android_url;
        }

}

// 获取url地址
function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
}
//点击图片放大
function toBigPic(pos,e) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = [];
    var getItems = function () {
        var aDiv = e.parent().find("img");
        for(var i=0;i<aDiv.length;i++){
            var item = {
                src: aDiv[i].src,
                w: aDiv[i].naturalWidth,
                h: aDiv[i].naturalHeight
            };
            items.push(item);
        }
    };

    getItems();

    // define options (if needed)
    var options = {
        // history & focus options are disabled on CodePen
        // history & focus options are disabled on CodePen
        history: false,
        focus: false,
        index: pos,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
        barsSize: {
            top: 100,
            bottom: 100
        },
        fullscreenEl : false,
        shareButtons: [
            {id:'download', label:'保存图片', url:'{{raw_image_url}}', download:true}
        ]
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

//返回上一页
function back(){
    window.history.go(-1);
}

$("#shade").on("click",function(){

    $('#model').hide();
    $(this).hide();
});
$("#model").on("click",function(){

    $('#shade').hide();
    $(this).hide();
});