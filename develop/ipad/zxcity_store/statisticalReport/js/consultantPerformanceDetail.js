(function($){
	var merchantId = getUrlParams("merchantId"),
		salesmanId = getUrlParams("salesmanId"),
		salesman = getUrlParams("salesman");

	var REQUEST_URL = {
		'bar_url':'shopStatistics/querySalesmanAchSummeryDetials',//顾问业绩柱状图
		'pie_url':'shopStatistics/querySalesmanProSummeryDetials'//顾问业绩饼状图
	};

	var param = {"merchantId":merchantId, "salesmanId":salesmanId};

	//设置标题
	$(".maintitle .title span").text(salesman);

	var now = new Date();
	var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
	//设置时间默认时间为今天
	$(".datetime").val(today);

	//日期选择器初始化
	$(".datetime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose: true,//自动关闭
		minView: 2
	}).on('show', function(ev){
        var startTime = $(".date-wrap .start-time").val();
        var endTime = $(".date-wrap .end-time").val();
        $(".start-time").datetimepicker('setEndDate', endTime);
        $(".end-time").datetimepicker('setStartDate', startTime);

    }).on('changeDate', function(ev){
        var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
        var evClassName = ev.target.className;
        //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
        if(evClassName.search('start-time') > -1){
            $(".end-time").datetimepicker('setStartDate', _time);
        }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
        else if(evClassName.search('end-time') > -1){
            $(".start-time").datetimepicker('setEndDate', _time);
        }
    });


	//柱状图数据请求
	function geteChatsHistogramData(type, timeType) {
		param['timeType'] = timeType;
		if (timeType == 3) {
			var start = $("#salsumpHistogramDate .start-time").val();
			var end = $("#salsumpHistogramDate .end-time").val();
			param['startData'] = start;
			param['endData'] = end;
		}
		var resData = reqAjax(REQUEST_URL['bar_url'], JSON.stringify(param));
		if (resData.code == 1) {
			echatsHistogram(type, resData.data);
		} else {
			layer.alert(resData.msg);
		}
	}

	//柱状图渲染
	function echatsHistogram(type, data) {
		var title, dataVale, series;
		var xData = [], yDataSales = [], yDataConsume = [];
		for (var i = 0; i < data.length; i++) {
			xData.push(data[i].time);
		}
		switch (type) {
			case 1:
				for (var i = 0; i < data.length; i++) {
					yDataSales.push(data[i].salePrice);
					yDataConsume.push(data[i].consumePrice);
				}
				title = '销售消耗业绩情况';
				dataVale = [ '销售业绩', '消耗业绩' ];
				xdata = xData;
				series = [ {
					name : '销售业绩',
					type : 'bar',
					data : yDataSales,
					barWidth : '40px'
				}, {
					name : '消耗业绩',
					type : 'bar',
					data : yDataConsume,
					barWidth : '40px'
				} ];
				break;
			case 2:
				for (var i = 0; i < data.length; i++) {
					yDataSales.push(data[i].saleNum);
					yDataConsume.push(data[i].consumeNum)
				}
				title = '销售消耗项目量情况';
				dataVale = [ '销售项目量', '消耗项目量' ];
				xdata = xData;
				series = [ {
					name : '销售项目量',
					type : 'bar',
					data : yDataSales,
					barWidth : '40px'
				}, {
					name : '消耗项目量',
					type : 'bar',
					data : yDataConsume,
					barWidth : '40px'
				} ];
				break;
		}
		// 初始化
		var myChart = echarts.init(document
				.getElementById('echartPic-salesconsumption'));
		// 参数设置
		var option = {
			title : {
				text : title
			},
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				selectedMode: false,
				data : dataVale
			},
			toolbox : {
				show : true
			},
			calculable : true,
			xAxis : [ {
				type : 'category',
				data : xdata
			} ],
			yAxis : [ {
				type : 'value'
			} ],
			series : series
		};
		myChart.setOption(option); // 参数设置方法
	}

	//获取饼状图数据
	function geteChatsPieData(timeType) {
		param['timeType'] = timeType;

		if (timeType == 3){
			var start = $("#salsumpPieDate .start-time").val();
			var end = $("#salsumpPieDate .end-time").val();
			param['startData'] = start;
			param['endData'] = end;
		}
		var resData = reqAjax(REQUEST_URL['pie_url'], JSON.stringify(param));
		if (resData.code == 1) {
			echatsPie(resData.data);
		} else {
			layer.alert(resData.msg);
		}
	}

	//饼状图参数设置
	function setPieOptions(title, dataArr){
		var option = {
			title : {
				text : title,
				x : 'center'
			},
			legend : {
				selectedMode: false
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			calculable : true,
			series : [ {
				name : '项目占比',
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				data : dataArr
			} ]
		};
		return option;
	}
	//饼状图渲染
	function echatsPie(dataList) {
		var salesData = dataList.saleData;
		var consumeData = dataList.consumeData;
		var arrSales = [], arrConsume = [];
		//销售
		if (salesData.length > 0) {
			for (var i = 0; i < salesData.length; i++) {
				var map = {
					"value" : salesData[i].price,
					"name" : salesData[i].typeName
				};
				arrSales[i] = map;
			}
			// 销售饼状图初始化
			var myChartSales = echarts.init(document
					.getElementById('echartPieSales'));

			myChartSales.setOption(setPieOptions('销售项目占比', arrSales)); // 参数设置方法
		} else {
			$("#echartPieSales").html("<div class='nodata'><p>暂无销售数据</p></div>");
		}
		//消耗
		if (consumeData.length > 0) {
			for (var i = 0; i < consumeData.length; i++) {
				var map = {
					"value" : consumeData[i].price,
					"name" : consumeData[i].typeName
				};
				arrConsume[i] = map;
			}
			// 消耗饼状图初始化
			var myChartSales = echarts.init(document
					.getElementById('echartPieConsume'));
			myChartSales.setOption(setPieOptions('消耗项目占比', arrConsume)); // 参数设置方法
		} else {
			$("#echartPieConsume").html("<div class='nodata'><p>暂无消耗数据</p></div>");
		}
	}

	//业绩、项目量切换
	$("#salsumpTab ul>li").click(function() {
		var _timeType = $("#salsumptimeTab").find("li.active").index() + 1;
		var thisIndex = $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if(_timeType == 3){
			if(!checkDate()) return;
		}
		geteChatsHistogramData(thisIndex, _timeType);
	});

	//柱状图日期筛选验证
	function checkDate(){
		var start = $("#salsumpHistogramDate .start-time").val();
		var end = $("#salsumpHistogramDate .end-time").val();
		var date1 = Date.parse(start.replace(/\-/g, "\/"));
		var date2 = Date.parse(end.replace(/\-/g, "\/"));
		var oneMonth = 1*30*24*60*60*1000;
		var datediff = date2 - date1;
		if (start == "" || end == ""){
			layer.msg('请选择起始日期或结束日期！');
			return false;
		}
		if (datediff < 0 || datediff > oneMonth){
			layer.msg('起始日期应小于结束日期且间隔小于30天!');
			return false;
		}
		return true;
	}

	//柱状图日期筛选验证事件
	$("#salsumpHistogramBtn").click(function(){
		var type = $("#salsumpTab").find("li.active").index() + 1;
		if(!checkDate()) return;
		geteChatsHistogramData(type,3);
	});

	//饼状图日期筛选验证事件
	$("#salsumpPieBtn").click(function(){
		geteChatsPieData(3);
	});

	//柱状图时间、日期切换筛选
	$("#salsumptimeTab ul>li").click(function() {
		var activeIndex = $("#salsumpTab").find("li.active").index() + 1;
		var timeType = $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if (timeType == 3){
			$("#salsumpHistogramDate").removeClass("hidden");
		}else{
			$("#salsumpHistogramDate").addClass("hidden");
			$("#salsumpHistogramDate .start-time").val(today);
			$("#salsumpHistogramDate .end-time").val(today);
			geteChatsHistogramData(activeIndex, timeType);
		}

	});

	//饼状图时间、日期切换筛选
	$("#salsumptimePieTab ul>li").click(function(){
		var timeType =  $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if(timeType == 3){
			$("#salsumpPieDate").removeClass("hidden");
		}else{
			$("#salsumpPieDate").addClass("hidden");
			$("#salsumpPieDate .start-time").val(today);
			$("#salsumpPieDate .end-time").val(today);
			geteChatsPieData(timeType);
		}

	});


	$(function(){
		var tab = $("#salsumpTab ul>li.active").index() + 1;
		var _timeType1 = $("#salsumptimeTab ul>li.active").index() +1,
		    _timeType2 = $("#salsumptimePieTab ul>li.active").index() +1;

		geteChatsHistogramData(tab, _timeType1);
		geteChatsPieData(_timeType2);
	});


})(jQuery);
