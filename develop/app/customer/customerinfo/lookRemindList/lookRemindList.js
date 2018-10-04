var getParam;
$(document).ready(function () {
    getParam = getParams();
    tableInit();
});

$('#search').click(function(){
    $("#recycleTable").bootstrapTable('destroy');
    tableInit();
})

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
                }else{
                    layer.msg(res.msg)
                }
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            striped: true,
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
        console.log(getParam.merchantId)
        params['data'] = JSON.stringify({
            merchantId: getParam.merchantId,
            userId: getParam.userId,
            memberName: $('#customerName').val(),
            mobile: $('#mobile').val(),
            status: $('#status').val()
        })
        params['cmd'] = 'customer/getMyRemindList';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
            {
                field: 'accountName',
                title: '姓名',
                align: "center"
            }, {
                field: 'mobile',
                title: '手机号',
                align: "center",
                formatter: function (val, row, index) {
                    if (val == "") {
                        return "-";
                    } else {
                        return val;
                    }
                }
            }, {
                field: 'remindTime',
                title: '时间选择',
                align: "center"
            }, {
                field: 'remake',
                title: '备注',
                align: "center",
                formatter: function (val, row, index) {
                    if (val == "") {
                        return '-';
                    } else{
                        return val;
                    }
                }
            }, {
                field: 'status',
                title: '状态',
                align: "center",
                formatter: function (val, row, index) {
                    if (val == 1) {
                        return '启用';
                    } else {
                        return '未启用';
                    }
                }
            }
        ];

    Table = new TableInit('recycleTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
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