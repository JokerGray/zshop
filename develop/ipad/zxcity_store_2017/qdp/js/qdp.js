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
    };
    var _timer = null;

    //取单初始化方法
    function showMeal(res){
        var sHtml = '';
        if(res.code == 1){
            if(res.data.length > 0){
                var obj = res.data;
                for(var i=0; i<obj.length; i++){
                    var orderList = obj[i].scPresaleInfoList;
                    var orderTime = obj[i].consumeTime.substring(11);
                    sHtml += '<li data-orderId="'+obj[i].id+'"><div class="inner-box">'
                        + '<span class="count-num">'+orderList.length+'</span>'
                        + '<div class="detail-container">'
                        + '<div class="top-info">'
                        + '<div class="left order-info">'
                        + '<p class="order-num">订单编号：<span>'+obj[i].id+'</span></p>'
                        + '<p class="order-time">下单时间：<span>'+orderTime+'</span></p>'
                        + '</div>'
                        + '<button type="button" class="btn take-all-btn">全部取单</button>'
                        + '</div><div class="order-list">';
                    if(orderList.length > 0){
                        for(var j=0; j<orderList.length; j++){
                            sHtml += '<div class="order-item" data-id="'+orderList[j].id+'">'
                                + '<div class="name">'+orderList[j].purchaseName+'</div>';
                            switch(orderList[j].makeStatus)
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
                    sHtml += '</div></div></div></li>';
                }

                $(".take-list").html(sHtml);
            }else{
                $(".take-list").html('<li class="nodata"><img src="image/nodata.jpg"></li>');
            }

        }else{
            layer.msg(res.msg);
        }
    }

    //展示取单列表
    function getMeal(){
        //console.log(new Date().getTime());
        reqAjaxAsync(REQUEST_URL.PERSALEINFO,paramInfo).done(function(res){
            if(res.code == 1){
                showMeal(res);
            }else{
                layer.msg(res.msg);
            }
        });

    }

    //设置定时30s加载一次
    function refresh(){
        _timer = setInterval(function(){
            getMeal();
        }, 10000);
    }

    //单个取单
    $(".take-list").on("click","li .take-btn",function(){
        //清除定时器
        _timer = null;
        clearInterval(_timer);

        var _that = this;
        var presaleInfoId = $(this).parent().attr("data-id");
        $(this).parent().attr("data-makeStatus","3");
        var makeStatus = $(this).parent().attr("data-makeStatus");
        var jsonData = '{"makeStatus":'+ makeStatus + ',"presaleInfoId":' + presaleInfoId +'}';
        reqAjaxAsync(REQUEST_URL.INFOSTATUS, jsonData).done(function(res){
            var lists = $(_that).parents(".order-list");
            //可制作的数量 == 餐品数量 - 取消的餐品
            var btnLen1 = lists.find(".btn").length - lists.find(".disable-btn").length;
            if(res.code == 1){
                $(_that).attr("class","btn over-btn");
                $(_that).text("已取");
                //if(lists.attr("class") != "order-list actv"){
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
            //启动定时器
            refresh();
        });


    });

    //点击全部取单
    $(".take-list").delegate("li .take-all-btn","click",function(){
        //清除定时器
        _timer = null;
        clearInterval(_timer);

        var index = $(this).parents("li").index();//获取点击按钮的索引
        var btnBody = $(".order-list");
        var liList = $(".take-list li");
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
            });
            refresh();
        }else{
            reqAjaxAsync(REQUEST_URL.ALLPRESALE, jsonData).done(function(res){
                if(res.code == 1){
                    liList.eq(index).remove();
                }else{
                    layer.msg(res.msg);
                }
                refresh();
            });
        }
    });

    function doLogin(){

        layer.open({
            type: 2,
            title: false,
            scrollbar: false,
            area: ['70%', '70%'], //宽高
            shadeClose: false, //开启遮罩关闭
            closeBtn:0,
            content: ['../login/login.html', 'no'],
            success:function(index, layero){
            }
        });
    }

    $(".return-icon").click(function(){
        $(this).attr("href", '../index.html');
    });

    $(".main-top .exit-btn").click(function(){
        sessionStorage.clear();
        window.location.reload();
    });

    $(function(){

        if(merchantId == null || shopId == null){
            doLogin();
        }else{
            var referrer = document.referrer;
            var hrefUrl = window.location.href;
            if(referrer == hrefUrl){
                $(".main-top .return-icon").addClass("invisible");
                $(".main-top .exit-btn").removeClass("invisible");
            }else{
                $(".main-top .return-icon").removeClass("invisible");
                $(".main-top .exit-btn").addClass("invisible");
            }
            getMeal();
            refresh();
        }

    });

})(jQuery);
