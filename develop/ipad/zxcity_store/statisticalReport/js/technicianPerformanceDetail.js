(function($){
	var merchantId = sessionStorage.getItem("merchantId");
	var waiterId = getUrlParams("waiterId");
	var waiterName = getUrlParams('waiterName');
	var startDate = getUrlParams("start");
	var endDate = getUrlParams("end");
	var timeType = 1;
	var oBarData = {}, oPieData = {};

	var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
    //设置时间默认时间为今天
    $(".datetime").val(today);
    $('.maintitle .title span').html(waiterName);

	//日期选择器初始化
	$(".datetime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose: true,//自动关闭
		minView: 2
	}).on('show', function(ev){
        var startTime = $(".date-wrap .startTime").val();
        var endTime = $(".date-wrap .endTime").val();
        $(".startTime").datetimepicker('setEndDate', endTime);
        $(".endTime").datetimepicker('setStartDate', startTime);

    }).on('changeDate', function(ev){
        var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
        var evClassName = ev.target.className;
        //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
        if(evClassName.search('startTime') > -1){
            $(".endTime").datetimepicker('setStartDate', _time);
        }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
        else if(evClassName.search('endTime') > -1){
            $(".startTime").datetimepicker('setEndDate', _time);
        }

    });

	function setPieOptions(params){
		var option = {
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
				data : params.arrConsume
			}]
		}
		return option;
	}
	//柱形图参数设置
	function barOptionSet(params){
	    var option = {
	    	title:{
	    		text:'技师业绩消耗'
	    	},
    		tooltip : {
    	        trigger: 'axis'
    	    },
	        legend: {
	        	data:['消耗金额','消耗项目量']
	        },
	        toolbox : {
				show : true
			},
	        calculable : true,
	        xAxis: {
	            data: params.timeArr
	        },
	        yAxis: {
	            type: 'value'
	        },
	        series: [{
	        	name: '消耗金额',
	    	    type: 'bar',
	    	    barWidth : '30px',
	    	    data:params.priceArr
	        },{
	            name: '消耗项目量',
	            type: 'bar',
	            barWidth : '30px',
	            data: params.numArr
	        }]
	    }
	    return option;
	}

	$(function() {
		getBarChartData();
		getPieChartData();
	});

	function getBarChartData(_type){
		startDate = $(".echarts-bar-box .date-wrap .startTime").val();
		endDate = $(".echarts-bar-box .date-wrap .endTime").val();
		var cmd = "shop/queryWaiterAchSummeryDetials";
		var params = "{'merchantId':" + merchantId + ",'waiterId':" + waiterId
				+",'timeType':"+timeType+ ",'startData':'" + startDate + "','endData':'" + endDate + "'}"
		var resData = reqAjax(cmd, params);
		if(resData.code == 1){
			var obj = resData.data;
			if(obj.length > 0){
				var priceArr = [], numArr = [], timeArr = [];
				for(var i=0; i<obj.length; i++){
					priceArr.push(obj[i].consumePrice);
					numArr.push(obj[i].consumeNum);
					timeArr.push(obj[i].time);
				}
				oBarData = {'priceArr':priceArr, 'numArr':numArr, 'timeArr':timeArr};

				var barChart = echarts.init(document.getElementById('technicianBarChart'));
				barChart.setOption(barOptionSet(oBarData));
			}
		}
	}

	function getPieChartData() {
		startDate = $(".echarts-pie-box .date-wrap .startTime").val();
		endDate = $(".echarts-pie-box .date-wrap .endTime").val();

		var cmd = "shop/queryWaiterProSummeryDetials";
		var pardata = "{'merchantId':" + merchantId + ",'waiterId':" + waiterId
				+",'timeType':"+timeType+ ",'startData':'" + startDate + "','endData':'" + endDate + "'}"
		var resData = reqAjax(cmd, pardata);
		if (resData.code == 1) {
			var obj = resData.data;

			if(obj.consumeData && obj.consumeData.length > 0){
				var arrConsume = [];
				var cObj = obj.consumeData;
				for(var i=0,len=cObj.length; i<len; i++){
					var item = {
						"value" : cObj[i].price,
						"name" : cObj[i].typeName
					}

					arrConsume.push(item);
				}
				var myChartSales = echarts.init(document
						.getElementById('technicianPieChart'));
				var params = {'arrConsume':arrConsume};
				myChartSales.setOption(setPieOptions(params)); // 参数设置方法
			}else{
				$("#echartPieConsume").html("<div class='nodata'><p>暂无消耗数据</p></div>");
			}
		} else {
			layer.alert(resData.msg);
		}
	}

	$(".echarts-bar-box .date-type-selector .btn").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		timeType = $(this).index() + 1;
		if(timeType == 3){
			$(".echarts-bar-box .date-wrap").removeClass("hide");
			$(".datetime").val(today);
		}else{
			$(".echarts-bar-box .date-wrap").addClass("hide");
		}
		getBarChartData();
	});
	$(".echarts-bar-box .date-wrap .btn").click(function(){
		getBarChartData();
	});

	$(".echarts-pie-box .date-type-selector .btn").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		timeType = $(this).index() + 1;
		if(timeType == 3){
			$(".echarts-pie-box .date-wrap").removeClass("hide");
			$(".datetime").val(today);
		}else{
			$(".echarts-pie-box .date-wrap").addClass("hide");
		}
		getPieChartData();
	});
	$(".echarts-pie-box .date-wrap .btn").click(function(){
		getPieChartData();
	});

//	$(".main-tab .btn").click(function(){
//		$(this).addClass("active").siblings().removeClass("active");
//		timeType = 1;
//		$(".date-type-selector .btn:eq(0)").addClass("active").siblings().removeClass("active");
//		$(".date-wrap").addClass("hide");
//		var _index = $(this).index();
//		if(_index == 0){
//			getBarChartData('price');
//		}else{
//			getBarChartData('num');
//			getPieChartData('num');
//		}
//	});

})(jQuery);
