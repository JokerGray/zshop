function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var shopId=GetQueryString('shopId') || '';
var gData = {
    "shopId": shopId
}
    function reqAjaxAsync(cmd, data, async) {
        var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
        var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
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
            beforeSend: function (request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function (data) {
                console.log(data);
                defer.resolve(data);
            },
            error: function (err) {
                $('.WindowBox').addClass('hide').removeClass('show');
                $('#warningMsg').html("系统繁忙，请稍后再试!");
            }
        });
        return defer.promise();
    }
    reqAjaxAsync('coupon/selectScCouponExchange', JSON.stringify(gData)).done(function (res){
        if (res.code == 1) {
            if (res.data != null) {
                var goodsName=res.data.goodsName;
                var array=goodsName.split(',');
                for(var i=0;i<array.length;i++){
                    var arrlist=array[i];
                    if(i<2){
                        $('.r_con').append($('.info').first().clone().removeClass('hidden')).children().eq(i+2).find('#amountMin').text(xx);
                    }else{
                        $('.r_con').append($('.info').first().clone().removeClass('hidden')).children().eq(i+2).find('#amountMin').text('...').addClass('Libao');
                    }
                }
            } else {
                return alert("没有兑换礼包");
            }
        } else {
            alert(res.msg);
        }
    })