$(function() {
	FastClick.attach(document.body); 
	var vueData = {
		performance : 0,
		profit : 0,
		rent : 0,
		wage : 0,
		decoration : 0,
		assetsDepreciation : 0,
		sales : 0,
		awardGift : 0,
		proofing : 0,
		gasHydropower : 0,
		telephoneFee : 0,
		officeExpenses : 0,
		posFee : 0,
        socialSecurityCharges:0,
		businessTax : 0,
		travelExpenses : 0,
		sporadicPurchaseCosts : 0,
		transportFees : 0,
		carFee : 0,
		cityTransportationFee : 0,
		repairCosts : 0,
		welfareFee : 0,
		rewardFee : 0,
		advertisingFee : 0,
		prFee :0,
		trainingFees : 0,
		totalCost : 0,
		performance : 0,
		profit : 0,
		zero : true,
		basicCostSubtotal:0,
		year : {
			totalCost : 0,
			performance:0,
			profit:0
		}
	};
	
	var vvueData = {
		performance : 0,
		profit : 0,
		rent : 0,
		wage : 0,
		decoration : 0,
		assetsDepreciation : 0,
		sales : 0,
		awardGift : 0,
		proofing : 0,
		gasHydropower : 0,
		telephoneFee : 0,
		officeExpenses : 0,
		posFee : 0,
		businessTax : 0,
        socialSecurityCharges:0,
		travelExpenses : 0,
		sporadicPurchaseCosts : 0,
		transportFees : 0,
		carFee : 0,
		cityTransportationFee : 0,
		repairCosts : 0,
		welfareFee : 0,
		rewardFee : 0,
		advertisingFee : 0,
		prFee :0,
		trainingFees : 0,
		totalCost : 0,
		performance : 0,
		profit : 0,
		zero : true,
		basicCostSubtotal:0,
		year : {
			totalCost : 0,
			performance:0,
			profit:0
		}
	}
	
	
	
	
	var app = new Vue({
		el: '.app',
		data: vueData,
		methods:{
			getp:function(num,performance){
				return	num ? ((num/performance)*100).toFixed(2)+"%"  :  0
			}
		}
	})
	window.app = app;
	
	var form = sessionStorage.getItem("form") || "";
	var backUserIdTwo = sessionStorage.getItem("backUserIdTwo") || "";
	var backUserId = sessionStorage.getItem("backUserId") || "";
	var _id = sessionStorage.getItem("_id") || sessionStorage.getItem('jumpId');
	
	
	$('#secend').data("month",1)
	getMonth(1, datamonth1);

	var serve = {
		getScMultipleShopConfigureById: "operations/getScMultipleShopConfigureById", //详情
		getScMultipleShopConfigureList: 'operations/getScMultipleShopConfigureList',
		getAllShopProfitSumByDate: "operations/getShopProfitSumByDate" //日期查询
	}


	var idPam = {
		id: _id
	}
	
	

	$('#gozero').on('click',function() {
		var jumpId = sessionStorage.getItem('jumpId');
		var isFirst = sessionStorage.getItem('isFirst');
		if(isFirst == "true") {
			location.href = "pageOne.html?backUserId="+backUserId+""
		} else if(isFirst == "false") {
			if(form){
				location.href = "pageTwoJump.html?backUserId="+backUserIdTwo+""
			}else{
				location.href = "pageTwo.html"
			}
		}
	})
	

	
	

	reqAjaxAsync(serve.getScMultipleShopConfigureList, JSON.stringify(idPam)).then(function(res) {
		if(res.code == 9 ||res.data==[]) {
			layer.msg(res.msg)
			return
		} 
		var data = res.data;
		var a = [];
		var sHtml = "";
		$.each(data, function(i, item) {
			sHtml += "<li data-id=" + item.id + ">" + item.name + "</li>"
			a.push(item.name)
		});
		if(a[0].length>=7){
			a[0] = a[0].substring(0,7)+".."
		}
		$('.titselect').html(a[0]);
		$('.selectlist').html(sHtml);
		var id = $('.selectlist li').eq(0).attr("data-id");
		$('.selectlist').attr("data-id", id);
		init("2018-01-01","2018-01-31");
		$('.second-date').html("2018-01-01 - 2018-01-31")
	})
	
	
	
	function yearInit(type,witch) {
		var id = $(".selectlist").attr('data-id') || "";
		if(type == "year"){//年
			var timeType = 2
			var startDate = "2018-01-01"
			var endDate = "2018-12-31"		
		}else if(type == "month"){
			var timeType = 0
			var startDate = "2018-"+witch+"-01"
			var endDate = "2018-"+witch+"-31"
		}
		var idPams = {
			id: id,
			startDate: startDate,
			endDate: endDate,
			timeType: timeType
		}
		reqAjaxAsync(serve.getAllShopProfitSumByDate, JSON.stringify(idPams)).then(function(res) {
			if(res.data.length!=0) {
				var vuData = res.data[0];
				var vData = app.$data.year
				for (var k in vuData){
					for(var u in vData){
						if(k == u){
							Vue.set(app.year,u,vuData[u])
						}
					}
				}
			}else{
				for (var k in vvueData){
					Vue.set(app.year,k,vvueData[k])
				}
			}
		});
	}
	
	
	
	
	

	function init(startDate,endDate) {
		var id = $(".selectlist").attr('data-id') || "";
		var timeType = $('.year-box>div.actv').index();
		var startDate = startDate|| ""
		var endDate = endDate || ""
		var idPams = {
			id: id,
			startDate: startDate,
			endDate: endDate,
			timeType: timeType
		}
		yearInit('year')
		reqAjaxAsync(serve.getAllShopProfitSumByDate, JSON.stringify(idPams)).then(function(res) {
			if(res.data != "") {
				var vuData = res.data[0];
				var vData = app.$data;
				for (var k in vuData){
					for(var u in vData){
						if(k == u){
							Vue.set(app,u,vuData[u])
						}
					}
				}
			}else{
				for (var k in vvueData){
					Vue.set(app,k,vvueData[k])
				}
			}
		});
	}

	//年月切换
	$(".year-box").on("click", "div", function() {
		var index = $(this).index();
		$(".year-box div").removeClass("actv");
		$(this).addClass("actv");
		var id = $(".selectlist .actv").attr("data-id");
		if(index == 0) {
			$("#monthBox").css("z-index", 2);
			$("#monthBox1").css("z-index", 1);
			var indexs = $("#monthBox .area-ul .actv").index();
			getMonth(indexs, datamonth1);
			swiper.slideTo(indexs);
			var vv = $('#secend').data("month")
			if(vv < 10){
				var startDate = "2018-0"+vv+"-01"
				var endDate = "2018-0"+vv+"-31"
			}else{
				var startDate = "2018-"+vv+"-01"
				var endDate = "2018-"+vv+"-31"
			}
			init(startDate,endDate);
			yearInit('year')
		} else {
			$("#monthBox").css("z-index", 1);
			$("#monthBox1").css("z-index", 2);
			var indexs = $("#monthBox1 .area-ul .actv").index();
			var month = $('#secend').data("month");
			getMonth(indexs, datamonth2);
			if(month) {
				var s = $('.second-date').html();
				s = s.split('-');
				console.log(s)
				s[1] = "0" + month + "";
				s = s.join("-")
				$('.second-date').html(s)
				if(month.length==1){
					month = '0' + month
				}
			}
			swiper1.slideTo(indexs);
			var startDate = $('.second-date').html();
			init(startDate);
			yearInit('month',month)
		}
	});

	//选月
	$("#monthBox .area-ul").on("click", ".swiper-slide", function() {
		$("#monthBox .area-ul .swiper-slide").removeClass("actv");
		$(this).addClass("actv");
		var id = $(".selectlist .actv").attr("data-id");
		var index = $(this).index();
		$('#secend').data("month", index + 1);
		getMonth(index, datamonth1);
		var vv = $('#secend').data("month")
		if(vv < 10){
			var startDate = "2018-0"+vv+"-01"
			var endDate = "2018-0"+vv+"-31"
		}else{
			var startDate = "2018-"+vv+"-01"
			var endDate = "2018-"+vv+"-31"
		}
		init(startDate,endDate);
		yearInit('year')
	});

	///选日
	$("#monthBox1 .area-ul").on("click", ".swiper-slide", function() {
		$("#monthBox1 .area-ul .swiper-slide").removeClass("actv");
		$(this).addClass("actv");
		var index = $(this).index();
		getMonth(index, datamonth2);
		var month = $('#secend').data("month");
		if(month) {
			var s = $('.second-date').html();
			s = s.split('-');
			s[1] = "0" + month + "";
			s = s.join("-")
			$('.second-date').html(s)
		}
		var startDate = $('.second-date').html();
		init(startDate);
		yearInit('month',month)
	});

	//下拉选中某区
	$(".selectval").on("click", function() {
		var num = $(this).attr("data-num");
		if(num == 0) {
			$(".selectlist").show();
			$(this).attr("data-num", 1);
		} else {
			$(".selectlist").hide();
			$(this).attr("data-num", 0);
		}

	});

	//选某个区
	$(".selectlist").on("click", "li", function() {
		$(".selectlist li").removeClass("acvt");
		$(this).addClass("acvt");
		var txt = $(this).text();
		if(txt.length>=7){
			txt=txt.substring(0,7)+".."
		}
		$(".titselect").text(txt);
		$(".selectlist").hide();
		$(".selectval").attr("data-num", 0);
		$(".area-ul .swiper-slide").removeClass("actv");
		$(".year-box div").removeClass("actv");
		$("#monthBox").css("z-index", 2);
		$("#monthBox1").css("z-index", 1);
		$(".year-box div").eq(0).addClass("actv");
		$("#monthBox .area-ul .swiper-slide").eq(0).addClass("actv");
		$("#monthBox1 .area-ul .swiper-slide").eq(0).addClass("actv");
		var id = $(this).attr("data-id");
		$('.selectlist').attr("data-id", id);
		swiper.slideTo(0);
		swiper1.slideTo(0);
		if(id == 1) {
			getMonth(0, datamonth1);
		} else {
			getMonth(0, datamonth1);
		}
		init("2018-01-01","2018-01-31");
		$('.second-date').html("2018-01-01 - 2018-01-31")
	});

	//月
	function monthList() {
		var sHtml = "";
		for(var i = 1; i < 32; i++) {
			sHtml += '<div class="swiper-slide">' +
				'<span>' + i + '号</span>' +
				'</div>';
		}
		$("#slider2").html(sHtml);
		$("#slider2 .swiper-slide").eq(0).addClass("actv");
	}
	
	monthList();
	
	window.onload = function() {
		swiper = new Swiper('#monthBox', {
			slidesPerView: "auto",
			spaceBetween: "5%"
		});

		swiper1 = new Swiper('#monthBox1', {
			slidesPerView: "auto",
			spaceBetween: "5%"
		});
	}

	//加载月数据方法
	function getMonth(i, e) {
		if(!e) {
			return false;
		}
		var monts = e.data[i];
		$(".second-date").text(monts.time);
	}

	//12个月json数据
	var datamonth1 = {
		"data": [{
				"time": "2018-01-01 - 2018-01-31"
			},
			{
				"time": "2018-02-01 - 2018-02-28"
			},
			{
				"time": "2018-03-01 - 2018-03-31"
			}, {
				"time": "2018-04-01 - 2018-04-30"
			}, {
				"time": "2018-05-01-2018-05-31"
			}, {
				"time": "2018-06-01-2018-06-30"
			}, {
				"time": "2018-07-01-2018-07-31"
			}, {
				"time": "2018-08-01-2018-08-31"
			}, {
				"time": "2018-09-01-2018-09-30"
			}, {
				"time": "2018-10-01-2018-10-31"
			}, {
				"time": "2018-11-01-2018-11-30"
			}, {
				"time": "2018-12-01-2018-12-31"
			}
		]
	};

	var datamonth2 = {
		"data": [{
				"time": "2018-01-01"
			},
			{
				"time": "2018-01-02"
			},
			{
				"time": "2018-01-03"

			}, {
				"time": "2018-01-04"

			}, {
				"time": "2018-01-05"
			}, {
				"time": "2018-01-06"

			}, {
				"time": "2018-01-07"

			}, {
				"time": "2018-01-08"

			}, {
				"time": "2018-01-09"

			}, {
				"time": "2018-01-10"

			}, {
				"time": "2018-01-11"

			}, {
				"time": "2018-01-12"

			}, {
				"time": "2018-01-13"

			}, {
				"time": "2018-01-14"

			}, {
				"time": "2018-01-15"

			}, {
				"time": "2018-01-16"

			}, {
				"time": "2018-01-17"

			}, {
				"time": "2018-01-18"

			}, {
				"time": "2018-01-19"

			}, {
				"time": "2018-01-20"

			}, {
				"time": "2018-01-21"

			}, {
				"time": "2018-01-22"

			}, {
				"time": "2018-01-23"

			}, {
				"time": "2018-01-24"

			}, {
				"time": "2018-01-25"

			}, {
				"time": "2018-01-26"

			}, {
				"time": "2018-01-27"

			}, {
				"time": "2018-01-28"

			}, {
				"time": "2018-01-29"

			}, {
				"time": "2018-01-30"

			}, {
				"time": "2018-01-31"

			}
		]
	};
});