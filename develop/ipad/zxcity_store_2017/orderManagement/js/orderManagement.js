(function ($) {
    var apikey = sessionStorage.getItem('apikey');
    var shopId = sessionStorage.getItem('shopId');
    var pageNo = 1, pageSize = 4;

    function showOrderList(res) {
        if (res.code == 1) {
            var sHtml = '<ol class="table-content">';
            if(res.data.length > 0){
                for (var i = 0, len = res.data.length; i < len; i++) {
                    var row = res.data[i];
                    sHtml += '<li class="list-item" id="' + row.orderId + '">'
                        + '<ul class="item-1"><li class="sub-item">支付单号：' + row.orderId + '</li>'
                        + '<li class="sub-item">客<i></i>户：' + row.accountName + '</li>'
                        + '<li class="sub-item">支付金额：' + row.actualPay + '元</li></ul>'
                        + '<ul class="item-2"><li class="sub-item">时<i></i>间：' + row.consumeTime + '</li>'
                        + '<li class="sub-item">支付状态：已完成</li></ul>'
                        + '<ul class="item-3"><li class="sub-item">开单者：' + row.saleMan + '</li></ul>'
                        + '<div class="item-btn">'
                        //+ '<button class="new-drawer-btn">重新出票</button>'
                        + '<button class="check-order-btn">查看详情</button>'
                        + '</div></li>';
                }
            }else{
                sHtml += '<li class="list-item nodata">暂无数据</li>';
            }

            sHtml += '</ol>';
            $("#orderList").html(sHtml);

            //客户名链接跳转 TODO
            // if ($(this).attr('data-accountid') != undefined) {
            //     $('.list-item ul:nth-child(1) .sub-item:nth-child(2)').on('click', function () {
            //         window.parent.location.href = "../../customerManagement/html/customerOverview.html?accountId=" + $(this).attr('data-accountid');
            //     });
            // }
        }
    }


    function loadOrderListData() {
        var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";

        reqAjaxAsync('shopStatistics/getAccountOrders', jsonData).done(function(resData){
            showOrderList(resData);
            pagingInit('#orderPage',resData.total,pageSize,function (page) {
                var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + page + ", 'pageSize': " + pageSize + "}";
                reqAjaxAsync('shopStatistics/getAccountOrders', jsonData).done(function(resData){
                    showOrderList(resData);
                });
            })
            // if (resData.total > 0) {
            //     $("#orderPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function (event, num) {
            //         var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + num + ", 'pageSize': " + pageSize + "}";
            //         reqAjaxAsync('shopStatistics/getAccountOrders', jsonData).done(function(resData){
            //             showOrderList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // } else {
            //     $('#orderPage').addClass("invisible");
            // }
        });

    }

    loadOrderListData();

    $("#orderList").delegate("li .item-btn .check-order-btn", "click", function () {
        var orderId = $(this).parents('li').attr('id');

        var jsonData = "{'orderId':"+orderId+"}";

        reqAjaxAsync("shopStatistics/getOneOrderDetail", jsonData).done(function(res){
            if(res.code == 1){
                var sHtml = '<div id="detailList"><div class="list-box"><ul>';
                var obj = res.data.goodsList;

                for(var i=0; i<obj.length; i++){
                    sHtml += '<li class="detial-item">'
                    + '<div class="order-info"><div class="row">'
                    + '<div class="small-2 columns">'
                    + '<img class="purchase-pic" src="'+obj[i].purchasePicture+'" alt="'+obj[i].purchaseName+'"></div>'
                    + '<div class="small-10 columns">'
                    + '<p class="purchase-name">'+obj[i].purchaseName+'</p>'
                    + '<p>单价：'+obj[i].unitPrice+'元</p>'
                    + '<p><span class="num">数量：'+obj[i].num+'</span><span>合计：'+obj[i].totelPrice+'元</span></p>'
                    + '<div class="state">'
                    + '<span class="money"><i></i><b>'+obj[i].actualPayment+'</b></span>';
                    if(obj.payType){
                        sHtml += '<span class="status">'+obj[i].payType+'</span>';
                    }
                    sHtml += '</div></div></div></div></li>';
                }
                sHtml += '</ul></div>';
                if(res.data.acName != "" && res.data.discountMoney != ""){
                    sHtml += '<div class="other-info">'
                        + '<label>活动折扣：</label><span>'+res.data.acName+'</span>'
                        + '<label>整单优惠：</label><span>'+res.data.discountMoney+'</span></div>';
                }else if(res.data.acName == "" && res.data.discountMoney != ""){
                    sHtml += '<div class="other-info">'
                        + '<label>整单优惠：</label><span>'+res.data.discountMoney+'</span></div>';
                }else if(res.data.acName != "" && res.data.discountMoney == ""){
                    sHtml += '<div class="other-info">'
                        + '<label>活动折扣：</label><span>'+res.data.acName+'</span></div>';
                }
                sHtml += '</div>';
                layer.open({
                    type: 1,
                    title: ['查看订单详情'],
                    area: ['80%', '480px'],
                    scrollbar: false,
                    shadeClose: true,
                    content: sHtml
                });
            }else{
                layer.msg(res.msg);
            }
        });

    });



})(jQuery);
