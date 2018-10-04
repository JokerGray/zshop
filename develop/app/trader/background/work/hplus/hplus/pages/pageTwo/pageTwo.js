(function($) {
	var serve = {
		getScMultipleShopConfigureByUserId: "operations/getScMultipleShopConfigureByUserId", //获取到id，再通过id查询出相关数据
		getScMultipleShopConfigureList : 'operations/getScMultipleShopConfigureList',
		getScMultipleShopConfigureById : "operations/getScMultipleShopConfigureById",//详情
		getShopProfitSum:"operations/getShopProfitMerchantSum"//运营中心片区数据
	}
	
	var dataId = sessionStorage.getItem('dataId') || "2";
	
	//生成echar
	function _eChar(domId, option) {
		var dom = echarts.init(document.getElementById(domId));
		dom.setOption(option);
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
				s += "<td class='text-center p12'><span class='label label-warning'>¥"+(t.salesMonth?t.salesMonth:0)+".00</span></td>"
				s += "</tr>"
			}else if(type == 2){
				s += "<tr>"
				s += "<td class='p12'>"+t.name+"</td>"
				s += "<td class='text-center p12'><span class='label label-primary'>"+(t.merchantCount?t.merchantCount:0)+"</span></td>"
				s += "</tr>"
			}else{
				s += "<tr>"
				s += "<td class='p12'>"+t.name+"</td>"
				s += "<td class='text-center p12'><span class='label label-warning'>¥"+(t.salesMonth?t.salesMonth:0)+".00</span></td>"
				s += "<td class='text-center p12'><span class='label label-primary'>¥"+(t.comsumptionMonth?t.comsumptionMonth:0)+".00</span></td>"
				s += "</tr>"
			}
		})
		$("#"+dom).html(s)
	}
	
	


	//初始化
	getEchar();
	function getEchar() {
			var date = new Date();
			var day = date.getDate();
			var dayArr = [];
			var dayCost = [];
			var idParm = {
				id: dataId
			};
			reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idParm)).then(function(res) {
				var firData = res.data;
				var fiveFirData = firData.slice(0,5);
				//表格初始化
				initTable(fiveFirData,"fTbody");
				initTable(fiveFirData,"sTbody",1);
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
					
				var sLi = "";
				for(var i = 0; i < firData.length; i++) {
					var salesMonth = firData[i].salesMonth?firData[i].salesMonth:0; //月销售额(1表)
					a.push(salesMonth)
					var comsumptionMonth = firData[i].comsumptionMonth?firData[i].comsumptionMonth:0 //消耗（1表）
					v.push(comsumptionMonth)
					var name = firData[i].name; //区名
					c.push(name)
					var cost = firData[i].cost?firData[i].cost:0 //片区商户数量（3表）
					d.push(cost);
					var imagePath = firData[i].imagePath; //图片地址
					z.push(imagePath)
					var id = firData[i].id;
					ida.push(id);
					sLi += "<li class='swiper-slide' data-MerchantId="+firData[i].merchantId+"><a data-id=" + ida[i] + " class='jump'><img src=" + z[i] + "><span>" + c[i] + "</span><h3 class='red'>销售额￥"+a[i]+"</h3><h3>消耗额￥"+v[i]+"</h3><h3>费用￥"+d[i]+"</h3></a></li>"
				}
				
				$('ul.swiper-wrapper').html(sLi)
				var swiper = new Swiper('.swiper-container', {
					slidesPerView: "auto",
					spaceBetween: "1%"
				})
				
				for(var i = 0; i < fiveFirData.length; i++) {
					var salesMonth = fiveFirData[i].salesMonth?fiveFirData[i].salesMonth:0; //月销售额(1表)
					alla.push(salesMonth)
					var comsumptionMonth = fiveFirData[i].comsumptionMonth?fiveFirData[i].comsumptionMonth:0 //消耗（1表）
					allv.push(comsumptionMonth)
					var name = firData[i].name; //区名
					allc.push(name)
					var merchantCount = fiveFirData[i].merchantCount //片区商户数量（3表）
					alld.push(merchantCount);
					var imagePath = fiveFirData[i].imagePath; //图片地址
					allz.push(imagePath)
					var id = fiveFirData[i].id;
					allida.push(id);
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
							color: ['#ceeefd', '#e5e5e5', '#cfccea'],
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
				
				
				reqAjaxAsync(serve.getScMultipleShopConfigureById,JSON.stringify(idParm)).then(function(res){
					var data = res.data;
					$('#pageTwoTit').html("<i class='left-corol'></i><i id='titPage'>"+data.name+"</i>")
					$('#h5conut').html(data.name + "商户(" + data.merchantCount + "家)");
					$('h3.salesMonth').html("销售额￥" + data.salesMonth)
					$('h3.comsumptionMonth').html("消耗额￥" + data.comsumptionMonth)
					$('h3.cost').html("费用￥" + data.cost);
				})
				
				$("img").error(function() {
					$(this).prop('src', 'pages/profile/img/test.png')
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
				
				

				_eChar("first", firstOption)
			})
		}
	
	$('body').on('click','.left-corol',function(){
		var backUserId = sessionStorage.getItem("backUserId")||"";
		location.href = "profile.html?backUserId="+backUserId+""
	})
	
	var fromurl = sessionStorage.getItem("fromurl");
	$('body').on('click','.swiper-slide',function(){
		var merchantId = $(this).attr("data-merchantid");
		top.window.location = "http://"+fromurl+"/agencyLogin.do?agencyMerchantId="+merchantId+""
	})
	
	$('body').on('click','#tojump',function(){
		sessionStorage.setItem("form","two")
		location.href="pageThree.html"
	})
	
})(jQuery)