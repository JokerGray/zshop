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
	var shopId = theRequest['shopId']==undefined?null:theRequest['shopId'];
	var timeType = theRequest['timeType']==undefined?null:theRequest['timeType'];
	
	//我的销售业绩/我的消耗业绩
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/queryShopAchInfoSummeryDetials",
			"version" : version,
			"data" :"{'shopId': '"+shopId+"','timeType':'"+timeType+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.data==null){
				window.location.href='blank.html';
			}else{
				if(res.code==1){
					var arr1=new Array();
					var arr2=new Array();
					var arr3=new Array();
					for(var i=0;i<res.data.length;i++){
						var time=res.data[i].time;
						var sale=res.data[i].salePrice;
						var use=res.data[i].consumePrice;
						arr1[i]=time;
						arr2[i]=sale;
						arr3[i]=use;
					}
					//门店销售树状图
			        var myChart1 = echarts.init(document.getElementById('main1'));
			        // 指定图表的配置项和数据
			        var option1 = {
			        	tooltip : {
					        trigger: 'axis',
					        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					        }
					    },
			        	grid:{
			        		top:80,
			        		left:'21%'
			        	},
			            title: {
			            	padding:[15,0],
			                text: '门店销售业绩',
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
	//						        axisLabel:{
	//						        	show: false
	//						        }
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
			        // 使用刚指定的配置项和数据显示图表。
			        myChart1.setOption(option1);
			        
			        //门店消耗树状图
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
			        		left:'20%'
			        	},
			            title: {
			            	padding:[15,0],
			                text: '门店消耗业绩',
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
	//						        axisLabel:{
	//						        	show: false
	//						        }
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
				}else{
					window.location.href='blank.html';
					console.log(res.msg);
				}
			}
		},
		error:function(res){
			window.location.href='blank.html';
			console.log("获取数据失败");
		}
	});
	
	//那个产品最好卖
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data: {
			"cmd":"shopStatistics/shopHomePageHotGoods",
			"version" : version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.code==1){
				var good=res.data.goodsList;
				if(good.length==0){
						$(".goodsContainer").html("<div class='col-xs-6' style='padding-left:50px;'>"+
						"<div class='use'><span class='useCount'>今日消耗额</span><br/><span class='use-amounts' id='consume-price'>"+res.data.consumePrice+"</span></div>"+
						"</div>")
				}else{
					for(var i=0;i<good.length;i++){
						if(good.length==1){
							$(".goodsContainer").html("<div class='col-xs-6' style='padding-left:50px;border-right:solid 1px #EEEEEE'>"+
							"<div class='product'><span class='productName'>"+good[0].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[0].price+"</span></div>"+
							"<div class='use'><span class='useCount'>今日消耗额</span><br/><span class='use-amounts' id='consume-price'>"+res.data.consumePrice+"</span></div>"+
							"</div>")
						}else if(good.length==2){
							$(".goodsContainer").html("<div class='col-xs-6' style='padding-left:50px;border-right:solid 1px #EEEEEE'>"+
							"<div class='product'><span class='productName'>"+good[0].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[0].price+"</span></div>"+
							"<div class='product'><span class='productName'>"+good[1].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[1].price+"</span></div>"+
							"</div>"+
							"<div class='col-xs-6' style='padding-left:40px;'>"+
							"<div class='use'><span class='useCount'>今日消耗额</span><br/><span class='use-amounts' id='consume-price'>"+res.data.consumePrice+"</span></div>"+
							"</div>")
						}else{
							$(".goodsContainer").html("<div class='col-xs-6' style='padding-left:50px;border-right:solid 1px #EEEEEE'>"+
							"<div class='product'><span class='productName'>"+good[0].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[0].price+"</span></div>"+
							"<div class='product'><span class='productName'>"+good[1].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[1].price+"</span></div>"+
							"</div>"+
							"<div class='col-xs-6' style='padding-left:40px;'>"+
							"<div class='product'><span class='productName'>"+good[2].name+"</span><br/><span class='use-amounts' id='consume-price'>"+good[2].price+"</span></div>"+
							"<div class='use'><span class='useCount'>今日消耗额</span><br/><span class='use-amounts' id='consume-price'>"+res.data.consumePrice+"</span></div>"+
							"</div>")
						}
				}
				}
			}else{
				console.log(res.msg);
			}
		},
		error:function(res){
			console.log('获取数据失败');
		}
	});
	
	//哪个客户贡献最大
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/shopHomePageMaxAccountContribute",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.code==1){
				var sHtml1='';
				var sHtml2='';
				var cums=res.data.accountList;
				for(var i=0;i<cums.length;i++){
					if(cums.length>0){
						if(cums.length==1){
							$('.con-left').html("<div class='client'><span class='client-name'>"
									+cums[0].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[0].price+"</span></div>")
						}else if(cums.length==2){
							$('.con-left').html("<div class='client'><span class='client-name'>"+cums[0].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+cums[1].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[1].price+"</span></div>")
						}else if(cums.length==3){
							$('.con-left').html("<div class='client'><span class='client-name'>"+cums[0].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+cums[1].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[1].price+"</span></div>");
							$('.con-right').html("<div class='client'><span class='client-name'>"
									+cums[2].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[2].price+"</span></div>")
						}else if(cums.length==4){
							$('.con-left').html("<div class='client'><span class='client-name'>"+cums[0].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+cums[1].accountName+"</span><br/>"
									+"<span class='client-amounts'>"+cums[1].price+"</span></div>");
							$('.con-right').html("<div class='client'><span class='client-name'>"+cums[2].accountName+"</span><br/>"
							+"<span class='client-amounts'>"+cums[2].price+"</span></div>"
							+"<div class='client'><span class='client-name'>"+cums[3].accountName+"</span><br/>"
							+"<span class='client-amounts'>"+cums[3].price+"</span></div>");
						}
					}
				}
			}
		},
		error:function(res){
			console.log("获取数据失败")
		}
	});
	
	//哪个员工贡献最大
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/shopHomePageMaxEmployeeContribute",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			console.log(res.data)
			if(res.code==1){
				var sHtml1='';
				var sHtml2='';
				var emp=res.data.employeeList;
				console.log(emp.length)
				for(var i=0;i<emp.length;i++){
					if(emp.length>0){
						if(emp.length==1){
							$('.em-left').html("<div class='client'><span class='client-name'>"
									+emp[0].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[0].price+"</span></div>")
						}else if(emp.length==2){
							$('.em-left').html("<div class='client'><span class='client-name'>"+emp[0].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+emp[1].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[1].price+"</span></div>")
						}else if(emp.length==3){
							$('.em-left').html("<div class='client'><span class='client-name'>"+emp[0].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+emp[1].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[1].price+"</span></div>");
							$('.em-right').html("<div class='client'><span class='client-name'>"
									+emp[2].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[2].price+"</span></div>")
						}else if(emp.length==4){
							$('.em-left').html("<div class='client'><span class='client-name'>"+emp[0].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[0].price+"</span></div>"
									+"<div class='client'><span class='client-name'>"+emp[1].salesman+"</span><br/>"
									+"<span class='client-amounts'>"+emp[1].price+"</span></div>");
							$('.em-right').html("<div class='client'><span class='client-name'>"+emp[2].salesman+"</span><br/>"
							+"<span class='client-amounts'>"+emp[2].price+"</span></div>"
							+"<div class='client'><span class='client-name'>"+emp[3].salesman+"</span><br/>"
							+"<span class='client-amounts'>"+emp[3].price+"</span></div>");
						}
					}
				}
			}
		},
		error:function(res){
			console.log("获取数据失败")
		}
	});

	
	//门店赠送
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"shopStatistics/shopHomePageLargess",
			"version":version,
			"data" :"{'shopId':'"+shopId+"'}",
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey",apikey);
		},
		success:function(res){
			if(res.code==1){
				$('#gift-amounts').text(res.data.num);
			}else{
				console.log(res.msg);
			}
		},
		error:function(res){
			console.log(res.msg);
		}
	});
})
