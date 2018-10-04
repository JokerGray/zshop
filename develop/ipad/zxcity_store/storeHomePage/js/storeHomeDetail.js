(function($){
    var shopId = getUrlParams("shopId") ? getUrlParams("shopId") : sessionStorage.getItem("shopId"),
        accountId = getUrlParams("accountId") ? getUrlParams("accountId") : "",
	    _module = getUrlParams("module"),
        _type = getUrlParams("type"),
        employeeId = sessionStorage.getItem("backUserId");
        var timeType = 3, startTime = "", endTime = "";
        var pageNo = 1, pageSize = 10;
        var barType = 0;//柱状图显示类型，0为金额即业绩，1为数量


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


    //柱状图基础设置
    function barOptionSet(param){
        var barOptions = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: param.legend,
                left: 'center'
            },
            toolbox : {
				show : true
			},
	        calculable : true,
            xAxis: {
                data: param.xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: param.seriesArr
        };
        return barOptions;
    }

	function pieOptionSet(param){
        var pieOptions = {
            title : {
    			title : param.title,
    			x : 'center'
    		},
    		tooltip : {
    			trigger : 'item',
    			formatter : "{a} <br/>{b} : {c} ({d}%)"
    		},
    		series : [ {
    			name : '所占比例',
    			type : 'pie',
    			radius : '65%',
    			center : [ '50%', '50%' ],
    			data : param.seriesData,
    			labelLine : {
    				normal : {
    					show : true,
    					length : 40,
    					length2 : 60,
    					lineStyle : {
    						width : 2,
    						type : 'solid'
    					}
    				}
    			}
    		} ]
        };
        return pieOptions;
    }


    //定金预售--金额|数量柱状图
    function presaleBarChartDataLoad(){
        var cmd = "shop/shopHomePagePresaleAchDetails";
        type = accountId == "" ? 1 : 2;
        var jsonData = "{'shopId':"+shopId+", 'type':"+type;
        if(accountId != ""){
             jsonData +=", 'accountId':"+accountId
        }
        jsonData += ",'timeType':"+timeType+", 'startData':'"+startTime+"','endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var timeArr = [], numArr = [], priceArr = [];
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    timeArr.push(obj[i].time);
                    numArr.push(obj[i].num);
                    priceArr.push(obj[i].price);
                }
            }
            var seriesArr = [{
                name: '金额',
                type: 'bar',
                barWidth : '30px',
                data: priceArr
            }];
            if(barType == 1){
                seriesArr = [{
                    name: '数量',
                    type: 'bar',
                    barWidth : '30px',
                    data: numArr
                }]
            }
            var param = {
                'legend': barType == 0 ? ['金额'] : ['数量'],
                'xAxisArr':timeArr,
                'seriesArr': seriesArr
            }
            var presaleBarChart = echarts.init(document.getElementById('presaleBarChart'));
            presaleBarChart.setOption(barOptionSet(param));
        }
    }

    //定金预售-饼状图
    function presalePieChartDataLoad(){
        var cmd = "shop/shopHomePagePresaleDetails";
        type = accountId == "" ? 1 : 2;
        var jsonData = "{'shopId':"+shopId+", 'type':"+type;
        if(accountId != ""){
             jsonData +=", 'accountId':"+accountId
        }
        jsonData += ",'timeType':"+timeType+", 'startData':'"+startTime+"','endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var pieArr = [], temp = {};
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    temp = {
                        'name': obj[i].typeName,
                        'value': obj[i].price
                    }
                    pieArr.push(temp);
                }
            }
            var presalePieChart = echarts.init(document.getElementById('presalePieChart'));
            var param = {
                'title': '定金预售饼状图',
                'seriesData': pieArr
            }
            presalePieChart.setOption(pieOptionSet(param));
        }
    }

    //门店赠送柱状图
    function shopGivenBarChartDataLoad(){
        var cmd = "shopStatistics/myHomePageLargessAchDetails";
        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            if(obj.length > 0){
                var timeArr = [], numArr = [], priceArr = [];
                for(var i=0; i<obj.length; i++){
                    timeArr.push(obj[i].time);
                    numArr.push(obj[i].num);
                    priceArr.push(obj[i].price);
                }
            }
            var seriesArr = [{
                name: '金额',
                type: 'bar',
                barWidth : '30px',
                data: priceArr
            }];
            if(barType == 1){
                seriesArr = [{
                    name: '数量',
                    type: 'bar',
                    barWidth : '30px',
                    data: numArr
                }]
            }
            var param = {
                'legend': barType == 0 ? ['金额'] : ['数量'],
                'xAxisArr':timeArr,
                'seriesArr': seriesArr
            }
            var shopGivenBarChart = echarts.init(document.getElementById('shopGivenBarChart'));
            shopGivenBarChart.setOption(barOptionSet(param));
        }
    }

    //门店赠送饼状图
    function shopGivenPieChartDataLoad(){
        var cmd = "shopStatistics/myHomePageLargessDetails";
        var jsonData = "{'shopId':"+shopId+",'type':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var pieArr = [], temp = {};
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    temp = {
                        'name': obj[i].name,
                        'value': obj[i].num
                    }
                    pieArr.push(temp);
                }
            }
            var shopGivenPieChart = echarts.init(document.getElementById('shopGivenPieChart'));
            var param = {
                'title': '门店赠送饼状图',
                'seriesData': pieArr
            }
            shopGivenPieChart.setOption(pieOptionSet(param));
        }
    }
    //哪个产品卖的好详情页--柱状图
    function whichSellWellBarChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageHotGoodsConsumeAchDetails";
        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            if(obj.length > 0){
                var timeArr = [], numArr = [], priceArr = [];
                for(var i=0; i<obj.length; i++){
                    timeArr.push(obj[i].time);
                    numArr.push(obj[i].num);
                    priceArr.push(obj[i].price);
                }
            }
            var seriesArr = [{
                name: '金额',
                type: 'bar',
                barWidth : '30px',
                data: priceArr
            }];
            if(barType == 1){
                seriesArr = [{
                    name: '数量',
                    type: 'bar',
                    barWidth : '30px',
                    data: numArr
                }]
            }
            var param = {
                'legend': barType == 0 ? ['金额'] : ['数量'],
                'xAxisArr':timeArr,
                'seriesArr': seriesArr
            }
            var whichSellWellBarChart = echarts.init(document.getElementById('whichSellWellBarChart'));
            whichSellWellBarChart.setOption(barOptionSet(param));
        }
    }

    //哪个产品卖的好详情页-今日消耗--饼状图
    function whichSellWellPieChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageHotGoodsConsumeDetails";
        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var pieArr = [], temp = {};
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    temp = {
                        'name': obj[i].typeName,
                        'value': obj[i].price
                    }
                    pieArr.push(temp);
                }
            }
            var whichSellWellPieChart = echarts.init(document.getElementById('whichSellWellPieChart'));
            var param = {
                'title': '今日消耗饼状图',
                'seriesData': pieArr
            }
            whichSellWellPieChart.setOption(pieOptionSet(param));
        }
    }

    function showListDataOfSellWell(res){
        var sHtml = "";
        if(res.code == 1){
            sHtml += "<thead><tr><td>产品名称</td><td>价格</td><td>数量</td><td>客户名称</td><td>购买时间</td></tr></thead><tbody>"
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].purchaseName+'</td>'
                        + '<td>'+res.data[i].price+'</td>'
                        + '<td>'+res.data[i].purchasNum+'</td>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].consumeTime+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="5">暂无数据</td></tr>'
            }
            sHtml += "</tbody>";
            $("#storeDetailTable").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //哪个产品卖的好详情页-明细列表
    function whichSellWellListDataLoad(){
        var cmd = "shopStatistics/shopHomePageHotGoodsDetails";
        var jsonData = "{'shopId':"+shopId+",'type':2,'goodsId':"+employeeId+",'pageNo':"+pageNo+", 'pageSize':"+pageSize+"}";
        var resData = reqAjax(cmd, jsonData);
        showListDataOfSellWell(resData);
        if(resData.total > 0){
            $("#storeDetailPage").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                jsonData = "{'shopId':"+shopId+",'type':2,'goodsId':"+accountId+",'pageNo':"+num+", 'pageSize':"+pageSize+"}";
                var resData = reqAjax(cmd, jsonData);
                showListDataOfSellWell(resData);
            }).removeClass("invisible");
        }else{
            $('#storeDetailPage').addClass("invisible");
        }
    }

    //客户贡献最大--柱状图
    function contributionMostBarChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageMaxAccountContributeAchDetails";
        var jsonData = "{'shopId':"+shopId+",'accountId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
         var obj = resData.data;
         if(obj.length > 0){
             var timeArr = [], numArr = [], priceArr = [];
             for(var i=0; i<obj.length; i++){
                 timeArr.push(obj[i].time);
                 numArr.push(obj[i].num);
                 priceArr.push(obj[i].price);
             }
         }
         var seriesArr = [{
             name: '金额',
             type: 'bar',
             barWidth : '30px',
             data: priceArr
         }];
         if(barType == 1){
             seriesArr = [{
                 name: '数量',
                 type: 'bar',
                 barWidth : '30px',
                 data: numArr
             }]
         }
         var param = {
             'legend': barType == 0 ? ['金额'] : ['数量'],
             'xAxisArr':timeArr,
             'seriesArr': seriesArr
         }
         var contributionMostBarChart = echarts.init(document.getElementById('contributionMostBarChart'));
         contributionMostBarChart.setOption(barOptionSet(param));
        }
    }

    //客户贡献最大-饼状图
    function contributionMostPieChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageMaxAccountContributeDetails";
        var jsonData = "{'shopId':"+shopId+",'accountId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var pieArr = [], temp = {};
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    temp = {
                        'name': obj[i].typeName,
                        'value': obj[i].price
                    }
                    pieArr.push(temp);
                }
            }
            var contributionMostPieChart = echarts.init(document.getElementById('contributionMostPieChart'));
            var param = {
                'title': '客户贡献最大饼状图',
                'seriesData': pieArr
            }
            contributionMostPieChart.setOption(pieOptionSet(param));
        }
    }

    //员工贡献最大--柱状图
    function workerDoMostBarChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageMaxEmployeeContributeAchDetails";
        var jsonData = "{'shopId':"+shopId+",'salesmanId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
         var obj = resData.data;
         if(obj.length > 0){
             var timeArr = [], numArr = [], priceArr = [];
             for(var i=0; i<obj.length; i++){
                 timeArr.push(obj[i].time);
                 numArr.push(obj[i].num);
                 priceArr.push(obj[i].price);
             }
         }
         var seriesArr = [{
             name: '金额',
             type: 'bar',
             barWidth : '30px',
             data: priceArr
         }];
         if(barType == 1){
             seriesArr = [{
                 name: '数量',
                 type: 'bar',
                 barWidth : '30px',
                 data: numArr
             }]
         }
         var param = {
             'legend': barType == 0 ? ['金额'] : ['数量'],
             'xAxisArr':timeArr,
             'seriesArr': seriesArr
         }
         var workerDoMostBarChart = echarts.init(document.getElementById('workerDoMostBarChart'));
         workerDoMostBarChart.setOption(barOptionSet(param));
        }
    }

    //员工贡献最大-饼状图
    function workerDoMostPieChartDataLoad(){
        var cmd = "shopStatistics/shopHomePageMaxEmployeeContributeDetails";
        var jsonData = "{'shopId':"+shopId+",'salesmanId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        var resData = reqAjax(cmd, jsonData);
        if(resData.code == 1){
            var obj = resData.data;
            var pieArr = [], temp = {};
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    temp = {
                        'name': obj[i].typeName,
                        'value': obj[i].price
                    }
                    pieArr.push(temp);
                }
            }
            var workerDoMostPieChart = echarts.init(document.getElementById('workerDoMostPieChart'));
            var param = {
                'title': '员工贡献最大饼状图',
                'seriesData': pieArr
            }
            workerDoMostPieChart.setOption(pieOptionSet(param));
        }
    }

    //今日她来
    function showListDataOfsheGo(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                       // + '<td><a href="../../customerManagement/html/customerOverview.html?accountId='+res.data[i].accountId+'">'+res.data[i].customer+'</a></td>'
                    	+ '<td>'+res.data[i].customer+'</td>'
                        + '<td>'+res.data[i].bespokTime+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].serviceName+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }

            $("#sheGoList").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //今日她来详情页-明细列表
    function sheGoListDataLoad(){
        var cmd = "shopStatistics/shopHomePageSheGoDetails";
        var jsonData = "{'shopId': " + shopId + ",'type':'" + _type + "','employeeId':'"+ employeeId + "','pageNo': " + pageNo + ",'pageSize': " + pageSize+ "}";
        var resData = reqAjax(cmd, jsonData);
        showListDataOfsheGo(resData);
        if(resData.total > 0){
            $("#page6").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                jsonData = "{'shopId': " + shopId + ",'type':'" + _type + "','employeeId':'"+ employeeId + "','pageNo': " + num + ",'pageSize': " + pageSize+ "}";
                var resData = reqAjax(cmd, jsonData);
                showListDataOfsheGo(resData);
            }).removeClass("invisible");
        }else{
            $('#page6').addClass("invisible");
        }
    }


    /***********************************************************/
    //页面初始化
    function init(){
        $(".main-content .module-"+_module).removeClass("hide").siblings().addClass("hide");
        startTime = $(".start-time").val();
        endTime = $(".end-time").val();
        switch (_module) {
            case "1":// 定金预售
                $(".date-wrap").removeClass("hide");
                $(".maintitle .title span").text("定金预售");
                presalePieChartDataLoad();
                presaleBarChartDataLoad();
                break;
            case "2"://哪个产品卖得最好-今日消耗
                $(".date-wrap").removeClass("hide");
                $(".maintitle .title span").text("今日消耗");
                whichSellWellBarChartDataLoad();
                whichSellWellPieChartDataLoad();
                whichSellWellListDataLoad();
                break;
            case "3":// 客户贡献
                $(".date-wrap").removeClass("hide");
                $(".maintitle .title span").text("客户贡献");
                contributionMostBarChartDataLoad();
                contributionMostPieChartDataLoad();
                break;
            case "4":// 员工贡献
                $(".date-wrap").removeClass("hide");
                $(".maintitle .title span").text("员工贡献");
                workerDoMostBarChartDataLoad();
                workerDoMostPieChartDataLoad();
                break;
            case "5": // 今日赠送
                $(".date-wrap").removeClass("hide");
                $(".maintitle .title span").text("今日赠送");
                shopGivenBarChartDataLoad();
                shopGivenPieChartDataLoad();
                break;
            case "6":
                if(_type == "1"){
                    $(".maintitle .title span").text("今日TA来");
                }else{
                    $(".maintitle .title span").text("您的功劳");
                }
                sheGoListDataLoad();
            default:

        }
    }
    init();

    //金额、数量柱状图切换
    $(".bar-chart-wrap .bar-chart-tab .btn").click(function(){
        $(this).addClass('active').siblings().removeClass("active");
        barType = $(this).index();
        init();
    });

    //时间类型切换--月|年|时间段
    $(".date-wrap .date-tab .btn").click(function(){
        $(this).addClass('active').siblings().removeClass("active");
        $(".bar-chart-wrap .bar-chart-tab .btn:eq(0)").addClass('active').siblings().removeClass("active");
        barType = 0;
        var _index = $(this).index();
        timeType = _index + 1;
        if(_index == 2){
            $(".start-time").val(today);
            $(".end-time").val(today);
            $(".date-wrap .date-selector").removeClass("hide");
        }else{
            $(".date-wrap .date-selector").addClass("hide");
        }
        startTime = $(".start-time").val();
        endTime = $(".end-time").val();
        init();
    });

    //时间选择确定
    $(".date-wrap .date-selector .btn").click(function(){
        startTime = $(".start-time").val();
        endTime = $(".end-time").val();
        init();
    });


    /***********************************************************/
    //返回
    $(".maintitle .return-icon").click(function(){
	    sessionStorage.setItem("prevPage", 2);
	    $(this).attr("href", '../../common/html/main/main.html');
    });

})(jQuery);
