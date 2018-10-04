(function($){
    var merchantId = sessionStorage.getItem("merchantId"); //商铺ID(取餐列表)
    var shopId = sessionStorage.getItem("shopId"); //店铺ID(取餐列表)
    var makeStatus = ""; //0-未分配 1-已分配 2-已完成 3-已交付 9-已取消(变更取餐状态)
    var presaleInfoId = "";//商品或服务ID(变更取餐状态)
    var presaleId = ""; //订单ID (全部取餐)
    var paramInfo = '{"merchantId":"' + merchantId + '","shopId":"' + shopId + '"}';//(取餐列表)
    var REQUEST_URL = {
        PERSALEINFO : 'shopOrder/findPresaleAndPresaleInfoByshopId', //(取餐列表)
        INFOSTATUS : 'shopOrder/upPresaleInfoStatus', //(变更取餐状态)
        ALLPRESALE : 'shopOrder/upPresaleInfoStatusByPresaleId' //(全部取餐)
    }

    //取餐初始化方法
    function showMeal(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0; i<res.data.length; i++){
                    var row = res.data[i];
                    sHtml += '<li data-orderId = "' + row.id + '">' +
                              '<span class="take-meal-num">' + row.scPresaleInfoList.length + '</span>' +
                              '<div class="take-meal-container">'  +
                                    '<div class="take-meal-head">' +
                                        '<div class="take-meal-order">订单号：' +
                                            '<span>' + row.id + '</span>' +
                                        '</div>' +
                                        '<div class="take-meal-time">' +
                                            '<div class="take-time-wrapper">下单时间：' +
                                                '<span>' + row.consumeTime + '</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="take-meal-btn">' +
                                            '<button class="btn allBtn">全部取餐</button>' +
                                        '</div>' +
                                     '</div>' +
                              '<div class="take-meal-list">';
                    if(row.scPresaleInfoList.length>0){
                        for(var j = 0;j < row.scPresaleInfoList.length;j++){
                            var obj = row.scPresaleInfoList[j];
                            sHtml += '<div class="take-meal-info" data-id="' + obj.id + '">' +
                            '<div class="meal-info-name">' + obj.purchaseName + '</div>' ;
                            switch(obj.makeStatus)
                            {
                                case 0:
                                    sHtml += '<button class="btn gray-btn">取餐</button>';
                                    break;
                                case 1:
                                    sHtml += '<button class="btn gray-btn">取餐</button>';
                                    break;
                                case 2:
                                    sHtml += '<button class="btn take-btn">取餐</button>';
                                    break;
                                case 3:
                                    sHtml += '<button class="btn over-btn">已取</button>';
                                    break;
                                case 9:
                                    sHtml += '<button class="btn disable-btn"></button>';
                            }
                            sHtml += '</div>';
                        }
                    }
                    sHtml += '</div>' +
                            '</div>' +
                            '<div class="hr"></div>' +
                        '</li>';
                }
                $(".take-meal-lists").html(sHtml);
            }
        }else{
            layer.msg(res.msg);
        }
    }

    //展示取餐列表
    function getMeal(){
        var res = reqAjax(REQUEST_URL.PERSALEINFO,paramInfo);
        if(res.code == 1){
            showMeal(res);
        }else{
            layer.msg(res.msg);
        }
    }
    getMeal();
    //设置定时30s加载一次
    var ref = "";
    ref = setInterval(function(){
        getMeal();
    },30000);

    //单个取餐
    $(".take-meal-lists").on("click","li .take-btn",function(){
        var presaleInfoId = $(this).parent().attr("data-id");
        $(this).parent().attr("data-makeStatus","3");
        var makeStatus = $(this).parent().attr("data-makeStatus");
        var jsonData = '{"makeStatus":'+ makeStatus + ',"presaleInfoId":' + presaleInfoId +'}';
        var res = reqAjax(REQUEST_URL.INFOSTATUS, jsonData);
        var lists = $(this).parents(".take-meal-list");
        lists.find(".btn").each(function(){
            var classList = $(this).attr("class");
            if(classList == "btn gray-btn"){
                lists.addClass("actv");
            }
        });
        if(res.code == 1){
            $(this).attr("class","btn over-btn");
            $(this).text("已取");
            if(lists.attr("class") != "take-meal-list actv"){
                lists.parents("li").remove();
            }
        }else{
            layer.msg(res.msg);
        }
    });

    //点击全部取餐
    $(".take-meal-lists").delegate("li .allBtn","click",function(){
        var index = $(this).parents("li").index();//获取点击按钮的索引
        var btnBody = $(".take-meal-list");
        var liList = $(".take-meal-lists li");
        var ordderId = $(this).parents("li").attr("data-orderId");//订单id
        var jsonData = '{"presaleId":"' + ordderId + '"}';
        btnBody.eq(index).find(".btn").each(function(){
            var classList = $(this).attr("class");
            if(classList == "btn gray-btn"){
                liList.eq(index).addClass("noactv");
            }
        });
        var classList = liList.eq(index).attr("class");
       if(classList == "noactv"){
            layer.alert('还有餐未做好哟', {
                icon: 1,
                skin: 'demo-class'
            })
        }else{
            var res = reqAjax(REQUEST_URL.ALLPRESALE, jsonData);
            if(res.code == 1){
                liList.eq(index).remove();
            }else{
                layer.msg(res.msg);
            }
        }
    });
})(jQuery);
