(function($){
    var REQUEST_URL = {
        'get_all_url':'shopStatistics/myHomePageAccountAllCardDetails',//获取客户卡项
        'return_url':'shopDisplayTerminal/returnPurchaseRecord',//申请退卡
        'get_return_list':'shopDisplayTerminal/getReturnPurchaseList'//退卡明细
    };
    var pageNo = 1, pageSize = 10;
    var shopId = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId"),
        employeeName = sessionStorage.getItem("username"),
        accountId = sessionStorage.getItem("accountId");

    //获取客户所有的卡项信息
    function getAllCard(){
        var param = {
            'shopId':shopId,
            'accountId': accountId,
            'pageNo': pageNo,
            'pageSize': 100
        };
        reqAjaxAsync(REQUEST_URL['get_all_url'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var sHtml = '', obj = res.data;
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        sHtml += '<li class="list-item" id="'+obj[i].id+'" data-useNum="'+obj[i].consume_num+'">'
                            + '<div class="item-inner">'
                            + '<p class="name">'+obj[i].card_name+'</p>'
                            + '<div class="detail">'
                            + '<p class="detail-info">'
                            + '<label class="item-label">购买数量：</label>'
                            + '<span class="item-txt">'+obj[i].total_num+'</span></p>'
                            + '<p class="detail-info">'
                            + '<label class="item-label">使用数量：</label>'
                            + '<span class="item-txt">'+obj[i].consume_num+'</span></p>'
                            + '<p class="detail-info">'
                            + '<label class="item-label">剩余数量：</label>'
                            + '<span class="item-txt">'+obj[i].remain_num+'</span></p></div>'
                            + '<button type="button" class="btn btn-default refundCard-btn">申请退卡</button>'
                            + '</div></li>'
                    }
                }else{
                    sHtml += '<li class="nodata">暂无卡项信息</li>'
                }
                $(".list-box .list").html(sHtml);
            }
        });

    }

    //退卡
    $(".list-box .list").delegate(".list-item .refundCard-btn", "click", function(){
        var cardId = $(this).parents(".list-item").attr("id"),
            consumeNum =  $(this).parents(".list-item").attr("data-useNum");
        if(consumeNum > 0){
            layer.msg("亲，只有没有使用过的卡才能进行退卡操作！");
            return ;
        }
        var param = {
            'accountId': accountId, //客户编号
            'id': cardId, //卡编号
            'employeeId': employeeId,//员工编号
            'employeeName': employeeName//员工姓名
        };
        layer.confirm('确定要退掉这张卡么?', function(index){
            reqAjaxAsync(REQUEST_URL['return_url'], JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("退卡成功!");
                    getAllCard();
                    return;
                }else{
                    layer.msg(res.msg);
                }
                layer.close(index);
            });

        });

    });

    //退卡明细
    function showReturnPurchaseList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].serviceCardName+'</td>'
                        + '<td>'+res.data[i].createName+'</td>'
                        + '<td>'+res.data[i].createTime+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#returnListTable tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }

    }
    //提醒 - 明日预约列表
    function getReturnPurchaseList(){
        var param = {
            'accountId':accountId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };

        reqAjaxAsync(REQUEST_URL['get_return_list'], JSON.stringify(param)).done(function(resData){
            showReturnPurchaseList(resData);
            pagingInit('#returnListPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['get_return_list'], JSON.stringify(param)).done(function(resData){
                    showReturnPurchaseList(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#returnListPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['get_return_list'], JSON.stringify(param)).done(function(resData){
            //             showReturnPurchaseList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#returnListPage').addClass("invisible");
            // }
        });

    }

    //tab切换
    $(".main-tab .btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index();
        if(_index == 0){
            getAllCard();
            $(".apply-return-box").removeClass("hide").siblings().addClass("hide");
        }else{
            getReturnPurchaseList();
            $(".return-list").removeClass("hide").siblings().addClass("hide");
        }
    });

    $(function(){
        getAllCard();
    });

})(jQuery);
