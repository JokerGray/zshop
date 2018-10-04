(function ($) {
    var REQUEST_URL = {
        'visit_line_url': 'shopStatistics/myHomePageAccountVisitDetails',//客户回访详情折线图
        'visit_list_url': 'shopStatistics/myHomePageAccountVisitListDetails',//客户回访详情列表
        'newAccount_url': 'shopStatistics/myHomePageNewAccountDetails',//新客分析详情
        'warning_url': 'shopStatistics/myHomePageWarningDetails',//卡项预警详情
        'largess_pie_url': 'shopStatistics/myHomePageLargessDetails',//赠送详情--饼状图
        'largess_bar_url': 'shopStatistics/myHomePageLargessAchDetails',//赠送详情--柱状图
        'largess_list_url': 'shopStatistics/myHomePageLargessListDetails',//赠送详情--明细列表
        'bespokeRemind_url': 'shopStatistics/myHomePageBespokeRemindList',//提醒 - 明日预约列表
        'saleRemind_url': 'shopStatistics/myHomePageSaleRemindList'//提醒 - 销售预测列表
    };
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-").replace(/(?=\b\d\b)/g, '0');
    var _module = getUrlParams('module'), _type = getUrlParams('type');
    var shopID = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId");
    var startTime = "", endTime = "", timeType = 1;
    var pageNo = 1, pageSize = 10;
    var navType = 0;
    sessionStorage.setItem("prevPage", 1);

    //设置时间默认时间为今天
    $(".datetime").val(today);
    //日期选择器初始化

    //日期初始化
    function initDateTime() {
        //日期选择器初始化
        $('.end-time').attr('disabled','disabled');
        var start = {
            isinitVal: true,
            skinCell: "mystyle",
            format: "YYYY-MM-DD",
            isClear: false,
            isok: false,
            maxDate: $.nowDate({DD: 0}), //最大日期
            choosefun: function (elem, val, date) {
                $('.end-time').attr('disabled',false);
                //end.minDate = date; //开始日选好后，重置结束日的最小日期
                //end.maxDate = $.nowDate({DD:"+30"},'YYYY-MM-DD',val);
                //如果是折现图表，只允许查询30天的数据
                if (navType == 0) {
                    var now = $.nowDate({DD: 0}, 'YYYY-MM-DD');
                    var selectDate = val;
                    if (daysBetween(now, selectDate) <= 30) {
                        end.maxDate = $.nowDate({DD: 0}, 'YYYY-MM-DD')
                    } else {
                        end.maxDate = $.nowDate({DD: "+30"}, 'YYYY-MM-DD', val)
                    }
                }else{
                    end.maxDate = $.nowDate({DD: 0})
                }
                end.minDate = val;
                endDates();
            }
        };
        var end = {
            isinitVal: true,
            skinCell: "mystyle",
            format: "YYYY-MM-DD",
            isClear: false,
            isok: false,
            maxDate: $.nowDate({DD: 0}),
            // maxDate: $.nowDate({DD:+30}),
            choosefun: function (elem, val, date) {
                // $('.end-time').attr('disabled','disabled');
                // start.minDate = $.nowDate({DD:"-30"},'YYYY-MM-DD',val);
                //start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
                // start.maxDate = val;
                // if(navType == 0){
                //     start.minDate = $.nowDate({DD: "-30"}, 'YYYY-MM-DD', val)
                // }
                // else if(navType == 1){
                //     start.maxDate = val;
                // }

            }
        };

        //这里是日期联动的关键
        function endDates() {
            //将结束日期的事件改成 false 即可
            end.trigger = false;
            $("#endTime").jeDate(end);
        }

        $.jeDate('.start-time', start);
        $.jeDate('.end-time', end);
    }

    initDateTime();

    if (_type == 3) {
        $(".date-wrap .date-selector").removeClass("hide");
        $(".date-wrap .date-tab .btn:eq(" + (_type - 1) + ")").addClass("active").siblings().removeClass("active");
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
    } else {
        $(".date-wrap .date-selector").addClass("hide");
    }

    $(".date-wrap .date-tab .btn").click(function () {
        var dataRel = $(this).attr("data-rel");
        $(this).addClass("active").siblings().removeClass("active");
        if (dataRel == "more") {
            $(".date-wrap .date-selector").removeClass("hide");
        } else {
            $(".date-wrap .date-selector").addClass("hide");
        }
    });


    function lineOptionSet(params) {
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
        };
        return lineOption;
    }

    var pieOptionSet = function (params) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                selectedMode: false,
                data: params.itemArr
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
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
    };

    function barOptionSet(params) {
        var option = {
            title: {
                text: params.title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
                data: params.legend,
                left: 'left'
            },
            toolbox: {
                show: true
            },
            calculable: true,
            xAxis: {
                data: params.xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: params.seriesData
        };
        return option;
    }


    function customerOverviewChartData() {
        var daysBtw = daysBetween(startTime, endTime);
        if (daysBtw > 30) {
            layer.msg("起始日期与结束日期的间隔须小于30天！");
            return;
        }
        var jsonData = "{'shopId':" + shopID + ",'type':" + _type + ",'timeType':" + timeType + ",'startData':'" + startTime + "','endData':'" + endTime + "'}";

        reqAjaxAsync(REQUEST_URL['visit_line_url'], jsonData).done(function (res) {
            if (res.code == 1) {
                var obj = res.data, timeArr = [], numArr = [];
                for (var i = 0; i < obj.length; i++) {
                    timeArr.push(obj[i].time);
                    numArr.push(obj[i].num);
                }
                var moduleChart_1 = echarts.init(document.getElementById('customerOverviewLineChart'));
                moduleChart_1.setOption(lineOptionSet({'timeArr': timeArr, 'numArr': numArr}));
            }
        });
    }

    function showListOfmodule_1(res) {
        var sHtml = "";
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        //  + '<td><a href="../customerManagement/html/customerOverview.html?accountId='+res.data[i].accountId+'">'+res.data[i].accountName+'</a></td>'
                        + '<td>' + res.data[i].accountName + '</td>'
                        + '<td>' + res.data[i].accountId + '</td>'
                        + '<td>' + res.data[i].mobile + '</td>'
                        + '<td>' + res.data[i].createTime + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml = '<tr><td colspan="4">暂无数据</td></tr>';
            }
            $("#module1 .table-list table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }

    }

    function getListDataOfmodule_1() {
        var _btnRel = $(".date-tab .btn.active").attr("data-rel");
        timeType = _btnRel == 'month' ? 1 : 2;
        var jsonData = "{'shopId':" + shopID + ",'type':" + _type + ", 'timeType':" + timeType + ", 'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
        reqAjaxAsync(REQUEST_URL['visit_list_url'], jsonData).done(function (resData) {
            showListOfmodule_1(resData);
            pagingInit("#page1", resData.total, 10, function (page) {
                jsonData = "{'shopId':" + shopID + ",'type':" + _type + ", 'timeType':" + timeType + ", 'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + page + ",'pageSize':" + pageSize + "}";
                reqAjaxAsync(REQUEST_URL['visit_list_url'], jsonData).done(function (resData) {
                    showListOfmodule_1(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page1").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         jsonData = "{'shopId':"+shopID+",'type':"+_type+", 'timeType':"+timeType+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
            //         reqAjaxAsync(REQUEST_URL['visit_list_url'], jsonData).done(function(resData){
            //             showListOfmodule_1(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page1').addClass("invisible");
            // }
        });

    }


    //预售列表显示
    function showPresalesList(res) {
        var sHtml = "";
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        //+ '<td><a href="../customerManagement/html/customerOverview.html?accountId='+res.data[i].accountId+'">'+res.data[i].accountName+'</a></td>'
                        + '<td>' + res.data[i].accountName + '</td>'
                        + '<td>' + res.data[i].goodsName + '</td>'
                        + '<td>' + res.data[i].num + '</td>'
                        + '<td>' + res.data[i].shouldPay + '</td>'
                        + '<td>' + res.data[i].time + '</td>'
                        + '<td>' + res.data[i].status + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>';
            }
            $("#module2 table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    //新客列表数据展示
    function showNewAccountList(res) {
        var sHtml = "";
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        + '<td>' + res.data[i].id + '</td>'
                        //+ '<td><a href="../customerManagement/html/customerOverview.html?accountId='+res.data[i].id+'">'+res.data[i].accountName+'</a></td>'
                        + '<td>' + res.data[i].accountName + '</td>'
                        + '<td>' + res.data[i].mobile + '</td>'
                        + '<td>' + res.data[i].cardName + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
            $("#module5 table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    //卡项预警列表数据展示
    function showCardWarningList(res) {
        var sHtml = "";
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        + '<td>' + res.data[i].card_name + '</td>'
                        + '<td>' + res.data[i].total_num + '</td>'
                        + '<td>' + res.data[i].consume_num + '</td>'
                        + '<td>' + res.data[i].remain_num + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
            $("#module6 table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    //新客分析详情列表加载
    function loadNewAccountData() {
        var jsonData = "{'shopId':" + shopID + ",'type':" + _type + ",'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
        reqAjaxAsync(REQUEST_URL['newAccount_url'], jsonData).done(function (resData) {
            showNewAccountList(resData);
            pagingInit('#page5', resData.total, 10, function (page) {
                var jsonData = "{'shopId':" + shopID + ",'type':" + _type + ",'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + page + ",'pageSize':" + pageSize + "}";
                reqAjaxAsync(REQUEST_URL['newAccount_url'], jsonData).done(function (resData) {
                    showNewAccountList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page5").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         var jsonData = "{'shopId':"+shopID+",'type':"+_type+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
            //         reqAjaxAsync(REQUEST_URL['newAccount_url'], jsonData).done(function(resData){
            //             showNewAccountList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page5').addClass("invisible");
            // }
        });

    }

    //客户卡项预警列表
    function loadCardWarningData() {
        var jsonData = "{'shopId':" + shopID + ",'accountId':" + _type + ",'pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
        reqAjaxAsync(REQUEST_URL['warning_url'], jsonData).done(function (resData) {
            showCardWarningList(resData);
            pagingInit('#page6', resData.total, 10, function (page) {
                var jsonData = "{'shopId':" + shopID + ",'accountId':" + _type + ",'pageNo':" + page + ",'pageSize':" + pageSize + "}";
                reqAjaxAsync(REQUEST_URL['warning_url'], jsonData).done(function (resData) {
                    showCardWarningList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page6").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         var jsonData = "{'shopId':"+shopID+",'accountId':"+_type+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
            //         reqAjaxAsync(REQUEST_URL['warning_url'], jsonData).done(function(resData){
            //             showCardWarningList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page6').addClass("invisible");
            // }
        });

    }

    function getPieChartDataOfmodule_7() {
        var jsonData = "{'shopId':" + shopID + ",'type':" + _type + ",'startData':'" + startTime + "', 'endData':'" + endTime + "'}";
        reqAjaxAsync(REQUEST_URL['largess_pie_url'], jsonData).done(function (res) {
            if (res.code == 1) {
                var obj = res.data, itemArr = [], dataArr = [];
                for (var i = 0; i < obj.length; i++) {
                    var oData = {};
                    oData.value = obj[i].num;
                    oData.name = obj[i].name;
                    itemArr.push(obj[i].name);
                    dataArr.push(oData);
                }
                var moduleChart_8 = echarts.init(document.getElementById('pieChart_module7'));
                moduleChart_8.setOption(pieOptionSet({'itemArr': itemArr, 'dataArr': dataArr}));
            }
        });

    }

    function getBarChartDataOfmodule_7() {
        var jsonData = "{'shopId':" + shopID + ", 'timeType':" + _type + ", 'startData':'" + startTime + "','endData':'" + endTime + "'}";
        reqAjaxAsync(REQUEST_URL['largess_bar_url'], jsonData).done(function (res) {
            if (res.code == 1) {
                var obj = res.data;
                if (obj.length > 0) {
                    var timeArr = [], numArr = [], priceArr = [];
                    for (var i = 0; i < obj.length; i++) {
                        timeArr.push(obj[i].time);
                        numArr.push(obj[i].num);
                        priceArr.push(obj[i].price);
                    }
                    var barChart_module7 = echarts.init(document.getElementById('barChart_module7'));
                    var params = {
                        'title': '赠送数量',
                        'legend': ['数量'],
                        'xAxisArr': timeArr,
                        'seriesData': [{
                            name: '数量',
                            type: 'bar',
                            barWidth: '30px',
                            data: numArr
                        }]
                    };
                    barChart_module7.setOption(barOptionSet(params));
                }
            }
        });

    }

    function showListOfmodule_7(res) {
        var sHtml = "";
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        + '<td>' + res.data[i].typeName + '</td>'
                        + '<td>' + res.data[i].num + '</td>'
                        + '<td>' + res.data[i].time + '</td>'
                        + '<td>' + res.data[i].name + '</td>'
                        + '<td>' + res.data[i].unitPrice + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="5">暂无数据</td></tr>';
            }
            $("#module7 .table-list table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    function getListDataOfmodule_7() {
        var jsonData = "{'shopId':" + shopID + ", 'timeType':" + _type + ", 'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
        reqAjaxAsync(REQUEST_URL['largess_list_url'], jsonData).done(function (resData) {
            showListOfmodule_7(resData);
            pagingInit('#page7', resData.total, 10, function (page) {
                jsonData = "{'shopId':" + shopID + ", 'timeType':" + _type + ", 'startData':'" + startTime + "','endData':'" + endTime + "','pageNo':" + page + ",'pageSize':" + pageSize + "}";
                reqAjaxAsync(REQUEST_URL['largess_list_url'], jsonData).done(function (resData) {
                    showListOfmodule_7(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page7").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         jsonData = "{'shopId':"+shopID+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
            //         reqAjaxAsync(REQUEST_URL['largess_list_url'], jsonData).done(function(resData){
            //             showListOfmodule_7(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page7').addClass("invisible");
            // }
        });

    }

    //提醒 - 销售预测列表
    function showSaleRemindList(res) {
        var sHtml = "";
        sHtml += '<thead><tr><th>会员名称</th><th>会员电话</th><th>会员卡号</th><th>注册时间</th></tr></thead><tbody>';
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        + '<td>' + res.data[i].accountName + '</td>'
                        + '<td>' + res.data[i].mobile + '</td>'
                        + '<td>' + res.data[i].cardNumber + '</td>'
                        + '<td>' + res.data[i].createTime + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        } else {
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#module8 table").html(sHtml);
    }

    //提醒 - 销售预测列表
    function getSaleRemindList() {
        var param = {
            'shopId': shopID,
            'employeeId': employeeId,
            'pageNo': pageNo,
            'pageSize': pageSize
        };

        reqAjaxAsync(REQUEST_URL['saleRemind_url'], JSON.stringify(param)).done(function (resData) {
            showSaleRemindList(resData);
            pagingInit("#page8", resData.total, 10, function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['saleRemind_url'], JSON.stringify(param)).done(function (resData) {
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
    function showBespokeRemindList(res) {
        var sHtml = "";
        sHtml += '<thead><tr><th>客户名称</th><th>客户电话</th><th>预约时间</th><th>预约服务</th></tr></thead><tbody>';
        if (res.code == 1) {
            if (res.data.length > 0) {
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<tr>'
                        + '<td>' + res.data[i].customer + '</td>'
                        + '<td>' + res.data[i].mobile + '</td>'
                        + '<td>' + res.data[i].bespokTime + '</td>'
                        + '<td>' + res.data[i].serviceName + '</td>'
                        + '</tr>';
                }
            } else {
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        } else {
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#module8 table").html(sHtml);
    }

    //提醒 - 明日预约列表
    function getBespokeRemindList() {
        var param = {
            'shopId': shopID,
            'employeeId': employeeId,
            'pageNo': pageNo,
            'pageSize': pageSize
        };

        reqAjaxAsync(REQUEST_URL['bespokeRemind_url'], JSON.stringify(param)).done(function (resData) {
            showBespokeRemindList(resData);
            pagingInit('#page8', resData.total, 10, function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['bespokeRemind_url'], JSON.stringify(param)).done(function (resData) {
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


    function init() {
        $("#module" + _module).removeClass("hide").siblings().addClass('hide');
        switch (_module) {
            case "1":
                $(".main-title .title").text("客户回访详情页");
                customerOverviewChartData();
                break;
            case "5":
                $(".main-title .title").text("新客分析详情页");
                $(".date-wrap .date-tab .year").hide();
                loadNewAccountData();
                break;
            case "6":
                $(".date-wrap").hide();
                $(".main-title .title").text("客户卡项预警详情页");
                loadCardWarningData();
                break;
            case "7":
                $(".main-title .title").text("赠送统计详情页");
                getPieChartDataOfmodule_7();
                getBarChartDataOfmodule_7();
                break;
            case "8":
                $(".date-wrap").hide();
                if (_type == 1) {
                    $(".main-title .title").text("提醒--销售预测详情页");
                    getSaleRemindList();
                } else if (_type == 2) {
                    $(".main-title .title").text("提醒--明日预约详情页");
                    getBespokeRemindList();
                }
                break;
            default:
        }
    }

    init();

    $("#module1 .chart-tab .btn").click(function () {
        $(this).addClass("active").siblings().removeClass('active');
        var _index = $(this).index();
        navType = $(this).index();
        $('.date-tab .btn-group .btn').each(function (i, v) {
            if($(v).hasClass('active')){
                timeType = $(v).attr('data-timeType');
            }
        });
        $("#module1 .show-content div.show-item:eq(" + _index + ")").removeClass("hide").siblings().addClass("hide");
        // $(".date-wrap .date-tab .month").addClass('active').siblings().removeClass('active');
        // $(".date-wrap .date-selector").addClass('hide');
        if (_index == 0) {
            $(".date-wrap .date-tab .year").show();
            customerOverviewChartData();
            initDateTime()
        } else {
            $(".date-wrap .date-tab .year").hide();
            getListDataOfmodule_1();
            initDateTime()
        }
    });

    $("#module7 .chart-tab .btn").click(function () {
        $(this).addClass("active").siblings().removeClass('active');
        var _index = $(this).index();
        navType = $(this).index();
        $("#module7 .show-content div.show-item:eq(" + _index + ")").removeClass("hide").siblings().addClass("hide");
        if (_index == 0) {
            getPieChartDataOfmodule_7();
            getBarChartDataOfmodule_7();
            initDateTime()
        } else {
            getListDataOfmodule_7();
            initDateTime()
        }
    });

    function reloadData() {
        startTime = $(".date-wrap .date-selector .start-time").val();
        endTime = $(".date-wrap .date-selector .end-time").val();
        switch (_module) {
            case "1":
                var _index = $("#module1 .chart-tab .btn.active").index();
                if (_index == 0) {
                    customerOverviewChartData();
                } else {
                    getListDataOfmodule_1();
                }

                break;
            case "5":
                //新客分析的参数时间类型为月时候，type=2
                _type = (_type == 1) ? 2 : _type;
                loadNewAccountData();
                break;
            case "7":
                var _index = $("#module7 .chart-tab .btn.active").index();
                if (_index == 0) {
                    getPieChartDataOfmodule_7();
                    getBarChartDataOfmodule_7();
                } else {
                    getListDataOfmodule_7();
                }
                break;
            case "8":
                if (_type == 1) {
                    getSaleRemindList();
                } else if (_type == 2) {
                    getBespokeRemindList();
                }
                break;
        }
    }

    $(".date-wrap .date-tab .btn").click(function () {
        if (_module == "1") {
            var module1_index = $("#module1 .chart-tab .btn.active").index();
            if (module1_index == 0) {
                timeType = $(this).index() + 2;
                if (timeType == 4) {
                    $(".datetime").val(today);
                    $(".date-wrap .date-selector").removeClass("hide");
                    startTime = $(".date-wrap .date-selector .start-time").val();
                    endTime = $(".date-wrap .date-selector .end-time").val();
                } else {
                    $(".datetime").val('');
                    $(".date-wrap .date-selector").addClass("hide");
                }
            } else {
                timeType = $(this).index();
                if (timeType == 2) {
                    $(".datetime").val(today);
                    $(".date-wrap .date-selector").removeClass("hide");
                    startTime = $(".date-wrap .date-selector .start-time").val();
                    endTime = $(".date-wrap .date-selector .end-time").val();
                } else {
                    timeType = 1;
                    $(".datetime").val('');
                    $(".date-wrap .date-selector").addClass("hide");
                }
            }

        } else {
            _type = $(this).index() + 1;
            if (_type == 3) {
                $(".datetime").val(today);
                $(".date-wrap .date-selector").removeClass("hide");
                startTime = $(".date-wrap .date-selector .start-time").val();
                endTime = $(".date-wrap .date-selector .end-time").val();
            } else {
                $(".datetime").val('');
                $(".date-wrap .date-selector").addClass("hide");
            }
        }
        reloadData();
    });

    $(".date-wrap .date-selector .btn").click(function () {
        reloadData();
    });

})(jQuery);