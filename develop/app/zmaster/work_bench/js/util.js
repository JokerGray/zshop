

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
            layer.load(2, { shade: [0.1, '#fff'] });
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


/**
 * @desc 金额转换，保留2位小数并四舍五入
 * @author：qiurui
 * @param  num / string : 1000.59
 * @return string : 1,000.60
 */
function getMoneyFormat(number) {
    number = number + ''; //数字转换成字符串
    number = number.replace(/\,/g, ""); //将 , 转换为空
    //判断是否是数字
    if (isNaN(number) || number == "") {
        return "";
    }
    //四舍五入,保留2位
    number = Math.round(number * 100) / 100;
    //是否是负数
    if (number < 0) {
        return '-' + getFormatYuan(Math.floor(Math.abs(number) - 0) + '') + getFormatCents(Math.abs(number) - 0);
    } else {
        return getFormatYuan(Math.floor(number - 0) + '') + getFormatCents(number - 0);
    }
    //格式化整数
    function getFormatYuan(number) {
        //判断是否是0.几几
        if (number.length <= 3) {
            return (number == '' ? '0' : number);
        } else {
            var mod = number.length % 3; //求余
            //截取字符开头的数字
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                //mod==0 && i==0 说明数字的长度被3整除；第一次循环的时候截取（0,3）位
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            return (output);
        }
    }
    //格式化小数
    function getFormatCents(amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
    }
}
