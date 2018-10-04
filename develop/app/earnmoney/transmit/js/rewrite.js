function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

var browers;
var isSmartCity = false;
var userid;
var taskid;
var macid;
function GetBrower() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	isSmartCity = u.indexOf('SmartCity') > -1; //是否在APP内部
	if (isAndroid)
		return "android" + (isSmartCity ? ".sc" : "");
	if (isiOS)
		return "ios" + (isSmartCity ? ".sc" : "");

	return "else";
}

// 重设地址
function setMacId(userId, reprintId, macId){
	var num = parseInt(userId) * parseInt(reprintId) + '';
	var numArr = num.split('');
	for(var i=0; i<4; i++) if(!numArr[i]) numArr[i] = 0;
	var reg = new RegExp(/\w{8,8}/g);
	var macIdArr = macId.match(reg);
	var result = []
	for(var i=0; i<4; i++) {
		result.push(macIdArr[i]);
		result.push(numArr[i]);
	}
	return result.reverse().join('');
}

var ReWrite = function () {

	var ajaxIframe = function () {
		//ajax请求
		//暂无，模拟数据
		//jsondata=json;
		$('#errorBlock a').attr('href', window.location.href)
		$.ajax({
			type: 'POST',
			url: '/zxcity_restful/ws/rest',
			headers:{
				apikey: sessionStorage.getItem('apikey') || 'test'
			},
			//url:'json/info.json',
			dataType: 'json',
			data: {
				'cmd': 'earnmoney/updateReadnum',
				'data': "{'userId':" + userid + ",'reprintId':"+ taskid + ",'macId':'"+ macid +"'}",
				'version': 2
			},
			success: function (data) {
				if (data.code == 1 && data.data != null) {
					// 还需要给iframe下的礼包设置参数……
					var yw = GetQueryString('yw');
					var cp = GetQueryString('cp');
					$('#mainframe').attr('src', data.data.taskUrl + '&isComment=1&yw='+yw+'&cp='+cp);
					$('title').text(data.data.taskTitle);
					share(data.data.taskTitle, data.data.taskTitle, data.data.taskPic)
				} else if(data.code == 8) {
					$('#wrap').hide();
					$('#errorBlock').show();
					$('#errorBlock p').text(data.msg);
				} else {
					$('#wrap').hide();
					$('#errorBlock').show();
					$('#errorBlock p').text('数据获取失败，请重试～');
				}
			},
			error: function (xhr, type) {
				if (browers == "android.sc") {
					window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				} else if (browers == "ios.sc") {
					htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				}
				$('#wrap').hide();
				$('#errorBlock').show();
				$('#errorBlock p').text('请求失败！请检查网络连接～');
			}
		});
	}
	
	return {
		//main function to initiate the module
		init: function () {
			browers = GetBrower();
			userid = GetQueryString("userid");
			taskid = GetQueryString("reprintid");
			// Fingerprint2跟踪方法为异步，暂定这样调整
			new Fingerprint2().get(function(result, components){
				macid = setMacId(userid, taskid, result);
				ajaxIframe()
			});
		}

	};
}
();