(function($) {
	var serve = {
		getScMultipleShopConfigureByUserId: "operations/getScMultipleShopConfigureByUserId", //获取到id，再通过id查询出相关数据
		getScMultipleShopConfigureList: 'operations/getScMultipleShopConfigureList',
		getScMultipleShopConfigureById: "operations/getScMultipleShopConfigureById", //详情
		getShopProfitSum: "operations/getShopProfitMerchantSum" //运营中心片区数据
	}
	FastClick.attach(document.body); 

	sessionStorage.setItem("form",0)
	
	function _eChar(domId, option) {
		var dom = echarts.init(document.getElementById(domId));
		dom.setOption(option);
	}

	//取url参
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}

	//ios 方法	
	function setupWebViewJavascriptBridge(callback) {
		if(window.WebViewJavascriptBridge) {
			return callback(WebViewJavascriptBridge);
		}
		if(window.WVJBCallbacks) {
			return window.WVJBCallbacks.push(callback);
		}
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'https://__bridge_loaded__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() {
			document.documentElement.removeChild(WVJBIframe)
		}, 0)
	}

	function backZmasterApp() {
		var merchantId = $(this).attr('data-merchantId');
		var j = {};
		j.merchantId = merchantId;
		var ua = navigator.userAgent;
		if(ua.match(/iPhone|iPod/i) != null) { //ios
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('switchToWorkBenchHomeVCArea', JSON.stringify(j), function(response) {})
			})
		} else if(ua.match(/Android/i) != null) { //安卓
			android.mAndroidWorkHome(merchantId);
		}
	}

	$('body').on('click', '.swiper-slide', backZmasterApp)

	//去重
	Array.prototype.unique = function() {
		var res = [this[0]];
		for(var i = 1; i < this.length; i++) {
			var repeat = false;
			for(var j = 0; j < res.length; j++) {
				if(this[i] == res[j]) {
					repeat = true;
					break;
				}
			}
			if(!repeat) {
				res.push(this[i]);
			}
		}
		return res;
	}

	getEchar()

	function getEchar() {
		var backUserId = GetQueryString("backUserId") || "";
		var parme = {
			backUserId: backUserId
		};
		reqAjaxAsync(serve.getScMultipleShopConfigureByUserId, JSON.stringify(parme)).then(function(res) {
			if(res.code == 9 ||res.data==[]) {
				layer.msg(res.msg)
				return
			} 
			$('.tit').text(res.data.name);
			if(res.code == 9) {
				layer.msg(res.msg)
				return
			}
			sessionStorage.setItem('backUserIdTwo', backUserId);
			var data = res.data;
			var id = data.id;
			sessionStorage.setItem('_id', id);
			$('#toMore a').attr('data-id', id);
			var idParm = {
				id: id
			}
			var date = new Date();
			var day = date.getDate();
			var dayArr = [];
			var dayCost = [];

			reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idParm)).then(function(res) {
				var firData = res.data;
				var fiveFirData = firData.slice(0, 5);
				var a = [],
					v = [],
					c = [],
					d = [],
					f = [],
					z = [],
					h = [],
					dayc = [],
					dayz = [],
					daya = [],
					dayv = [],
					dayh = []
				for(var i = 0; i < fiveFirData.length; i++) {
					var salesMonth = fiveFirData[i].salesMonth?fiveFirData[i].salesMonth:0; //月销售额(1表)
					a.push(salesMonth)
					var comsumptionMonth = fiveFirData[i].comsumptionMonth?fiveFirData[i].comsumptionMonth:0 //消耗（1表）
					v.push(comsumptionMonth)
					var name = fiveFirData[i].name; //区名
					c.push(name)
					var merchantCount = fiveFirData[i].merchantCount //片区商户数量（3表）
					d.push(merchantCount);
					var imagePath = fiveFirData[i].imagePath; //图片地址
					z.push(imagePath)
					var cost = fiveFirData[i].cost? fiveFirData[i].cost:0; //费用
					h.push(cost)
				}
				console.log(c)

				var sLi = "";
				for(var i = 0; i < firData.length; i++) {
					var salesMonth = firData[i].salesMonth?firData[i].salesMonth:0; //月销售额(1表)
					daya.push(salesMonth)
					var comsumptionMonth = firData[i].comsumptionMonth?firData[i].comsumptionMonth:0; //消耗（1表）
					dayv.push(comsumptionMonth)
					var name = firData[i].name; //区名
					dayc.push(name)
					var imagePath = firData[i].imagePath; //图片地址
					dayz.push(imagePath)
					var cost = firData[i].cost?firData[i].cost:0; //费用
					dayh.push(cost)
					sLi += "<li class='swiper-slide' data-merchantId=" + firData[i].merchantId + "><a><img src=" + dayz[i] + "><span>" + dayc[i] + "</span><h3 class='red'>销售额￥" + daya[i] + "</h3><h3>消耗额￥" + dayv[i] + "</h3><h3>费用￥" + dayh[i] + "</h3></a></li>"
				}
				$('ul.swiper-wrapper').html(sLi)
				try {
					if(firData.length != 1) {
						var swiper = new Swiper('#area', {
							slidesPerView: "auto",
							spaceBetween: "1%"
						})
					}
				} catch(e) {
					console.log(e)
				}

				reqAjaxAsync(serve.getShopProfitSum, JSON.stringify(idParm)).then(function(res) {
					var data = res.data;
					data = data.slice(0, 5);
					var c = [],
						f = [],
						dataCost = [],
						dayArr = []
					for(var i = 0; i < data.length; i++) {
						var name = data[i].name;
						c.push(name);
						dataCost[i] = [];
						for(var u = 0; u < data[i].list.length; u++) {
							dayArr.push(u + 1);
							dayArr = dayArr.unique();
							dataCost[i].push(data[i].list[u].totalCost);
						}
						//step2
						var e = {};
						e.name = c[i]
						e.type = "line",
							e.stack = "总量",
							e.areaStyle = {
								normal: {}
							},
							e.data = dataCost[i]
						f.push(e)
					}

					console.log(f)
					var secendOption = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								label: {
									backgroundColor: '#6a7985'
								}
							}
						},
						color: ['#ffa576','#64e0fa',"#009688","#1E9FFF","#FF5722"],
						legend: {
							data: c,
							top: "5%",
							left: "7%"
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							boundaryGap: false,
							data: dayArr
						}],
						yAxis: [{
							type: 'value'
						}],
						series: f
					};
					_eChar("secend", secendOption)
				})

				reqAjaxAsync(serve.getScMultipleShopConfigureById, JSON.stringify(idParm)).then(function(res) {
					var data = res.data;
					$('h2.tit').html(data.name)
					$('h3.left-area').html(data.name + "商户(" + data.merchantCount + "家)");
					$('h3.salesMonth').html("销售额￥" + data.salesMonth)
					$('h3.comsumptionMonth').html("消耗额￥" + data.comsumptionMonth)
					$('h3.cost').html("费用￥" + data.cost);
				})

				$("img").error(function() {
					$(this).prop('src', 'img/test.png')
				});

				var firstOption = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					backgroundColor: "#fff",
					color: ['#ffa576', '#64e0fa'],
					legend: {
						data: ['销售', '消耗'],
						top: "5%",
						left: "7%"
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						axisTick: {
							show: false
						},
						data: c
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: "销售",
							type: 'bar',
							barGap: 0,
							barWidth: 20, //柱图宽度
							data: a
						},
						{
							name: '消耗',
							type: 'bar',
							barGap: 0,
							barWidth: 20, //柱图宽度
							data: v
						}
					]
				};

				_eChar("first", firstOption) // 销售消耗图

			})
		})

	}

	$('body').on('click', '#secend-tip', function() {
		var jumpId = $('#jumpa').attr('data-id');
		sessionStorage.setItem("jumpId", jumpId);
		sessionStorage.setItem("isFirst", false);
		location.href = "pageThree.html";
	})
})(jQuery)