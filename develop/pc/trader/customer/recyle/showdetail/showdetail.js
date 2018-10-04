var zNodes = [];
var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    serviceInit();
    cardInit();
    // recordInit();
    params = getParams();
    getInfo();
    getSelect(params);
});
//获取信息
function getInfo(shopId, cardName) {
    var cmd = "customer/getCustomerDetail";
    var datas = {
        merchantId: params.merchantId,
        memberId: params.memberId,
        shopId: shopId,
        cardName: cardName
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            getPersonInfo(re.data.customerInfoList[0])
            var businessList = re.data.businessList;
            var serviceList = re.data.serviceList;
            if (re.data.consumeList){
                var consumeList = re.data.consumeList;
                for (var i = 0; i < consumeList.length; i++) {
                    serviceList.push(consumeList[i]);
                }
            }
            refreshTable(businessList, serviceList);
            // layer.close(layer.loading);
        } else {
            layer.msg(re.msg);
        }
    })
}
//获取个人信息
function getPersonInfo(data) {
    $('#userName').text(data.accountName)
    $('#userPhone').text(data.mobile)
    $('#birthday').text(data.birthday)
    $('#identityCard').val(data.identityCard)
}
//加载下拉框
function getSelect(data) {
    var cmd = "customer/getShopListAndBusinessName";
    var datas = {
        merchantId: data.merchantId,
        memberId: data.memberId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if(re.data.nameList){
                var nameList = re.data.nameList;
                for (let i = 0; i < nameList.length; i++) {
                    var optBox = `
                        <option class="" value="${nameList[i].cardName}">${nameList[i].cardName}</option>
                    `;
                    $('#account').append(optBox);
                }
            }
            if (re.data.shopList){
                var shopList = re.data.shopList;
                for (let i = 0; i < shopList.length; i++) {
                    var optBox = `
                        <option class="" value="${shopList[i].shopId}">${shopList[i].shopName}</option>
                    `;
                    $('#shop').append(optBox);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
};
$('#searchTable').click(function () {
    var cardName = $('#account').val();
    var shopId = $('#shop').val();
    getInfo(shopId, cardName)
})
//刷新表格
function refreshTable(businessList, serviceList) {
    if (businessList !== undefined){
        $('#serviceTable').bootstrapTable('load', businessList);
    }
    if (serviceList !== undefined){
        $('#cardTable').bootstrapTable('load', serviceList);
        var totalCost = 0;
        for (var i = 0; i < serviceList.length; i++) {
            if(serviceList[i].purchasePrice !== undefined){
                totalCost += Number(serviceList[i].purchasePrice);
            }            
        }
        $('#totalCost').text(totalCost.toFixed(2));
    }
    layer.close(layer.loading);
    // $('#recordTable').bootstrapTable('load', consumeList);
}
/************* 初始化 ******************/
// 业务办理
function serviceInit() {
    $('#serviceTable').bootstrapTable({
        striped: false,
        sortable: false,
        columns: [{
                field: 'Number',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'cardType', title: '账户类型', align: 'center', formatter: function (val, row, index) {
                    switch (val) {
                        case 1:
                            return '普通卡';
                            break;
                        case 2:
                            return '银卡';
                            break;
                        case 3:
                            return '金卡';
                            break;
                        case 4:
                            return '白金卡';
                            break;
                        default:
                            return '普通卡';
                            break;
                    }
                } },
            {
                field: 'principal', title: '充值金额', align: 'center'
            },
            {
                field: 'shopName', title: '店铺', align: 'center'
            },
            {
                field: 'cardType', title: '业务说明', align: 'center', formatter: function (val, row, index) {
                    switch (val) {
                        case 1:
                            return '普通卡,消费折扣' + row.discount + '%';
                            break;
                        case 2:
                            return '银卡,消费折扣' + row.discount + '%';
                            break;
                        case 3:
                            return '金卡,消费折扣' + row.discount + '%';
                            break;
                        case 4:
                            return '白金卡,消费折扣' + row.discount + '%';
                            break;
                        default:
                            return '普通卡,消费折扣' + row.discount + '%';
                            break;
                    }
                }
            }
        ]
    });
    $('#serviceTable').bootstrapTable('hideLoading');
}
// 服务卡列表
function cardInit() {
    $('#cardTable').bootstrapTable({
        striped: false,
        sortable: false,
        columns: [{
                field: 'Number',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            { field: 'cardName', title: '名称', align: 'center' },
            {
                field: 'totalNum', title: '总次数', align: 'center'
            },
            {
                field: 'purchasePrice', title: '购买总价', align: 'center'
            },
            {
                field: 'remainNum', title: '剩余次数', align: 'center'
            },
            {
                field: 'achRatio', title: '服务业绩', align: 'center'
            }
        ]
    });
    $('#cardTable').bootstrapTable('hideLoading');
}
// 消费记录
/* function recordInit() {
    $('#recordTable').bootstrapTable({
        striped: false,
        sortable: false,
        columns: [{
                field: 'Number',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            { field: 'actualPay', title: '支付金额', align: 'center' },
            {
                field: 'orderType', title: '账单类型', align: 'center', formatter: function (val, row, index) {
                    switch (val) {
                        case 1:
                            return '充值账单';
                            break;
                        case 2:
                            return '办卡账单';
                            break;
                        case 3:
                            return '服务账单';
                            break;
                        case 4:
                            return '预售转账单';
                            break;
                        default:
                            return '充值账单';
                            break;
                    }
                }
            },
            {
                field: 'payType', title: '支付方式', align: 'center', formatter: function (val, row, index) {
                    switch (val) {
                        case 1:
                            return '本金支付';
                            break;
                        case 2:
                            return '卡项支付';
                            break;
                        case 3:
                            return '现金支付';
                            break;
                        case 4:
                            return '组合支付';
                            break;
                        default:
                            return '本金支付';
                            break;
                    }
                }
            },
            {
                field: 'shopName', title: '所属门店', align: 'center'
            },
            {
                field: 'consumeTime', title: '结账时间', align: 'center'
            },
            {
                field: 'finance', title: '业务说明', align: 'center', formatter: function (val, row, index) {
                    if (val < 0) {
                        return '<span class="red">' + val + '</span>'
                    } else {
                        return val;
                    }
                }
            }
        ]
    });
    $('#recordTable').bootstrapTable('hideLoading');
} */
// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        headers: {
            apikey: 'test'
        },
        data: {
            cmd: cmd,
            data: data
        },
        beforeSend: function (request) {
            layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.closeAll();
        }
    });
}
function getParams() {
    var url = location.search;
    var param = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return param;
}