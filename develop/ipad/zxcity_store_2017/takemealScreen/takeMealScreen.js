(function($){
    var merchantId = sessionStorage.getItem("merchantId"); //商铺ID(取单列表)
    var shopId = sessionStorage.getItem("shopId"); //店铺ID(取单列表)
    var makeStatus = ""; //0-未分配 1-已分配 2-已完成 3-已交付 9-已取消(变更取单状态)
    var presaleInfoId = "";//商品或服务ID(变更取单状态)
    var presaleId = ""; //订单ID (全部取单)
    var paramInfo = '{"merchantId":"' + merchantId + '","shopId":"' + shopId + '"}';//(取单列表)
    var REQUEST_URL = {
        PERSALEINFO : 'shopOrder/findPresaleAndPresaleInfoByshopId', //(取单列表)
        INFOSTATUS : 'shopOrder/upPresaleInfoStatus', //(变更取单状态)
        ALLPRESALE : 'shopOrder/upPresaleInfoStatusByPresaleId' //(全部取单)
    }

    //取单初始化方法
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
                                            '<button class="btn allBtn">全部取单</button>' +
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
                                    sHtml += '<button type="button" class="btn gray-btn">取单</button>';
                                    break;
                                case 1:
                                    sHtml += '<button type="button" class="btn gray-btn">取单</button>';
                                    break;
                                case 2:
                                    sHtml += '<button type="button" class="btn take-btn">取单</button>';
                                    break;
                                case 3:
                                    sHtml += '<button type="button" class="btn over-btn">已取</button>';
                                    break;
                                case 9:
                                    sHtml += '<button type="button" class="btn disable-btn"></button>';
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

    //展示取单列表
    function getMeal(){
        reqAjaxAsync(REQUEST_URL.PERSALEINFO,paramInfo).done(function(res){
            if(res.code == 1){
                showMeal(res);
            }else{
                layer.msg(res.msg);
            }
        });

    }
    getMeal();
    //设置定时30s加载一次
    var ref = "";
    ref = setInterval(function(){
        getMeal();
    },30000);

    //单个取单
    $(".take-meal-lists").on("click","li .take-btn",function(){
        var _that = this;
        var presaleInfoId = $(this).parent().attr("data-id");
        $(this).parent().attr("data-makeStatus","3");
        var makeStatus = $(this).parent().attr("data-makeStatus");
        var jsonData = '{"makeStatus":'+ makeStatus + ',"presaleInfoId":' + presaleInfoId +'}';
        reqAjaxAsync(REQUEST_URL.INFOSTATUS, jsonData).done(function(res){
            var lists = $(_that).parents(".take-meal-list");
            //可制作的数量 == 餐品数量 - 取消的餐品
            var btnLen1 = lists.find(".btn").length - lists.find(".disable-btn").length;
            if(res.code == 1){
                $(_that).attr("class","btn over-btn");
                $(_that).text("已取");
                //if(lists.attr("class") != "take-meal-list actv"){
                //    lists.parents("li").remove();
                //}
                //已完成的数量
                var btnLen2 = lists.find(".over-btn").length;
                //已完成的数量 == 可制作的数量时，表示所有的餐品已取完

                if(btnLen1 == btnLen2){
                    lists.parents("li").remove();
                }
            }else{
                layer.msg(res.msg);
            }
        });


    });

    //点击全部取单
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
            layer.alert('亲，还有订单内容未完成哟', {
                icon: 1,
                skin: 'demo-class'
            })
        }else{
            reqAjaxAsync(REQUEST_URL.ALLPRESALE, jsonData).done(function(res){
                if(res.code == 1){
                    liList.eq(index).remove();
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    });

    $(".return-icon").click(function(){
        $(this).attr("href", '../index.html');
    });
})(jQuery);
