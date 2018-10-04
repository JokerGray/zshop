(function($){
    var REQUEST_URL = {
        M_1: 'shopStatistics/myHomePageAccountVisit', //客户回访
        M_3: 'shopStatistics/myHomePageAch',//我的消耗销售业绩
        M_4: 'shopStatistics/myHomePageNewAccount', //新客分析
        M_5: 'shopStatistics/myHomePageLargess',//赠送统计
        M_6: 'shopStatistics/myHomePageWarning', //卡项预警
        M_7: 'shopStatistics/myHomePageRemind'//提醒
    };

    var shopID = sessionStorage.getItem("shopId"),
        merchantId = sessionStorage.getItem("merchantId"),
        employeeId = sessionStorage.getItem("backUserId"),
        employeeName = sessionStorage.getItem("username");
    var param_1 = "{'shopId':"+shopID+"}",
        param_2 = "{'employeeId':"+employeeId+"}";

    //销售报表
    var salesChart = echarts.init(document.getElementById('salesChart'));
    //消耗报表
    var consumptionChart = echarts.init(document.getElementById('consumptionChart'));
    //新客分析报表
    var newCustomerChart = echarts.init(document.getElementById('newCustomerChart'));
    //赠送统计报表
    var sendCountChart = echarts.init(document.getElementById('sendCountChart'));

    //柱形图参数设置
    function barOptionSet(params){
        var option = {
            grid: {
                left: '10%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer:{
                    type: 'shadow'
                }

            },
            legend:{
                selectedMode: false,
            },
            xAxis: {
                axisTick: {
                    alignWithLabel: true
                },
                data: params.date
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '金额',
                type: 'bar',
                barWidth : '20px',
                data: params.num
            }]
        };
        return option;
    }

    //环形图设置
    function radiusOptionSet(params){
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                selectedMode: false,
                orient: 'vertical',
                x: 'left',
                data: params.legendArr
            },
            series: [
                {
                    name: params.title,
                    type:'pie',
                    center:['55%', '58%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    color:['#fe6869', '#bbb'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:params.data
                }
            ]
        };
        return option;
    }

    //数据初始化接口调用
    //客户回访
    var accountVisit = function(){
        reqAjaxAsync(REQUEST_URL.M_1, param_1).done(function(res){
            if(res.code == 1){
                $("#oneMonthCome").html(res.data.oneMonthCome);
                $("#oneMonthRegister").html(res.data.oneMonthRegister);
                $("#twoMonthNotCome").html(res.data.twoMonthNotCome);
                $("#twoMonthNotCommunicatee").html(res.data.twoMonthNotCommunicatee);
            }
        });

    };
    //今日预售
    var presales = function(){
        reqAjaxAsync(REQUEST_URL.M_2, param_1).done(function(res){
            if(res.code == 1){
                $("#presalesNum").html(res.data.num);
                $("#imprest").html(res.data.imprest);
            }
        });
    };
    //我的消耗销售业绩
    var myHomePageAch = function(){
        reqAjaxAsync(REQUEST_URL.M_3, param_2).done(function(res){
            if(res.code == 1){
                var obj = res.data;
                var dateArr = [], salesArr = [], consumeArr = [];
                for(var i=0, len = obj.length; i<len; i++){
                    dateArr.push(obj[i].time);
                    salesArr.push(obj[i].salePrice);
                    consumeArr.push(obj[i].consumePrice);
                }
                salesChart.setOption(barOptionSet({'date':dateArr, 'num':salesArr}));
                consumptionChart.setOption(barOptionSet({'date':dateArr, 'num':consumeArr}));
            }
        });
    };
    //新客分析
    var newAccount = function(){
        reqAjaxAsync(REQUEST_URL.M_4, param_1).done(function(res){
            if(res.code == 1){
                $("#todayRegister").html(res.data.todayRegister);
                $("#monthRegister").html(res.data.monthRegister);

                var newCustomerParams = {'legendArr':['今日新客人数','本月新客人数'],'title':'新客分析','data':[{value:res.data.todayRegister, name:'今日新客人数'},{value:res.data.monthRegister-res.data.todayRegister, name:'本月新客人数'}]};
                newCustomerChart.setOption(radiusOptionSet(newCustomerParams));
            }
        });
    };
    //卡项预警
    var cardWarning = function(){
        reqAjaxAsync(REQUEST_URL.M_6, param_1).done(function(res){
            if(res.code == 1){
                var obj = res.data, sHtml = '';
                for(var i=0, len=obj.length; i<len; i++){
                    if(i%2 == 0){
                        sHtml += '<div class="small-6 columns">';
                    }
                    sHtml += '<div class="item" data-accountId="'+obj[i].accountId+'">'
                    + '<p class="sub-title"><a href="javascript:void(0);">'+obj[i].account_name+'</a></p>'
                    + '<span class="color-grey count-num">'+obj[i].totelSos+'</span>'
                    + '</div>';
                    if(i%2 == 1){
                        sHtml += '</div>';
                    }
                }
                $(".module-6 .module-con").html(sHtml);

                $(".module-6 .module-con").delegate(".item .sub-title a", 'click', function(){
                    // window.parent.location.href="../customerManagement/html/customerSubPage.html?accountId="+$(this).parents('.item').attr("data-accountId");
                    var param = {'module':6, 'type':$(this).parent().parent(".item").attr("data-accountId")};
                    showChart(param);
                    sessionStorage.setItem("prevPage", 1);
                });
            }
        });

    };

    //赠送统计
    var myHomePageLargess = function(){
        reqAjaxAsync(REQUEST_URL.M_5, param_1).done(function(res){
            if(res.code == 1){
                $("#todayLargess").html(res.data.todayLargess);
                $("#monthLargess").html(res.data.monthLargess);

                var sendCountParams = {'legendArr':['今日赠送','本月已赠送'],'title':'赠送统计','data':[{value:res.data.todayLargess, name:'今日赠送'},{value:res.data.monthLargess-res.data.todayLargess, name:'本月已赠送'}]};
                sendCountChart.setOption(radiusOptionSet(sendCountParams));
            }
        });

    };

    function remind(){
        var param = {'shopId':shopID,'employeeId':employeeId};
        reqAjaxAsync(REQUEST_URL.M_7,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#saleRemindNum").text(res.data.remindNum);
                $("#bespokeRemindNum").text(res.data.bespokeNum);
            }
        });
    }

    $(function(){
        accountVisit();
        myHomePageAch();
        newAccount();
        myHomePageLargess();
        cardWarning();
        remind();
    });


    function showChart(param){
        if(param.type){
            window.parent.location.href = 'myHomeDetail.html?module='+param.module+'&type='+param.type;
        }else{
            window.parent.location.href = 'myHomeDetail.html?module='+param.module;
        }
    }

    $(".module-1 .item .count-num").click(function(){
        var param = {'module':1, 'type':$(this).attr("data-type")};
        showChart(param);
    });
    $(".module-2 .item .count-num").click(function(){
        var param = {'module':2, 'type':$(this).attr("data-type")};
        showChart(param);
    });
    $(".module-5 .item .count-num").click(function(){
        var param = {'module':5, 'type':$(this).attr("data-type")};
        showChart(param);
    });
    $(".module-6").delegate(".item .count-num", "click", function(){
        var param = {'module':6, 'type':$(this).parent(".item").attr("data-accountId")};
        showChart(param);
    });
    $(".module-7 .item .count-num").click(function(){
        var param = {'module':7, 'type':$(this).attr("data-type")};
        showChart(param);
    });
    $("#saleRemindNum, #bespokeRemindNum").click(function(){
        var param = {'module':8, 'type':$(this).attr("data-type")};
        showChart(param);
    });


    $(".module-3 .module-title a, .module-4 .module-title a").click(function(){
        sessionStorage.setItem("prevPage", 1);
        window.parent.location.href = "../statisticalReport/html/consultantPerformanceDetail.html?salesmanId="+employeeId+"&merchantId="+merchantId+"&salesman="+employeeName+"&mType="+$(this).attr("data-type");
    });

})(jQuery);
