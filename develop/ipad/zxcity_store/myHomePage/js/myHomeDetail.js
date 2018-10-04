(function($){
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
    var _module = getUrlParams('module'), _type = getUrlParams('type');
    var shopID = sessionStorage.getItem("shopId");
    var startTime = "", endTime = "", timeType = 1;
    var pageNo = 1, pageSize = 10;

    //设置时间默认时间为今天
    $(".datetime").val(today);
    //日期选择器初始化
	$(".datetime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose: true,//自动关闭
		minView: 2
	}).on('show', function(ev){
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
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

    if(_type == 3){
        $(".date-wrap .date-selector").removeClass("hide");
        $(".date-wrap .date-tab .btn:eq("+(_type-1)+")").addClass("active").siblings().removeClass("active");
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
    }else{
        $(".date-wrap .date-selector").addClass("hide");
    }

    $(".date-wrap .date-tab .btn").click(function(){
        var dataRel = $(this).attr("data-rel");
        $(this).addClass("active").siblings().removeClass("active");
        if(dataRel == "more"){
            $(".date-wrap .date-selector").removeClass("hide");
        }else{
            $(".date-wrap .date-selector").addClass("hide");
        }
    });


    function lineOptionSet(params){
        var lineOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
                data: ['人数']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: params.timeArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '人数',
                type: 'line',
                data: params.numArr
            }]
        }
        return lineOption;
    }

    var pieOptionSet = function(params){
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                textStyle: {
                    fontSize:28
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                selectedMode: false,
                data: params.itemArr
            },
            series : [
                {
                    name: '数量',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: params.dataArr,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return option;
    }

    function barOptionSet(params){
        var option = {
	    	title:{
	    		text: params.title,
                left: 'center'
	    	},
    		tooltip : {
    	        trigger: 'axis'
    	    },
	        legend: {
                selectedMode: false,
	        	data: params.legend,
                left: 'left'
	        },
	        toolbox : {
				show : true
			},
	        calculable : true,
	        xAxis: {
	            data: params.xAxisArr
	        },
	        yAxis: {
	            type: 'value'
	        },
	        series: params.seriesData
	    }
	    return option;
    }


    function customerOverviewChartData(){
        var jsonData = "{'shopId':"+shopID+",'type':"+_type+",'timeType':"+timeType+",'startData':'"+startTime+"','endData':'"+endTime+"'}";
        var res = reqAjax('shopStatistics/myHomePageAccountVisitDetails',jsonData);
        if(res.code == 1){
            var obj = res.data, timeArr = [], numArr = [];
            for(var i=0; i<obj.length; i++){
                timeArr.push(obj[i].time);
                numArr.push(obj[i].num);
            }
            var moduleChart_1 = echarts.init(document.getElementById('customerOverviewLineChart'));
            moduleChart_1.setOption(lineOptionSet({'timeArr':timeArr, 'numArr':numArr}));
        }
    }

    function showListOfmodule_1(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        //+ '<td><a href="../../customerManagement/html/customerOverview.html?accountId='+res.data[i].accountId+'">'+res.data[i].accountName+'</a></td>'
                    	+'<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].accountId+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].createTime+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml = '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module1 .table-list table tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }

    }
    function getListDataOfmodule_1(){
    	var _btnRel = $(".date-tab .btn.active").attr("data-rel");
        timeType = _btnRel == 'month' ? 1 : 2;
        var jsonData = "{'shopId':"+shopID+",'type':"+_type+", 'timeType':"+timeType+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageAccountVisitListDetails', jsonData);
        showListOfmodule_1(resData);
        if(resData.total > 0){
            $("#page1").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                jsonData = "{'shopId':"+shopID+",'type':"+_type+", 'timeType':"+1+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageAccountVisitListDetails', jsonData);
                showListOfmodule_1(resData);
            }).removeClass("invisible");
        }else{
            $('#page1').addClass("invisible");
        }
    }


    //预售列表显示
    function showPresalesList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        //+ '<td><a href="../../customerManagement/html/customerOverview.html?accountId='+res.data[i].accountId+'">'+res.data[i].accountName+'</a></td>'
                    	+ '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].goodsName+'</td>'
                        + '<td>'+res.data[i].num+'</td>'
                        + '<td>'+res.data[i].shouldPay+'</td>'
                        + '<td>'+res.data[i].time+'</td>'
                        + '<td>'+res.data[i].status+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>'
            }
            $("#module2 table tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //新客列表数据展示
    function showNewAccountList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].id+'</td>'
                       // + '<td><a href="../../customerManagement/html/customerOverview.html?accountId='+res.data[i].id+'">'+res.data[i].accountName+'</a></td>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].cardName+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module5 table tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //卡项预警列表数据展示
    function showCardWarningList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].card_name+'</td>'
                        + '<td>'+res.data[i].total_num+'</td>'
                        + '<td>'+res.data[i].consume_num+'</td>'
                        + '<td>'+res.data[i].remain_num+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module6 table tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //预售数据加载
    function loadPresalesData(){
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
        var jsonData = "{'shopId':"+shopID+", 'type':2,'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shop/myHomePagePresalesDetails', jsonData);
        showPresalesList(resData);
        if(resData.total > 0){
            $("#page2").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopID+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shop/myHomePagePresalesDetails', jsonData);
                showPresalesList(resData);
            }).removeClass("invisible");
        }else{
            $('#page2').addClass("invisible");
        }
    }
    //新客分析详情列表加载
    function loadNewAccountData(){
        var jsonData = "{'shopId':"+shopID+",'type':"+_type+",'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageNewAccountDetails', jsonData);
        showNewAccountList(resData);
        if(resData.total > 0){
            $("#page5").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopID+",'type':"+_type+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageNewAccountDetails', jsonData);
                showNewAccountList(resData);
            }).removeClass("invisible");
        }else{
            $('#page5').addClass("invisible");
        }
    }
    //客户卡项预警列表
    function loadCardWarningData(){
        var jsonData = "{'shopId':"+shopID+",'accountId':"+_type+",'pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageWarningDetails', jsonData);
        showCardWarningList(resData);
        if(resData.total > 0){
            $("#page6").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopID+",'accountId':"+_type+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageWarningDetails', jsonData);
                showCardWarningList(resData);
            }).removeClass("invisible");
        }else{
            $('#page6').addClass("invisible");
        }
    }

    function getPieChartDataOfmodule_8(){
        var jsonData = "{'shopId':"+shopID+",'type':"+_type+",'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var res = reqAjax('shopStatistics/myHomePageLargessDetails', jsonData);
        if(res.code == 1){
            var obj = res.data, itemArr = [], dataArr = [];
            for(var i=0; i<obj.length; i++){
                var oData = {};
                oData.value = obj[i].num;
                oData.name = obj[i].name;
                itemArr.push(obj[i].name);
                dataArr.push(oData);
            }
            var moduleChart_8 = echarts.init(document.getElementById('pieChart_module8'));
            moduleChart_8.setOption(pieOptionSet({'itemArr':itemArr,'dataArr':dataArr}));
        }
    }
    function getBarChartDataOfmodule_8(){
        var jsonData = "{'shopId':"+shopID+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"'}";
        var res = reqAjax('shopStatistics/myHomePageLargessAchDetails', jsonData);
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                var timeArr = [], numArr = [], priceArr = [];
                for(var i=0; i<obj.length; i++){
                    timeArr.push(obj[i].time);
                    numArr.push(obj[i].num);
                    priceArr.push(obj[i].price);
                }
                var barChart_module8 = echarts.init(document.getElementById('barChart_module8'));
                var params = {
                    'title': '赠送数量',
                    'legend': ['数量'],
                    'xAxisArr': timeArr,
                    'seriesData':[{
                        name: '数量',
        	    	    type: 'bar',
        	    	    barWidth : '30px',
        	    	    data: numArr
                    }]
                }
                barChart_module8.setOption(barOptionSet(params));
            }
        }
    }

    function showListOfmodule_8(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].typeName+'</td>'
                        + '<td>'+res.data[i].num+'</td>'
                        + '<td>'+res.data[i].time+'</td>'
                        + '<td>'+res.data[i].name+'</td>'
                        + '<td>'+res.data[i].unitPrice+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module8 .table-list table tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    function getListDataOfmodule_8(){
        var jsonData = "{'shopId':"+shopID+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageLargessListDetails', jsonData);
        showListOfmodule_8(resData);
        if(resData.total > 0){
            $("#page8").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                jsonData = "{'shopId':"+shopID+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageLargessListDetails', jsonData);
                showListOfmodule_8(resData);
            }).removeClass("invisible");
        }else{
            $('#page8').addClass("invisible");
        }
    }

    function init(){
        $("#module"+_module).removeClass("hide").siblings().addClass('hide');
        switch (_module) {
            case "1":
                $(".maintitle .title").text("客户回访详情页");
                customerOverviewChartData();
                break;
            case "2":
                $(".maintitle .title").text("今日预售详情页");
                $(".date-wrap .date-tab").hide();
                $(".date-wrap .date-selector").removeClass("hide");
                loadPresalesData();
                break;
            case "5":
                $(".maintitle .title").text("新客分析详情页");
                $(".date-wrap .date-tab .year").hide();
                loadNewAccountData();
                break;
            case "6":
                $(".date-wrap").hide();
                $(".maintitle .title").text("客户卡项预警详情页");
                loadCardWarningData();
                break;
            case "8":
                $(".maintitle .title").text("赠送统计详情页");
                getPieChartDataOfmodule_8();
                getBarChartDataOfmodule_8();
                break;
            default:
        }
    }

    init();

    $("#module1 .chart-tab .btn").click(function(){
        $(this).addClass("active").siblings().removeClass('active');
        var _index = $(this).index();
        $("#module1 .show-content div.show-item:eq("+_index+")").removeClass("hide").siblings().addClass("hide");
        if(_index == 0){
        	 $(".date-wrap .date-tab .year").show();
            customerOverviewChartData();
        }else{
            $(".date-wrap .date-tab .year").hide();
            getListDataOfmodule_1();
        }
    });

    $("#module8 .chart-tab .btn").click(function(){
        $(this).addClass("active").siblings().removeClass('active');
        var _index = $(this).index();
        $("#module8 .show-content div.show-item:eq("+_index+")").removeClass("hide").siblings().addClass("hide");
        if(_index == 0){
            getPieChartDataOfmodule_8();
            getBarChartDataOfmodule_8();
        }else{
            getListDataOfmodule_8();
        }
    });

    function reloadData(){
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
        switch(_module){
            case "1":
                var _index = $("#module1 .chart-tab .btn.active").index();
                if(_index == 0){
                    customerOverviewChartData();
                }else{
                    getListDataOfmodule_1();
                }

                break;
            case "2":
                loadPresalesData();
                break;
            case "5":
                //新客分析的参数时间类型为月时候，type=2
                _type = (_type == 1) ? 2 : _type;
                loadNewAccountData();
                break;
            case "8":
                var _index = $("#module8 .chart-tab .btn.active").index();
                if(_index == 0){
                    getPieChartDataOfmodule_8();
                    getBarChartDataOfmodule_8();
                }else{
                    getListDataOfmodule_8();
                }
                break;
        }
    }

    $(".date-wrap .date-tab .btn").click(function(){
        if(_module == "1"){
            var module1_index = $("#module1 .chart-tab .btn.active").index();
            if(module1_index == 0){
                timeType = $(this).index() + 2;
                if(timeType == 4){
                    $(".datetime").val(today);
                    $(".date-wrap .date-selector").removeClass("hide");
                    startTime = $(".date-wrap .date-selector .start-time").val();
                    endTime = $(".date-wrap .date-selector .end-time").val();
                }else{
                    $(".datetime").val('');
                    $(".date-wrap .date-selector").addClass("hide");
                }
            }else{
                timeType = $(this).index();
                if(timeType == 2){
                    $(".datetime").val(today);
                    $(".date-wrap .date-selector").removeClass("hide");
                    startTime = $(".date-wrap .date-selector .start-time").val();
                    endTime = $(".date-wrap .date-selector .end-time").val();
                }else{
                    timeType = 1;
                    $(".datetime").val('');
                    $(".date-wrap .date-selector").addClass("hide");
                }
            }

        }else{
            _type = $(this).index() + 1;
            if(_type == 3){
                $(".datetime").val(today);
                $(".date-wrap .date-selector").removeClass("hide");
                startTime = $(".date-wrap .date-selector .start-time").val();
                endTime = $(".date-wrap .date-selector .end-time").val();
            }else{
                $(".datetime").val('');
                $(".date-wrap .date-selector").addClass("hide");
            }
        }
        reloadData();
    });

    $(".date-wrap .date-selector .btn").click(function(){
        reloadData();

    });

})(jQuery);
