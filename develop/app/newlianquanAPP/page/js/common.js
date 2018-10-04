var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
function reqAjaxAsync(cmd, data, async, successfn) {
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
			request.setRequestHeader("apikey", apikey);
		},
		success: function(data) {
			defer.resolve(data);
		},
		error: function(err) {}
	});
	return defer.promise();
}

//获取参数
function getParams(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return decodeURI(r[2]);
	}
	return null;
};

var com = {
	tooltip: function(content, url) {
		var html = '<div class="none" id="msg" style="z-index:9999;left: 5%;width: 50%;position: fixed;background:none;top:50%; transform: translateX(40%);"> <p class="msg" style="background: none repeat scroll 0 0 #000; border-radius: 30px;color: #fff; margin: 0 auto;padding: 0.5em;font-size:1.2rem;text-align: center;width: 50%;opacity: 0.9;"></p></div>';
		$(document.body).append(html);
		$("#msg").show();
		$(".msg").html(content);
		if(url) {
			window.setTimeout("location.href='" + url + "'", 1500);
		} else {
			setTimeout('$("#msg").remove()', 3000);
		}
	},
}

//时间格式化
Vue.filter('date', function(time) {
	let oldDate = new Date(time)
	let newDate = new Date()
	var dayNum = "";
	var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;
	if(getTime < 60 * 5) {
		dayNum = "刚刚";
	} else if(getTime >= 60 * 5 && getTime < 60 * 60) {
		dayNum = parseInt(getTime / 60) + "分钟前";
	} else if(getTime >= 3600 && getTime < 3600 * 24) {
		dayNum = parseInt(getTime / 3600) + "小时前";
	} else if(getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
		dayNum = parseInt(getTime / 3600 / 24) + "天前";
	} else if(getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
		dayNum = parseInt(getTime / 3600 / 24 / 30) + "个月前";
	} else if(time >= 3600 * 24 * 30 * 12) {
		dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + "年前";
	}

	let year = oldDate.getFullYear();
	let month = oldDate.getMonth() + 1;
	let day = oldDate.getDate();
	let hour = oldDate.getHours();
	let minute = oldDate.getMinutes();
	let second = oldDate.getSeconds();
	return dayNum;
});

Vue.filter('getDate', function(date) {
	return date.substring(0, 10)
})