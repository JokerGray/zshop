(function ($) {
    var apikey = sessionStorage.getItem('apikey');
    var shopId = sessionStorage.getItem('shopId');
    var pageNo = 1, pageSize = 4;

    /*function showPresalesList(res) {
        if (res.code == 1) {
            var sHtml = '<ol class="table-content">';
            for (var i = 0, len = res.data.length; i < len; i++) {
                var row = res.data[i];
                sHtml += '<li class="list-item" id="' + row.orderNo + '">'
                    + '<ul><li class="sub-item">支付单号：' + row.orderNo + '</li>'
                    + '<li class="sub-item" data-accountid="' + row.accountId + '">客<i></i>户：' + row.accountName + '</li>'
                    + '<li class="sub-item">支付金额：' + row.fee + '</li></ul>'
                    + '<ul><li class="sub-item">时<i></i>间：' + row.consumeTime + '</li>'
                    + '<li class="sub-item">支付状态：未支付</li></ul>'
                    + '<ul><li class="sub-item">开单者：' + row.operator + '</li></ul>'
                    + '<div class="item-btn">'
                    + '<button class="new-drawer-btn">重新出票</button>'
                    + '<button class="check-order-btn">查看销售单</button>'
                    + '</div></li>'
            }
            sHtml += '</ol>'
            $("#orderList").html(sHtml);

            //客户名链接跳转
            if ($('.list-item ul:nth-child(1) .sub-item:nth-child(2)').attr('data-accountid') != undefined) {
                $('.list-item ul:nth-child(1) .sub-item:nth-child(2)').on('click', function () {
                    window.parent.location.href = "../../customerManagement/html/customerOverview.html?accountId=" + $(this).attr('data-accountid');
                });
            }
        }
    }

    function loadPresalesListData() {
        var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
        var resData = reqAjax('shop/presales', jsonData);
        showPresalesList(resData)
        if (resData.total > 0) {
            $("#orderPage").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function (event, num) {
                var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + num + ", 'pageSize': " + pageSize + "}";
                var resData = reqAjax('shop/presales', jsonData);
                showPresalesList(resData)
            }).removeClass("invisible");
        } else {
            $('#orderPage').addClass("invisible");
        }
    }

    loadPresalesListData();*/

    function showOrderList(res) {
        if (res.code == 1) {
            var sHtml = '<ol class="table-content">';
            for (var i = 0, len = res.data.length; i < len; i++) {
                var row = res.data[i];
                sHtml += '<li class="list-item" id="' + row.orderNo + '">'
                    + '<ul><li class="sub-item">支付单号：' + row.orderNo + '</li>'
                    + '<li class="sub-item" data-accountId="' + row.accountId + '">客<i></i>户：' + row.accountName + '</li>'
                    + '<li class="sub-item">支付金额：' + row.actualPayment + '</li></ul>'
                    + '<ul><li class="sub-item">时<i></i>间：' + row.consumeTime + '</li>'
                    + '<li class="sub-item">支付状态：已完成</li></ul>'
                    + '<ul><li class="sub-item">开单者：' + row.operator + '</li></ul>'
                    + '<div class="item-btn">'
                    + '<button class="new-drawer-btn">重新出票</button>'
                    + '<button class="check-order-btn">查看销售单</button>'
                    + '</div></li>'
            }
            sHtml += '</ol>'
            $("#orderList").html(sHtml);

            //客户名链接跳转
            if ($(this).attr('data-accountid') != undefined) {
                $('.list-item ul:nth-child(1) .sub-item:nth-child(2)').on('click', function () {
                    window.parent.location.href = "../../customerManagement/html/customerOverview.html?accountId=" + $(this).attr('data-accountid');
                });
            }
        }
    }


    function loadOrderListData() {
        var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
        var resData = reqAjax('shop/orders', jsonData);
        showOrderList(resData)
        if (resData.total > 0) {
            $("#orderPage").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function (event, num) {
                var jsonData = "{'shopId': " + shopId + ", 'pageNo': " + num + ", 'pageSize': " + pageSize + "}";
                var resData = reqAjax('shop/orders', jsonData);
                showOrderList(resData)
            }).removeClass("invisible");
        } else {
            $('#orderPage').addClass("invisible");
        }
    }
    
    loadOrderListData();

    /*$("#tableCondition button").click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        var _index = $(this).index();
        _index == 0 ? loadPresalesListData() : loadOrderListData();
    });*/


    $("#orderList").delegate("li .item-btn .check-order-btn", "click", function () {
        var orderId = $(this).parents('li').attr('id');
        var tabVal = $("#tableCondition button.active").index();
        layer.open({
            type: 2,
            title: ['查看销售单', 'fontSize:34px;color:#fff;background:#fe6869;text-align:center;'],
            area: ['72%', '60%'], //宽高
            content: ['checkDetails.html?orderId=' + orderId + '&tabVal=' + tabVal, 'no']
        });
    });

})(jQuery);
