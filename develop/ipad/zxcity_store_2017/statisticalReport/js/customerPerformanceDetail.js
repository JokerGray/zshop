(function($){
    var REQUEST_URL = {
        'bar_url':'shopStatistics/queryAccountAchSummeryDetials',//客户贡献-柱状图
        'pie_url':'shopStatistics/queryAccountProSummeryDetials'//客户贡献-饼状图
    };
    var merchantId = getUrlParams("merchantId"),
        accountId = getUrlParams("accountId"),
        customerName = getUrlParams("customerName");

    var startTime1 = "", endTime1 = "",startTime2 = "", endTime2 = "";

    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');

    //设置时间默认时间为今天
    $(".datetime").val(today);
    $('.main-title .title span').html(customerName);
    //日期选择器初始化
    dateLinkage('.start-time','.end-time','YYYY-MM-DD');
    // $(".datetime").datetimepicker({
    //     language: 'zh-CN',
    //     format: 'yyyy-mm-dd',
    //     autoclose: true,//自动关闭
    //     minView: 2
    // }).on('show', function(ev){
    //     var startTime = $(".date-wrap .start-time").val();
    //     var endTime = $(".date-wrap .end-time").val();
    //     $(this).siblings(".start-time").datetimepicker('setEndDate', endTime);
    //     $(this).siblings(".end-time").datetimepicker('setStartDate', startTime);
    //
    // }).on('changeDate', function(ev){
    //     var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
    //     var evClassName = ev.target.className;
    //     //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
    //     if(evClassName.search('start-time') > -1){
    //         $(this).siblings(".end-time").datetimepicker('setStartDate', _time);
    //         //$(".end-time").datetimepicker('setStartDate', _time);
    //     }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
    //     else if(evClassName.search('end-time') > -1){
    //         //$(".start-time").datetimepicker('setEndDate', _time);
    //         $(this).siblings(".star-time").datetimepicker('setStartDate', _time);
    //     }
    // });

    //设置柱状图
    function setBarOptions(opts){
        var option = {
            title:{
                text: '客户贡献订单量',
                left: 'center'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
                data: opts.legend,
                left: 'left'
            },
            toolbox : {
                show : true
            },
            calculable : true,
            xAxis: {
                data: opts.xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: opts.seriesData
        };
        return option;
    }
    //设置饼状图
    function setPieOptions(opts){
        var option = {
            title:{
                text: '客户贡献饼状图',
                left: 'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                selectedMode: false,
                data: opts.itemArr
            },
            series : [
                {
                    name: '订单量',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: opts.dataArr,
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

    //加载柱状图数据
    function barChartDataLoad(){
        var timeType = $("#barTimeTab ul>li.active").index() + 1;
        if(timeType == 3){
            startTime1 = $("#startTime1").val();
            endTime1 = $("#endTime1").val();
        }
        var param = {
            'merchantId':merchantId,
            'accountId':accountId,
            'timeType':timeType,
            'startData':startTime1,
            'endData':endTime1
        };
        reqAjaxAsync(REQUEST_URL['bar_url'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data;
                var timeArr = [], numArr = [], priceArr = [];
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        timeArr.push(obj[i].time);
                        numArr.push(obj[i].num);
                        priceArr.push(obj[i].price);
                    }
                }

                var barChart = echarts.init(document.getElementById('barChart'));
                var _index = $("#salsumpTab ul>li.active").index();
                var opts = {'xAxisArr': timeArr};
                if(_index == 0){
                    opts['title'] = '客户消费情况';
                    opts['legend'] = ['金额'];
                    opts['seriesData'] = [{
                        name: '金额',
                        type: 'bar',
                        barWidth : '30px',
                        data: priceArr
                    }];
                }else{
                    opts['title'] = '客户订单情况';
                    opts['legend'] = ['订单量'];
                    opts['seriesData'] = [{
                        name: '数量',
                        type: 'bar',
                        barWidth : '30px',
                        data: numArr
                    }];
                }

                barChart.setOption(setBarOptions(opts));
            }
        });

    }

    //加载饼状图数据
    function pieChartDataLoad(){
        var timeType = $("#pieTimeTab ul>li.active").index() + 1;
        if(timeType == 3){
            startTime2 = $("#startTime2").val();
            endTime2 = $("#endTime2").val();
        }
        var param = {
            'merchantId':merchantId,
            'accountId':accountId,
            'timeType':timeType,
            'startData':startTime2,
            'endData':endTime2
        };
        reqAjaxAsync(REQUEST_URL['pie_url'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data.saleData;
                if(obj.length > 0){
                    var itemArr = [], dataArr = [];
                    for(var i=0; i<obj.length; i++){
                        var oData = {};
                        oData.value = obj[i].num;
                        oData.name = obj[i].typeName;
                        itemArr.push(obj[i].typeName);
                        dataArr.push(oData);
                    }
                    var pieChart = echarts.init(document.getElementById('pieChart'));
                    pieChart.setOption(setPieOptions({'itemArr':itemArr,'dataArr':dataArr}));
                }else{
                    $("#pieChart").html("<div class='nodata'><p>暂无客户贡献数据</p></div>");
                }
            }
        });

    }

    //柱状图日期筛选验证
    function checkDate(){
        var start = $("#barTimeBox").find(".start-time").val();
        var end = $("#barTimeBox").find(".end-time").val();
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
            layer.msg('起始日期应小于结束日期且间隔不得超过30天!');
            return false;
        }
        return true;
    }

    //柱状图业绩、项目量切换
    $("#barTimeTab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index() + 1;
        if (_index == 3){
            $("#barTimeBox").removeClass("hide");
            if(!checkDate()){
                return;
            }
        }else{
            $("#barTimeBox").addClass("hide");
        }

        barChartDataLoad();
    });

    //饼状图
    $("#pieTimeTab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index() + 1;
        if (_index == 3){
            $("#salsumpPieDate").removeClass("hide");
        }else{
            $("#salsumpPieDate").addClass("hide");
        }
        pieChartDataLoad();
    });
    //柱状图日期筛选验证事件
    $("#salsumpHistogramBtn").click(function(){
        if(!checkDate()) return;
        barChartDataLoad();
    });

    $("#pieSearchBtn").click(function(){
        pieChartDataLoad();
    });


    $(function(){
        barChartDataLoad();
        pieChartDataLoad();
    });

})(jQuery);
