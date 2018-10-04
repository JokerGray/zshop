function getParams(){
	var url = location.search;
	var params = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return params;
}

//根据参数名获取地址栏URL里的参数
function getUrlParams(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		return decodeURI(decodeURIComponent(r[2]));
	}
	return "";
}

function load(){
	document.addEventListener('touchmove',touch, false);

	function touch (event){
		var event = event || window.event;
		switch(event.type){
			case "touchmove":
				event.preventDefault();
		}
	}
}
//window.addEventListener('load',load, false);


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



function isVisible(obj){
    var ret = true;
    if(obj.style.display === "none"){
        ret = false;
    }
    return ret;
}


function backZxcityStoreApp(){
	var ua = navigator.userAgent;
	if(ua.match(/iPhone|iPod/i) != null){
		document.location = 'backZxcityStoreApp://';
	}else if(ua.match(/Android/i) != null){
		document.location = 'intent:com.cnblogs.cn.client.android;end';
	}else if(ua.match(/iPad/i) != null){
		document.location = 'backZxcityStoreApp://';
	}
}

function getStringFomat(str){
	return str == null ? "-" : str;
}

function formatAllDate(date, _formate){
	var paddNum = function(num){
	      num += "";
	      return num.replace(/^(\d)$/,"0$1");
	    };
	    //指定格式字符
	    var cfg = {
	       yyyy : date.getFullYear(), //年 : 4位
	       yy : date.getFullYear().toString().substring(2),//年 : 2位
	       M  : date.getMonth() + 1,  //月 : 如果1位的时候不补0
	       MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
	       d  : date.getDate(),   //日 : 如果1位的时候不补0
	       dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
	       hh : paddNum(date.getHours()),  //时
	       mm : paddNum(date.getMinutes()), //分
	       ss : paddNum(date.getSeconds()) //秒
	    };
	    var format = _formate ? _formate : "yyyy-MM-dd hh:mm:ss";
	    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
};

//比较两个日期的大小  startdate：较近的日期  enddate：较远的日期
function compareDate(startdate,enddate){
	var arr=startdate.split("-");
	var starttime=new Date(arr[0],arr[1],arr[2]);
	var starttimes=starttime.getTime();

	var arrs=enddate.split("-");
	var lktime=new Date(arrs[0],arrs[1],arrs[2]);
	var lktimes=lktime.getTime();

	if(starttimes>=lktimes){
		return false;
	}else{
		return true;
	}
};
