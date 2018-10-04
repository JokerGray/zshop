(function($){
    var REQUEST_URL = {
        'largess_bar_url':'shopStatistics/myHomePageLargessAchDetails',//赠送柱状图
        'largess_pie_url':'shopStatistics/myHomePageLargessDetails',//赠送饼状图
        'hotGoods_bar_url':'shopStatistics/shopHomePageHotGoodsConsumeAchDetails',//哪个产品卖的好详情页--柱状图
        'hotGoods_pie_url':'shopStatistics/shopHomePageHotGoodsConsumeDetails',//今日消耗--饼状图
        'hotGoods_list_url':'shopStatistics/shopHomePageHotGoodsDetails',//哪个产品卖的好详情页-明细列表
        'customer_bar_url':'shopStatistics/shopHomePageMaxAccountContributeAchDetails',//客户贡献最大--柱状图
        'customer_pie_url':'shopStatistics/shopHomePageMaxAccountContributeDetails',//客户贡献最大-饼状图
        'employee_bar_url':'shopStatistics/shopHomePageMaxEmployeeContributeAchDetails',//员工贡献最大--柱状图
        'employee_pie_url':'shopStatistics/shopHomePageMaxEmployeeContributeDetails',//员工贡献最大-饼状图
        'sheGo_list_url':'shopStatistics/shopHomePageSheGoDetails',//今日她来详情页-明细列表
        'bespokeRemind_url':'shopStatistics/myHomePageBespokeRemindList',//提醒 - 明日预约列表
        'saleRemind_url':'shopStatistics/myHomePageSaleRemindList'//提醒 - 销售预测列表
    };
    var shopId = getUrlParams("shopId") ? getUrlParams("shopId") : sessionStorage.getItem("shopId"),
        accountId = getUrlParams("accountId") ? getUrlParams("accountId") : "",
        goodsId = getUrlParams("goodsId"),
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

    //日期初始化
    function initDateTime(){
        //日期选择器初始化
        var start = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            maxDate: $.nowDate({DD:0}), //最大日期
            choosefun: function(elem, val, date){
                end.minDate = date; //开始日选好后，重置结束日的最小日期
                end.maxDate = $.nowDate({DD:"+30"},'YYYY-MM-DD',val);
                endDates();
            }
        };
        var end = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            minDate: $.nowDate({DD:0}),
            maxDate: $.nowDate({DD:+30}),
            choosefun: function(elem, val, date){
                start.minDate = $.nowDate({DD:"-30"},'YYYY-MM-DD',val);
                start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
            }
        };
        //这里是日期联动的关键
        function endDates() {
            //将结束日期的事件改成 false 即可
            //end.trigger = false;
            $("#endTime").jeDate(end);
        }
        $.jeDate('.start-time',start);
        $.jeDate('.end-time',end);
    }
    initDateTime();


    //柱状图基础设置
    function barOptionSet(param){
        var barOptions = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
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
                x : 'center',
                top:'5%'
            },
            tooltip : {
                trigger : 'item',
                formatter : "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                selectedMode: false
            },
            series : [ {
                name : param.name,
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

    //门店赠送柱状图
    function shopGivenBarChartDataLoad(){
        if(timeType == 3){
            var daysBtw = daysBetween(startTime, endTime);
            if(daysBtw > 30){
                layer.msg("柱状图的开始日期与结束日期的间隔须小于30天！");
                return;
            }
        }

        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['largess_bar_url'], jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data;
                if(obj.length > 0){
                    var timeArr = [], numArr = [], priceArr = [];
                    for(var i=0; i<obj.length; i++){
                        timeArr.push(obj[i].time);
                        numArr.push(obj[i].num);
                        priceArr.push(obj[i].price);
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
                        }];
                    }
                    var param = {
                        'legend': barType == 0 ? ['金额'] : ['数量'],
                        'xAxisArr':timeArr,
                        'seriesArr': seriesArr
                    };
                    var shopGivenBarChart = echarts.init(document.getElementById('shopGivenBarChart'));
                    shopGivenBarChart.setOption(barOptionSet(param));
                }

            }
        });

    }

    //门店赠送饼状图
    function shopGivenPieChartDataLoad(){

        var jsonData = "{'shopId':"+shopId+",'type':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['largess_pie_url'], jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data;
                var pieArr = [], temp = {};
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        temp = {
                            'name': obj[i].name,
                            'value': obj[i].num
                        };
                        pieArr.push(temp);
                    }
                    var shopGivenPieChart = echarts.init(document.getElementById('shopGivenPieChart'));
                    var param = {
                        'title': '门店赠送饼状图',
                        'name':'数量',
                        'seriesData': pieArr
                    };
                    shopGivenPieChart.setOption(pieOptionSet(param));
                }else{
                    $("#shopGivenPieChart").html("<div class='nodata'><p>暂无数据</p></div>");
                }

            }
        });

    }
    //哪个产品卖的好详情页--柱状图
    function whichSellWellBarChartDataLoad(){
        if(timeType == 3){
            var daysBtw = daysBetween(startTime, endTime);
            if(daysBtw > 30){
                layer.msg("柱状图的开始日期与结束日期的间隔须小于30天！");
                return;
            }
        }

        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['hotGoods_bar_url'], jsonData).done(function(resData){
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
                    }];
                }
                var param = {
                    'legend': barType == 0 ? ['金额'] : ['数量'],
                    'xAxisArr':timeArr,
                    'seriesArr': seriesArr
                };
                var whichSellWellBarChart = echarts.init(document.getElementById('whichSellWellBarChart'));
                whichSellWellBarChart.setOption(barOptionSet(param));

            }
        });
    }

    //哪个产品卖的好详情页-今日消耗--饼状图
    function whichSellWellPieChartDataLoad(){
        var jsonData = "{'shopId':"+shopId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['hotGoods_pie_url'], jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data;
                var pieArr = [], temp = {};
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        temp = {
                            'name': obj[i].typeName,
                            'value': obj[i].price
                        };
                        pieArr.push(temp);
                    }
                    var whichSellWellPieChart = echarts.init(document.getElementById('whichSellWellPieChart'));
                    var param = {
                        'title': '今日消耗饼状图',
                        'name':'金额',
                        'seriesData': pieArr
                    };
                    whichSellWellPieChart.setOption(pieOptionSet(param));
                }else{
                    $("#whichSellWellPieChart").html("<div class='nodata'><p>暂无数据</p></div>");
                }

            }
        });

    }

    function showListDataOfSellWell(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].purchaseName+'</td>'
                        + '<td>'+res.data[i].price+'</td>'
                        + '<td>'+res.data[i].purchasNum+'</td>'
                        + '<td>'+res.data[i].consumeTime+'</td>'
                        + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="5">暂无数据</td></tr>';
            }
            $("#HotGoodsList tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //哪个产品卖的好详情页-明细列表
    function whichSellWellListDataLoad(){
        var jsonData = "{'shopId':"+shopId+",'type':"+_type+",'goodsId':"+goodsId+",'pageNo':"+pageNo+", 'pageSize':"+pageSize+"}";
        reqAjaxAsync(REQUEST_URL['hotGoods_list_url'], jsonData).done(function(resData){
            showListDataOfSellWell(resData);
            pagingInit('#HotGoodsListPage',resData.total,pageSize,function (page) {
                jsonData = "{'shopId':"+shopId+",'type':"+_type+",'goodsId':"+goodsId+",'pageNo':"+page+", 'pageSize':"+pageSize+"}";
                reqAjaxAsync(REQUEST_URL['hotGoods_list_url'], jsonData).done(function(resData){
                    showListDataOfSellWell(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#HotGoodsListPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         jsonData = "{'shopId':"+shopId+",'type':2,'goodsId':"+accountId+",'pageNo':"+num+", 'pageSize':"+pageSize+"}";
            //         reqAjaxAsync(REQUEST_URL['hotGoods_list_url'], jsonData).done(function(resData){
            //             showListDataOfSellWell(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#HotGoodsListPage').addClass("invisible");
            // }
        });

    }

    //客户贡献最大--柱状图
    function contributionMostBarChartDataLoad(){
        if(timeType == 3){
            var daysBtw = daysBetween(startTime, endTime);
            if(daysBtw > 30){
                layer.msg("柱状图的开始日期与结束日期的间隔须小于30天！");
                return;
            }
        }

        var jsonData = "{'shopId':"+shopId+",'accountId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['customer_bar_url'], jsonData).done(function(resData){
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
                    }];
                }
                var param = {
                    'legend': barType == 0 ? ['金额'] : ['数量'],
                    'xAxisArr':timeArr,
                    'seriesArr': seriesArr
                };
                var contributionMostBarChart = echarts.init(document.getElementById('contributionMostBarChart'));
                contributionMostBarChart.setOption(barOptionSet(param));
            }
        });

    }

    //客户贡献最大-饼状图
    function contributionMostPieChartDataLoad(){
        var jsonData = "{'shopId':"+shopId+",'accountId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['customer_pie_url'], jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data;
                var pieArr = [], temp = {};
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        temp = {
                            'name': obj[i].typeName,
                            'value': obj[i].num
                        };
                        pieArr.push(temp);
                    }
                }
                var contributionMostPieChart = echarts.init(document.getElementById('contributionMostPieChart'));
                var param = {
                    'title': '客户贡献最大饼状图',
                    'name':'数量',
                    'seriesData': pieArr
                };
                contributionMostPieChart.setOption(pieOptionSet(param));
            }
        });

    }

    //员工贡献最大--柱状图
    function workerDoMostBarChartDataLoad(){
        if(timeType == 3){
            var daysBtw = daysBetween(startTime, endTime);
            if(daysBtw > 30){
                layer.msg("柱状图的开始日期与结束日期的间隔须小于30天！");
                return;
            }
        }

        var jsonData = "{'shopId':"+shopId+",'salesmanId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['employee_bar_url'], jsonData).done(function(resData){
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
                    }];
                }
                var param = {
                    'legend': barType == 0 ? ['金额'] : ['数量'],
                    'xAxisArr':timeArr,
                    'seriesArr': seriesArr
                };
                var workerDoMostBarChart = echarts.init(document.getElementById('workerDoMostBarChart'));
                workerDoMostBarChart.setOption(barOptionSet(param));
            }
        });

    }

    //员工贡献最大-饼状图
    function workerDoMostPieChartDataLoad(){
        if(timeType == 3){
            var daysBtw = daysBetween(startTime, endTime);
            if(daysBtw > 30){
                layer.msg("柱状图的开始日期与结束日期的间隔须小于30天！");
                return;
            }
        }

        var jsonData = "{'shopId':"+shopId+",'salesmanId':"+accountId+",'timeType':"+timeType+", 'startData':'"+startTime+"', 'endData':'"+endTime+"'}";
        reqAjaxAsync(REQUEST_URL['employee_pie_url'], jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data;
                var pieArr = [], temp = {};
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        temp = {
                            'name': obj[i].typeName,
                            'value': obj[i].num
                        };
                        pieArr.push(temp);
                    }
                }
                var workerDoMostPieChart = echarts.init(document.getElementById('workerDoMostPieChart'));
                var param = {
                    'title': '员工贡献最大饼状图',
                    'name':'数量',
                    'seriesData': pieArr
                };
                workerDoMostPieChart.setOption(pieOptionSet(param));
            }
        });

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
                        + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }

            $("#sheGoList").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    //今日她来详情页-明细列表
    function sheGoListDataLoad(){
        var jsonData = "{'shopId': " + shopId + ",'type':'" + _type + "','employeeId':'"+ employeeId + "','pageNo': " + pageNo + ",'pageSize': " + pageSize+ "}";
        reqAjaxAsync(REQUEST_URL['sheGo_list_url'], jsonData).done(function(resData){
            showListDataOfsheGo(resData);
            pagingInit('#page6',resData.total,pageSize,function (page) {
                jsonData = "{'shopId': " + shopId + ",'type':'" + _type + "','employeeId':'"+ employeeId + "','pageNo': " + page + ",'pageSize': " + pageSize+ "}";
                reqAjaxAsync(REQUEST_URL['sheGo_list_url'], jsonData).done(function(resData){
                    showListDataOfsheGo(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page6").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         jsonData = "{'shopId': " + shopId + ",'type':'" + _type + "','employeeId':'"+ employeeId + "','pageNo': " + num + ",'pageSize': " + pageSize+ "}";
            //         reqAjaxAsync(REQUEST_URL['sheGo_list_url'], jsonData).done(function(resData){
            //             showListDataOfsheGo(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page6').addClass("invisible");
            // }
        });

    }

    //提醒 - 销售预测列表
    function showSaleRemindList(res){
        var sHtml = "";
        sHtml += '<thead><tr><th>会员名称</th><th>会员电话</th><th>会员卡号</th><th>注册时间</th></tr></thead><tbody>';
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].cardNumber+'</td>'
                        + '<td>'+res.data[i].createTime+'</td>'
                        + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#module8 table").html(sHtml);
    }
    //提醒 - 销售预测列表
    function getSaleRemindList(){
        var param = {
            'shopId':shopId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };

        reqAjaxAsync(REQUEST_URL['saleRemind_url'], JSON.stringify(param)).done(function(resData){
            showSaleRemindList(resData);
            pagingInit('#page8',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['saleRemind_url'], JSON.stringify(param)).done(function(resData){
                    showSaleRemindList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page8").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['saleRemind_url'], JSON.stringify(param)).done(function(resData){
            //             showSaleRemindList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page8').addClass("invisible");
            // }
        });

    }

    //提醒 - 明日预约列表
    function showBespokeRemindList(res){
        var sHtml = "";
        sHtml += '<thead><tr><th>客户名称</th><th>客户电话</th><th>预约时间</th><th>预约服务</th></tr></thead><tbody>';
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].customer+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].bespokTime+'</td>'
                        + '<td>'+res.data[i].serviceName+'</td>'
                        + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#module8 table").html(sHtml);
    }
    //提醒 - 明日预约列表
    function getBespokeRemindList(){
        var param = {
            'shopId':shopId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };

        reqAjaxAsync(REQUEST_URL['bespokeRemind_url'], JSON.stringify(param)).done(function(resData){
            showBespokeRemindList(resData);
            pagingInit('#page8',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['bespokeRemind_url'], JSON.stringify(param)).done(function(resData){
                    showBespokeRemindList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page8").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['bespokeRemind_url'], JSON.stringify(param)).done(function(resData){
            //             showBespokeRemindList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page8').addClass("invisible");
            // }
        });

    }


    /***********************************************************/
    //页面初始化
    function init(){
        $(".main-content .module-"+_module).removeClass("hide").siblings().addClass("hide");
        startTime = $(".start-time").val();
        endTime = $(".end-time").val();
        switch (_module) {
        case "2"://哪个产品卖得最好-今日消耗
            $(".date-wrap").removeClass("hide");
            if(goodsId == ""){
                $(".main-title .title span").text("今日消耗");
                whichSellWellBarChartDataLoad();
                if(barType == 0){
                    whichSellWellPieChartDataLoad();
                    $(".pie-chart").removeClass("hide");
                }else{
                    $(".pie-chart").addClass("hide");
                }

                $(".chart-box").removeClass("hide").siblings().addClass("hide");
            }else{
                $(".date-wrap").addClass("hide");
                $(".main-title .title span").text("产品销售明细");
                whichSellWellListDataLoad();
                $(".table-box").removeClass("hide").siblings().addClass("hide");
            }
            break;
        case "3":// 客户贡献
            $(".date-wrap").removeClass("hide");
            $(".main-title .title span").text("客户贡献");
            contributionMostBarChartDataLoad();
            if(barType == 0){
                $(".pie-chart").addClass("hide");
            }else{
                contributionMostPieChartDataLoad();
                $(".pie-chart").removeClass("hide");

            }
            break;
        case "4":// 员工贡献
            $(".date-wrap").removeClass("hide");
            $(".main-title .title span").text("员工贡献");
            workerDoMostBarChartDataLoad();
            if(barType == 0){
                $(".pie-chart").addClass("hide");
            }else{
                workerDoMostPieChartDataLoad();
                $(".pie-chart").removeClass("hide");
            }
            break;
        case "5": // 今日赠送
            $(".date-wrap").removeClass("hide");
            $(".main-title .title span").text("今日赠送");
            shopGivenBarChartDataLoad();
            if(barType == 0){
                $(".pie-chart").addClass("hide");
            }else{
                shopGivenPieChartDataLoad();
                $(".pie-chart").removeClass("hide");
            }

            break;
        case "6":
            if(_type == "1"){
                $(".main-title .title span").text("今日TA来");
            }else{
                $(".main-title .title span").text("您的功劳");
            }
            sheGoListDataLoad();
            break;
        case "8":
            $(".date-wrap").addClass("hide");
            if(_type == 1){
                $(".main-title .title").text("提醒--销售预测详情页");
                getSaleRemindList();
            }else if(_type == 2){
                $(".main-title .title").text("提醒--明日预约详情页");
                getBespokeRemindList();
            }
            break;
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
        layer.closeAll();
        $(this).addClass('active').siblings().removeClass("active");
        $(".bar-chart-wrap .bar-chart-tab").find(".btn:eq(0)").addClass('active').siblings().removeClass("active");
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
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 2);
        $(this).attr("href", '../index.html');
    });

})(jQuery);
