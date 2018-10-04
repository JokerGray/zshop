    //根据参数名获取地址栏URL里的参数
    function getUrlParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
        }
        return "";
    }
    // ajax方法
    function reqAjax(cmd,url,data){
        return new Promise(function(resolve,reject){
            var apikey = sessionStorage.getItem('apikey') || "test";
            var version = sessionStorage.getItem('version') || "1";
            var queryData={
                    "cmd": cmd,
                    "data": JSON.stringify(data),
                    "version":version
            }
            // 序列化data
            var oStr='';
        　　for(var key in queryData){
        　　　　oStr += key+"="+queryData[key]+"&";
        　　};
            // 创建ajax对象
            var xhr=null;
            if(window.XMLHttpRequest){
                xhr=new XMLHttpRequest();
            }else{
                xhr=new ActiveXObject('Microsoft.XMLHTTP');
            }
            // POST请求
            xhr.open('POST',url,true);
            xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('apikey',apikey);              
            xhr.send(oStr);
            // 监控服务器响应
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        var res=JSON.parse(xhr.responseText);
                        resolve([res,data]);
                    }else{
                        reject(xhr.status)
                    }
                }
            }       
        });
    }
//异步请求Ajax
function reqNewAjaxAsync(url, cmd, data, async) {
    var defer = $.Deferred();
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
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
        beforeSend: function(request) {
            layer.load(0, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
            layer.closeAll('loading');
            defer.resolve(data);
        },
        error: function(err) {
            layer.closeAll('loading');
            layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}
