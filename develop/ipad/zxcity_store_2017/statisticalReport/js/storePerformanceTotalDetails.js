(function($){
    var REQUEST_URL = {
        'bar_url':'shopStatistics/queryShopAchInfoSummeryDetials',//门店销售/消耗业绩
        'pie_url':'shopStatistics/queryShopProInfoSummeryDetials'//单个门店占比详情
    };

    var shopList = JSON.parse(sessionStorage.getItem('shopList'));

    var merchantId = sessionStorage.getItem("merchantId");
    var startTime1 = '', endTime1 = '', startTime2 = '', endTime2 = '';
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');

    //设置时间默认时间为今天
    $(".datetime").val(today);

    //日期选择器初始化
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
                endDates($(elem).attr("id").replace("startTime",""));
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
        function endDates(n) {
            //将结束日期的事件改成 false 即可
            //end.trigger = false;
            $("#endTime"+n).jeDate(end);
        }
        $.jeDate('.start-time',start);
        $.jeDate('.end-time',end);
    }
    initDateTime();
    // $(".datetime").datetimepicker({
    // 	language: 'zh-CN',
    // 	format: 'yyyy-mm-dd',
    // 	autoclose: true,//自动关闭
    // 	minView: 2
    // }).on('show', function(ev){
    //     var startTime = $(".date-wrap .start-time").val();
    //     var endTime = $(".date-wrap .end-time").val();
    //     $(".start-time").datetimepicker('setEndDate', endTime);
    //     $(".end-time").datetimepicker('setStartDate', startTime);
    //
    // }).on('changeDate', function(ev){
    //     var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
    //     var evClassName = ev.target.className;
    //     var evParent = $(ev.target).parent();
    //     console.log($(evParent));
    //     console.log($(evParent.find(".end-time")))
    //     //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
    //     if(evClassName.search('start-time') > -1){
    //         $(evParent.find(".end-time")).datetimepicker('setStartDate', _time);
    //     }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
    //     else if(evClassName.search('end-time') > -1){
    //         $(evParent.find(".start-time")).datetimepicker('setEndDate', _time);
    //     }
    // });

    //柱形图参数设置
    function setBarOptions(opts){
        var option = {
            title:{
                text:opts.title
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
                data:['销售业绩','消耗业绩']
            },
            toolbox : {
                show : true
            },
            calculable : true,
            xAxis: {
                data: opts.timeArr
            },
            yAxis: {
                type: 'value'
            },
            series: opts.seriesData
        };
        return option;
    }

    //柱状图数据加载
    function loadBarData(){
        var timeType = $("#barTab ul>li.active").index() + 1;
        if(timeType == 3){
            startTime1 = $("#startTime1").val();
            endTime1 = $("#endTime1").val();
        }
        var param = {
            'merchantId':merchantId,
            'timeType':timeType,
            'startData':startTime1,
            'endData':endTime1,
            'shopList':shopList,
        };
        reqAjaxAsync(REQUEST_URL['bar_url'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data;
                if(obj.length > 0){
                    var timeArr = [], salePriceArr = [], saleNumArr = [],
                        consumePriceArr = [], consumeNumArr = [];
                    for(var i=0; i<obj.length; i++){
                        timeArr.push(obj[i].time);
                        salePriceArr.push(obj[i].salePrice);
                        saleNumArr.push(obj[i].saleNum);
                        consumePriceArr.push(obj[i].consumePrice);
                        consumeNumArr.push(obj[i].consumeNum);
                    }
                    var barChart = echarts.init(document
                        .getElementById('barChart'));
                    var type = $("#salsumpTab ul>li.active").index() + 1;
                    if(type == 2){
                        var opts = {
                            'title':'门店销售消耗订单量',
                            'legend':['销售数量','消耗数量'],
                            'timeArr':timeArr,
                            'seriesData':[{
                                name: '销售数量',
                                type: 'bar',
                                barWidth : '30px',
                                data:saleNumArr
                            },{
                                name: '消耗数量',
                                type: 'bar',
                                barWidth : '30px',
                                data: consumeNumArr
                            }]
                        };
                        barChart.setOption(setBarOptions(opts));
                    }else{
                        var opts = {
                            'title':'门店销售消耗业绩',
                            'legend':['销售业绩','消耗业绩'],
                            'timeArr':timeArr,
                            'seriesData':[{
                                name: '销售业绩',
                                type: 'bar',
                                barWidth : '30px',
                                data:salePriceArr
                            },{
                                name: '消耗业绩',
                                type: 'bar',
                                barWidth : '30px',
                                data: consumePriceArr
                            }]
                        };
                        barChart.setOption(setBarOptions(opts));
                    }
                }
            }
        });

    }

    //柱状图时间类型切换
    $("#barTab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index() + 1;
        if(_index == 3){
            $("#barDateBox").removeClass("invisible");
        }else{
            startTime1 = '';
            endTime1 = '';
            $("#barDateBox").addClass("invisible");
        }
        loadBarData();
    });
    $("#salsumpTab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        $("#barTab ul>li:eq(0)").addClass("active").siblings().removeClass("active");
        startTime1 = '';
        endTime1 = '';
        $("#barDateBox").addClass("invisible");
        loadBarData();
    });

    //柱状图按时间段查询
    $("#barSearchBtn").click(function(){
        loadBarData();
    });


    //饼状图设置
    function setPieOPtions(opts){
        var option = {
            title : {
                text : opts.title,
                x : 'center'
            },
            legend:{
                selectedMode: false
            },
            tooltip : {
                trigger : 'item',
                formatter : "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : true,
            series : [ {
                name : '数量',
                type : 'pie',
                radius : '55%',
                center : [ '50%', '60%' ],
                data : opts.seriesData
            }]
        };
        return option;
    }

    function loadPieData(){
        var timeType = $("#pieTab ul>li.active").index() + 1;
        if(timeType == 3){
            startTime2 = $("#startTime2").val();
            endTime2 = $("#endTime2").val();
        }
        var param = {
            'merchantId':merchantId,
            'timeType':timeType,
            'startData':startTime2,
            'endData':endTime2,
            'shopList':shopList,
        };
        reqAjaxAsync(REQUEST_URL['pie_url'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var consumeData = res.data.consumeData,
                    saleData = res.data.saleData;
                var saleArr = [], consumeArr = [];
                //销售
                if(saleData.length > 0){
                    for(var i=0; i<saleData.length; i++){
                        var oSale = {};
                        oSale['name'] = saleData[i].typeName;
                        oSale['value'] = saleData[i].num;
                        saleArr.push(oSale);
                    }
                    var opts = {
                        'title':'门店销售业绩',
                        'seriesData':saleArr
                    };
                    var salePieChart = echarts.init(document
                        .getElementById('salePieChart'));
                    salePieChart.setOption(setPieOPtions(opts));
                }else{
                    $("#salePieChart").html("<div class='nodata'><p>暂无门店销售数据</p></div>");
                }
                //消耗
                if(consumeData.length > 0){
                    for(var i=0; i<consumeData.length; i++){
                        var oConsume = {};
                        oConsume['name'] = consumeData[i].typeName;
                        oConsume['value'] = consumeData[i].num;
                        consumeArr.push(oConsume);
                    }
                    var opts = {
                        'title':'门店消耗业绩',
                        'seriesData':consumeArr
                    };
                    var consumePieChart = echarts.init(document
                        .getElementById('consumptionPieChart'));
                    consumePieChart.setOption(setPieOPtions(opts));
                }else{
                    $("#consumptionPieChart").html("<div class='nodata'><p>暂无门店消耗数据</p></div>");
                }

            }else{
                layer.msg(res.msg);
            }
        });

    }

    //饼状图时间类型切换
    $("#pieTab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index() + 1;
        if(_index == 3){
            $("#pieDateBox").removeClass("invisible");
        }else{
            startTime2 = '';
            endTime2 = '';
            $("#pieDateBox").addClass("invisible");
        }
        loadPieData();
    });

    //饼状图按时间段查询
    $("#pieSearchBtn").click(function(){
        loadPieData();
    });

    $(function(){
        loadBarData();
        loadPieData();
    });
})(jQuery);
