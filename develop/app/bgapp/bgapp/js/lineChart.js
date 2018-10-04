var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

	//判断设备是否联网
	setInterval(function(){
		var EventUtil = {
			addHandler: function(element, type, handler) {
				if(element.addEventListener) {
					element.addEventListener(type, handler, false);
				} else if(element.attachEvent) {
					element.attachEvent("on" + type, handler);
				} else {
					element["on" + type] = handler;
				}
			}
		};
		//	EventUtil.addHandler(window, "online", function() {
		//		console.log("Online");
		//	});
		EventUtil.addHandler(window, "offline", function() {
			$('body').html("<div class='netTip'>当前没有网络连接，请稍后再试</div>");
		});
	},1000)
	
	//获取url参数
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
    
    //动态改变字体大小
	(function(doc, win) {
		var docEl = doc.documentElement,
			resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
			recalc = function() {
				var clientWidth = docEl.clientWidth;
				if (!clientWidth) return;
				docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
			};
		if (!doc.addEventListener) return;
		win.addEventListener(resizeEvt, recalc, false);
		doc.addEventListener('DOMContentLoaded', recalc, false);
	})(document, window);

	//绘制销售折线图
	function line1(xData,yData){
		//初始化表格
			var myChart1 = echarts.init(document.getElementById('lineChartContainer1'));
			var option1={
				backgroundColor:'#ffffff',
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'line',
			            label: {
			                backgroundColor: '#6a7985'
			            },
			            lineStyle:{
			            	color:'#ffa074',
			            	width:1
			            }
			        },
			        alwaysShowContent: true,
			      	backgroundColor:'#ffa579',
			        position: function (point, params, dom, rect, size) {
					      // 固定在顶部
					      return [point[0]-size.contentSize[0]/2, '5%'];
					},
					formatter:'{c0}'
				},
			    legend: {
			    	show: false
			    },
			    grid: {
			       left: '15px',
			        right: '20px',
			        bottom: '30px',
			        top: '30px',
			        containLabel: false,
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data : xData,
			            axisLine:{
			            	show:false
			            },
			            axisTick:{
			            	show:false
			            },
	                    axisLabel:{  
	                        interval:0,
	                    },
			        }
			    ],
				yAxis : {
					show : false
				},
			    series : [
			        {
			            name:'门店销售业绩',
			            type:'line',
			            stack: '总量',
			            showSymbol:true,
			            symbol:'image://images/yuan1.png',
			            symbolSize:8,
			            areaStyle: {
			            	normal: {
				            	color: {
								    type: 'linear',
								    x: 0,
								    y: 0,
								    x2: 0,
								    y2: 1,
								    colorStops: [{
								        offset: 0, color: '#ffa074' // 0% 处的颜色
								    }, {
								        offset: 1, color: '#fffbf8' // 100% 处的颜色
								    },],
								    globalCoord: false // 缺省为 false
								}
			            	}
			            },
			            itemStyle:{
			            	normal:{
			            		color:'#ffa074'
			            	}
			            },
			            lineStyle:{
			            	normal:{
			            		width:2,
			            		color:'#ffa074'
			            	}
			            },
			            data: yData
			        }
			    ]
			}
			//绘制图表
			myChart1.setOption(option1);
			myChart1.dispatchAction({
			    type: 'showTip',
			    seriesIndex: 0,
				dataIndex: xData.length-1
			})
	}
	
	//绘制消耗折线图
	function line2(xData,yData){
		//初始化表格
			var myChart2 = echarts.init(document.getElementById('lineChartContainer2'));
			var option2={
				backgroundColor:'#ffffff',
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'line',
			            label: {
			                backgroundColor: '#7dc6fb'
			            },
			            lineStyle:{
			            	color:'#7dc6fb',
			            	width:1
			            }
			        },
			        alwaysShowContent: true,
			        backgroundColor:'#71cbff',
			        position: function (point, params, dom, rect, size) {
					      // 固定在顶部
					      return [point[0]-size.contentSize[0]/2, '5%'];
					},
					formatter:'{c0}'
			    },
			    legend: {
			    	show: false
			    },
			    grid: {
			        left: '15px',
			        right: '20px',
			        bottom: '30px',
			        top: '30px',
			        containLabel: false,
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data : xData,
			            axisLine:{
			            	show:false
			            },
			            axisTick:{
			            	show:false
			            },
	                    axisLabel:{  
	                        interval:0,
	                    },
			        }
			    ],
				yAxis : {
					show : false
				},
			    series : [
			        {
			        	name:'门店消耗业绩',
			        	type:'line',
			        	stack:'总量',
			        	showSymbol:true,
			        	symbol:'image://images/yuan2.png',
			        	symbolSize:8,
			        	areaStyle: {
			            	normal: {
				            	color: {
								    type: 'linear',
								    x: 0,
								    y: 0,
								    x2: 0,
								    y2: 1,
								    colorStops: [{
								        offset: 0, color: '#71cbff' // 0% 处的颜色
								    }, {
								        offset: 1, color: '#f2f9ff' // 100% 处的颜色
								    }],
								    globalCoord: false // 缺省为 false
								}
			            	}
			            },
			        	itemStyle:{
			        		normal:{
			        			color:'#71cbff',
			        		}
			        	},
			        	lineStyle:{
			        		normal:{
			        			width:2,
			        			color:'#71cbff',
			        		}
			        	},
			        	data:yData
			        }
			    ]
			}
			//绘制图表
			myChart2.setOption(option2);
			myChart2.dispatchAction({
			    type: 'showTip',
			    seriesIndex: 0,
				dataIndex: xData.length-1
			})
	}
	
