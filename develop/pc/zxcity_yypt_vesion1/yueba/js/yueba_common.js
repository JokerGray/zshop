var apikey = yyCache.get('apikey',"test"); //获取缓存 通行证码
var version = yyCache.get('version',"1"); //获取缓存 版本号
var userId = yyCache.get("userId");
// 未登录，直接跳转到登录页
if (!userId) {
    sessionStorage.clear();
    if(window.layer){
        window.layer.msg('登录异常，请重新登录！');
        setTimeout(function() {
            yyCommon.logout();
        }, 3000);
    } else{
        yyCommon.logout();
    }
    

}

// 自定义ajax方法
function myAjax(cmd, data, successFunc, errorFunc, completeFunc) {
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        data: {
            "cmd": cmd,
            "data": data,
            "version": version
        },
        beforeSend: function(request) {
            layer.load(0, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            if (typeof successFunc == 'function') successFunc(re);
        },
        error: function() {
            layer.msg('系统繁忙！', { icon: 2 });
            if (typeof errorFunc == 'function') errorFunc()
        },
        complete: function() {
            layer.closeAll('loading');
            if (typeof completeFunc == 'function') completeFunc()
        }
    });
}
// 随机名称，共36位
function randomName(len) {
    len = len || 23;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return new Date().getTime() + str;
}
// 获取查询参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// oss参数定义
var OSSParams;
// 获取oss参数，返回deferred
function getOssParams() {
    var defer = $.Deferred();
    /// 若参数存在且未超时，直接返回之前的数据，否则ajax请求数据
    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        OSSParams.randomName = randomName();
        defer.resolve(OSSParams);
    } else {
        $.ajax({
            url: '/zxcity_restful/ws/oss/ossUpload',
            dataType: 'json',
            success: function(data) {
                OSSParams = data;
                OSSParams.randomName = randomName();
                defer.resolve(data);
            },
            error: function() {
                layer.msg('上传参数获取失败！', {
                    icon: 2
                })
            }
        });
    }
    return defer.promise();
}