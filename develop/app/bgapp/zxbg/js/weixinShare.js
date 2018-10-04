	// 转发微信
	function weixin(titles,imgurl,introduce,apikey,version){
		var url=window.location.href;
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			async: true,
			data: {
				"cmd": "game/getSign",
				"data": '{"url":"' + url + '"}',
				"version": version
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				console.log(res);
	            wx.config({
	                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	                appId: 'wxe50dd59beab1e644', // 必填，公众号的唯一标识  正式环境wx18be8421db23061e  测试环境wx18be8421db23061e
	                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
	                nonceStr:res.data.nonceStr, // 必填，生成签名的随机串
	                signature:res.data.signature,// 必填，签名，见附录1
	                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
	                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	            });

		        wx.ready(function () {
		            wx.onMenuShareTimeline({
		            	title:introduce,
		            	link:location.href,
		            	imgUrl:imgurl,
		                success: function(){},
		                cancel: function(){}
		            });
		            wx.onMenuShareAppMessage({
		            	title:titles,
		            	desc:introduce,
		            	link:location.href,
		            	imgUrl:imgurl,
		                success: function(){},
		                cancel: function(){}
		            });
		            wx.onMenuShareQQ({
		            	title:titles,
		            	desc:introduce,
		            	link:location.href,
		            	imgUrl:imgurl,
		                success: function(){},
		                cancel: function(){}
		            });
//		            wx.onMenuShareWeibo({
//		            	title:titles,
//		            	desc:introduce,
//		            	link:location.href,
//		            	imgUrl:imgurl,
//		                success: function(){},
//		                cancel: function(){}
//		            });
		            wx.onMenuShareQZone({
		            	title:titles,
		            	desc:introduce,
		            	link:location.href,
		            	imgUrl:imgurl,
		                success: function(){},
		                cancel: function(){}
		            });
		        });
			},
			error: function(res) {
				console.log(res);
			}
		});	
	}
