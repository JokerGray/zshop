var getInfo=function (){
		//参数
	var ids = [],
		datainfo,
		data_x,
		id;
	var echart;
	var data_y = ["3:00", "6:00", "9:00", "12:00", "15:00", "18:00", "24:00"];
	
	ids = [document.getElementById("yestoday"), document.getElementById("today"), document.getElementById("seven"), document.getElementById("thirty")];
	
	//进入页面显示当天的数据
	id = ids[1];
	echart = echarts.init(ids[1]);
	
	//时间显示设置
	 var time={  
	        getPreDate:function(pre){  
	            var self=this;  
	            var c = new Date();  
	            c.setDate(c.getDate() - pre);  
	            return self.formatDate(c,pre);  
	        },  
	        formatDate:function(d,pre){  
	            var self=this;  
	            if(pre>1){
	            	var old = d.getFullYear() + "-" + self.getMonth1(d.getMonth()) + "-" + self.getDay1(d.getDate());
	            	d.setDate(d.getDate() + pre);  
	            	return old + "至" +d.getFullYear() + "-" + self.getMonth1(d.getMonth()) + "-" + self.getDay1(d.getDate());
	            	return false;
	            }
	            return d.getFullYear() + "-" + self.getMonth1(d.getMonth()) + "-" + self.getDay1(d.getDate());  
	        },  
	        getMonth1:function(m){  
	            var self=this;  
	            m++;  
	            if(m<10)  
	                return "0" + m.toString();  
	            return m.toString();  
	        },
	        getDay1:function(m){
	        	var self=this;
	        	if(m<10)  
	                return "0" + m.toString();  
	            return m.toString();  
	        }
	   };
	 //图表x轴时间显示
	 var time1={  
	        getPreDate:function(pre){  
	            var self=this;  
	            var c = new Date();  
	            c.setDate(c.getDate() - pre);  
	            return self.formatDate(c,pre);  
	        },  
	        formatDate:function(d,pre){  
	            var self=this;  
	            return self.getMonth1(d.getMonth()) + "-" + self.getDay1(d.getDate());  
	        },  
	        getMonth1:function(m){  
	            var self=this;  
	            m++;  
	            if(m<10)  
	                return "0" + m.toString();  
	            return m.toString();  
	        },
	        getDay1:function(m){
	        	var self=this;
	        	if(m<10)  
	                return "0" + m.toString();  
	            return m.toString();  
	        }
	 };
	 
	//进入页面显示当天时间;
	$(".time").html(time.getPreDate(0));
	
	var browers= function () {
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
	//对应的日期点击
	$(".nav").on("click", "li", function() {
			var _this = $(this);
			var _index = _this.index();
			_this.addClass("active");
			$("#content li").eq(_index).siblings().css("display", "none");
			$("#content li").eq(_index).css("display", "block");
			_this.siblings().removeClass("active");
			id = ids[_index];
			echart = echarts.init(id);
			getTime(_index);
			getY(_index);
			getX(_index)
			getEchart(data_y, data_x);
		})
		//不同事件对应y坐标轴判断
	function getY(num) {
		switch(num) {
			case 0:
				data_y = ["3:00", "6:00", "9:00", "12:00", "15:00", "18:00", "24:00"];
				break;
			case 1:
				data_y = ["3:00", "6:00", "9:00", "12:00", "15:00", "18:00", "24:00"];
				break;
			case 2:
				data_y = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
				break;
			case 3:
				data_y = [time1.getPreDate(30),time1.getPreDate(25),time1.getPreDate(20),time1.getPreDate(15),time1.getPreDate(10),time1.getPreDate(5),time1.getPreDate(0)];
				break;
			default:
				break;
		}
	}
	//不同时间显示不同的数据
	function getX(num){
		switch(num) {
			case 0:
			    data_x =datainfo.today;
				break;
			case 1:
				data_x =datainfo.yestoday;
				break;
			case 2:
				data_x =datainfo.seven;
				break;
			case 3:
				data_x =datainfo.thirty;
				break;
			default:
				break;
		}
	}
	//不同的时间显示
	function getTime(num) {
		switch(num) {
			case 0:
			   $(".time").html(time.getPreDate(0));
				break;
			case 1:
			   $(".time").html(time.getPreDate(1));
				break;
			case 2:
			   $(".time").html(time.getPreDate(7));
				break;
			case 3:
			   $(".time").html(time.getPreDate(30));
				break;
			default:
				break;
		}
	}
	//屏幕缩放图表自动显示
//	window.onresize = function() {
//		echart = echarts.init(id);
//		getEchart(data_y, data_x);
//	}
	
	//图表
	function getEchart(data_y, data_x) {
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['']
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			grid: {
				left: '1%',
				right: '2%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: data_y,
				axisLabel:{
					show:false,
					textStyle:{
						color:"#fff"
					}
				},
				axisTick:{
					show:false
				},
				axisLine:{
					lineStyle:{
						color:"#999"
					}
				}
			}],
			yAxis: [{
				type: 'value',
				min: 0,
				minInterval: 1,
//				interval:15,
				axisLine:{
					lineStyle:{
						color:"#fff"
					}
				},
				axisLabel:{
					show:true,
					textStyle:{
						color:"#999"
					},
					formatter: function (value) {
	                    return value;
	             },
	              interval:15
				},
				splitLine:{
					lineStyle:{
						type:'dotted'
					}
				}
			}],
			series: [{
				name: '收入',
				type: 'line',
				stack: '总量',
				symbolSize:10,
				areaStyle: {
					normal: {
						 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		                        offset: 0,
		                        color: '#fff5c0'
		                    }, {
		                        offset: 1,
		                        color: '#fffbe9'
		                    }])
					}
				},
				itemStyle : {  
                    normal : {  
                        color:'#ffd600',
                        lineStyle:{  
                            color:'#ffd600'  
                        }  
                    }  
               },
				data: data_x
			}],
			radiusAxis:{
				axisLine:{
					show:[false]
				}
			},
			color: ["rgba(255,215,0,0.5)"],
			
		};
		echart.setOption(option);
	}
	//进入页面加载5条数据
	var url = "json/l_detail.json";
	var datas  = {"id":"1"};
	
	//数据加载函数
	var getAjax = function(url,datas,callback,me){
			$.ajax({
			type: 'get',
			url: url,
			dataType: 'json',
			data: datas,
			dataType:"json",
			success: function(data) {
				callback(data);
			},
			error: function (xhr, type) {
					if (browers == "android.sc") {
						window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
					} else if (browers == "ios.sc") {
						htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
					}
					console.log('请求失败！请检查网络连接');
					if(me){
						me.resetload();
					}
					
				}
		});
	}
	
	//进入页面加载5条数据
	getAjax(url,datas,function (res){
		datainfo=res.info[0];
		var data=res.data;
		data_x=datainfo.today;
		getEchart(data_y, data_x);
		if(data.length>2){
			for(var i = 0;i<2;i++){
				var oli = '<li><span class="data_time">'+data[i].time+'</span><i class="data_count">数量: <span>'+data[i].num+'</span></i><span class="data_data"><b>+</b>'+data[i].price+'</span></li>';
				$("#info_list_data").append(oli);
			};
		}else{
			if(data.length<1){
				var nodata = "<div class='dropload-down'><div class='dropload-noData'>暂无数据</div></div>";
				$("#list_scroll").html(nodata);
			}else{
				for(var i = 0;i<data.length;i++){
					var oli = '<li><span class="data_time">'+data[i].time+'</span><i class="data_count">数量: <span>'+data[i].num+'</span></i><span class="data_data"><b>+</b>'+data[i].price+'</span></li>';
					$("#info_list_data").append(oli);
				};
			}
			
		}
	});
	
	
	//数据上拉加载
	var count=2;
	var handleDropload = function() {
		dropload = $("#list_scroll").dropload({
			scrollArea: window, //滑屏范围
			distance: 50, //拉动距离
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">暂无数据</div>'
			},
			loadDownFn: function(me) { //上拉函数
				getAjax(url,datas,function(data){
					var data=data.data;
						if(data.length){
							//控制每次加载5条数据
							if(5*count<=data.length){
								for(var i = 5*(count-1)-3;i<5*count-3;i++){
									var oli = '<li><span class="data_time">'+data[i].time+'</span><i class="data_count">数量: <span>'+data[i].num+'</span></i><span class="data_data"><b>+</b>'+data[i].price+'</span></li>';
									$("#info_list_data").append(oli);
								};
							}
							else{
								for(var i = 5*(count-1)-3;i<data.length;i++){
									var oli = '<li><span class="data_time">'+data[i].time+'</span><i class="data_count">数量: <span>'+data[i].num+'</span></i><span class="data_data"><b>+</b>'+data[i].price+'</span></li>';
									$("#info_list_data").append(oli);
								}
								$(".dropload-down div").html("已加载全部数据");
								return false;
							};
							count++;
						}else{
							me.noData(true);
						}
						me.resetload();
				},me)			
			}
		});
	}
	handleDropload();
}