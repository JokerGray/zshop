$(function () {
    var requireURL = {
        completedOrderList:'shopDisplayTerminal/getShopPresaleServiceList'
    };
    var merchantId = sessionStorage.getItem("merchantId"),
        shopId = sessionStorage.getItem("shopId"),
        shopName = sessionStorage.getItem('shopName'),
        pageNo = 1;
    var shopList = JSON.parse(sessionStorage.getItem("shopList"));
    // var now = new Date();
    // var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');

    //设置时间默认时间为今天
    // $(".datetime").val(today);

    //日期初始化
    function initDateTime(){
        //日期选择器初始化
        var start = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            minDate:$.nowDate({MM:-6}),
            maxDate: $.nowDate({DD:0}), //最大日期
            choosefun: function(elem, val, date){
                end.minDate = date; //开始日选好后，重置结束日的最小日期
                //end.maxDate = $.nowDate({DD:"+30"},'YYYY-MM-DD',val);
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
            //maxDate: $.nowDate({DD:+30}),
            choosefun: function(elem, val, date){
                //start.minDate = $.nowDate({DD:"-30"},'YYYY-MM-DD',val);
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

    //加载店铺列表

    function loadShopList(){
    if(shopList.length > 1){
        //将本店铺设为默认选中
        var shopArr = [{'id':shopId,'text':shopName}];
        for(var i=0; i<shopList.length; i++){
            if(shopList[i].shopId!=shopId){//避免下拉框中有重复的本店铺名称
                var temp = {
                    'id':shopList[i].shopId,
                    'text':shopList[i].shopName
                };
                shopArr.push(temp);
            }
        }
        //$("#shopSelector").html(sHtml);
        $('#shopName').select2({
            data:shopArr
        });
        if(shopArr.length<=1){
            $('#shopName').attr("disabled","disabled")
        }
        $("#shopName").removeClass("invisible");
    }
}

    //获取完成工单列表
    function getCompletedOrderList() {
        var params = {
            "merchantId":merchantId,
            "shopId": $('#shopName').val(),
            "waiterName": $.trim($('#staffName').val())||'',
            "phone": $.trim($('#phoneNum').val())||'',
            "startTime": $('#startTime').val(),
            "endTime": $('#endTime').val(),
            "serviceName": $.trim($('#serviceName').val())||'',
            "pageNo":pageNo,
            "pageSize":10
        };
        var url = requireURL['completedOrderList'];
        reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
            if(res.code!=1){
                layer.msg(res.msg);
                return;
            }
            if(res.data.length==0){
                $('#storePerformance').html('<td colspan="7" style="text-align: center;padding: 10px;">暂无数据！</td>');
            }else{
                var html = template('completedList',res);
                $('#storePerformance').html(html);
            }

            //初始化分页器
            $('#page-selection').html('');
            if(res.total>=10){//小于一页时不显示分页
                var p = new Paging();
                p.init({
                    target:'#page-selection',
                    pagesize:10,
                    count:res.total,
                    prevTpl:'<<',
                    nextTpl:'>>',
                    callback:function (page, size, count) {
                        params['pageNo'] = page;
                        reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                            if(res.code!=1){
                                layer.msg(res.msg);
                                return;
                            }
                            var html = template('completedList',res);
                            $('#storePerformance').html(html);
                        })
                    }
                });
            }
        })
    }

    // 搜索已完成工单
    $('#searchBtn1').on('click',function(){
        getCompletedOrderList();
    });

    //初始化页面
    init();
    function init() {
        loadShopList();
        getCompletedOrderList();
        initDateTime();
    }

    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });
});