

var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

/**
 * 获取地址栏URL里的参数集
 */
function getParams(url) {
	// var url = location.search;
	var params = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
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
	if(r != null) return unescape(r[2]);
	return null;
}



/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */

function reqAjaxAsync(cmd, data, async) {
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
			layer.load(2, {
				shade: [0.1, '#fff']
			});
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

