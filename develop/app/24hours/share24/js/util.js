// 微信二次分享
function share(d) {
    var data = JSON.stringify({
        url: location.href
    });
    reqAjaxAsync("game/getSign", data).done(function(res) {
        wx.config({  
            debug: false,
            appId: 'wxe50dd59beab1e644',
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQZone', 'onMenuShareQQ']
        });

        // 分享加载
        wx.ready(function() {
            //  朋友圈
            wx.onMenuShareTimeline({
                title: d.title, // 分享标题
                link: d.link, // 分享链接
                imgUrl: d.imgUrl, // 分享图标
                success: function() {},
                cancel: function() {}
            });
            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: d.title, // 分享标题
                desc: d.desc, // 分享描述
                link: d.link, // 分享链接
                imgUrl: d.imgUrl, // 分享图标
                success: function() {},
                cancel: function() {}
            });
            //  分享到微博
            wx.onMenuShareWeibo({
                title: d.title, // 分享标题
                desc: d.desc, // 分享描述
                link: d.link, // 分享链接
                imgUrl: d.imgUrl, // 分享图标
                success: function() {},
                cancel: function() {}
            });
            //  分享qq空间
            wx.onMenuShareQZone({
                title: d.title, // 分享标题
                desc: d.desc, // 分享描述
                link: d.link, // 分享链接
                imgUrl: d.imgUrl, // 分享图标
                success: function() {},
                cancel: function() {}
            });
            //  分享qq
            wx.onMenuShareQQ({
                title: d.title, // 分享标题
                desc: d.desc, // 分享描述
                link: d.link, // 分享链接
                imgUrl: d.imgUrl, // 分享图标
                success: function() {},
                cancel: function() {}
            });
        });
    });
}

function reqAjaxAsync(cmd, data) {
    var deferr = $.Deferred();
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号

    var reData;
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dateType: "json",
        data: {
            "cmd": cmd,
            "data": data,
            "version": version
        },
        beforeSend: function(request) {
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            deferr.resolve(re);
        },
        error: function(re) {
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return deferr.promise();
}

function formatImg(html) {
    var newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
        var match = match.replace(/style=\"(.*)\"/gi, '');
        return match;
    });
    return newContent;
}

//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "undefined" || val == "") {
        return true;
    }
    return false;
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

// 根据转文赚需求控制评论和礼包是否显示
function isShowFn() {
    if (getUrlParams("isComment") == 1) {
        $(".isComment").hide();
    }
    if (getUrlParams("isPack") == 1) {
        $(".isPack").hide();
    }
}

// 重设获取的校验码
function setMacId(articleId, code){
	var num = parseInt(articleId) * 32 + '';
	var numArr = num.split('');
	for(var i=0; i<4; i++) if(!numArr[i]) numArr[i] = 0;
	var reg = new RegExp(/\w{8,8}/g);
	var codeArr = code.match(reg);
	var result = []
	for(var i=0; i<4; i++) {
		result.push(codeArr[i]);
		result.push(numArr[i]);
	}
	return result.reverse().join('');
}

$(function() {
    isShowFn();
});