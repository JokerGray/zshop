$(function(){
	var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号		
	var homepage = function(){
		this.gameFamilyIndex="gameFamilyIndex";
		this.newFamilyTrends="newFamilyTrends";
		this.hotFamilyTrends="hotFamilyTrends";
		this.eliteFamilyTrends="eliteFamilyTrends";
		this.newData={
			"page": "0",
			"familyId": "2",
			"row": "10"
		}
	}
	homepage.prototype={
		newFamilyTrendsMethod:function(d){
			var _this = this;
			reqAjaxAsync(this.newFamilyTrends, d).done(function(res) {
				console.log("res")
			})	
		}
	}
	var faceCircle= new homepage();

	faceCircle.newFamilyTrendsMethod(JSON.stringify(faceCircle.newData));


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
})