(function($){
    var REQUEST_URL = {
        'list': 'shopStatistics/queryConsumeDetials'
    };
    var merchantId = sessionStorage.getItem("merchantId");

    //2017.12.15添加开始
    var shopList = JSON.parse(sessionStorage.getItem('shopList'));
    //2017.12.15添加结束

    var pageNo = 1, pageSize = 10;
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
    //设置时间默认时间为今天
    $(".datetime").val(today);

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
    //     $(".start-time").datetimepicker('setEndDate', endTime);
    //     $(".end-time").datetimepicker('setStartDate', startTime);
    //
    // }).on('changeDate', function(ev){
    //     var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
    //     var evClassName = ev.target.className;
    //     //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
    //     if(evClassName.search('start-time') > -1){
    //         $(".end-time").datetimepicker('setStartDate', _time);
    //     }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
    //     else if(evClassName.search('end-time') > -1){
    //         $(".start-time").datetimepicker('setEndDate', _time);
    //     }
    // });

    function fillList(resData) {
        var sHtml = "";
        if (resData.code == 1) {
            if (resData.total > 0) {
                var obj = resData.data;
                for (var i = 0; i < obj.length; i++) {
                    sHtml += '<tr>';
                    sHtml += '<td>' + obj[i].shopName + '</td>';
                    sHtml += '<td>' + obj[i].goodsName + '</td>';
                    sHtml += '<td>'+ obj[i].goodsNum +'</td>';
                    sHtml += '<td>'+ obj[i].accountName +'</td>';
                    sHtml += '<td>' + obj[i].waiterName + '</td>';
                    sHtml += '<td>' + obj[i].consumeTime + '</td>';
                    sHtml += '</tr>';
                }
            } else {
                sHtml = '<tr><td colspan="6">暂无数据</td></tr>';
            }

        } else {
            layer.alert(resData.msg);
        }
        $("#consumptionDetails").html(sHtml);
    }


    function getList(){
        var start = $("#startTime").val();
        var end = $("#endTime").val();
        var sName = $.trim($("#serviceName").val());
        var param = {
            'merchantId':merchantId,
            'goodsName':sName,
            'startData':start,
            'endData':end,
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList
        };

        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            fillList(resData);
            pagingInit('#page-selection',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
                    fillList(resData);
                });
            })
            // if(resData.total > 0){
            //     $('#page-selection').bootpag({
            //         total : Math.ceil(resData.total / 10),
            //         page : 1,
            //         leaps: false,
            //         maxVisible : 10
            //     }).on("page", function(event, num) {
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            //             fillList(resData);
            //         });
            //     }).removeClass("invisible");
            // }else{
            //     $('#page-selection').addClass("invisible");
            // }
        });
    }

    $(function(){
        getList();
    });

    $("#searchBtn").click(function(){
        getList();
    });

    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });
})(jQuery);
