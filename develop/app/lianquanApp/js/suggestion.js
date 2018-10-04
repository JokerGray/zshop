$(function() {
	function telTest(tel) {
		var reg = /^1[34578]\d{9}$/;
		return reg.test(tel);
	}

	function getParam() {
		var url = location.search;
		var params = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return params;
	}
	var subCmd="feedback/addUserFeedback";
	var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
	var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号		
	
	function reqAjaxAsync(cmd, data, callback) {
		var inputdata = data;
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: true, //默认为异步
			data: {
				"cmd": cmd,
				"data": data || "",
				"version": version
			},
			beforeSend: function(request) {
				layer.load(2);
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				layer.closeAll('loading');
				callback(res);
			},
			error: function(err) {
				layer.closeAll('loading');
				layer.msg("系统繁忙，请稍后再试!");
				console.log(err.status + ":" + err.statusText);
			}
		});
	}	
	
	function submitSuccess(){
		layer.msg("成功提交！");
		setTimeout(function(){
			window.location.reload();
		},1e3);
	}
	
	
	
	
	var params=getParam();
	var userId=params.userId;
	console.log(userId);

	$("#textInput").keyup(function() {
		var lengthLf =400-$(this).val().length;
		$("#inputNum").text(lengthLf);
	});
	runupload($("#hidBtn"), $("#inputBtn"));
	$("#inputBtn").on("click", function() {
		var imgNum = $(".imgBox").length;
		console.log(imgNum);
		if (imgNum < 9) {
			$("#hidBtn").siblings("div").children("input").trigger("click");
		} else {
			layer.msg("最多上传9张图片！");
		}
	});
	$("#submits").on("click", function() {
		var content = $("#textInput").val(),
			pics = "",
			phone = $("#tel").val();
			for (var i = 0; i < $(".imgBox").length; i++) {
				var srcs = $($(".imgBox")[i]).children("img").attr("src");
				if(pics==""){
					pics=srcs;
				}else{
					pics += "," + srcs;
				}
			}

		if (content == "") {
			layer.msg("请发表您的意见吧！");
			return false;
		}
		if (pics == "") {
			layer.msg("请上传至少一张图片！");
			return false;
		}
		if (phone != "") {
			if (!telTest(phone)) {
				layer.msg("请正确填写手机号码！");
				return false;
			}
		}
		var submitObj={
			"userId":userId,
			"content":content,
			"pics":pics,
			"phone":phone
		};
		var subData=JSON.stringify(submitObj);
		reqAjaxAsync(subCmd, subData, submitSuccess);
	});

});