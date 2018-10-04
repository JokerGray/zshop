var $;
layui.use(['jquery'], function() {
	$ = layui.jquery
})

		
var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
var passwordExp = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9a-zA-Z]{6,16}$/; //密码正则
var messageExp = /^[0-9]{6}$/; //验证码正则
var nameExp = /^[\u4E00-\u9FA5]{2,10}$/; //真实姓名
var emailExp = /^[a-z0-9]+([._\-]*[a-z0-9])*@([-a-z0-9]*[a-z0-9]+.){2,63}[a-z0-9]+$/i; //邮箱绑定
var videoExp = /[·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*]{1,20}$/g; //视频
var address = /^[A-Za-z0-9#\(\)（）\u4E00-\u9FA5]{1,50}$/; //地址
var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/; //金额
var idcard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证
var $company_name = /^[A-Za-z\u4E00-\u9FA5]{1,90}$/; //企业名称
var $website = /^((http:\/\/)|(https:\/\/))[0-9a-zA-Z-.]{1,90}$/; //网址

//校验正则表达式
function reg(val, exp) {
	if(!exp.test(val)) {
		return false;
	} else {
		return true;
	}
}
//判断视频名称
function is_video(val) {
	return reg(val, videoExp);
}
//判断地址
function is_address(val) {
	return reg(val, address);
}
//判断金额
function is_amount(val) {
	return reg(val, amountExp);
}
//判断真实姓名正则
function is_name(val) {
	return reg(val, nameExp);
}
//判断手机正则
function is_mobile(val) {
	return reg(val, mobileExp);
}
//判断密码正则
function is_password(val) {
	return reg(val, passwordExp);
}
//判断验证码正则
function is_message(val) {
	return reg(val, messageExp);
}
//判断推荐码正则
function is_okey(val) {
	return reg(val, okeyExp);
}
//判断邮箱正则
function is_email(val) {
	if(val.length > 50) {
		return false;
	}
	return reg(val, emailExp);
}
//判断企业名称
function is_company_name(val) {
	return reg(val, $company_name);
}
//判断省份
function is_province(val) {
	return reg(val, $province);
}
//判断城市
function is_city(val) {
	return reg(val, $city);
}
//判断身份证方法
function is_identity(id) {
	var strlen = id.length;
	if(strlen != 18) {
		return false;
	}
	var set = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var ver = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
	var arr = id.split("");
	var sum = 0;
	for(var i = 0; i < 17; i++) {
		if(isNaN(arr[i])) {
			return false;
		}
		sum += arr[i] * set[i];
	}
	var mod = sum % 11;
	if(ver[mod] != arr[17]) {
		if(mod == 2) {
			if(arr[17] == "X" || arr[17] == "x") {
				return true;
			}
		}
		return false;
	}
	return true;
}

//计算倒计时,dom&时间戳
function countdown(dom, closeTime) {
	var displayTime;

	function showTime() {
		var day = Math.floor(closeTime / (60 * 60 * 24));
		var hour = Math.floor(closeTime / (3600)) - (day * 24);
		var minute = Math.floor(closeTime / (60)) - (day * 24 * 60) - (hour * 60);
		var second = Math.floor(closeTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		closeTime -= 1;
		var html = day + '天' + hour + '小时' + minute + '分' + second + '秒';
		dom.html(html);
		if(closeTime == -1) {
			clearInterval(displayTime);
			document.location.href = document.location.href;
			return;
		}
	}
	showTime();
	displayTime = setInterval(function() {
		showTime();
	}, 1000)
}

//把数组字符串转换为数字
function strToNum(arr) {
	var json = [];
	for(var i = 0; i < arr.length; i++) {
		json.push(arr[i] - 0);
	}
	return json;
}

//判断正整数加".00"
function isPositiveNum(s) {
	var re = /^[0-9]*[1-9][0-9]*$/;
	if(re.test(s)) {
		s = s + ".00";
	}
	return s;
}

/**
 * 操作cookie
 * @param key 
 * @param val
 * @param exp 有效期单位为秒
 */
function setCookie(key, val, exp) {
	var d = new Date();
	d.setTime(d.getTime() + exp * 1000); //1000为毫秒
	var expires = "expires=" + d.toUTCString();
	document.cookie = key + "=" + val + ";" + expires + ";path=/";
}

function getCookie(key) {
	var cookieArr = document.cookie.split(';');
	for(var i = 0; i < cookieArr.length; i++) {
		var u = cookieArr[i];
		u = u.replace(/(^\s*)|(\s*$)/g, '');
		var d = u.split('=');
		if(key == d[0]) {
			return d[1];
		}
	}
}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 数字动画
function countUp(dom, val) {
	var options = {  
		useEasing: true,
		useGrouping: true,
		separator: ',',
		decimal: '.',
		prefix: '',
		suffix: ''
	};
	var val = val - 0;
	var demo = new CountUp(dom, 0, val, 0, 1, options);
	demo.start();
}

//判断input输入长度
function inputLen(inputStar) {
	var bytesCount = 0;
	for(var i = 0; i < inputStar.length; i++) {
		var c = inputStar.charAt(i);
		bytesCount += 1;
	}
	return bytesCount;
}

//判断是否为空
function isNull(val) {
	if(val == null || val == "null" || val == undefined || val == "") {
		return true;
	}
	return false;
}

//删除数组指定元素
function removeByValue(arr, val) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}
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
function reqAjax(cmd, data) {
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
            layer.load(0, { shade: [0.1, '#fff'] });
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
			layer.load(0, {
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

/**
 * @desc 将时间戳转换为YYYY-MM-DD格式
 * @access public
 * @param 时间戳
 * @return string
 */
function formatDate(now) {
	var d = new Date(now * 1000);
	var month = parseInt(d.getMonth()) + 1;
	var day = parseInt(d.getDate());
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	return d.getFullYear() + "-" + month + "-" + day;
}

/**
 * @desc 将时间戳转换为YYYY-MM-DD HH:ii
 * @access public
 * @param
 * @return string
 */
function formatDateTime(now) {
	var d = new Date(now * 1000);
	var hour = parseInt(d.getHours());
	var minute = parseInt(d.getMinutes());
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	return formatDate(now) + " " + hour + ":" + minute;
}
