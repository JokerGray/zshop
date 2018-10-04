$(function () {
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
    var queryId=GetQueryString('id');
    var cmd = "payAU/selUserLogById";
    var data = { id:queryId,modelType:1};
    var datas = JSON.stringify(data);
    reqAjaxAsync(cmd, datas, orderDetail);
    function reqAjaxAsync(cmd, data, callback) {
        var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
        var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: true, //默认为异步
            data: {
                "cmd": cmd,
                "data": data || "",
                "version": version
            },
            beforeSend: function (request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function (res) {
                callback(res);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function orderDetail(res) {
        console.log(res);
        if(res.code==1){
            if(res.data.scAccountUserLog.billType==3){
                var hdhtml1 = template('tradeBill', res.data);
                document.getElementById('head').innerHTML = hdhtml1;
            }else{
                var hdhtml2= template('trade', res.data);
                document.getElementById('head').innerHTML = hdhtml2;
            }
            var html = template('billCont', res.data);
            document.getElementById('bills').innerHTML = html;            
        }else{
            $('body').html('<p class="nodatas">暂无数据...</p>');
            $('#head').hide();
            $('#bills').hide();
        }
    }
});