		$(function(){
			var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号		
			$(".nav li").on("click",function(){
				$(this).siblings().removeClass("active");
				$(this).addClass("active");
				var index=$(this).index();
				if(index){
					$(".cont_sj").hide();
					$(".cont_lv").show();
				}else{
					$(".cont_lv").hide();
					$(".cont_sj").show();					
				}
			});

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

			var params=getParam();
			var userId=Number(params.userId);
			var datas={"userId":userId};
			var data=JSON.stringify(datas);
			var cmd="game/showPersonalData";
			reqAjaxAsync(cmd,data,levelShow);
			function reqAjaxAsync(cmd, data, callback) {
				console.log(data);
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
						request.setRequestHeader("apikey", apikey);
					},
					success: function(res) {
						console.log(res);
						callback(res);
					},
					error: function(err) {
						console.log(err.status + ":" + err.statusText);
					}
				});
			}	

			function levelShow(res){
				var acPoint=res.data.expGrade.exp;
				var level=null,
					levelPercent=0;
				var grade=res.data.expGrade.grade;
				level=Math.floor(res.data.expGrade.grade);
				levelPercent=grade-level;
				disPt=res.data.expGrade.wantExp;
				if(res.data.userMain.scGameUser){
					$(".header").css("background","url("+res.data.userMain.scGameUser.userpic+"?x-oss-process=image/resize,m_fill,w_750,h_524,limit_0) no-repeat center center");
					$(".header").css("background-size","100% 100%");
					var imgHtml='<img src="'+res.data.userMain.scGameUser.userpic+'?x-oss-process=image/resize,m_fill,w_160,h_160,limit_0">'+
						'<span class="now_lv">Lv'+Math.floor(level)+'</span>';
				}else if(res.data.userMain.scGameUser==null){
					$(".header").css("background","url('https://tsnrhapp.oss-cn-hangzhou.aliyuncs.com/touxiang2%402x.png') no-repeat center center");
					$(".header").css("background-size","100% 100%");					
					var imgHtml='<img src="https://tsnrhapp.oss-cn-hangzhou.aliyuncs.com/touxiang2%402x.png">'+
						'<span class="now_lv">Lv'+Math.floor(level)+'</span>';					
				}
				$(".hd_img").html(imgHtml);
				$(".indicator").html(acPoint+"<span></span>");
				if(level>0&&level<8){
					$(".lv_hint").html("距离V"+(level+1)+"还需"+disPt+"积分，新等级在等你快加油");
				}else if(level==8){
					$(".lv_hint").html("您已经达到最高级！");
				}
				showLv(level,levelPercent);
			}


			function showLv(level,levelPercent){
				switch(level){
					case 1:$(".indicator").css("left",(0.295+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width",levelPercent*100+"%");
					break;
					case 2:$(".indicator").css("left",(1.215+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width",levelPercent*100+"%");					
					break;
					case 3:$(".indicator").css("left",(2.315+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width",levelPercent*100+"%");	
					break;
					case 4:$(".indicator").css("left",(3.055+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width","100%");					  
					  $(".lv_bar_prs").eq(3).css("width",levelPercent*100+"%");						
					break;
					case 5:$(".indicator").css("left",(3.975+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width","100%");	
					  $(".lv_bar_prs").eq(3).css("width","100%");					  				  
					  $(".lv_bar_prs").eq(4).css("width",levelPercent*100+"%");						
					break;
					case 6:$(".indicator").css("left",(4.895+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width","100%");	
					  $(".lv_bar_prs").eq(3).css("width","100%");	
					  $(".lv_bar_prs").eq(4).css("width","100%");					  				  				  
					  $(".lv_bar_prs").eq(5).css("width",levelPercent*100+"%");						
					break;
					case 7:$(".indicator").css("left",(5.815+0.6*levelPercent)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width","100%");	
					  $(".lv_bar_prs").eq(3).css("width","100%");	
					  $(".lv_bar_prs").eq(4).css("width","100%");	
					  $(".lv_bar_prs").eq(5).css("width","100%");					  				  				  				  
					  $(".lv_bar_prs").eq(6).css("width",levelPercent*100+"%");				
					break;
					case 8:$(".indicator").css("left",(5.815+0.6*1)+"rem");
					  $(".lv_bar_prs").eq(0).css("width","100%");
					  $(".lv_bar_prs").eq(1).css("width","100%");
					  $(".lv_bar_prs").eq(2).css("width","100%");	
					  $(".lv_bar_prs").eq(3).css("width","100%");	
					  $(".lv_bar_prs").eq(4).css("width","100%");	
					  $(".lv_bar_prs").eq(5).css("width","100%");	
					  $(".lv_bar_prs").eq(6).css("width","100%");						  				  				  				  				  
					  $(".lv_bar_prs").eq(7).css("width","100%");						
					break;
				}
				var leftSet=$(".indicator").position().left;
				$(".lvs").scrollLeft(leftSet-30);
			}

		});