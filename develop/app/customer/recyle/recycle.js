var getParam;
$(document).ready(function () {
    getParam = getParams();
    tableInit();
    selectInit();
});

$('#search').click(function () {
    $('#recycleTable').bootstrapTable('destroy');
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
function lookSearchCustomer(merchantId, memberId) {
    if (merchantId) {
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            // btn: ['确定'],
            title: "查看",
            content: 'showdetail/showdetail.html?merchantId=' + merchantId + '&memberId=' + memberId
            // cancel: function (index, layero) {
            //     var info = window["layui-layer-iframe" + index].callbackdata();
            //     sumList = info.selectList;
            //     cirList = info.circleList;
            //     $('#staff').val('已选择' + info.sumNum + '人');
            //     $('#totalPeople').text(info.sumNum);
            //     layer.close(index);
            // }
        })
    }
};
//恢复用户
function recoverUser(memberId, memberName, mobile) {
    layer.confirm('确认要恢复' + memberName + '的账户？', {
        btn: ['确认', '取消'] //按钮
    }, function () {
        recover(memberId, mobile);
    });
}
function recover(memberId, mobile) {
    var cmd = "customer/recoverCustomer";
    var datas = {
        merchantId: getParam.merchantId,
        memberId: memberId,
        userId: getParam.userId,
        mobile: mobile
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg('恢复成功！', { icon: 1 }); 
            $('#recycleTable').bootstrapTable('refresh');
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
            customerPhone: $('#customerPhone').val(),
            shopId: $('#shopSelect').val()
        })
        params['cmd'] = 'customer/getDelMemberCustomerList';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
            {
                field: 'memberName',
                title: '顾客姓名',
                // width: 100,
                align: "center"
            }, {
                field: 'mobile',
                title: '手机号',
                // width: 100,
                align: "center"
            }, {
                field: 'shopName',
                title: '所属门店',
                // width: 100,
                align: "center"
            }, {
                field: 'createTime',
                title: '办理时间',
                // width: 100,
                align: "center"
            }, {
                field: 'isFans',
                title: '粉团队',
                // width: 50,
                align: "center",
                formatter: function (val, row, index) {
                    var re = "";
                    if (val == "0") {
                        re = "<span style='color:red;'></span>否";
                    } else if (val == "1") {
                        re = "是";
                    }
                    return re;
                }
            }, {
                field: 'id',
                title: '操作',
                // width: 400,
                align: "center",
                clickToSelect: false,
                formatter: function (val, row, index) {
                    return "<span title='查看' href='javascript:;' onclick='lookSearchCustomer(\"" + row.merchantId + "\",\"" + row.memberId + "\")'> <img src='img/look.png'> </span>&nbsp;&nbsp;"
                        + "<span title='恢复' href='javascript:;' onclick='recoverUser(\"" + row.memberId + "\",\"" + row.memberName + "\",\"" + row.mobile + "\")'> <img src='img/recover.png'> </span>&nbsp;&nbsp;";
                }
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

//返回值
var callbackdata = function () {
    var sumNum = $('#totalSum').text();
    var dataList = [];
    var circleList = [];
    for (let i = 0; i < selectList.length; i++) {
        dataList.push(selectList[i].userId);       
        circleList.push(selectList[i].personCircleId);  
    }
    var returnDate ={
        sumNum: sumNum,
        selectList: dataList,
        circleList: circleList
    };
    return returnDate;
}