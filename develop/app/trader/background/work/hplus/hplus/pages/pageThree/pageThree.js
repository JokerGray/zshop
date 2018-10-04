(function($) {
	var serve = {
		getScMultipleShopConfigureByUserId: "operations/getScMultipleShopConfigureByUserId", //获取到id，再通过id查询出相关数据
		getScMultipleShopConfigureList: 'operations/getScMultipleShopConfigureList',
		getScMultipleShopConfigureById: "operations/getScMultipleShopConfigureById", //详情
		getAllShopProfitSumByShopIdAndDate: "operations/getAllShopProfitSumByShopIdAndDate", //区域利润
		getAllShopProfitSumByDate: "operations/getAllShopProfitSumByDate" //商户利润
	}
	sessionStorage.removeItem("_year")
	sessionStorage.removeItem("_month")
	sessionStorage.removeItem("shopId")
	
	var laydate = layui.laydate;

	var dataId = sessionStorage.getItem('dataId') || "";
	var backUserId = sessionStorage.getItem("backUserId") || "";
	
	var idPam = {
		id: dataId
	}

	var vueData = {
		"areaJson": [{
			"name": "0",
			"id": 0,
			"updateTime": "0",
			"merchantId": 0,
			"shopId": 0,
			"level": 0,
			"parentId": 0,
			"comsumptionMonth": 0,
			"merchantCount": 0,
			"salesMonth": 0,
			"backUserId": 0,
			"cost": 0,
			"imagePath": "0",
			"addTime": "0",
			"active":false
		}],
		"yearJson": [{
			"id": 0,
			"updateTime": 0,
			"merchantId": 0,
			"shopId": 0,
			"params": 0,
			"performance": 0,
			"totalCostPercentage": 0,
			"profitPercentage": 0,
			"wagePercentage": 0,
			"rentPercentage": 0,
			"travelExpensesPercentage": 0,
			"cityTransportationFee": 0,
			"telephoneFeePercentage": 0,
			"productCostSubtotal": 0,
			"salesPercentage": 0,
			"repairCosts": 0,
			"rewardFeePercentage": 0,
			"assetsDepreciation": 0,
			"transportFeesPercentage": 0,
			"advertisingFeePercentage": 0,
			"prFeePercentage": 0,
			"businessTax": 0,
			"travelExpenses": 0,
			"gasHydropowerPercentage": 0,
			"trainingFees": 0,
			"officeExpenses": 0,
			"sporadicPurchaseCosts": 0,
			"posFeePercentage": 0,
			"decorationPercentage": 0,
			"basicCostSubtotal": 0,
			"gasHydropower": 0,
			"telephoneFee": 0,
			"socialSecurityCharges": 0,
			"proofingPercentage": 0,
			"transportFees": 0,
			"carFeePercentage": 0,
			"repairCostsPercentage": 0,
			"welfareFeePercentage": 0,
			"advertisingFee": 0,
			"awardGiftPercentage": 0,
			"businessTaxPercentage": 0,
			"officeExpensesPercentage": 0,
			"trainingFeesPercentage": 0,
			"cashCostsSubtotal": 0,
			"posFee": 0,
			"wage": 0,
			"sales": 0,
			"carFee": 0,
			"prFee": 0,
			"proofing": 0,
			"profit": 0,
			"awardGift": 0,
			"rewardFee": 0,
			"welfareFee": 0,
			"totalCost": 0,
			"rent": 0,
			"decoration": 0,
			"basicCostSubtotalPercentage": 0,
			"sporadicPurchaseCostsPercentage": 0,
			"socialSecurityChargesPercentage": 0,
			"cityTransportationFeePercentage": 0,
			"cashCostsSubtotalPercentage": 0,
			"assetsDepreciationPercentage": 0,
			"productCostSubtotalPercentage": 0,
			"searchDate": "0",
			"statisticsDate": "0",
			"addTime": 0
		}]
	}
	
	var yearJsonNull={
			"id": 0,
			"updateTime": 0,
			"merchantId": 0,
			"shopId": 0,
			"params": 0,
			"performance": 0,
			"totalCostPercentage": 0,
			"profitPercentage": 0,
			"wagePercentage": 0,
			"rentPercentage": 0,
			"travelExpensesPercentage": 0,
			"cityTransportationFee": 0,
			"telephoneFeePercentage": 0,
			"productCostSubtotal": 0,
			"salesPercentage": 0,
			"repairCosts": 0,
			"rewardFeePercentage": 0,
			"assetsDepreciation": 0,
			"transportFeesPercentage": 0,
			"advertisingFeePercentage": 0,
			"prFeePercentage": 0,
			"businessTax": 0,
			"travelExpenses": 0,
			"gasHydropowerPercentage": 0,
			"trainingFees": 0,
			"officeExpenses": 0,
			"sporadicPurchaseCosts": 0,
			"posFeePercentage": 0,
			"decorationPercentage": 0,
			"basicCostSubtotal": 0,
			"gasHydropower": 0,
			"telephoneFee": 0,
			"socialSecurityCharges": 0,
			"proofingPercentage": 0,
			"transportFees": 0,
			"carFeePercentage": 0,
			"repairCostsPercentage": 0,
			"welfareFeePercentage": 0,
			"advertisingFee": 0,
			"awardGiftPercentage": 0,
			"businessTaxPercentage": 0,
			"officeExpensesPercentage": 0,
			"trainingFeesPercentage": 0,
			"cashCostsSubtotal": 0,
			"posFee": 0,
			"wage": 0,
			"sales": 0,
			"carFee": 0,
			"prFee": 0,
			"proofing": 0,
			"profit": 0,
			"awardGift": 0,
			"rewardFee": 0,
			"welfareFee": 0,
			"totalCost": 0,
			"rent": 0,
			"decoration": 0,
			"basicCostSubtotalPercentage": 0,
			"sporadicPurchaseCostsPercentage": 0,
			"socialSecurityChargesPercentage": 0,
			"cityTransportationFeePercentage": 0,
			"cashCostsSubtotalPercentage": 0,
			"assetsDepreciationPercentage": 0,
			"productCostSubtotalPercentage": 0,
			"searchDate": "0",
			"statisticsDate": "0",
			"addTime": 0
		}
	
	
	var app = new Vue({
		el: '.wrapper',
		data: vueData,
		methods: {
			getp: function(num, performance) {
				return num ? ((num / performance) * 100).toFixed(2) + "%" : 0
			},
			getAll: function(yearJson, key) {
				var countAllNum = 0;
				for(var i = 0; i < yearJson.length; i++) {
					countAllNum += yearJson[i][key]
				}
				return countAllNum;
			},
			doTab: function(item, areaJson) {
				item.active = true;
				sessionStorage.setItem("shopId", item.id);
			}
		},
		mounted: function() {
			inIt();
		},
		created:function(){
			this.$nextTick(function(){
				reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idPam)).then(function(res) {
					var areaJson = res.data;
					for(var i=0;i<areaJson.length;i++){
						areaJson[i].active = false;
						areaJson[0].active = true;
						sessionStorage.setItem("shopId",areaJson[0].id)
						Vue.set(app.areaJson, i, areaJson[i])
					}
					var yearv = Number($('#year').html())
					var monthv = Number($('#month').html())
					if(!isNaN(yearv) && isNaN(monthv)) { //年
						var timeType = 0
					} else if(!isNaN(yearv) && !isNaN(monthv)) { //年月
						var timeType = 1
					}
					var shopId = sessionStorage.getItem("shopId");
					if(timeType == 0) { //年
						var startDate = "" + yearv + "-01-01";
						var endDate = "" + yearv + "-12-31"
						var idPams = {
							id: shopId,
							startDate: startDate,
							endDate: endDate,
							timeType: 0
						}
						$("#witch").html(yearv + "年利润表")

					}else if(timeType == 1) { //月
						var startDate = "" + yearv + "-" + monthv + "-01";
						var endDate = "" + yearv + "-" + monthv + "-31"
						var idPams = {
							id: shopId,
							startDate: startDate,
							endDate: endDate,
							timeType: 1
						}
						$("#witch").html(monthv+ "月利润表")
					}
					
					reqAjaxAsync(serve.getAllShopProfitSumByDate, JSON.stringify(idPams)).then(function(res) {
						var vuData = res.data;
						var vData = app.$data.yearJson;
						for(var k = 0; k < vuData.length; k++) {
							if(!vuData[k]){
								vuData[k] = yearJsonNull
							}
							Vue.set(app.yearJson,k,vuData[k])
						}
					});
				});
				
				
				
			})
		}
	})


	

	//tab切换
	$('body').on('click', '.top-link', function() {
		var index = $(this).index();
		var shopId = $(this).attr('data-id');
		sessionStorage.setItem("shopId", shopId);
		vueInit(index);
	})
	


	function vueInit(index) {
			reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idPam)).then(function(res) {
					var areaJson = res.data;
					try{
						for(var i=0;i<areaJson.length;i++){
							areaJson[i].active=false;
							areaJson[index].active=true;
							Vue.set(app.areaJson, i, areaJson[i])
						}
					}catch(e){
						console.log(e)
					}
				});
				
				var yearv = sessionStorage.getItem("_year")||$('#year').html()
				var monthv = sessionStorage.getItem("_month")||$('#month').html()
				if(!isNaN(yearv) && isNaN(monthv)) { //年
					var timeType = 0
				} else if(!isNaN(yearv) && !isNaN(monthv) && monthv!="" ) { //年月
					var timeType = 1
				}else{
					timeType = 0
				}
				var shopId = sessionStorage.getItem("shopId");
				if(timeType == 0) { //年
					$("#witch").html(yearv+"年利润表")
					var startDate = "" + yearv + "-01-01";
					var endDate = "" + yearv + "-12-31"
					var idPams = {
						id: shopId,
						startDate: startDate,
						endDate: endDate,
						timeType: 0
					}
				} else if(timeType == 1) { //月,闰年暂时不考虑
					$("#witch").html(yearv+"年"+monthv+ "月利润表")
					if(monthv==1||monthv==3||monthv==5||monthv==7||monthv==8||monthv==10||monthv==12){
						var startDate = "" + yearv + "-" + monthv + "-01";
						var endDate = "" + yearv + "-" + monthv + "-31"
					}else if(monthv==4||monthv==6||monthv==9||monthv==11){
						var startDate = "" + yearv + "-" + monthv + "-01";
						var endDate = "" + yearv + "-" + monthv + "-30"
					}else{
						var startDate = "" + yearv + "-" + monthv + "-01";
						var endDate = "" + yearv + "-" + monthv + "-28"
					}
					var idPams = {
						id: shopId,
						startDate: startDate,
						endDate: endDate,
						timeType: 1
					}
				}
				reqAjaxAsync(serve.getAllShopProfitSumByDate, JSON.stringify(idPams)).then(function(res) {
					var vuData = res.data;
					var vData = app.$data.yearJson;
					try{
						var length = vuData.length;
						if(vuData.length==12){
							app.yearJson.length=length;
							for(var k = 0; k < vuData.length; k++) {
								for(var p=0;p<vData.length;p++){
									if(k==p){
										if(!vuData[p]){
											vuData[p] = yearJsonNull
										}
										Vue.set(app.yearJson,p,vuData[p])
									}
								}
							}
						}else{
							for(var k = 0; k < vuData.length; k++) {
								app.yearJson.length=length;
								if(!vuData[k]){
									vuData[k] = yearJsonNull
								}
								Vue.set(app.yearJson,k,vuData[k])
							}
						}
						
					}catch(e){
						console.log(e)
					}
					
				});
	}

	function inIt() {
		$('.right-table').niceScroll({
			cursorcolor: "transparent", //#CC0071 光标颜色
			cursoropacitymax: 0.5, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
			touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备
			cursorwidth: "5px", //像素光标的宽度
			cursorborder: "0", // 游标边框css定义
			cursorborderradius: "5px", //以像素为光标边界半径
			autohidemode: false, //是否隐藏滚动条
			smoothscroll: true, // ease动画滚动
			railoffset: true // 可以使用top/left来修正位置
		});
		var date = new Date();
		var year = date.getFullYear();

		laydate.render({
			elem: '#year', //指定元素
			type: "year",
			max: "2018",
			btns:['now', 'confirm'],
			ready: function(date){
			     $('body').on('click',function(){
			     	return false
			     })
		    },			
			done: function(value) {
				sessionStorage.setItem("_year", value);
				vueInit();
			}
		});

		laydate.render({
			elem: '#month', //指定元素
			type: "month",
			format: "MM",
			ready: function(date){
				 $('.layui-laydate-hint').hide();
				 $('.layui-laydate-header').hide();
			     $('body').on('click',function(){
			     	return false
			     })
		    },	
			done: function(value) {
				if(value==""){
					$("#month").html("月份")
				}
				sessionStorage.setItem("_month", value);
				vueInit();
			}
		});
	}
	
	$('body').on('click',"#goBack",function(){
		var form = sessionStorage.getItem("form");
		var backUserId = sessionStorage.getItem("backUserId")||"";
		if(form == "one"){
			location.href = "profile.html?backUserId="+backUserId+""
		}else if(form == "twoJump"){
			location.href = "pageTwoJump.html?backUserId="+backUserId+""
		}else if(form == "two"){
			location.href = "pageTwo.html"
		}
	})

})(jQuery)