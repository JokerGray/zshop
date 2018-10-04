//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
        return true;
    }
    return false;
}

//获取参数
function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
}

//同步ajax
function reqAjax(cmd, data) {
    var apikey = getUrlParams('apikey') || 'test';
    var version = getUrlParams('version') || '1';
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
                time: 10 * 1000
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            layer.closeAll('loading');
            reData = re;
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

//异步ajax
function reqAjaxAsync(cmd, data) {
    var apikey = getUrlParams('apikey') || 'test';
    var version = getUrlParams('version') || '1';
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "JSON",
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(0, {
                time: 10 * 1000
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
            layer.closeAll('loading');
            /*defer.resolve(JSON.parse(html2Escape(JSON.stringify(data))));*/
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

//防脚本注入匹配
function html2Escape(sHtml) {
    return sHtml.replace(/</g, "&lt").replace(/>/g, "&gt");
}

//跳转方法
function changeMenuClik(menuid, backCtx) {
    if (typeof(exec_obj) == 'undefined') {
        exec_obj = document.createElement('iframe');
        exec_obj.name = 'IFRAME_TMPA';
        exec_obj.src = backCtx + '/assets/common.html?method=changeMenuClik&menuid=' + menuid + '&r=' + Math.random();
        exec_obj.style.display = 'none';
        document.body.appendChild(exec_obj);
    } else {
        exec_obj.src = backCtx + '/assets/common.html?method=changeMenuClik&menuid=' + menuid + '&r=' + Math.random();
    }
}