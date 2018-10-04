(function($){
    var REQUEST_URL = {
        'list':'shopStatistics/queryAccountSummeryDetials'
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

    //数据渲染
    function showList(res){
        var sHtml = '';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr id="'+obj[i].id+'" data-name="'+obj[i].accountName+'">'
      + '<td>'+getStringFomat(obj[i].accountName)+'</td>'
      + '<td>'+obj[i].mobile+'</td>'
      + '<td>'+obj[i].recharge+'</td>'
      + '<td>'+obj[i].principal+'</td>'
      + '<td>'+obj[i].interest+'</td>'
      + '<td>'+obj[i].sale+'</td>'
      + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>';
            }

        }else{
            layer.msg(res.msg);
        }
        $("#customerPerformance").html(sHtml);
    }

    //加载数据
    function loadCustomerList(){
        var startTime = $("#startTime").val(),
            endTime = $("#endTime").val();
        var accountName = $.trim($("#accountName").val());

        var param = {
            'merchantId':merchantId,
            'accountName':accountName,
            'startData':startTime,
            'endData':endTime,
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList
        };
        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            showList(resData);
            pagingInit('#page-selection',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
                    showList(resData);
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
            //             showList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#page-selection').addClass("invisible");
            // }
        });

    }

    $("#searchBtn").click(function() {
        loadCustomerList();
    });

    $(function() {
        loadCustomerList();
    });

    $("#customerPerformance").delegate("tr", "click", function(){

        var accountId = $(this).attr("id"),
            customerName = $(this).attr("data-name");
        if(typeof accountId != "undefined"){
            window.location.href='customerPerformanceDetail.html?accountId='+accountId
               +'&merchantId='+merchantId
               +'&customerName='+customerName;
        }

    });

    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });

})(jQuery);
