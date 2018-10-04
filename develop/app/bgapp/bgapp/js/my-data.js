$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
	
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var employeeId = theRequest['employeeId']==undefined?null:theRequest['employeeId'];
	var shopId = theRequest['shopId']==undefined?null:theRequest['shopId'];
	
	//我的销售业绩/我的消耗业绩
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/myHomePageAch",
			"version" : version,
			"data" :"{'employeeId': '"+employeeId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			var arr1=new Array();
			var arr2=new Array();
			var arr3=new Array();
			if(res.data==null){
				window.location.href="blank.html";
			}else{
				if(res.code==1){
					console.log(res)
					for(var i=0;i<res.data.length;i++){
						var time=res.data[i].time;
						var sale=res.data[i].salePrice;
						var use=res.data[i].consumePrice;
						arr1[i]=time;
						arr2[i]=sale;
						arr3[i]=use;
						//我的销售业绩树状图
						var myChart1 = echarts.init(document.getElementById('main1'));
					    var option1 = {
					        	tooltip : {
							        trigger: 'axis',
							        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
							            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
							        }
							    },
					        	grid:{
					        		top:80,
					        		left:'15%'
					        	},
					            title: {
					            	padding:[15,0],
					                text: '我的销售业绩',
					                textStyle:{
					                	fontWeight:'normal',
					                	color: '#333333',
					                	fontSize: '20'
					                }
					            },
					            xAxis: {
					                data: arr1,
					                axisLabel:{
					                	textStyle:{
					                		color:'#333333',
					                	}
					                },
					                axisLine:{
					                	lineStyle:{
					                		color:'#d2d2d2'
					                	}
					                },
					                axisTick: {
							            show: false,
							            lineStyle:{
							            	color:'#d2d2d2'
							            }
							        },
					            },
					            yAxis: {
									axisLabel:{
					                	textStyle:{
					                		color:'#333333'
					                	}
					                },
					                axisLine:{
					                	lineStyle:{
					                		color:'#d2d2d2'
					                	}
					                },
					                axisTick: {
							            inside:'true',
							            lineStyle:{
							            	color:'#d2d2d2'
							            }
							        },
							        splitLine:{
							        	show:false,
							        }
					            },
					            series: [{
					                type: 'bar',
					                data: arr2,
					                itemStyle:{
					                	 normal: {
						                    color: new echarts.graphic.LinearGradient(
						                        0, 0, 0, 1,
						                        [
						                            {offset: 0, color: '#ffa576'},
						                            {offset: 0.5, color: '#ff967a'},
						                            {offset: 1, color: '#ff7882'}
						                        ]
						                    )
						                },
					                },
					                barWidth:'20px',
					            }]
					        };
						  myChart1.setOption(option1);
						  //我的消耗业绩树状图
					      var myChart2 = echarts.init(document.getElementById('main2'));
					      // 指定图表的配置项和数据
					      var option2 = {
					        	tooltip : {
							        trigger: 'axis',
							        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
							            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
							        }
							    },
					        	grid:{
					        		top:80,
									left:'15%'				        		
					        	},
					            title: {
					            	padding:[15,0],
					                text: '我的消耗业绩',
					                textStyle:{
					                	fontWeight:'normal',
					                	color: '#333333',
					                	fontSize: '20'
					                }
					            },
					            xAxis: {
					                data: arr1,
					                axisLabel:{
					                	textStyle:{
					                		color:'#333333'
					                	}
					                },
					                axisLine:{
					                	lineStyle:{
					                		color:'#d2d2d2'
					                	}
					                },
					                axisTick: {
							            show: false,
							            lineStyle:{
							            	color:'#d2d2d2'
							            }
							        },
					            },
					            yAxis: {
									axisLabel:{
					                	textStyle:{
					                		color:'#333333'
					                	}
					                },
					                axisLine:{
					                	lineStyle:{
					                		color:'#d2d2d2'
					                	}
					                },
					                axisTick: {
							            inside:'true',
							            lineStyle:{
							            	color:'#d2d2d2'
							            }
							        },
							        splitLine:{
							        	show:false,
							        }
					            },
					            series: [{
					                type: 'bar',
					                data: arr3,
					                itemStyle:{
					                	 normal: {
						                    color: new echarts.graphic.LinearGradient(
						                        0, 0, 0, 1,
						                        [
						                            {offset: 0, color: '#ffa576'},
						                            {offset: 0.5, color: '#ff967a'},
						                            {offset: 1, color: '#ff7882'}
						                        ]
						                    )
						                },
					                },
					                barWidth:'20px',
					            }]
					        };
					
					        // 使用刚指定的配置项和数据显示图表。
					        myChart2.setOption(option2);
					}
				}else{
					window.location.href="blank.html";
					console.log(res.msg);
				}
			}
		},
		error:function(res){
			window.location.href="blank.html";
			console.log("获取数据失败");
		}
	});
	
	//客户回访
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data: {
			"cmd":" shopStatistics/myHomePageAccountVisit",
			"version" : version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			console.log(res)
			if(res.code==1){
				$('#visit-amounts').text(res.data.oneMonthCome);
				$('#regist-amounts').text(res.data.oneMonthRegister);
				$('#novisit-amounts').text(res.data.twoMonthNotCome);
				$('#noregist-amounts').text(res.data.twoMonthNotCommunicatee);
			}else{
				console.log(res.msg);
			}
		},
		error:function(res){
			console.log('获取数据失败');
		}
	});
	
	//新客分析
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/myHomePageNewAccount",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.code==1){
				var todayRegister=res.data.todayRegister;
				var monthRegister=res.data.monthRegister;
				if(monthRegister==0){
					var percent=0;
				}else{
					var percent=Math.floor(todayRegister/monthRegister*100);
				}	
				$('#day-amounts').text(todayRegister);
				$('#month-amounts').text(monthRegister);
				$('#main3').attr('data-text',percent+"%");
				$('#main3').attr('data-percent',percent);
				$('#main3').circliful();
			}
		},
		error:function(res){
			console.log("获取数据失败")
		}
	});
	
	//赠送统计
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/myHomePageLargess",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.code==1){
				var todayLargess=res.data.todayLargess;
				var monthLargess=res.data.monthLargess;
				if(monthLargess==0){
					var percent=0;
				}else{
					var percent=Math.floor(todayLargess/monthLargess*100);
				}	
				$('#day-gifts').text(todayLargess);
				$('#month-gifts').text(monthLargess);
				$('#main4').attr('data-text',percent+"%");
				$('#main4').attr('data-percent',percent);
				$('#main4').circliful();
			}else{
				console.log(res.msg);
			}
		},
		error:function(res){
			console.log("获取数据失败")
		}
	});
	
	//客户卡项预警
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/myHomePageWarning",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey",apikey);
		},
		success:function(res){
			console.log(res)
			if(res.code==1){
				for(var i=0;i<res.data.length;i++){
					var sHtml='';
					var sHtml1='';
					var sHtml2='';
					if(res.data.length<=2){
						sHtml+="<div class='client'><span class='client-name'>"
								+res.data[i].account_name+"</span><br/><span class='client-amounts'>"
								+res.data[i].totelSos+"</span></div>";
						$('.warn-left').html(shtml);
					}else{
						for(j=0;j<=1;j++){
							sHtml1+="<div class='client'><span class='client-name'>"
									+res.data[j].account_name+"</span><br/><span class='client-amounts'>"
									+res.data[j].totelSos+"</span></div>";
							$('.warn-left').html(sHtml1);
						}
						for(k=2;k<=res.data.length;k++){
							sHtml2+="<div class='client'><span class='client-name'>"
									+res.data[k].account_name+"</span><br/><span class='client-amounts'>"
									+res.data[k].totelSos+"</span></div>";
							$('.warn-right').html(sHtml2);
						}
					}
				}
			}
		}
	});
	
})
