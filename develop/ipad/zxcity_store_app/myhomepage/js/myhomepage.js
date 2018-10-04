(function($){
var REQUEST_URL = {
    M_1: 'shopStatistics/myHomePageAccountVisit', //客户回访
    //M_2: 'shop/myHomePagePresales',//今日预售
    M_3: 'shopStatistics/myHomePageAch',//我的消耗销售业绩
    M_4: 'shopStatistics/myHomePageNewAccount', //新客分析
    M_5: 'shopStatistics/myHomePageLargess',//赠送统计
    M_6: 'shopStatistics/myHomePageWarning', //卡项预警
    M_7: '',
    M_8: ''
}

var shopId = sessionStorage.getItem("shopId"),
    merchantId = sessionStorage.getItem("merchantId"),
    employeeId = sessionStorage.getItem("backUserId"),
    employeeName = sessionStorage.getItem("username");
var param_1 = "{'shopId':"+shopId+"}",
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
            top: '3%',
            left: '5%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer:{
                type: 'shadow'
            }

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
    }
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
            orient: 'vertical',
            x: 'left',
            selectedMode: false,
            data: params.legendArr
        },
        series: [
            {
                name: params.title,
                type:'pie',
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
    var res = reqAjax(REQUEST_URL.M_1, param_1);
    if(res.code == 1){
        $("#oneMonthCome").html(res.data.oneMonthCome);
        $("#oneMonthRegister").html(res.data.oneMonthRegister);
        $("#twoMonthNotCome").html(res.data.twoMonthNotCome);
        $("#twoMonthNotCommunicatee").html(res.data.twoMonthNotCommunicatee);
    }
}
//今日预售
var presales = function(){
    var res = reqAjax(REQUEST_URL.M_2, param_1);
    if(res.code == 1){
        $("#presalesNum").html(res.data.num);
        $("#imprest").html(res.data.imprest);
    }
}
//我的消耗销售业绩
var myHomePageAch = function(){
    var res = reqAjax(REQUEST_URL.M_3, param_2);
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
}
//新客分析
var newAccount = function(){
    var res = reqAjax(REQUEST_URL.M_4, param_1);
    if(res.code == 1){
        $("#todayRegister").html(res.data.todayRegister);
        $("#monthRegister").html(res.data.monthRegister);

        var newCustomerParams = {'legendArr':['今日新客人数','本月新客总数'],'title':'新客分析','data':[{value:res.data.todayRegister, name:'今日新客人数'},{value:res.data.monthRegister, name:'本月新客总数'}]};
        newCustomerChart.setOption(radiusOptionSet(newCustomerParams));
    }

}
//卡项预警
var cardWarning = function(){
    var res = reqAjax(REQUEST_URL.M_6, param_1);
    if(res.code == 1){
        var obj = res.data, sHtml = '';
        for(var i=0, len=obj.length; i<len; i++){
            if(i%2 == 0){
                sHtml += '<div class="small-6 columns">'
            }
            sHtml += '<div class="item" data-accountId="'+obj[i].accountId+'">'
                + '<p class="sub-title"><a href="javascript:void(0);">'+obj[i].account_name+'</a></p>'
                + '<span class="color-grey count-num">'+obj[i].totelSos+'</span>'
                + '</div>'
            if(i%2 == 1){
                sHtml += '</div>';
            }
        }
        $(".module-6 .module-con").html(sHtml);

        // $(".module-6 .module-con").delegate(".item .sub-title a", 'click', function(){
        //     window.parent.location.href="../../customerManagement/html/customerOverview.html?accountId="+$(this).parents('.item').attr("data-accountId");
        // });

    }
}

//赠送统计
var myHomePageLargess = function(){
    var res = reqAjax(REQUEST_URL.M_5, param_1);
    if(res.code == 1){
        $("#todayLargess").html(res.data.todayLargess);
        $("#monthLargess").html(res.data.monthLargess);

        var sendCountParams = {'legendArr':['今日赠送','本月赠送总数'],'title':'赠送统计','data':[{value:res.data.todayLargess, name:'今日赠送'},{value:res.data.monthLargess, name:'本月赠送总数'}]};
        sendCountChart.setOption(radiusOptionSet(sendCountParams));
    }
}

$(function(){
     accountVisit();
    // presales();
     myHomePageAch();
     newAccount();
     myHomePageLargess();
     cardWarning();
});


function showChart(param){
    if(param.type){
        window.location.href = './myhomepage/myHomeDetail.html?module='+param.module+'&type='+param.type;
    }else{
        window.location.href = './myhomepage/myHomeDetail.html?module='+param.module;
    }
}

//客户回访
$(".module-1 .item .count-num").click(function(){
    var tit = $(this).siblings('.sub-title').text();
    var param = {'title':tit,'module':1, 'type':$(this).attr("data-type")}
    showChart(param);
});
//今日预售
$(".module-2 .item .count-num").click(function(){
    var tit = $(this).parents(".item").find('.sub-title').text();
    var param = {'title':tit,'module':2, 'type':$(this).attr("data-type")}
    showChart(param);
});
//新客分析
$(".module-5 .item .count-num").click(function(){
    var tit = $(this).siblings('.sub-title').text();
    var param = {'title':tit,'module':5, 'type':$(this).attr("data-type")}
    showChart(param);
});
//客户卡项预警
$(".module-6").delegate(".item .count-num", "click", function(){
    var tit = $(this).siblings('.sub-title').text();
    var param = {'title':tit,'module':6, 'type':$(this).parent(".item").attr("data-accountId")};
    showChart(param);
});
//赠送统计
$(".module-7 .item .count-num").click(function(){
    var tit = $(this).siblings('.sub-title').text();
    var param = {'title':tit,'module':8, 'type':$(this).attr("data-type")}
    showChart(param);
});


})(jQuery);
