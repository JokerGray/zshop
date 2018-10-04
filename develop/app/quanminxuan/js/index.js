$(function() {
	console.log(navigator.userAgent);
	var rootfont = $("html").css("font-size");
	var rootFont = Number(rootfont.substring(0, rootfont.length - 2));

	function ShowContent() {
		this.init();
	}
	ShowContent.prototype = {
		init: function() {
			this.getParams();
			console.log(this.params);
			this.fetchData();
			//					获取评论json数据
			this.getComment();	
		},
		getParams: function() {
			var url = location.search;
			var params = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			this.params = params;
			this.params.dazzleId=(this.params.dazzleId||this.params.dazzleid);
		},
		fetchData: function() {
			var that = this;
			var cmd = "dazzle/findDazzleDetail",
				version = sessionStorage.getItem('version') || "1", //获取缓存 版本号
				apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			var datas = {
				"userId": that.params.userId,
				"dazzleId": that.params.dazzleId
			};
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
					if(re.code==1){
						var html = template('myContent', re);
						document.getElementById("content").innerHTML = html;
						// 获取动态标题
						var newtitle=re.data.scSysUser.username+"的全民炫"+((re.data.introduce.length>0)?("："+re.data.introduce):"");
						document.title =newtitle;
						var $meta1 = $('<meta name="keywords" content="' + newtitle + '" />');
					    var $meta2 = $('<meta name="description" content="' + newtitle + '" />');
						$('head').append($meta1).append($meta2);

						var playbtn = $(".playbtn");
						that.playvedio(playbtn);
						//通过渲染的文字高度判断是否展开，隐藏
						var titleH = $(".title").outerHeight();
						var remH = titleH / rootFont;
						// console.log(remH);
						if (remH >0.99) {
							$(".title").addClass("textOver-hid");
							$(".mores").show();
						}
						$(".mores_icon").on("click", function() {
							$(".title").removeClass("textOver-hid");
							$(this).parent().hide();
						});
						// 加载点击跳转至app事件
						$("#praiseBtn").on("click",function(){
							that.toApp(that);
						});
						$(".header_load").on("click",function(){
							that.toApp(that);
						});						
						//加载wx转发时候的图像，标题等
						that.weixin(re);
					}else if(re.code==9){
						$("#contBlank").show();
						$("#comment").hide();
					}
				},
				error: function(re) {
					console.log(re);
				}
			});
		},
		//	播放视频的方法
		playvedio: function($playbtn) {
			$playbtn[0] && $playbtn.on("click", function() {
				$(this).parent().hide();
				$(this).parent().next("video").show();
				$(this).parent().next("video").trigger("play");
			});
		},
		//	各个图标跳转app的方法
		outputParams: function() {
			var that=this;
			var params = this.params;
			var outParamsObj = {};
			outParamsObj.yw = params.yw;
			outParamsObj.sn = params.sn;
			outParamsObj.cp = 1;
			var outstr = "";
			for (var i in outParamsObj) {
				outstr += "&" + i + "=" + outParamsObj[i];
			}
			outstr = "?" + outstr.substr(1);
			// $(".header_open").on("click", function() {
			// 	window.location.href = "/24hours/share24/getPackage.html" + outstr;
			// });
			// $(".header_load").on("click", function() {
			// 	window.location.href = "/24hours/share24/getPackage.html" + outstr;
			// });
			var outLink="/24hours/share24/getPackage.html" + outstr;

			$("#footer").on("click", function() {
				var apptype="dazzleAll";
				var dazzleId=that.params.dazzleId;
				var subtype="dazzleDetail";
				console.log(dazzleId);
				// app跳转地址
				var $ios_app="CityNRH://?apptype="+apptype+"&subtype="+subtype+"&dazzleId="+dazzleId;
				var $android_app= "selfapp://izxcs/openwith_dazzle?apptype="+apptype+"&dazzleId="+dazzleId;
				  //app下载地址
				var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
				var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
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
			          if (Date.now() - last < 4000) {
			            window.location.href = outLink;
			          }
			        },3000);
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
			        }, 3000);
			      }
			    } else {
			      //判断为pc
			      window.location.href =outLink;
			    }			

			});
		},
//		读取评论列表
		getComment:function(){
			var that = this;
			var cmd = "dazzle/queryDazzleCommentList",
				version = sessionStorage.getItem('version') || "1", //获取缓存 版本号
				apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			var nowTime=that.getTime();
			var datas = {
				"dazzleId":that.params.dazzleId,
				"lastFreshTime": "2017-01-01 12:00:00",
				"nowTime":nowTime,
				 "pagination": {"page": 1,"rows":10},
				 "type":1
			};
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
					that.showComment(re);
				},
				error: function(re) {
					console.log(re);
				}
			});			
		},
//		获取当前时间
		getTime:function(){
				var date = new Date();
				var seperator1 = "-";
				var seperator2 = ":";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var hour = date.getHours();
				var mins = date.getMinutes();
				var sec = date.getSeconds();
				function addZero(str) {
					if (str >= 0 && str <= 9) {
						str = "0" + str;
					}
					return str;
				}				
				year = addZero(year);
				month = addZero(month);
				day = addZero(day);
				hour = addZero(hour);
				mins = addZero(mins);
				sec = addZero(sec);
				var currentdate = year + seperator1 + month + seperator1 + day + " " + hour + seperator2 + mins + seperator2 + sec;
				return currentdate;			
		},
//		展示评论列表
		showComment:function(re){
			var that=this;
			var total=re.total;
			var comment=$("#comment");
			if(total==0){
				var cHtml='<div class="com_tit">评论&nbsp;<span id="commentNum">'+total+'</span></div>'+
						  '<div class="no_com">暂无评论喔~</div><div id="footer"><img src="img/footer.png" /></div>';
				comment.html(cHtml);
			}else if(total>0){
				var cHtml='<div class="com_tit">评论&nbsp;<span id="commentNum">'+total+'</span></div>';
				for(var i=0;i<re.data.length;i++){
				cHtml+=	'<div class="com_list"><img src="'+re.data[i].scSysUser.userpic+'"/>'+
							'<div class="com_cont">'+
								'<p class="com_user">'+re.data[i].scSysUser.username+'</p>'+
								'<p class="com_dt_time">'+re.data[i].commentTime+'</p>'+
								'<p class="com_comment">'+re.data[i].commentContent+'</p>'+
							'</div></div>';
											
				}
				cHtml+='<div id="footer"><img src="img/footer.png"/></div>';
//				if(total>5){
//					cHtml+='<div class="com_bt"><span id="checkCom">查看全部评论&nbsp;></span></div>';
//				}
				comment.html(cHtml);
				$(".com_list:nth-of-type("+(re.data.length+1)+")").css("border-bottom","none");
				if(isIOSApp() || isAndriodApp()){
					$("#header").hide();
					$("#footer").hide();
					$("#comment").css({"marginTop":0});
				}
			}
			that.outputParams();
		},
		// 跳转至app对应版块
		toApp:function(that){
			var apptype="dazzleAll";
			var dazzleId=that.params.dazzleId;
			var subtype="dazzleDetail";
			console.log(dazzleId);
			// app跳转地址
			var $ios_app="CityNRH://?apptype="+apptype+"&subtype="+subtype+"&dazzleId="+dazzleId;
			var $android_app= "selfapp://izxcs/openwith_dazzle?apptype="+apptype+"&dazzleId="+dazzleId;
			  //app下载地址
			var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
			var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
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
		          if (Date.now() - last < 2000) {
		            window.location.href = $android_url;
		          }
		        }, 1000);
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
		          window.location.href = $ios_url;
		        }, 250);
		        setTimeout(function () {
		          window.location.reload();
		        }, 1000);
		      }
		    } else {
		      //判断为pc
		      window.location.href = $android_url;
		    }			
		},
		// 转发微信
		weixin:function(re){
			var that = this;
			var imgurl=re.data.coverUrl,
				titles=re.data.scSysUser.username+"的全民炫"+((re.data.introduce.length>0)?("："+re.data.introduce):""),
				introduce=re.data.introduce || "全民炫";
			var cmd = "game/getSign",
				version = sessionStorage.getItem('version') || "1", //获取缓存 版本号
				apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			var datas = {
				"url":location.href
			};
			var data = JSON.stringify(datas);
			console.log(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				async: true,
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(res) {
					console.log(res);
		            wx.config({
		                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                appId: 'wxe50dd59beab1e644', // 必填，公众号的唯一标识 
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
			            wx.onMenuShareWeibo({
			            	title:titles,
			            	desc:introduce,
			            	link:location.href,
			            	imgUrl:imgurl,
			                success: function(){},
			                cancel: function(){}
			            });
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

	}
	var contents = new ShowContent();

    function isIOSApp () {
        var u = window.navigator.userAgent;
        return !!u.match(/\(i[^;]+;( u;)? CPU.+Mac OS X/) && u.indexOf('SmartCity') > -1;
    }
    function isAndriodApp () {
        var u = window.navigator.userAgent;
        return u.match(/SmartCity_Android/i);
    }

});