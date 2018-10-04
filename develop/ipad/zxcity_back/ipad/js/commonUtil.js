function reqAjax(cmd, data){

    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

    var reData;
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dateType: "json",
        async: false,
        data: {
            "cmd": cmd,
            "data": data,
            "version": version
        },
        beforeSend: function(request){
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re){
            reData = re;
        },
        error: function(re){
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}