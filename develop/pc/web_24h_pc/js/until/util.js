var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
/**
 * 检查登录状态
 */
function checkUserLogin() {
	if(sessionStorage.getItem("scSysUserInfo") == null) {
		//alert('您还没有登录！');
		location.href = 'login.html';
		return false;
	} else {
		var scSysUserInfo = JSON.parse(sessionStorage.getItem("scSysUserInfo"));
		console.log('当前登录平台ID：' + scSysUserInfo.id);
		console.log('当前登录平台用户：' + scSysUserInfo.username);
	}
}
/**
 * 获取地址栏URL里的参数集
 */
function getParams() {
	var url = location.search;
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
function getUrlParams(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		return decodeURI(decodeURIComponent(r[2]));
	}
	return "";
}
/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */
function reqAjax(cmd, data) {
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
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(re) {
			reData = re;
		},
		error: function(re) {
			var str1 = JSON.stringify(re);
			re.code = 9;
			re.msg = str1;
			reData = re;
		}
	});
	return reData;
}

function reqAjaxAsync(cmd, data, async, successfn) {
	var defer = $.Deferred();
	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		dateType: "json",
		async: async || true, //默认为异步
		data: {
			"cmd": cmd,
			"data": data || "",
			"version": version
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(data) {
			defer.resolve(data);
		},
		error: function(err) {
			console.log(err.status + ":" + err.statusText);
		}
	});
	return defer.promise();
}

/**
 * 指定格式化日期字符串
 */
function formatAllDate(date, _formate) {
	var paddNum = function(num) {
		num += "";
		return num.replace(/^(\d)$/, "0$1");
	};
	var cfg = {
		yyyy: date.getFullYear(), //年 : 4位
		yy: date.getFullYear().toString().substring(2), //年 : 2位
		M: date.getMonth() + 1, //月 : 如果1位的时候不补0
		MM: paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
		d: date.getDate(), //日 : 如果1位的时候不补0
		dd: paddNum(date.getDate()), //日 : 如果1位的时候补0
		hh: paddNum(date.getHours()), //时
		mm: paddNum(date.getMinutes()), //分
		ss: paddNum(date.getSeconds()) //秒
	};
	var format = _formate ? _formate : "yyyy-MM-dd hh:mm:ss";
	return format.replace(/([a-z])(\1)*/ig, function(m) { return cfg[m]; });
};