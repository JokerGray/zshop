var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

function getParams(url) {
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

function StoreShow() {
	this.params = getParams();
	this.init();
}
StoreShow.prototype = {
	init: function() {
		console.log("初始化");
		console.log(this.params);
		this.getInfo();
	},
	getInfo: function() {
		var that = this;
		var cmd = "game/showShopEarnings1",
			shopId = Number(that.params.shopId);
		var datas = {
			"shopId": shopId
		};
		var data = JSON.stringify(datas);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: false,
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
				var html = template('storeShowContent', re);
				document.getElementById("storeShow").innerHTML = html;
				console.log(shopId);
				that.navbtnClasschange($("#month1"));
				that.navbtnClasschange($("#week1"));				
				that.navbtnClasschange($("#day1"));				
				that.navbtnClasschange($("#month2"));				
				that.navbtnClasschange($("#week2"));				
				that.navbtnClasschange($("#day2"));
				that.navbtnClasschange($("#month3"));				
				that.navbtnClasschange($("#week3"));				
				that.navbtnClasschange($("#day3"));				
				
				$("#month2").on("click", function() {
					that.getpersonIncomeChart(shopId, 1);
				});
				$("#week2").on("click", function() {
					that.getpersonIncomeChart(shopId, 2);
				});
				$("#day2").on("click", function() {
					that.getpersonIncomeChart(shopId, 3);
				});
				$("#day2").trigger("click");
				$("#month1").on("click", function() {
					that.getPercentChart(shopId, 1);
				});
				$("#week1").on("click", function() {
					that.getPercentChart(shopId, 2);
				});
				$("#day1").on("click", function() {
					that.getPercentChart(shopId, 3);
				});
				$("#day1").trigger("click");
				$("#month3").on("click", function() {
					that.getIncomeTide(shopId, 1);
				});
				$("#week3").on("click", function() {
					that.getIncomeTide(shopId, 2);
				});
				$("#day3").on("click", function() {
					that.getIncomeTide(shopId, 3);
				});
				$("#day3").trigger("click");	
			},
			error: function(re) {
				console.log(re);
			}
		});
	},
	getpersonIncomeChart: function(shopId, num) {
		var that = this,
			cmd = "game/showShopEarnings3";
		var datas = {
			"shopId": shopId,
			"num": num
		}
		var data = JSON.stringify(datas);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: false,
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
				that.tideChart(re);
			},
			error: function(re) {
				console.log(re);
			}
		});

	},
	navbtnClasschange: function($btnChange) {
		var that = this;
		$btnChange[0] && $btnChange.on("click", function() {
			$(this).siblings().removeClass("btn-active");
			$(this).siblings().addClass("btn-default");
			$(this).removeClass("btn-default");
			$(this).addClass("btn-active");
		});
	},
	tideChart: function(re) {
		var myChart1 = echarts.init(document.getElementById('income'));
		var dataAxis = [],
			data = [];
		console.log(re);
		for (var i = 0; i < re.data.rankings.length; i++) {
			dataAxis.push((i+1)+" "+re.data.rankings[i].userName);
			data.push(re.data.rankings[i].earning);
		}

		option = {
			title: {
				text: '收益排行',
				padding: [20, 70],
				subtext: '',
				textStyle: {
					fontSize: 18,
					fontWeight: '200'
				}
			},
			tooltip:{
				trigger:"axis",
				formatter:"{b} : {c}只"
			},
			grid: {
				bottom: 20
			},
			xAxis: {
				data: dataAxis,
				axisLabel: {
					interval: 0,
					textStyle: {
						color: '#999'
					}
				},
				axisLine: {
					show:false,
					lineStyle:{
						color:"#eeeeee",
						width:1
					}
				},
				axisTick: {
					show: false
				}
			},
			yAxis: {
				type:"value",
				boundaryGap:['20%','20%'],
				min:0,
				axisLine: {
					show:true,
					lineStyle:{
						color:"#eee",
						width:1
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#eee'
					}
				},				
				padding: [10, 10],
				axisLabel: {
					textStyle: {
						color: '#999'
					}
				}
			},
			dataZoom: [{
				type: 'inside'

			}],
			series: [{
				type: 'bar',
				barWidth:25,
				data:data,
				itemStyle: {
					normal: {
						barBorderRadius: [30, 30, 0, 0],
						color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1, [{
								offset: 0.1,
								color: '#2ed9cd'
							}, {
								offset: 0.5,
								color: '#34c6d9'
							}, {
								offset: 1,
								color: '#38b8e2'
							}]
						)
					},
					emphasis: {
						barBorderRadius: [10, 10, 0, 0],
						color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1, [{
								offset: 0,
								color: '#2378f7'
							}, {
								offset: 0.7,
								color: '#2378f7'
							}, {
								offset: 1,
								color: '#83bff6'
							}]
						)
					}
				}
			}]
		};
		// Enable data zoom when user click bar.
		var zoomSize = 6;
		myChart1.on('click', function(params) {
			console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
			myChart.dispatchAction({
				type: 'dataZoom',
				startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
				endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
			});
		});
		myChart1.setOption(option);
		window.addEventListener("resize",function(){
			setTimeout(function(){
				myChart1.resize();
			},200)
		});
	},
	getPercentChart: function(shopId, num) {
		var that = this;
		console.log(shopId + ":" + num);
		var that = this,
			cmd = "game/showShopEarnings4";
		var datas = {
			"shopId": shopId,
			"num": num
		}
		var data = JSON.stringify(datas);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: false,
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
				console.log("个人收益数据拿到");
				that.percentChart(re);
				var html = template('incomeTable', re);
				document.getElementById("informationBox").innerHTML = html;				
			},
			error: function(re) {
				console.log(re);
			}
		});
	},
	percentChart: function(re) {
		var that=this,
			nameArr=[],
			percentArr=[],
			leftPercent=100;
		console.log(re.data.rankings);
		for(var i=0;i<re.data.rankings.length;i++){
			if(i<3){
				nameArr.push(re.data.rankings[i].userName);
			}
				percentArr[i]={value:re.data.rankings[i].percentum,name:re.data.rankings[i].userName};
		}
//		初始化canvas画布框的宽高相等
		var wid=$("#person_income").width();
		$("#person_income").height(wid);
		
		var myChart2 = echarts.init(document.getElementById('person_income'));
		option = {
			title: {
				text: '个人收益占比率',
				padding: [30, 50],
				textStyle: {
					fontSize: 18,
					fontWeight: 200,
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: "{d}%",
			},

//			legend: {
//				orient: 'vertical',
//				x: 'center',
//				y: 'bottom',
//				textStyle: {
//					fontSize: '20',
//					color:'#999999'
//				},
//
//				data:nameArr,
//				align: 'left',
//				padding: [40,150],
////	            itemGap:'1'
//				selectedMode:false,
//				formatter: function(name){
//					return name + '    1%     ' +'       %0.22.22';
//				}
//			},
			series: [{
				name: '收益占比',
				type: 'pie',
				radius: ['30%', '40%'],
				avoidLabelOverlap: false,
				hoverAnimation:false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						},
						formatter:"{b}:{c}%"
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: percentArr,
				color:["#b3baff","#87eae2","#9986f9","#f9c383","#84d7f9","#ebebeb","#54c0ec","#2ed9cc"]
			}]
		};
		myChart2.setOption(option);
		window.addEventListener("resize",function(){
			setTimeout(function(){
				myChart2.resize();
			},200)
		});
	},
	getIncomeTide: function(shopId,num) {
		var that = this,
			cmd = "game/showShopEarnings2";
		var datas = {
			"shopId": shopId,
			"num": num
		}
		var data = JSON.stringify(datas);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: false,
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
				console.log("个人趋势图");
				that.persontideChart(re,num);
			},
			error: function(re) {
				console.log(re);
			}
		});
		
	},
	persontideChart:function(re,num){
		console.log(re.data.earnings);
		console.log(num);		
		var myChart3 = echarts.init(document.getElementById('rankingtide'));
		var dataYxis =re.data.earnings;
		//    var datarankingtide = [3000,7000,11000,12000,13000,12000,14000,13000,13500,16000,16500,17000];
		var option = {
			title: {
				text: '收益趋势',
				padding: [20, 70],
				textStyle: {
					fontSize: 18,
					fontWeight: 200,

				}
			},
			tooltip:{
				trigger:"axis",
				formatter:"{b}：{c}只"
			},
			xAxis: {
				type: 'category',
				data: re.data.dateTime,
				axisLabel: {
					textStyle: {
						color: '#999'
					}
				},
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#eee'
					}
				}
			},
			yAxis: {
				type: 'value',
				boundaryGap:['20%','20%'],
				min:0,
				axisLabel: {
					textStyle: {
						color: '#999'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#eee'
					}
				},

				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#eee'
					}
				},

			},
			series: [{
				type: 'line',
				data:re.data.earnings,
				symbolSize: 10,
				itemStyle: {
					normal: {
						color: '#2ed9cd',
						label: {
							show: false,
						},
						lineStyle: {
							normal: {
								width: 10,
								color: '#2ed9cd'
							}

						},
					}
				},

			}]

		};
		myChart3.setOption(option);
		window.addEventListener("resize",function(){
			setTimeout(function(){
				myChart3.resize();
			},200)
		});
		
	}

}
var stores = new StoreShow();


