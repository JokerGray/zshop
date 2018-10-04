(function ($) {
    var REQUEST_URL = {
        'bar_url': 'shopStatistics/querySalesmanAchSummeryDetials',//销售业绩柱状图
        'pie_url': 'shopStatistics/querySalesmanProSummeryDetials',//销售业绩饼状图
        'detail': 'shopStatistics/querySalesmanSummeryList'//明细列表
    };
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-").replace(/(?=\b\d\b)/g, '0');

    var merchantId = getUrlParams("merchantId"),
        salesmanId = getUrlParams("salesmanId"),
        salesman = getUrlParams("salesman"),
        mType = getUrlParams("mType");
    var startTime = today, endTime = today, tabType = 1;
    var pageNo = 1, pageSize = 10;

    var param = {"merchantId": merchantId, "salesmanId": salesmanId};

    //设置标题
    $(".main-title .title span").text(salesman);
    //设置时间默认时间为今天
    $(".datetime").val(today);

    //日期初始化
    function initDateTime() {
        //日期选择器初始化
        dateLinkage('.start-time', '.end-time', 'YYYY-MM-DD')
        // var start = {
        //     isinitVal:true,
        //    skinCell:"mystyle",
        //    format:"YYYY-MM-DD",
        //    isClear:false,
        //    isok:false,
        //    maxDate: $.nowDate({DD:0}), //最大日期
        //    choosefun: function(elem, val, date){
        //        end.minDate = date; //开始日选好后，重置结束日的最小日期
        //         end.maxDate = $.nowDate({DD:"+30"},'YYYY-MM-DD',val);
        //        endDates($(elem).attr("id").replace("startTime",""));
        //    }
        // };
        // var end = {
        //     isinitVal:true,
        //    skinCell:"mystyle",
        //    format:"YYYY-MM-DD",
        //    isClear:false,
        //    isok:false,
        //     minDate: $.nowDate({DD:0}),
        //     maxDate: $.nowDate({DD:+30}),
        //    choosefun: function(elem, val, date){
        //         start.minDate = $.nowDate({DD:"-30"},'YYYY-MM-DD',val);
        //        start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
        //    }
        // };
        // //这里是日期联动的关键
        // function endDates(n) {
        //    //将结束日期的事件改成 false 即可
        //    //end.trigger = false;
        //    $("#endTime"+n).jeDate(end);
        // }
        // $.jeDate('.start-time',start);
        // $.jeDate('.end-time',end);
    }

    //柱状图参数设置
    function barOptionSet(opts) {
        var option = {
            title: {
                text: opts.title
            },
            grid: {
                left: '5%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                selectedMode: false,
                data: opts.legend
            },
            calculable: true,
            xAxis: {
                axisTick: {
                    alignWithLabel: true
                },
                data: opts.xData
            },
            yAxis: {
                type: 'value'
            },
            series: opts.series
        };
        return option;
    }

    //柱状图数据渲染
    function getBarData(tabType, timeType) {
        param['timeType'] = timeType;
        if (timeType == 3) {
            startTime = $("#startTime1").val();
            endTime = $("#endTime1").val();

            var daysBtw = daysBetween(startTime, endTime);
            if (daysBtw > 30) {
                layer.msg("柱状图的开始时间与结束时间的间隔不得超过30天！");
                return;
            }
            param['startData'] = startTime;
            param['endData'] = endTime;
        }
        var consumePriceArr = [], //消耗金额
            consumeNumArr = [],//消耗数量
            salesPriceArr = [], //销售金额
            salesNumArr = [],//销售数量
            timeArr = [];//时间
        reqAjaxAsync(REQUEST_URL['bar_url'], JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                var obj = res.data;
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        consumePriceArr.push(obj[i].consumePrice);
                        consumeNumArr.push(obj[i].consumeNum);
                        salesPriceArr.push(obj[i].salePrice);
                        salesNumArr.push(obj[i].saleNum);
                        timeArr.push(obj[i].time);
                    }
                } else {

                }
                var opts = {};
                if (tabType == 1) {
                    opts['title'] = '销售消耗业绩';
                    opts['xData'] = timeArr;
                    opts['legend'] = ['销售业绩', '消耗业绩'];
                    opts['series'] = [{
                        name: '销售业绩',
                        type: 'bar',
                        data: salesPriceArr,
                        barWidth: '30px'
                    }, {
                        name: '消耗业绩',
                        type: 'bar',
                        data: consumePriceArr,
                        barWidth: '30px'
                    }];
                } else if (tabType == 2) {
                    opts['title'] = '销售消耗订单数量';
                    opts['xData'] = timeArr;
                    opts['legend'] = ['销售订单量', '消耗订单量'];
                    opts['series'] = [{
                        name: '销售订单量',
                        type: 'bar',
                        data: salesNumArr,
                        barWidth: '30px'
                    }, {
                        name: '消耗订单量',
                        type: 'bar',
                        data: consumeNumArr,
                        barWidth: '30px'
                    }];
                }
                var barChart = echarts.init(document.getElementById('barChart'));
                barChart.setOption(barOptionSet(opts));
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //饼状图参数配置
    function pieOptionSet(opts) {
        var option = {
            title: {
                text: opts.title,
                x: 'center'
            },
            legend: {
                selectedMode: false
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [{
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: opts.seriesData
            }]
        };
        return option;
    }

    //饼状图数据渲染
    function getPieData(tabType, timeType) {
        param['timeType'] = timeType;
        if (timeType == 3) {
            startTime = $("#startTime2").val();
            endTime = $("#endTime2").val();
            param['startData'] = startTime;
            param['endData'] = endTime;
        }
        reqAjaxAsync(REQUEST_URL['pie_url'], JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                var consumeArr = [], saleArr = [];
                var consumeData = res.data.consumeData,
                    saleData = res.data.saleData;
                for (var i = 0; i < consumeData.length; i++) {
                    var temp = {};
                    temp['name'] = consumeData[i].typeName;
                    temp['value'] = consumeData[i].num;
                    consumeArr.push(temp);
                }
                for (var i = 0; i < saleData.length; i++) {
                    var temp = {};
                    temp['name'] = saleData[i].typeName;
                    temp['value'] = saleData[i].num;
                    saleArr.push(temp);
                }

                if (consumeArr.length > 0) {
                    var consumePieChart = echarts.init(document.getElementById('consumePieChart'));
                    consumePieChart.setOption(pieOptionSet({title: '消耗项目占比', seriesData: consumeArr}));
                } else {
                    $("#consumePieChart").html("<div class='nodata'><p>暂无消耗数据</p></div>");
                }

                if (saleArr.length > 0) {
                    var salePieChart = echarts.init(document.getElementById('salePieChart'));
                    salePieChart.setOption(pieOptionSet({title: '销售项目占比', seriesData: saleArr}));
                } else {
                    $("#salePieChart").html("<div class='nodata'><p>暂无销售数据</p></div>");
                }
                if (mType == 1) {
                    $("#consumePieChart").addClass("hide");
                } else {
                    $("#salePieChart").addClass("hide");
                }
            } else {
                layer.msg(res.msg);
            }
        });

    }

    //列表渲染
    function showListData(res) {
        if (res.code == 1) {
            var obj = res.data, sHtml = '';
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    sHtml += '<tr><td>' + obj[i].orderId + '</td>'
                        + '<td>' + obj[i].price + '</td>'
                        + '<td>' + obj[i].accountName + '</td>'
                        + '<td>' + obj[i].mobile + '</td>'
                        + '<td>' + obj[i].createTime + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="5">暂无数据</td></tr>';
            }
            $("#listTable tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    function loadDetailList(summaryType, timeType) {
        param['timeType'] = timeType;
        if (timeType == 3) {
            startTime = $("#startTime3").val();
            endTime = $("#endTime3").val();
            param['startData'] = startTime;
            param['endData'] = endTime;
        }
        param['pageNo'] = pageNo;
        param['pageSize'] = pageSize;
        param['summaryType'] = summaryType;
        reqAjaxAsync(REQUEST_URL['detail'], JSON.stringify(param)).done(function (resData) {
            showListData(resData);
            pagingInit('#listPage', resData.total, pageSize, function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['detail'], JSON.stringify(param)).done(function (resData) {
                    showListData(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //        param['pageNo'] = num;
            //        reqAjaxAsync(REQUEST_URL['detail'], JSON.stringify(param)).done(function(resData){
            //            showListData(resData);
            //        });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#listPage').addClass("invisible");
            // }
        });

    }

    //数据类型tab切换
    $("#salsumpTab .tab-ul .tab-item").click(function () {
        initDateTime();
        $(this).addClass("active").siblings().removeClass("active");
        tabType = $(this).index() + 1;
        $(".date-type-box .tab-ul").find(".tab-item:eq(0)").addClass("active").siblings().removeClass("active");
        $(".date-selector").addClass("hide");
        if (tabType == 3) {
            $(".list-box").removeClass("hide").siblings().addClass("hide");
            loadDetailList(mType, 1);
        } else if (tabType == 4) {
            $(".pie-chart-box").removeClass("hide").siblings().addClass("hide");
            getPieData(tabType, 1);
        } else {
            $(".charts-box").removeClass("hide").siblings().addClass("hide");
            getBarData(tabType, 1);

        }
    });

    //柱状图时间类型tab切换
    $("#barTimeTypeBox .tab-item").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var timeType = $(this).index() + 1;
        var tabType = $("#salsumpTab .tab-ul .tab-item.active").index() + 1;
        if (timeType == 3) {
            $("#barDateSelector").removeClass("hide");
        } else {
            $("#barDateSelector").addClass("hide");
        }
        getBarData(tabType, timeType);
    });

    //柱状图按时间段查询
    $("#barSearchBtn").click(function () {
        var startTime = $("#startTime1").val(),
            endTime = $("#endTime1").val();
        var days = daysBetween(startTime, endTime);
        if (days > 30) {
            layer.msg('起始日期与结束日期的时间间隔须小于30天!');
            return;
        }
        getBarData(tabType, 3);
    });

    //饼状图时间类型tab切换
    $("#pieTimeTypeBox .tab-item").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var timeType = $(this).index() + 1;
        var tabType = $("#salsumpTab .tab-ul .tab-item.active").index() + 1;
        if (timeType == 3) {
            $("#pieDateSelector").removeClass("hide");
        } else {
            $("#pieDateSelector").addClass("hide");
        }
        getPieData(tabType, timeType);
    });

    //饼状图按时间段查询
    $("#pieSearchBtn").click(function () {
        var tabType = $("#salsumpTab .tab-ul .tab-item.active").index() + 1;
        getPieData(tabType, 3);
    });

    //明细时间类型tab切换
    $("#listTimeTypeBox .tab-item").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var timeType = $(this).index() + 1;
        if (timeType == 3) {
            $("#listDateSelector").removeClass("hide");
        } else {
            $("#listDateSelector").addClass("hide");
        }
        loadDetailList(mType, timeType);
    });

    //明细按时间段查询
    $("#listSearchBtn").click(function () {
        loadDetailList(mType, 3);
    });

    $(function () {
        var detailTxt = mType == 1 ? '销售明细' : (mType == 2 ? '消耗明细' : '明细');
        $("#salsumpTab .tab-ul .tab-item:eq(2) .tab-link").html(detailTxt);
        initDateTime();
        getBarData(tabType, 1);
        //getPieData(tabType, 1);
    });

    //返回
//	$(".main-title .return-icon").click(function(){
//		if(sessionStorage.getItem("prevPage") == null || sessionStorage.getItem("prevPage") == "null" || sessionStorage.getItem("prevPage") == "1"){
//			sessionStorage.setItem("prevPage", 1);
//		}else{
//			location.href = "consultantPerformance.html"
//			//sessionStorage.setItem("prevPage", sessionStorage.getItem("prevPage"));
//		}
//
//		$(this).attr("href", '../../index.html');
//	});

})(jQuery);
