$(function(){
    var CMD_XUAN="dazzle/findDazzleDetail";
    //异步请求Ajax
    function reqNewAjaxAsync(url, cmd, data, async) {
        var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
        var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
        var defer = $.Deferred();
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            async: async || true, //默认为异步
            data: {
                "cmd": cmd,
                "data": JSON.stringify(data) || "",
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
                layer.msg("系统繁忙，请稍后再试!");
                console.log(err.status + ":" + err.statusText);
            }
        });
        return defer.promise();
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

var DAZZLEID=GetQueryString('dazzleid');
var USERID=GetQueryString('userid');
var queryData={
        dazzleId:DAZZLEID,
        userId:USERID
    }
    reqNewAjaxAsync('/zxcity_restful/ws/rest',CMD_XUAN, queryData).done(function (res) {
        console.log(res);
        var html=template('queryXuan',res);
        document.getElementById('content').innerHTML = html;
        $('.playbtn').on('click',function(){
            $('.video_play').hide();
            $('#myVd').show();
            $('#myVd')[0].play();
        });
    })

});