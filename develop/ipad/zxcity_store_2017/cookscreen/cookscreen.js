(function($){
    var merchantId = sessionStorage.getItem('merchantId'),
        shopId = sessionStorage.getItem('shopId'), positionId;
    //根据店铺id查询职务列表
    function getPositionListByMerchantId(){
        var jsonData = "{'merchantId':"+merchantId+"}";
        reqAjaxAsync('shopOrder/findPositionListByMerchantId', jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    sHtml += '<option value="'+obj[i].id+'">'+obj[i].positionName+'</option>';
                }
                $("#positionSelector").html(sHtml);
                init();
            }
        });

    }

    getPositionListByMerchantId();

    function init(){
        positionId = $("#positionSelector").find("option:selected").val();
        getPersonListByPositionId();
        loadOrderList();
        setTimeout(function(){
            $("#orderList .order-item").draggable({
                cursor: "move",
                revert: "invalid"
            });
            $("#todoList .todo-dishes-list").droppable({
                accept: "#orderList .order-item",
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                drop:function(event, ui){
                    var _that = this;
                    var userId = $(this).attr("data-uid"),
                        orderId = $(ui.draggable).attr("id"),
                        orderName = $(ui.draggable).find(".dishes-name").text(),
                        remark = $(ui.draggable).attr("data-remark"),
                        orderTime = $(ui.draggable).find(".order-time").attr("data-time");

                    //将订单分配给员工
                    var param = "{'userId':"+userId+", 'presaleInfoId':"+orderId+"}";
                    var cmd = "shopOrder/upPresaleInfoStatusAndWaiter";
                    reqAjaxAsync(cmd, param).done(function(resData){
                        if(resData.code == 1){
                            layer.msg("操作成功！");
                            var sHtml = '<li id="'+orderId+'" class="todo-dishes">'
                                + '<div class="dishes-info">'
                                + '<p class="name">商品名称：<span>'+orderName+'</span></p>'
                                + '<p>订单备注：<span>'+remark+'</span></p>'
                                + '<p>下单时间：<span>'+orderTime+'</span></p></div>'
                                + '<div class="handle-box">'
                                + '<a class="take-btn" href="javascript:void(0);">完成</a>'
                                + '<a class="cancel-btn" href="javascript:void(0);">取消</a>'
                                + '</div></li>';

                            $(ui.draggable).remove();
                            $(_that).find("ul").append(sHtml);
                            $(_that).parent().find(".duty-chef .count").text($(_that).find("ul li").length);
                            return;
                        }else{
                            layer.alert(resData.msg);
                        }
                    });


                }
            });
        }, 1000);

    }

    $("#positionSelector").change(function(){
        init();
    });


    //根据职务id查询人员列表
    function getPersonListByPositionId(){
        var jsonData = "{'merchantId':"+merchantId+",'shopId':"+shopId+",'positionId':"+positionId+"}";

        reqAjaxAsync('shopOrder/findBackUserListById', jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    var todoList = obj[i].scPresaleInfoList;
                    sHtml += '<dl id="'+obj[i].id+'" class="duty-item">'
                        + '<dt class="duty-chef">'
                        + '<div class="ava pull-left"><img src="'+obj[i].userImg+'" alt="'+obj[i].username+'"></div>'
                        + '<div class="name pull-left">'+obj[i].username+'</div>'
                        + '<span class="count">'+todoList.length+'</span>'
                        + '</dt><dd class="todo-dishes-list" data-uid="'+obj[i].id+'"><ul>';
                    if(todoList.length > 0){
                        for(var j=0; j<todoList.length; j++){
                            var remark = todoList[j].remark == null ? "" : todoList[j].remark,
                                consumeTime = todoList[j].consumeTime == null ? "" : todoList[j].consumeTime.substring(10);
                            sHtml += '<li id="'+todoList[j].id+'" class="todo-dishes">'
                                + '<div class="dishes-info">'
                                + '<p class="name">商品名称：<span>'+todoList[j].purchaseName+'</span></p>'
                                + '<p>订单备注：<span>'+remark+'</span></p>'
                                + '<p>下单时间：<span>'+consumeTime+'</span></p>'
                                + '</div>'
                                + '<div class="handle-box">'
                                + '<a class="take-btn" href="javascript:void(0);">完成</a>'
                                + '<a class="cancel-btn" href="javascript:void(0);">取消</a>'
                                + '</div></li>';
                        }
                    }
                    sHtml += '</ul></dd></dl>';
                }
                $("#todoList").html(sHtml);
            }
        });


    }

    //加载订单数据
    function loadOrderList(){
        var jsonData = "{'merchantId':"+merchantId+",'shopId':"+shopId+",'positionId':"+positionId+"}";

        reqAjaxAsync('shopOrder/findPresaleInfoListById', jsonData).done(function(resData){
            if(resData.code == 1){
                var obj = resData.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    var orderTime = obj[i].consumeTime == null ? "" : obj[i].consumeTime.substring(10);
                    sHtml += '<li id="'+obj[i].id+'" data-presaleId="'+obj[i].presaleId+'" data-remark="'+(obj[i].remake == null ? "" : obj[i].remake)+'" class="order-item">'
                        //+ '<span class="count">1</span>'
                        + '<p class="dishes-name">'+obj[i].purchaseName+'</p>'
                        + '<p class="order-time" data-time="'+orderTime+'">下单时间：'+orderTime+'</p>'
                        + '</li>';
                }
                $("#orderList").html(sHtml);
            }
        });

    }

    //变更订单状态
    function changeOrderStatus(presaleInfoId, status, optEl, uid){
        //0-未分配 1-已分配 2-已完成 3-已交付 9-已取消
        var param = "{'presaleInfoId':"+presaleInfoId+", 'makeStatus':"+status+"}";
        var cmd = "shopOrder/upPresaleInfoStatus";
        reqAjaxAsync(cmd,param).done(function(resData){
            if(resData.code == 1){
                layer.msg("操作成功！");

                $("#todoList").find(".duty-item[id="+uid+"]").find(".duty-chef .count").text($(optEl).parent().find("li").length -1);
                $(optEl).remove();
                return;
            }else{
                layer.alert(resData.msg);
            }
        });

    }

    $("#todoList").delegate(".todo-dishes-list .todo-dishes .take-btn", "click",function(event){
        event.stopPropagation();
        var presaleId = $(this).parents("li").attr("id");
        var toUid = $(this).parents(".todo-dishes-list").attr("data-uid");
        changeOrderStatus(presaleId, 2, $(this).parents("li"), toUid);
    }).on("click",".todo-dishes-list .todo-dishes .cancel-btn", function(event){
        event.stopPropagation();
        //取消
        var presaleId = $(this).parents("li").attr("id");
        var toUid = $(this).parents(".todo-dishes-list").attr("data-uid");
        changeOrderStatus(presaleId, 9, $(this).parents("li"), toUid);
    });
})(jQuery);
