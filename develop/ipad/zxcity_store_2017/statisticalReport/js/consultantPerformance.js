(function($){
    var REQUEST_URL = {
        'adviser':'shopStatistics/queryAdviserSummeryDetials'//技师业绩-列表
    };
    var merchantId = sessionStorage.getItem("merchantId");
    var pageNo = 1, pageSize = 10;
    //2017.12.15添加开始
    var shopList = JSON.parse(sessionStorage.getItem('shopList'));
    //2017.12.15添加结束

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
    //技师数据渲染
    function showAdviserList(res){
        var sHtml = '';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr data-salesmanId="'+obj[i].salesmanId+'" data-salesman="'+obj[i].salesman+'">'
                          + '<td>'+getStringFomat(obj[i].salesman)+'</td>'
                          + '<td>'+obj[i].shopName+'</td>'
                          + '<td>'+obj[i].salePrice+'</td>'
                          + '<td>'+obj[i].saleNum+'</td>'
                          + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        $("#consultantPerformance").html(sHtml);
    }

    //技师
    function getAdviserList(){
        var startTime = $("#startTime").val(),
            endTime = $("#endTime").val();
        var adviserName = $.trim($("#adviserName").val());
        var param = {
            'merchantId':merchantId,
            'summaryType':1,//{1:顾问},{2:技师}
            'adviserName':adviserName,
            'startData':startTime,
            'endData':endTime,
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList//2017.12.15添加
        };

        reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
            showAdviserList(resData);
            pagingInit('#page-selection',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
                    showAdviserList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#page-selection").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
            //             showAdviserList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $("#page-selection").addClass("invisible");
            // }
        });

    }

    $(function(){
        getAdviserList();
    });

    $("#searchBtn").click(function() {
        getAdviserList();
    });

    $("#consultantPerformance").delegate("tr","click", function(){
        var salesmanId = $(this).attr("data-salesmanId"),
            salesman = $(this).attr("data-salesman");
        if(typeof salesmanId != "undefined"){
            window.location.href='consultantPerformanceDetail.html?salesmanId='
                +salesmanId
                +'&merchantId='+merchantId
                +'&salesman='+ salesman
                +'&mType='+1 ;
        }

    });


    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });


})(jQuery);
