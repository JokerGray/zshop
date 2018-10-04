(function ($) {
    var _index = 0, pageNo = 1, pageSize = 10;
    var shopID = sessionStorage.getItem('shopId');

    function init(orderStatus) {
        var resData = getOrderData(pageNo, orderStatus);
        orderListShow(resData);
        if (resData.total > 0) {
            $('#page-selection').bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function (event, num) {
                var status = $("#orderTab .btn-group .btn:eq(" + _index + ")").attr("data-status");
                orderListShow(getOrderData(num, status));
            }).removeClass("invisible");
        } else {
            $('#page-selection').addClass("invisible");
        }

    }


    function getOrderData(pageNo, orderStatus) {
        var shopId = 49,
            keyword = $("#keyword").val(),
            orderStatus = orderStatus ? orderStatus : 1;
        var jsonData = "{'shopId':" + shopID + ",'keyword':'" + keyword + "', 'orderStatus':" + orderStatus + ", 'pageNo':" + pageNo + ", 'pageSize':" + pageSize + "}";
        var res = reqAjax('shop/queryConsumptionsDetails', jsonData);
        return res;
    }

    function orderListShow(res) {
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr>'
                    + '<td>' + row.orderId + '</td>'
                    + '<td data-accountid="' + row.accountId + '">' + row.accountName + '</td>'
                    + '<td>' + row.operator + '</td>'
                    + '<td>' + row.consumeTime + '</td>'
                switch (_index) {
                    case 1:
                        sHtml += '<td>服务中</td>'
                            + '<td><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default complete">服务完成</button><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default show-detail">查看详情</button></td>';
                        break;
                    case 2:
                        sHtml += '<td>服务完成</td>'
                            + '<td><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default complete">开票</button><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default show-detail">查看详情</button></td>';
                        break;
                    default:
                        sHtml += '<td>已下单</td>'
                            + '<td><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default complete">开始服务</button><button type="button" data-orderId="' + row.orderId + '" class="btn btn-default show-detail">查看详情</button></td>';
                }
                sHtml += '</tr>';
            }
        } else {
            layer.alert(res.msg);
        }

        $("#workOrderList tbody").html(sHtml);


        //增加客户名链接跳转
        if ($('#workOrderList tbody tr td:nth-child(2)').attr('data-accountid') != undefined) {
            $('#workOrderList tbody tr td:nth-child(2)').on('click', function () {
                window.parent.location.href = "../../customerManagement/html/customerOverview.html?accountId=" + $(this).attr('data-accountid');
            })
        }

    }

    init(1);

    //搜索
    $(".search-box .search-btn").click(function () {
        var status = $("#orderTab .btn-group .btn:eq(" + _index + ")").attr("data-status");
        init(status);
    });

    $("#orderTab .btn-group .btn").click(function () {
        _index = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        init($(this).attr("data-status"));
    });

    //状态更改
    $("#workOrderList tbody").delegate("tr td .complete", "click", function () {
        var changeState = _index == 0 ? 3 : (_index == 1 ? 5 : -1);
        //变更状态
        if (changeState != -1) {
            var jsonData = "{'orderId':" + $(this).attr("data-orderId") + ", 'change':" + changeState + "}"
            var res = reqAjax("shop/consumptionsStatusChange", jsonData);
            if (res.code == 1) {
                _index = changeState == 3 ? 1 : 2;
                $("#orderTab .btn-group .btn:eq(" + _index + ")").addClass("on").siblings().removeClass("on");
                init(changeState);
            }
        }
    }).delegate("tr td .show-detail", "click", function () {
        var orderId = $(this).attr("data-orderId");
        layer.open({
            type: 2,
            title: ['查看工单详情', 'fontSize:34px;color:#fff;background:#fe6869;text-align:center;'],
            area: ['72%', '60%'], //宽高
            shadeClose: true, //开启遮罩关闭
            content: ['workOrderDetail.html?orderId=' + orderId, 'no']

        });
    });

})(jQuery);
