(function($){
    var REQUEST_URL = {
        'total':'shopStatistics/selectManageTotalData',//商铺总额
        'list':'shopStatistics/selectManageTotalDataDetials',//列表
        'saleInfo':'shopStatistics/getManageShopSaleInfo'//查询指定门店销售情况
    };
    var merchantId = sessionStorage.getItem("merchantId"), shopId = sessionStorage.getItem("shopId");
    var shopList = JSON.parse(sessionStorage.getItem("shopList"));
    var pageNo = 1, pageSize = 10;

    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');

    function loadShopList(){
        if(shopList.length > 0){

            var shopArr = [];
            if(shopList.length > 1){
                shopArr.push({'id':'','text':'全部门店'});
            }
            for(var i=0; i<shopList.length; i++){
                var temp = {
                    'id':shopList[i].shopId,
                    'text':shopList[i].shopName
                };
                shopArr.push(temp);
            }
            //$("#shopSelector").html(sHtml);
            $('#shopSelector').select2({
                data:shopArr
            });
            if(shopArr.length<=1){
                $('#shopSelector').attr("disabled","disabled");
            }
            //$("#shopSelector").removeClass("invisible");
        }

    }
    //设置时间默认时间为今天
    $(".datetime").val(today);

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
    initDateTime();

    //渲染数据
    function showListData(res){
        var sHtml = '';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr id="'+obj[i].shopId+'">'
      + '<td>'+obj[i].shopName+'</td>'
      + '<td>'+obj[i].consumePrice+'</td>'
      + '<td>'+obj[i].consumeNum+'</td>'
      + '<td>'+obj[i].salePrice+'</td>'
      + '<td>'+obj[i].saleNum+'</td>'
      + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="5">暂无数据</td></tr>';
            }

        }else{
            layer.msg(res.data);
        }
        $("#storePerformance").html(sHtml);
    }
    $("#storePerformance").delegate("tr", "click", function(){
        if(typeof $(this).attr("id") != "undefined"){
            sessionStorage.setItem("prevPage", 11);
            window.location.href = "storePerformanceDetails.html?shopID="
     + $(this).attr("id") + "&shopName="
     + $(this).children(":first").text();
        }

    });

    //加载列表数据
    function loadListData(){
        var startTime = $("#startTime").val(),
            endTime = $("#endTime").val();
        var param = {
            'startData':startTime,
            'endData':endTime,
            'pageNo':pageNo,
            'pageSize':pageSize
        };
        if($("#shopSelector").hasClass("invisible")){
            param['shopList'] = [{'shopId':shopId}];
        }else{
            if("" == $("#shopSelector").val()){
                param['shopList'] = shopList;
            }else{
                param['shopList'] = [{'shopId':$("#shopSelector").val()}];
            }
        }
        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            showListData(resData);
            pagingInit('#page-selection',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
                    showListData(resData);
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
            //             showListData(resData);
            //         });
            //     }).removeClass("invisible");
            // }else{
            //     $('#page-selection').addClass("invisible");
            // }
        });

    }

    //总额
    function getTotal(){
        var startTime = $("#startTime").val(),
            endTime = $("#endTime").val();
        var param = {
            'startData':startTime,
            'endData':endTime
        };
        if($("#shopSelector").hasClass("invisible")){
            param['shopList'] = [{'shopId':shopId}];
        }else{
            if("" == $("#shopSelector").val()){
                param['shopList'] = shopList;
            }else{
                param['shopList'] = [{'shopId':$("#shopSelector").val()}];
            }

        }

        reqAjaxAsync(REQUEST_URL['total'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $(".consumetotal .total").text(res.data.consumePrice);
                $(".salestotal .total").text(res.data.salePrice);
            }else{
                layer.msg(res.msg);
            }
        });

    }

    function getShopSaleInfo(){
        var shopId = $("#shopSelector").val();
        var param = {
            'shopId':shopId,
            'startData':$("#startTime2").val(),
            'endData':$("#endTime2").val()
        };
        reqAjaxAsync(REQUEST_URL['saleInfo'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#xseNum").text("￥"+res.data.salePrice);
                $("#xheNum").text("￥"+res.data.consumePrice);
                $("#czjeNum").text("￥"+res.data.rechargePrice);
                $("#xkrhNum").text(res.data.addAccount);
                $("#czrcNum").text(res.data.rechargeNum);
                $("#xbhyNum").text(res.data.keepRechargeNum);
                $("#ddslNum").text(res.data.ordersNum);
                $("#yyrcNum").text(res.data.bespokeNum);
                if(res.data.maxOrder.accountName == ""){
                    $("#zddbxfNum").text(0);
                }else{
                    $("#zddbxfNum").html(res.data.maxOrder.accountName+"<br>￥"+res.data.maxOrder.price);
                }

                $("#ddrcNum").text(res.data.accountCome);
                $("#zszjzNum").text("￥"+res.data.largessInfo.price);
            }
        });
    }


    $("#shopSelector").change(function(){
        $(".datetime").val(today);
        if("" == $(this).val()){
            $(".all-store").removeClass("hide").siblings().addClass("hide");
            getTotal();
            loadListData();
        }else{
            $(".single-store").removeClass("hide").siblings().addClass("hide");
            getShopSaleInfo();
        }

    });

    $("#searchBtn2").click(function(){
        getShopSaleInfo();
    });

    $(".consumetotal").click(function() {
        window.location.href = "storePerformanceTotalDetails.html";
    });

    $(".salestotal").click(function() {
        window.location.href = "storePerformanceTotalDetails.html";
    });

    $(function(){
        loadShopList();
        getTotal();
        loadListData();
    });

    $("#searchBtn1").click(function(){
        getTotal();
        loadListData();
    });

    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });
})(jQuery);
