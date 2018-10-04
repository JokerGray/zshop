var merchantId = sessionStorage.getItem("merchantId");
$(function() {
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
	geteChatsHistogramData(1, 1);
	geteChatsPieData(1);
	//柱状图业绩、项目量切换
	$("#salsumpTab").find("li").click(function() {
		var activeIndex = $("#salsumptimeTab").find("li.active").index() + 1;
		var thisIndex = $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if(activeIndex == 3)
		{
			if(!checkDate()) return;
		}
		geteChatsHistogramData(thisIndex, activeIndex);
	});
	//柱状图时间、日期切换筛选
	$("#salsumptimeTab").find("li").click(function() {
		var activeIndex = $("#salsumpTab").find("li.active").index() + 1;
		var thisIndex = $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if (thisIndex == 3){
			$("#salsumpHistogramDate").removeClass("hidden");
		}else{
			geteChatsHistogramData(activeIndex, thisIndex);
			$("#salsumpHistogramDate").addClass("hidden");
			$("#salsumpHistogramDate").find(".start-time").val('');
			$("#salsumpHistogramDate").find(".end-time").val('');
		}
	});
	//柱状图日期筛选验证事件
	$("#salsumpHistogramBtn").click(function(){
		var type = $("#salsumpTab").find("li.active").index() + 1;
		if(!checkDate()) return;
		geteChatsHistogramData(type,3);
	});
	//饼状图时间、日期切换筛选
	$("#salsumptimePieTab").find("li").click(function() {
		var index =  $(this).index() + 1;
		$(this).addClass("active").siblings().removeClass("active");
		if(index == 3){
			$("#salsumpPieDate").removeClass("hidden");
		}else{
			geteChatsPieData(index);
			$("#salsumpPieDate").addClass("hidden");
			$("#salsumpPieDate").find(".start-time").val('');
			$("#salsumpPieDate").find(".end-time").val('');
		}
	});

});

//柱状图日期筛选验证
function checkDate(){
	var start = $("#salsumpHistogramDate").find(".start-time").val();
	var end = $("#salsumpHistogramDate").find(".end-time").val();
	var date1 = Date.parse(start.replace(/\-/g, "\/"));
	var date2 = Date.parse(end.replace(/\-/g, "\/"));
	var oneMonth = 1*30*24*60*60*1000;
	var datediff = date2 - date1;
	if (start == "" || end == "")
	{
		layer.msg('请选择起始日期或结束日期！');
		return false;
	}
	if (datediff < 0 || datediff > oneMonth){
		layer.msg('起始日期应小于结束日期且间隔小于30天!');
		return false;
	}
	return true;
}

function geteChatsHistogramData(type, timeType) {
	var cmd = "shop/queryShopAchInfoSummeryDetials";
	var data = "";
	if (timeType == 3){
		var start = $("#salsumpHistogramDate").find(".start-time").val();
		var end = $("#salsumpHistogramDate").find(".end-time").val();
		data = "{'merchantId': " + merchantId + ",'timeType':'" + timeType+ "','startData':'"+start+"','endData':'"+end+"'}";
	}else{
		data = "{'merchantId': " + merchantId + ",'timeType':'" + timeType+ "'}";
	}
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		echatsHistogram(type, resData.data)
	} else {
		layer.alert(resData.msg);
	}
}

function echatsHistogram(type, data) {
	var title, dataVale, series;
	var xData = new Array();
	var yDataSales = new Array();
	var yDataConsume = new Array();
	for (var i = 0; i < data.length; i++) {
		xData.push(data[i].time);
	}
	switch (type) {
	case 1:
		for (var i = 0; i < data.length; i++) {
			yDataSales.push(data[i].salePrice);
			yDataConsume.push(data[i].consumePrice)
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
	option = {
		title : {
			text : title
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
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

function geteChatsPieData(timeType) {
	var cmd = "shop/queryShopProInfoSummeryDetials";
	var data = "";
	if (timeType == 3){
		var start = $("#salsumpPieDate").find(".start-time").val();
		var end = $("#salsumpPieDate").find(".end-time").val();
		data = "{'merchantId': " + merchantId + ",'timeType':'" + timeType+ "','startData':'"+start+"','endData':'"+end+"'}";
	}else{
		data = "{'merchantId': " + merchantId + ",'timeType':'" + timeType+ "'}";
	}
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		echatsPie(resData.data, timeType)
	} else {
		layer.alert(resData.msg);
	}
}

function echatsPie(data, timeType) {
	if (data.saleData.length > 0) {
		var arr = new Array();
		for (var i = 0; i < data.saleData.length; i++) {
			var map = {
				"value" : data.saleData[i].price,
				"name" : data.saleData[i].typeName
			};
			arr[i] = map;
		}
		// 销售项目饼状图初始化
		var myChartSales = echarts.init(document
				.getElementById('echartPic-sales-pie'));
		option = {
			title : {
				text : '销售项目占比',
				x : 'center'
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
				data : arr

			} ]
		};
		myChartSales.setOption(option); // 参数设置方法
	}else{
		$("#echartPic-sales-pie").html("<div class='nodata'><p>暂无数据</p></div>");
	}

	if (data.consumeData.length > 0) {
		var arrs = new Array();
		for (var i = 0; i < data.consumeData.length; i++) {
			var map = {
				"value" : data.consumeData[i].price,
				"name" : data.consumeData[i].typeName
			};
			arrs[i] = map;
		}
		// 消耗项目饼状图初始化
		var myChartConsumption = echarts.init(document
				.getElementById('echartPic-consumption-pie'));
		option = {
			title : {
				text : '消耗项目占比',
				x : 'center'
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
				data : arrs
			} ]
		};
		myChartConsumption.setOption(option); // 参数设置方法
	}else{
		$("#echartPic-consumption-pie").html("<div class='nodata'><p>暂无数据</p></div>");
	}
}
