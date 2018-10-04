(function($) {
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
	
	
	
	//表格方法
	function initTable(d,dom,type){
		var s = "";
		if(d.length>=5){
			d = d.slice(0,5)
		}
		$.each(d,function(i,t){
			if(type == 1){
				s += "<tr>"
				s += "<td class='p12'>"+t.name+"</td>"
				s += "<td class='text-center p12'><span class='label label-warning'>¥"+t.salesMonth+".00</span></td>"
				s += "</tr>"
			}else if(type == 2){
				s += "<tr>"
				s += "<td class='p12'>"+t.name+"</td>"
				s += "<td class='text-center p12'><span class='label label-primary'>"+t.merchantCount+"</span></td>"
				s += "</tr>"
			}else{
				s += "<tr>"
				s += "<td class='p12'>"+t.name+"</td>"
				s += "<td class='text-center p12'><span class='label label-warning'>¥"+t.salesMonth+".00</span></td>"
				s += "<td class='text-center p12'><span class='label label-primary'>¥"+t.comsumptionMonth+".00</span></td>"
				s += "</tr>"
			}
		})
		$("#"+dom).html(s)
	}
	
	sessionStorage.setItem("backUserId",GetQueryString("backUserId"));
	sessionStorage.setItem("fromurl",GetQueryString("fromurl"));


	//初始化
	getEchar();

	function getEchar() {
		var parme = {
			backUserId: GetQueryString("backUserId") || "10705"
		};
		reqAjaxAsync(serve.getScMultipleShopConfigureByUserId, JSON.stringify(parme)).then(function(res) {
			if(res.code==9||res.data==[]){
				layer.msg(res.msg)
				return
			}
			var data = res.data;
			var id = data.id;
			sessionStorage.setItem("dataId",id);
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
				//表格初始化
				initTable(firData,"fTbody");
				initTable(firData,"sTbody",1);
				initTable(firData,"tTbody",2);
				var a = [],
					v = [],
					c = [],
					d = [],
					f = [],
					z = [],
					ida = [],
					dayCost = [],
					alla = [],
					allv = [],
					allc = [],
					alld = [],
					allf = [],
					allz = [],
					allida = []
				for(var i = 0; i < firData.length; i++) {
					var salesMonth = firData[i].salesMonth; //月销售额(1表)
					a.push(salesMonth)
					var comsumptionMonth = firData[i].comsumptionMonth //消耗（1表）
					v.push(comsumptionMonth)
					var name = firData[i].name; //区名
					c.push(name)
					var merchantCount = firData[i].merchantCount //片区商户数量（3表）
					d.push(merchantCount);
					var imagePath = firData[i].imagePath; //图片地址
					z.push(imagePath)
					var id = firData[i].id;
					ida.push(id);
					
				}
				
				var sLi = "";
				
				for(var i = 0; i < fiveFirData.length; i++) {
					var salesMonth = fiveFirData[i].salesMonth; //月销售额(1表)
					alla.push(salesMonth)
					var comsumptionMonth = fiveFirData[i].comsumptionMonth //消耗（1表）
					allv.push(comsumptionMonth)
					var name = firData[i].name; //区名
					allc.push(name)
					var merchantCount = fiveFirData[i].merchantCount //片区商户数量（3表）
					alld.push(merchantCount);
					var imagePath = fiveFirData[i].imagePath; //图片地址
					allz.push(imagePath)
					var id = fiveFirData[i].id;
					allida.push(id);
					sLi += "<li class='swiper-slide'><a href='pageTwo.html' data-id=" + ida[i] + " class='jump'><img src=" + z[i] + "><span>" + c[i] + "</span></a></li>"
				}
				
				$('ul.swiper-wrapper').html(sLi)
				var swiper = new Swiper('.swiper-container', {
					slidesPerView: "auto",
					spaceBetween: "1%"
				})
				
				$("img").error(function() {
					$(this).prop('src', 'pages/profile/img/test.png')
				});
				
				
				
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
				_eChar("second", secendOption)
			})
				
				
				
				
				

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
						data: allc
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: "销售",
							type: 'bar',
							barGap: 0,
							barWidth: 20, //柱图宽度
							data: alla,
							itemStyle: {
								normal: {
									shadowColor: 'rgba(0, 0, 0, 0.4)',
									shadowBlur: 20
								}
							}
						},
						{
							name: '消耗',
							type: 'bar',
							barGap: 0,
							barWidth: 20, //柱图宽度
							data: allv,
							itemStyle: {
								normal: {
									shadowColor: 'rgba(0, 0, 0, 0.4)',
									shadowBlur: 20
								}
							}
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
						data: allc
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '数量',
						type: 'bar',
						barGap: 0,
						barWidth: 20, //柱图宽度
						data: alld,
						itemStyle: {
							normal: {
								color: '#84a0ff',
								shadowColor: 'rgba(0, 0, 0, 0.4)',
								shadowBlur: 20
							}
						}

					}]
				};
				
				
				_eChar("first", firstOption)
				_eChar("third", thirdOption)
			})
		})
	}
	$('body').on('click','.jump',function(){
		var id = $(this).attr('data-id') || '2';
		sessionStorage.setItem('dataId',id)
	})
	
	
	
	$('body').on('click','#tojump',function(){
		sessionStorage.setItem("form","one")
		location.href="pageThree.html"
	})

})(jQuery)