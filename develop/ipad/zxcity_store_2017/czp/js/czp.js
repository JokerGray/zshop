(function($){
    var REQUEST_URL = {
        'position_list':'shopOrder/findPositionListByMerchantId',//查询商铺下的岗位
        'p_list':'shopOrder/findUsedPositionListByMerchantId',//查询店铺使用的岗位
        'order_allocation':'shopOrder/upPresaleInfoStatusAndWaiter',//将订单分配给员工
        'user_list':'shopOrder/findBackUserListById',//根据职务id查询人员列表
        'order_list':'shopOrder/findPresaleInfoListById',//加载订单数据
        'order_change':'shopOrder/upPresaleInfoStatus'//变更订单状态
    };

    var merchantId = sessionStorage.getItem('merchantId'),
        shopId = sessionStorage.getItem('shopId'),
        positionId;
    var _timer = null;

    //根据店铺id查询职务列表
    function getPositionListByMerchantId(){
        var param = {
            'merchantId': merchantId,
            'shopId': sessionStorage.getItem('shopId')
        };
        reqAjaxAsync(REQUEST_URL['p_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data;
                var arr = [];
                for(var i=0; i<obj.length; i++){
                    var temp = {
                        'id':obj[i].id,
                        'text':obj[i].positionName
                    };
                    arr.push(temp);
                }

                $('#positionSelector').select2({
                    data:arr
                });
                init();
            }
        });
    }

    function init(){
        positionId = $("#positionSelector").val();

        getPersonListByPositionId();
        loadOrderList();

        setTimeout(function(){
            $("#orderList .order-item").draggable({
                cursor: "move",
                revert: "invalid"
            });
            $("#todoList .list-item").droppable({
                accept: "#orderList .order-item",
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                drop:function(event, ui){
                    _timer = null;
                    clearInterval(_timer);

                    var _that = this;
                    var userId = $(this).attr("data-uid"),
                        orderId = $(ui.draggable).attr("id"),
                        orderName = $(ui.draggable).find(".name").text(),
                        remark = $(ui.draggable).attr("data-remark"),
                        orderTime = $(ui.draggable).find(".time").attr("data-time");

                    //将订单分配给员工
                    var param = {
                        'userId':userId,
                        'presaleInfoId':orderId
                    };

                    reqAjaxAsync(REQUEST_URL['order_allocation'], JSON.stringify(param)).done(function(res){
                        if(res.code == 1){
                            layer.msg("操作成功！");

                            var sHtml = '<li id="'+orderId+'" class="todo-item">'
                                + '<div class="item-info">'
                                + '<p class="name">名称：<span>'+orderName+'</span></p>'
                                + '<p>备注：<span>'+remark+'</span></p>'
                                + '<p>时间：<span>'+orderTime+'</span></p>'
                                + '</div>'
                                + '<div class="handle-box">'
                                + '<button type="button" class="btn btn-normal take-btn">完成</button>'
                                //+ '<button type="button" class="btn btn-default cancel-btn">取消</button>'
                                + '</div></li>';

                            $(ui.draggable).remove();
                            $(_that).find("ul").append(sHtml);
                            $(_that).parent().find(".user-info .count").text($(_that).find("ul li").length);
                            return;
                        }else{
                            layer.alert(res.msg);
                        }
                        refresh();
                    });


                }
            });
        }, 1000);
    }

    //根据职务id查询人员列表
    function getPersonListByPositionId(){
        var param = {
            'merchantId':merchantId,
            'shopId':shopId,
            'positionId':positionId
        };
        reqAjaxAsync(REQUEST_URL['user_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    var todoList = obj[i].scPresaleInfoList;
                    sHtml += '<dl id="'+obj[i].id+'">'
                        + '<dt class="user-info">'
                        + '<div class="ava"><img src="'+obj[i].userImg+'" alt="'+obj[i].username+'" onerror="this.src=\'../common/image/default_avatar.png\'"></div>'
                        + '<div class="name">'+obj[i].username+'</div>'
                        + '<span class="count">'+todoList.length+'</span>'
                        + '</dt><dd class="list-item" data-uid="'+obj[i].id+'"><ul>';
                    if(todoList.length > 0){
                        for(var j=0; j<todoList.length; j++){
                            var remark = todoList[j].remark == null ? "" : todoList[j].remark,
                                consumeTime = todoList[j].consumeTime == null ? "" : todoList[j].consumeTime.substring(10);
                            sHtml += '<li id="'+todoList[j].id+'" class="todo-item">'
                                + '<div class="item-info">'
                                + '<p class="name">名称：<span>'+todoList[j].purchaseName+'</span></p>'
                                + '<p>备注：<span>'+remark+'</span></p>'
                                + '<p>时间：<span>'+consumeTime+'</span></p>'
                                + '</div>'
                                + '<div class="handle-box">'
                                + '<button type="button" class="btn btn-normal take-btn">完成</button>'
                                //+ '<button type="button" class="btn btn-default cancel-btn">取消</button>'
                                + '</div></li>';
                        }
                    }
                    sHtml += '</ul></dd></dl>';
                }
                $("#todoList").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });
    }

    //加载订单数据
    function loadOrderList(){
        var param = {
            'merchantId':merchantId,
            'shopId':shopId,
            'positionId':positionId
        }
        reqAjaxAsync(REQUEST_URL['order_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    var orderTime = obj[i].consumeTime == null ? "" : obj[i].consumeTime.substring(10);
                    sHtml += '<li id="'+obj[i].id+'" data-presaleId="'+obj[i].presaleId+'" data-remark="'+(obj[i].remake == null ? "" : obj[i].remake)+'" class="order-item">'
                        //+ '<span class="count">1</span>'
                        + '<p class="name">'+obj[i].purchaseName+'</p>'
                        + '<p class="time" data-time="'+orderTime+'">下单时间：'+orderTime+'</p>'
                        + '</li>'
                }
                $("#orderList").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });
    }


    //变更订单状态
    function changeOrderStatus(presaleInfoId, status, optEl, uid){
        //0-未分配 1-已分配 2-已完成 3-已交付 9-已取消
        var param = {
            'presaleInfoId':presaleInfoId,
            'makeStatus':status
        };
        reqAjaxAsync(REQUEST_URL['order_change'], JSON.stringify(param)).done(function(resData){
            if(resData.code == 1){
                layer.msg("操作成功！");

                $("#todoList").find("dl[id="+uid+"]").find(".user-info .count").text($(optEl).parent().find("li").length -1);
                $(optEl).remove();
                return;
            }else{
                layer.alert(resData.msg);
            }
            refresh();
        });

    }

    $("#todoList").delegate(".list-item .todo-item .take-btn", "click",function(event){
        _timer = null;
        clearInterval(_timer);

        event.stopPropagation();
        var presaleId = $(this).parents("li").attr("id");
        var toUid = $(this).parents(".list-item").attr("data-uid");
        changeOrderStatus(presaleId, 2, $(this).parents("li"), toUid);
    }).on("click",".list-item .todo-item .cancel-btn", function(event){
        _timer = null;
        clearInterval(_timer);
        
        event.stopPropagation();
        //取消
        var presaleId = $(this).parents("li").attr("id");
        var toUid = $(this).parents(".list-item").attr("data-uid");
        changeOrderStatus(presaleId, 9, $(this).parents("li"), toUid);
    });

    $("#positionSelector").change(function(){
        init();
    });

    //登录
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

    //返回
    $(".return-icon").click(function(){
        $(this).attr("href", '../index.html');
    });

    //退出
    $(".main-top .exit-btn").click(function(){
        sessionStorage.clear();
        window.location.reload();
    });

    //设置定时30s加载一次
    function refresh(){
        _timer = setInterval(function(){
            loadOrderList();
            getPersonListByPositionId();
     }, 30000);
    }

    $(function(){
        if(merchantId == null || shopId == null){

            doLogin();
        }else{
            $(".main-top").removeClass("invisible");
            var referrer = document.referrer;
            var hrefUrl = window.location.href;
            if(referrer == hrefUrl){
                $(".main-top .return-icon").addClass("invisible");
                $(".main-top .exit-btn").removeClass("invisible");
            }else{
                $(".main-top .return-icon").removeClass("invisible");
                $(".main-top .exit-btn").addClass("invisible");
            }
            getPositionListByMerchantId();
            refresh();
        }

    });




})(jQuery);
