var getParam;
$(document).ready(function () {
    getParam = getParams();
    tableInit();
    selectInit();
});
var nowDate = getSec(new Date(), 5);
laydate.render({
    elem: '#startDate',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date(value).getTime();
        var endTime = new Date($('#endDate').val()).getTime();
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#startDate').val($('#endDate').val());
        }
    }
});
laydate.render({
    elem: '#endDate',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date($('#startDate').val()).getTime();
        var endTime = new Date(value).getTime();
        if (endTime < startDate){
            layer.msg('结束时间不能小于开始时间');
            $('#endDate').val($('#startDate').val());
        }
    }
});

$('#search').click(function(){
    $("#recycleTable").bootstrapTable('destroy');
    tableInit();
})

function selectInit() {
    var cmd = "customer/getShopInfoByMerId";
    var datas = {
        merchantId: getParam.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data) {
                var shopList = re.data;
                for (let i = 0; i < shopList.length; i++) {
                    var optBox = `
                        <option class="" value="${shopList[i].shopId}">${shopList[i].shopName}</option>
                    `;
                    $('#shopSelect').append(optBox);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
}

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
            pagination: true,
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
            merchantId: getParam.merchantId,
            page: params.offset / params.limit + 1,
            rows: params.limit,
            customerName: $('#customerName').val(),
            operatorName: $('#operatorName').val(),
            bgTime: $('#startDate').val(),
            edTime: $('#endDate').val(),
            shopId: $('#shopSelect').val()
        })
        params['cmd'] = 'customer/getCustomerOperation';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
            {
                field: 'customName',
                title: '顾客姓名',
                align: "center"
            }, {
                field: 'accountName',
                title: '账户',
                align: "center",
                formatter: function (val, row, index) {
                    if (val == "") {
                        return "-";
                    } else {
                        return val;
                    }
                }
            }, {
                field: 'content',
                title: '操作内容',
                align: "center"
            }, {
                field: 'shopName',
                title: '操作店铺',
                align: "center",
                formatter: function (val, row, index) {
                    if (val == "") {
                        return row.merchantName;
                    } else{
                        return val;
                    }
                }
            }, {
                field: 'operatorName',
                title: '操作员工',
                align: "center"
            }, {
                field: 'createTime',
                title: '操作时间',
                align: "center"
            }
        ];

    Table = new TableInit('recycleTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    var loading = '';
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
            loading = layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.close(loading);
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
//获取对应时间的年月日时分秒,index对应说明: 1=>年月日时分秒 2=>月份 3=>日期 4=>星期 5=>年月日 6=>时分 7=>时分秒 8=>年 9=>年月日拼接完整格式
function getSec(val, index) {
    var _date = new Date(val);
    var nowYear = _date.getFullYear();
    var nowMonth = _date.getMonth() + 1;
    var nowDate = _date.getDate();
    var nowHours = _date.getHours();
    var nowMinutes = _date.getMinutes();
    var nowSeconds = _date.getSeconds();
    var nowDay = _date.getDay();
    if (nowMonth < 10) {
        nowMonth = '0' + nowMonth;
    }
    if (nowDate < 10) {
        nowDate = '0' + nowDate;
    }
    if (nowHours < 10) {
        nowHours = '0' + nowHours;
    }
    if (nowMinutes < 10) {
        nowMinutes = '0' + nowMinutes;
    }
    if (nowSeconds < 10) {
        nowSeconds = '0' + nowSeconds;
    }
    if (index == 1) {
        return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
    } else if (index == 2) {
        return nowMonth;
    } else if (index == 3) {
        return nowDate;
    } else if (index == 4) {
        return nowDay;
    } else if (index == 5) {
        return nowYear + '-' + nowMonth + '-' + nowDate;
    } else if (index == 6) {
        return nowHours + ':' + nowMinutes;
    } else if (index == 7) {
        return nowHours + ':' + nowMinutes + ':' + nowSeconds;
    } else if (index == 8) {
        return nowYear;
    } else if (index == 9) {
        return nowYear + '-' + nowMonth + '-' + nowDate + ' 00:00:00';
    }
    return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
}
