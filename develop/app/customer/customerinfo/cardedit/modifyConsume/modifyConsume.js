var getParam;
$(document).ready(function () {
    getParam = getParams();
    tableInit();
    $('#recordTable').bootstrapTable('hideLoading');
});

function deleteRecord(params) {
    
}

//初始化表格
var TableInit = function (id, url, columns, param) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#' + id).bootstrapTable({
            url: url,
            method: 'POST',
            toolbar: '#toolbar',
            contentType: "application/x-www-form-urlencoded",
            ajaxOptions: {
                headers: {
                    apikey: 'test'
                }
            },
            responseHandler: function (res) {
                if (res.code == 1) {
                    res.rows = res.data;
                    return res;
                } else {
                    layer.msg(res.msg)
                }
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            striped: false,
            cache: false,
            pagination: false,
            sortable: false,
            sidePagination: "server",
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            strictSearch: false,
            clickToSelect: false,
            uniqueId: 'id',
            columns: columns
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        params['data'] = JSON.stringify({
            id: getParam.purchaseId
        })
        params['cmd'] = 'customer/modifyConsume';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
        {
            field: 'Number',
            align: 'center',
            formatter: function (value, row, index) {
                return index + 1;
            }
        },
        {
            field: 'cardName',
            title: '服务卡名',
            // width: 100,
            align: "center"
        }, {
            field: 'consumeNum',
            title: '消费次数',
            // width: 100,
            align: "center"
        }, {
            field: 'consumeTime',
            title: '消费时间',
            // width: 100,
            align: "center"
        }, {
            field: 'id',
            title: '操作',
            // width: 400,
            align: "center",
            clickToSelect: false,
            formatter: function (val, row, index) {
                return "<a title='删除' href='javascript:;' onclick='deleteRecord(\"" + row.merchantId + "\",\"" + row.id + "\",\"" + row.cardName + "\",\"" + row.subaccountId + "\")'>删除</a>";
            }
        }
    ];

    Table = new TableInit('recordTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function deleteRecord(merchantId, id, cardName, subaccountId) {
    layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
        var cmd = "customer/deleConsume";
        var datas = {
            merchantId: merchantId,
            id: id,
            userId: getParam.userId,
            memberId: getParam.memberId,
            cardName: cardName,
            subaccountId: subaccountId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                location.reload();
            } else {
                layer.msg(re.msg);
            }
        })
    });
}
function deleAllConsume() {
    layer.confirm('确定要全部删除吗?', { icon: 3, title: '提示' }, function (index) {
        var cmd = "customer/deleAllConsume";
        var datas = {
            merchantId: getParam.merchantId,
            purchaseId: getParam.purchaseId,
            userId: getParam.userId,
            memberId: getParam.memberId,
            cardName: unescape(getParam.cardName),
            subaccountId: getParam.subaccountId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                location.reload();
            } else {
                layer.msg(re.msg);
            }
        })
    });
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
    var params = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
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
//返回值
var callbackdata = function () {
    var buyNum = $('#buyNum').val();
    var returnDate = {
        consumeNum: buyNum
    };
    return returnDate;
}