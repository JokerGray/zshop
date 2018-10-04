(function($) {
	
    FastClick.attach(document.body);    
	
	var serve = {
		getScMultipleShopConfigureByUserId: "operations/getScMultipleShopConfigureByUserId", //获取到id，再通过id查询出相关数据
		getScMultipleShopConfigureList: "operations/getScMultipleShopConfigureList", //连锁店接口
		getShopProfitSum:"operations/getShopProfitSum"//运营中心片区数据
	}
	

	//生成echar
	function _eChar(domId, option) {
		var dom = echarts.init(document.getElementById(domId));
		dom.setOption(option);
	}

	sessionStorage.clear();


	//取url参
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	
	

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


	//初始化
	getEchar();

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
			sessionStorage.setItem('backUserId',backUserId);
			var data = res.data;
			var id = data.id;
			$('#toMore').html("<a data-id=" + id + " id='jumpa'></a>")
			var date = new Date();
			var day = date.getDate();
			var dayArr = [];
			var dayCost = [];
			var idParm = {
				id: id
			};
			reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idParm)).then(function(res) {
				var firData = res.data;
				var fiveFirData = firData.slice(0,5);
				var a = [],
					v = [],
					c = [],
					d = [],
					z = [],
					ida = [],
					daya=[],
					dayv=[],
					dayc=[],
					dayd=[],
					dayf=[],
					dayz=[],
					dayida=[]
				
				for(var i = 0; i < fiveFirData.length; i++) {
					var salesMonth = fiveFirData[i].salesMonth; //月销售额(1表)
					a.push(salesMonth)
					var comsumptionMonth = fiveFirData[i].comsumptionMonth //消耗（1表）
					v.push(comsumptionMonth)
					var merchantCount = fiveFirData[i].merchantCount //片区商户数量（3表）
					d.push(merchantCount);
					var imagePath = fiveFirData[i].imagePath; //图片地址
					var name = fiveFirData[i].name; //区名
					c.push(name)
					z.push(imagePath)
					var id = fiveFirData[i].id;
					ida.push(id);
				}
				
				var sLi = "";
				for(var i = 0; i < firData.length; i++) {
					var salesMonth = firData[i].salesMonth; //月销售额(1表)
					daya.push(salesMonth)
					var comsumptionMonth = firData[i].comsumptionMonth //消耗（1表）
					dayv.push(comsumptionMonth)
					var merchantCount = firData[i].merchantCount //片区商户数量（3表）
					dayd.push(merchantCount);
					var imagePath = firData[i].imagePath; //图片地址
					var name = firData[i].name; //区名
					dayc.push(name)
					dayz.push(imagePath)
					var id = firData[i].id;
					dayida.push(id);
					sLi += "<li class='swiper-slide' data-id=" + dayida[i] + "><a class='jump'><img src=" + dayz[i] + "><span>" + dayc[i] + "</span></a></li>"
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
				
				
				reqAjaxAsync(serve.getShopProfitSum,JSON.stringify(idParm)).then(function(res){
					var data = res.data;
					data = data.slice(0,5);
					var c = [],
						f = [],
						dataCost = [],
						dayArr = []

					for(var i = 0; i < data.length; i++) {
						var name = data[i].name;
						c.push(name);
						dataCost[i] = [];
						for(var u=0;u<data[i].list.length;u++){
							dayArr.push(u+1);
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
					console.log(f)
					_eChar("secend", secendOption)
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

				

				var thirdOption = {
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
						top: "6%",
						bottom: '3%',
						containLabel: true
					},
					backgroundColor: "#fff",
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
						name: '数量',
						type: 'bar',
						barGap: 0,
						barWidth: 20, //柱图宽度
						data: d,
						itemStyle: {
							normal: {
								color: '#84a0ff',
								shadowColor: 'rgba(0, 0, 0, 0.4)'
							}
						}

					}]
				};
				_eChar("first", firstOption) // 销售消耗图
				_eChar("third", thirdOption) //数量图
			})
		})
	}
	
	
	
	$('body').on('click', '.swiper-slide', function() {
		var _id = $(this).attr('data-id');
		sessionStorage.setItem("_id", _id);
		location.href="pageTwo.html";
		
	})
	
	$('body').on('click', '#secend-tip', function() {
		var jumpId = $("#jumpa").attr('data-id');
		var isFirst = true;
		sessionStorage.setItem("isFirst", isFirst);
		sessionStorage.setItem("jumpId", jumpId);
		location.href ="pageThree.html";
	})

})(jQuery)