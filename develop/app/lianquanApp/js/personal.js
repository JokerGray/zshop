$(function(){
		/**
		 * 获得参数
		 * @param[Object] datas:入参参数对象
		 *				  params：地址栏数据对象
		 * @param[funtion] 参数函数
		 */
		var params=getParams();
		var otherUserId=(params.otherUserId||params.otherUserid),
			userId=(params.userId||params.userid),
			theodolite=params.theodolite;
		var datas={
			"otherUserId":Number(otherUserId),
			"userId":Number(userId),
			"theodolite":theodolite
		};

		var cmd="game/selectOthersDetails";
		ajaxAsy(cmd,datas,showContent);

		/**
		 * 获得参数
		 * @param[funtion] getParams:拿到地址栏参数,并返回对象
		 */
		function getParams() {
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
		/**
		 * 根据参数名获取地址栏URL里的参数
		 */
		function GetQueryString(name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) return unescape(r[2]);
		    return null;
		}
		/**
		 * ajax获取数据
		 * @param[str] cmd:接口字符串
		 * @param[obj] datas:入参对象
		 * @param[funtion] callback:成功后回调方法
		 */
		function  ajaxAsy(cmd,datas,callback) {
			var that = this;
			var version = sessionStorage.getItem('version') || "1", //获取缓存 版本号
				apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			console.log(datas);
			var data = JSON.stringify(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				async: true,
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log(re);
					callback(re);
				},
				error: function(re) {
					console.log(re);
				}
			});
		}
		/**
		 * 内容展示
		 * @param[obj] re:成功回调后数据
		 */
		function showContent(re){
			if(re.code==1){
				// 账号正常的时候
				if(re.data.boolAccount){
					var html = template('showCont', re);
					document.getElementById("content").innerHTML = html;
					$(".cont_box:last").css("border-bottom","none");
					// 跳转至app领奖券h5页面
					 $(".toApp").on("click",getCoupon);
					 var title="脸圈个人页";
					 var desc=(re.data.userMain.scGameUser.signature)?(re.data.userMain.scGameUser.signature):"暂无描述~";
					 var img=re.data.userMain.scGamePicture.fileUrl;
					 share(title,desc,img);				 
				}else{
					var html = template('showBlank', re);
					document.getElementById("content").innerHTML = html;
				}
			}else{
				var html = template('showBlank', re);
				document.getElementById("content").innerHTML = html;
			}
		}
		/**
		 * 传入参数对象后输出传出的字符串
		 */
		function outStr(){
			var outObj={};
			outObj.yw = params.yw;
			outObj.sn = params.sn;
			outObj.cp = 1;
			var outstr = "";
			for (var i in outObj) {
				outstr += "&" + i + "=" + outObj[i];
			}
			outstr = "?" + outstr.substr(1);
			return outstr;
		}
		/**
		 * 跳转到h5领取券页面
		 */
		 function getCoupon(){
		 	var outLink="/24hours/share24/getPackage.html"+outStr();
			var jumpParams=GetQueryString("jumpParams")||"";
			console.log(jumpParams);
			// app跳转地址
		    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
		    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;				
			//判断为android
			    if (navigator.userAgent.match(/android/i)) {
			      //android非微信
			      if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
			        var last = Date.now();
			        var doc = window.document;
			        var ifr = doc.createElement('iframe');
			        ifr.src = $android_app;
			        ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
			        doc.body.appendChild(ifr);

			        setTimeout(function () {
			          doc.body.removeChild(ifr);
			          //setTimeout回小于2000一般为唤起失败
			          if (Date.now() - last <4000) {
			            window.location.href = outLink;
			          }
			        }, 3000);
			      } else {
			        //android微信
			        	$(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
				        $(".model").show();
				        $(".model").on("click",function(){
				        	$(this).hide();
				        });
				        $(".model_cont").on("click",function(event){
				        	event.stopPropagation();
				        });
			      }
			      //判断为IOS
			    } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
			      //微信
			      if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
				        $(".model").show();
				        $(".model").on("click",function(){
				        	$(this).hide();
				        });
				        $(".model_cont").on("click",function(event){
				        	event.stopPropagation();
				        });	
			        //QQ内置浏览器
			      } else if (navigator.userAgent.indexOf(' QQ') > -1) {
				        $(".model").show();
				        $(".model").on("click",function(){
				        	$(this).hide();
				        });
				        $(".model_cont").on("click",function(event){
				        	event.stopPropagation();
				        });
			      } else {
			        window.location.href = $ios_app;
			        setTimeout(function () {
			          window.location.href =outLink;
			        },3000);
			      }
			    } else {
			      //判断为pc
			      window.location.href =outLink;
			    }	
		 }

		 function share(title, desc, img) {
			  var url = window.location.href;
			  var apikey = sessionStorage.getItem('apikey') || 'test';
			  var version = sessionStorage.getItem('version') || '1';
			  $.ajax({
			    type: "POST",
			    url: "/zxcity_restful/ws/rest",
			    dateType: "json",
			    async: false,
			    data: {
			      "cmd": 'game/getSign',
			      "data": '{"url":"' + url + '"}',
			      "version": version
			    },
			    beforeSend: function (request) {
			      request.setRequestHeader("apikey", apikey);
			    },
			    success: function (res) {
			      wx.config({
			        debug: false,
			        appId: 'wxe50dd59beab1e644',
			        timestamp: res.data.timestamp,
			        nonceStr: res.data.nonceStr,
			        signature: res.data.signature,
			        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
			      });
			      wx.ready(function () {
			        wx.onMenuShareTimeline({
			          title: title,
			          desc: desc,
			          link: url,
			          imgUrl: img
			        });
			        wx.onMenuShareAppMessage({
			          title: title,
			          desc: desc,
			          link: url,
			          imgUrl: img
			        });
			        wx.onMenuShareQQ({
			          title: title,
			          desc: desc,
			          link: url,
			          imgUrl: img
			        });
			        wx.onMenuShareWeibo({
			          title: title,
			          desc: desc,
			          link: url,
			          imgUrl: img
			        });
			        wx.onMenuShareQZone({
			          title: title,
			          desc: desc,
			          link: url,
			          imgUrl: img
			        });
			      })
			    },
			    error: function (res) {
			      console.log(res);
			    }
			  });
			}



});