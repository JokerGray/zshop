var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
function reqAjaxAsync(cmd, data, async, successfn) {
	var defer = $.Deferred();
	var d = isNull(data) ? "" : JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		dataType: "json",
		async: async || true, //默认为异步
		data: {
			"cmd": cmd,
			"data": d || "",
			"version": version
		},
		beforeSend: function(request) {
			layer.load(1);
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

//获取参数
function getParams(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	}
	return null;
};

//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "undefined" || val == "") {
        return true;
    }
    return false;
}

function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
}  

function getTimeStr(currTime, createTime) {
    var createTime = Date.parse(new Date(createTime));
    var timeInterval = parseInt((currTime - createTime) / 1000);
    var result = "";
    var temp = "";
    if (timeInterval < 60) {
        result = "刚刚";
    } else if ((temp = timeInterval / 60) < 60) {
        result = parseInt(temp) + "分钟前";
    } else if ((temp = temp / 60) < 24) {
        result = parseInt(temp) + "小时前";
    } else if ((temp = temp / 24) < 30) {
        result = parseInt(temp) + "天前";
    } else if ((temp = temp / 30) < 12) {
        result = parseInt(temp) + "个月前";
    } else {
        result = parseInt(temp / 12) + "年前";
    }
    return result;
}