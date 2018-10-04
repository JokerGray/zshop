var getParam;
$(document).ready(function () {
    getParam = getParams();
    tableInit();
    // $('#subaccountRemindTable').bootstrapTable('hideLoading');
});

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
            memberId: getParam.memberId
        })
        params['cmd'] = 'customer/getRemindList';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
        {
            checkbox: true,
            visible: false
        }, {
            field: 'id',
            title: 'id',
            width: 100,
            visible: false,
            align: "center"
        }, {
            field: 'dayNameStr',
            title: '星期',
            width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var dList = row.remindDayList;
                var dayNameString = "";
                for (var i = 0; i < dList.length; i++) {
                    if (i == 0) {
                        dayNameString += dList[i].dayName;
                    } else {
                        dayNameString += "," + dList[i].dayName;
                    }
                }
                return dayNameString;
            }
        }, {
            field: 'remindTime',
            title: '时间',
            width: 100,
            align: "center"
        }, {
            field: 'shopName',
            title: '店铺',
            width: 100,
            align: "center"
        }, {
            field: 'backuserNameStr',
            title: '提醒员工',
            width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var bList = row.remindBackuserList;
                var backuserNameString = "";
                for (var i = 0; i < bList.length; i++) {
                    if (i == 0) {
                        backuserNameString += bList[i].backuserName;
                    } else {
                        backuserNameString += "," + bList[i].backuserName;
                    }
                }
                return backuserNameString;
            }
        }, {
            field: 'remake',
            title: '备注',
            width: 100,
            align: "center"
        }, {
            field: 'status',
            title: '状态',
            width: 100,
            align: "center",
            formatter: function (val, row, index) {
                if (val == 1) {
                    return "<button class='btn btn-info' onclick='updateRemindStatus(" + row.id + ",0)'> 启用  </button>";
                } else {
                    return "<button class='btn btn-info' onclick='updateRemindStatus(" + row.id + ",1)'> 未启用  </button>";
                }
            }
        }, {
            field: 'id',
            title: '操作',
            width: 100,
            align: "center",
            clickToSelect: false,
            formatter: function (val, row, index) {
                return "<a title='编辑' href='javascript:;' onclick='editRemind(" + val + ")'> <img src='../img/edit.png'> </a>&nbsp;&nbsp;"
                    + "<a title='删除' href='javascript:;' onclick='delSubaccountRemind(" + val + ")'> <img src='../img/delete_circle.png'> </a>&nbsp;&nbsp;";
            }
        }
    ];

    Table = new TableInit('subaccountRemindTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

/**
 * 刷新表单
 */
function refreshTable() {
    // ImpList_Init("subaccountRemindTable");
    $('#subaccountRemindTable').bootstrapTable('refresh');
}

/**
 * 删除
 */
function delSubaccountRemind(id) {
    layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
        // top.layer.close(index);
        var cmd = "customer/delRemindList";
        var datas = {
            remindId: id
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                refreshTable();
            } else {
                layer.msg(re.msg);
            }
        })
    });
}

/**
 * 添加提醒
 */
function addSubaccountRemind() {
    layer.open({
        type: 2,
        area: ['900px', '600px'],
        fix: false, //不固定
        maxmin: true,
        title: "新增提醒",
        content: 'SubaccountRemindView/SubaccountRemindView.html?memberId=' + getParam.memberId + '&merchantId=' + getParam.merchantId + '&userId=' + getParam.userId + '&shopId=' + getParam.shopId,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            //提交
            iframeWin.contentWindow.sub();
        },
        cancel: function (index) {

        }
    });
}

/**
 * 编辑
 */
function editRemind(remindId) {
    layer.open({
        type: 2,
        area: ['800px', '600px'],
        fix: false, //不固定
        maxmin: true,
        title: "编辑提醒",
        content: 'SubaccountRemindView/SubaccountRemindView.html?memberId=' + getParam.memberId + '&merchantId=' + getParam.merchantId + '&userId=' + getParam.userId + '&remindId=' + remindId,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            //提交
            iframeWin.contentWindow.sub();
        },
        cancel: function (index) {

        }
    });
}

/**
 * 修改提醒状态
 */
function updateRemindStatus(id, status) {
    layer.confirm('确定要修改状态吗?', { icon: 3, title: '提示' }, function (index) {
        var cmd = "customer/updateSubaccountRemindStatus";
        var datas = {
            remindId: id,
            status: status
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                refreshTable();
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
//返回值
var callbackdata = function () {
    var buyNum = $('#buyNum').val();
    var returnDate = {
        consumeNum: buyNum
    };
    return returnDate;
}