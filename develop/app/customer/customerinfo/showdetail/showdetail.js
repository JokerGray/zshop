var zNodes = [];
var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    serviceInit();
    cardInit();
    recordInit();
    params = getParams();
    getInfo();
    getSelect(params);
});
//获取信息
function getInfo(shopId, subaccountId) {
    var cmd = "customer/getCustomerDetail";
    var datas = {
        merchantId: params.merchantId,
        memberId: params.memberId,
        shopId: shopId,
        subaccountId: subaccountId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var accountList = [];
            var serviceList = [];
            var consumesAccList = [];
            if (re.data) {
                if (re.data.memberCardList) {
                    if (re.data.memberCardList[0]) {
                        getPersonInfo(re.data.memberCardList[0])
                    }
                }

                if (re.data.accountList) {
                    accountList = re.data.accountList;
                }
                if (re.data.consumesAccList) {
                    consumesAccList = re.data.consumesAccList;
                }
                if (re.data.serviceList) {
                    serviceList = re.data.serviceList;
                }
                if (re.data.packageList) {
                    var packageList = re.data.packageList;
                    for (var i = 0; i < packageList.length; i++) {
                        serviceList.push(packageList[i]);
                    }
                }
            }
            refreshTable(accountList, serviceList, consumesAccList);
            // layer.close(layer.loading);
        } else {
            layer.msg(re.msg);
        }
    })
}
//获取个人信息
function getPersonInfo(data) {
    $('#userName').text(data.memberName)
    $('#userPhone').text(data.mobile)
    if (data.birthday !== '') {
        $('#birthday').text(data.birthday);
        $('#birthdayTitle').text('生日：');
    } else if (data.lunarBirthday !== '') {
        $('#birthday').text(data.lunarBirthday);
        $('#birthdayTitle').text('农历生日：');
    } else {
        $('#birthday').text(data.birthday);
        $('#birthdayTitle').text('生日：');
    }
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
            if (re.data.nameList) {
                var nameList = re.data.nameList;
                for (let i = 0; i < nameList.length; i++) {
                    var optBox = `
                        <option class="" value="${nameList[i].subaccountId}">${nameList[i].accountName}</option>
                    `;
                    $('#account').append(optBox);
                }
            }
            if (re.data.shopList) {
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
    var subaccountId = $('#account').val();
    var shopId = $('#shop').val();
    getInfo(shopId, subaccountId)
})
//刷新表格
function refreshTable(accountList, serviceList, consumesAccList) {
    if (accountList !== undefined) {
        $('#serviceTable').bootstrapTable('load', accountList);
    }
    if (consumesAccList !== undefined) {
        $('#recordTable').bootstrapTable('load', consumesAccList);
    }
    if (serviceList !== undefined) {
        $('#cardTable').bootstrapTable('load', serviceList);
        var totalCost = 0;
        for (var i = 0; i < serviceList.length; i++) {
            if (serviceList[i].purchasePrice !== undefined) {
                totalCost += Number(serviceList[i].purchasePrice);
            }
        }
        $('#totalCost').text(totalCost.toFixed(2));
    }
    layer.close(layer.loading);
}
//展开收起
function changeFlow(self) {
    var status = $(self).text();
    if (status == '收起') {
        $(self).parent().siblings('.tablerow').hide('slow', function () {
            $(self).text('展开');
        });
    } else {
        $(self).parent().siblings('.tablerow').show('slow', function () {
            $(self).text('收起');
        });
    }
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
            field: 'accountName', title: '账户名称', align: 'center'
        },
        {
            field: 'businessName', title: '账户类型', align: 'center'
        },
        {
            field: 'principal', title: '剩余金额', align: 'center'
        },
        {
            field: 'shopName', title: '店铺', align: 'center'
        },
        {
            field: 'discount', title: '业务说明', align: 'center', formatter: function (val, row, index) {
                var text = '';
                if(val == 100) text = '无折扣';
                else text = val + '%';
                return row.businessName + ',消费折扣:' + text;
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
        {
            field: 'cardName', title: '名称', align: 'center',
            formatter: function (val, row, index) {
                if (row.serviceType == 4) {
                    return val + '[' + row.purchaseName + ']-' + row.shopName;
                } else {
                    if (row.packageName !== '') {
                        return val + '[' + row.packageName + ']-' + row.shopName;
                    } else {
                        return val + '-' + row.shopName;
                    }
                }
            }
        },
        {
            field: 'totalNum', title: '总次数', align: 'center'
        },
        {
            field: 'purchasePrice', title: '购买总价', align: 'center'
        },
        {
            field: 'remainNum', title: '消费次数', align: 'center'
        },
        {
            field: 'achRatio', title: '服务业绩', align: 'center'
        }
        ]
    });
    $('#cardTable').bootstrapTable('hideLoading');
}
// 消费记录
function recordInit() {
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
        {
            field: 'orderType', title: '类型', align: 'center', formatter: function (val, row, index) {
                if (val == 9) {
                    return '套盒';
                } else if (val == 1) {
                    return '充值';
                } else if (val == 3) {
                    return '服务账单';
                } else if (val == 2) {
                    return '购买商品/购买服务';
                } else if (val == 4) {
                    return '商品/服务卡';
                }
            }
        },
        {
            field: 'purchaseName', title: '名称', align: 'center'
        },
        {
            field: 'salesman', title: '销售员', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return '-';
                } else {
                    return val;
                }
            }
        },
        { field: 'actualPay', title: '金额', align: 'center' },
        // {
        //     field: 'payType', title: '支付方式', align: 'center', formatter: function (val, row, index) {
        //         switch (val) {
        //             case 1:
        //                 return '本金支付';
        //                 break;
        //             case 2:
        //                 return '卡项支付';
        //                 break;
        //             case 3:
        //                 return '现金支付';
        //                 break;
        //             case 4:
        //                 return '组合支付';
        //                 break;
        //             default:
        //                 return '本金支付';
        //                 break;
        //         }
        //     }
        // },
        {
            field: 'consumeTime', title: '消费时间', align: 'center'
        }
        ]
    });
    $('#recordTable').bootstrapTable('hideLoading');
}
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