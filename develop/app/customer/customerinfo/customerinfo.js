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


//会员补录
$('#memberAdd').click(function () {
    layer.open({
        type: 2,
        area: ['80%', '70%'],
        // btn: ['确定'],
        title: "会员补录",
        content: 'memberadd/memberadd.html?merchantId=' + getParam.merchantId + '&userId=' + getParam.userId
        // cancel: function (index, layero) {
        //     var info = window["layui-layer-iframe" + index].callbackdata();
        //     sumList = info.selectList;
        //     cirList = info.circleList;
        //     $('#staff').val('已选择' + info.sumNum + '人');
        //     $('#totalPeople').text(info.sumNum);
        //     layer.close(index);
        // }
        ,cancel: function (index) {
            $('#recycleTable').bootstrapTable('refresh');
        }
    })
});
//提醒查看列表
$('#lookRemindList').click(function () {
    layer.open({
        type: 2,
        area: ['80%', '80%'],
        // btn: ['确定'],
        title: "提醒查看",
        content: 'lookRemindList/lookRemindList.html?merchantId=' + getParam.merchantId + '&userId=' + getParam.userId
        // cancel: function (index, layero) {
        //     var info = window["layui-layer-iframe" + index].callbackdata();
        //     sumList = info.selectList;
        //     cirList = info.circleList;
        //     $('#staff').val('已选择' + info.sumNum + '人');
        //     $('#totalPeople').text(info.sumNum);
        //     layer.close(index);
        // }
    })
});
//-----------------------------------------table按钮功能方法
//业务办理
function addAccount(memberId) {
    if (memberId) {
        layer.open({
            type: 2,
            area: ['80%', '65%'],
            // btn: ['确定'],
            title: "业务办理",
            content: 'addAccount/addAccount.html?merchantId=' + getParam.merchantId + '&userId=' + getParam.userId + '&memberId=' + memberId
            // cancel: function (index, layero) {
            //     var info = window["layui-layer-iframe" + index].callbackdata();
            //     sumList = info.selectList;
            //     cirList = info.circleList;
            //     $('#staff').val('已选择' + info.sumNum + '人');
            //     $('#totalPeople').text(info.sumNum);
            //     layer.close(index);
            // }
            ,cancel: function (index) {
                $('#recycleTable').bootstrapTable('refresh');
            }
        })
    }
};
//查看
function lookSearchCustomer(memberId,shopId) {
    if (memberId) {
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            // btn: ['确定'],
            title: "查看详情",
            content: 'showdetail/showdetail.html?merchantId=' + getParam.merchantId + '&memberId=' + memberId
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
//查看积分情况
function lookIntegral(userId, memberName) {
    if (userId) {
        layer.open({
            type: 2,
            area: ['50%', '80%'],
            // btn: ['确定'],
            title: "查看积分",
            content: 'integralinfo/integral.html?merchantId=' + getParam.merchantId + '&userId=' + userId + '&memberName=' + escape(memberName)
            // cancel: function (index, layero) {
            //     var info = window["layui-layer-iframe" + index].callbackdata();
            //     sumList = info.selectList;
            //     cirList = info.circleList;
            //     $('#staff').val('已选择' + info.sumNum + '人');
            //     $('#totalPeople').text(info.sumNum);
            //     layer.close(index);
            // }
        })
    }else{
        layer.msg('请选择要编辑的行', { icon: 2 });
    }
};

//账户修改
function accountModify(id) {
    if (id) {
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            // btn: ['确定'],
            title: "账户修改",
            content: 'editAccount/editAccount.html?memberId=' + id + '&merchantId=' + getParam.merchantId + '&userId=' + getParam.userId,
            btn: ['确定','删除', '关闭'],
            yes: function (index, layero) {
                var info = window["layui-layer-iframe" + index].callbackdata();
                if (info.businessType == "1"){
                    if (info.newFinance.length > 0 && Number(info.newFinance) < 0) {
                        layer.msg('请填写有效活动经费！');
                        return false;
                    } else if (info.newFinance.length == 0){
                        layer.msg('请填写活动经费！');
                        return false;
                    }
                    if (info.newPeriodTime.length <= 0 ) {
                        layer.msg('请填写有效时间！');
                        return false;
                    }
                }
                // if (info.accountName.length == 0) {
                //     layer.msg('请输入账户名称！');
                //     return false;
                // }
                if (info.phone.length == 0) {
                    layer.msg('请输入手机号！');
                    return false;
                }
                var regMobile = /^[1][3-9][0-9]{9}$/;
                if (!regMobile.test(info.phone)) {
                    layer.msg("请输入正确的手机号!")
                    return false;
                }
                if (info.memberName.length == 0) {
                    layer.msg('请输入用户名称！');
                    return false;
                }
                if (info.memberName.length < 2) {
                    layer.msg('顾客姓名不少于2个字！');
                    return false;
                }
                // if (info.usableInterest.length > 0 && Number(info.usableInterest) < 0) {
                //     layer.msg('请填写有效赠送金额！');
                //     return false;
                // }
                if (info.principal.length > 0 && Number(info.principal) < 0) {
                    layer.msg('请填写有效充值金额！');
                    return false;
                }
                if(info.type == 1){
                    var cmd = "customer/addSubaccounts";
                }else{
                    var cmd = "customer/modifySubAccount";
                }
                ajaxAsync(cmd, info, function (re) {
                    if (re.code == 1) {
                        layer.msg(re.msg);
                        window["layui-layer-iframe" + index].location.reload();
                        // layer.close(index);
                    } else {
                        layer.msg(re.msg);
                    }
                })
                
            },
            btn2: function(index){
                console.log(index);
                var info = window["layui-layer-iframe" + index].callbackdata();
                console.log(info);
                if(info.accountlist.length==1){
                    layer.msg('无法删除');
                    
                }else{
                    // 询问框
                    var index1 = layer.confirm('是否确定删除子账户：'+info.businessName+'？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        layer.close(index1);
                        var data = info.accountlist;
                        var content = '<div style="font-size:16px;padding:50px 0 0 20px;">请选择需要转移到的子账户：<select id="newSubaccountId" style="width:;40px;height:30px;">';
                        for(var i = 0;i<info.accountlist.length;i++){
                            if(info.subaccountId != data[i].subaccountId){
                                content += `<option value="${data[i].subaccountId}">${data[i].accountName}</option>`;
                            }
                        }
                        content+='</select></div>'
                        layer.open({
                            type: 1,
                            title : '删除子账户',
                            closeBtn: 0,
                            area: ['420px', '240px'], //宽高
                            content: content,
                            btn: ['确定', '取消'],
                            yes:function(index2){
                                // console.log($('#newSubaccountId').val());
                                // return false;
                                var params = {
                                    userId:getParam.userId,
                                    memberId:info.memberId,
                                    subaccountId:info.subaccountId,
                                    newSubaccountId:$('#newSubaccountId').val()

                                };
                                var cmd = "customer/deleteSubaccount";
                                ajaxAsync(cmd, params, function (re) {
                                    if (re.code == 1) {
                                        layer.msg(re.msg);
                                        layer.close(index2);
                                        window["layui-layer-iframe" + index].location.reload();
                                    } else {
                                        layer.msg(re.msg);
                                    }
                                })
                            }
                        });
                    });
                }
                
                return false;
                // if(info.subaccountId == ''){
                //     layer.msg('请选择一个要删除的子账户！');
                //     return false;
                // }
                // var cmd = "customer/deleteSubaccount";
                // ajaxAsync(cmd, info, function (re) {
                //     if (re.code == 1) {
                //         layer.msg(re.msg);
                //         window["layui-layer-iframe" + index].location.reload();
                //         // layer.close(index);
                //     } else {
                //         layer.msg(re.msg);
                //     }
                // })
            },
            end: function (index) {
                $('#recycleTable').bootstrapTable('refresh');
            }
        })
    }
}

//后台补卡
var canClick = true;
function cardsPurchAseInit(id, shopId, status) {
    if (status == 1){
        layer.open({
            type: 2,
            area: ['60%', '50%'],
            fix: false, //不固定
            maxmin: true,
            title: "补卡",
            content: 'selectAccount/selectAccount.html?id=' + id + '&merchantId=' + getParam.merchantId + '&shopId=' + shopId + '&userId=' + getParam.userId,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                if (canClick == false) {
                    return false;
                }
                canClick == false;
                var info = window["layui-layer-iframe" + index].callbackdata();
                if(info.subaccountId !== ''){
                    layer.close(index);
                    layer.open({
                        type: 2,
                        area: ['80%', '80%'],
                        fix: false, //不固定
                        maxmin: true,
                        title: "补卡",
                        content: 'supcard/supcard.html?id=' + id + '&merchantId=' + getParam.merchantId + '&shopId=' + shopId + '&userId=' + getParam.userId + '&subaccountId=' + info.subaccountId,
                        btn: ['确定', '关闭'],
                        yes: function (index, layero) {
                            var info = window["layui-layer-iframe" + index].callbackdata();
                            if (info.serviceCards.length < 1) {
                                layer.msg('请选择补录的服务卡项后提交！', { icon: 2 });
                                return false;
                            }
                            var cmd = "customer/addServiceCard";
                            ajaxAsync(cmd, info, function (re) {
                                if (re.code == 1) {
                                    layer.msg(re.msg);
                                    $('#recycleTable').bootstrapTable('refresh');
                                    layer.close(index);
                                } else {
                                    layer.msg(re.msg);
                                }
                            })
                        },
                        cancel: function (index) {
                        }
                    });
                }else{
                    layer.msg('请选择子账户！');
                }
            },
            cancel: function (index) {
            }
        });
    }else{
        if (id) {
            layer.open({
                type: 2,
                area: ['80%', '80%'],
                fix: false, //不固定
                maxmin: true,
                title: "补卡",
                content: 'supcard/supcard.html?id=' + id + '&merchantId=' + getParam.merchantId + '&shopId=' + shopId + '&userId=' + getParam.userId,
                btn: ['确定', '关闭'],
                yes: function (index, layero) {
                    if (canClick == false) {
                        return false;
                    }
                    canClick == false;
                    var info = window["layui-layer-iframe" + index].callbackdata();
                    if (info.serviceCards.length < 1){
                        layer.msg('请选择补录的服务卡项后提交！', { icon: 2 });
                        return false;
                    }
                    var cmd = "customer/addServiceCard";
                    ajaxAsync(cmd, info, function (re) {
                        canClick == true;
                        if (re.code == 1) {
                            layer.msg(re.msg);
                            $('#recycleTable').bootstrapTable('refresh');
                            layer.close(index);
                        } else {
                            layer.msg(re.msg);
                        }
                    })
                },
                cancel: function (index) {
                }
            });
        } else {
            layer.msg('请选择要编辑的行', { icon: 2 });
        }
    }
    
}

//卡项修改
function purchaseInitCardModify(id) {
    if (id) {
        layer.open({
            type: 2,
            area: ['80%', '70%'],
            fix: false, //不固定
            maxmin: true,
            title: "卡项修改",
            content: 'cardedit/cardedit.html?id=' + id + '&merchantId=' + getParam.merchantId + '&userId=' + getParam.userId
            ,cancel: function (index) {
                $('#recycleTable').bootstrapTable('refresh');
            }
        });
    } else {
        layer.msg('请选择要编辑的行', { icon: 2 });
    }
}

//留店修改
function consumeaccAccRecordIndex(memberId) {
    if (memberId) {
        layer.open({
            type: 2,
            area: ['70%', '60%'],
            fix: false, //不固定
            maxmin: true,
            title: "留店修改",
            content: 'accRecordIndex/accRecordIndex.html?memberId=' + memberId
            , cancel: function (index) {
                $('#recycleTable').bootstrapTable('refresh');
            }
        });
    } else {
        layer.msg('请选择要编辑的行', { icon: 2 });
    }
}

//客户提醒
function subaccountRemind(id,shopId) {
    if (id) {
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            fix: false, //不固定
            maxmin: true,
            title: "客户提醒",
            content: 'remind/remind.html?memberId=' + id + '&merchantId=' + getParam.merchantId + '&userId=' + getParam.userId + '&shopId=' + shopId
            , cancel: function (index) {
                $('#recycleTable').bootstrapTable('refresh');
            }
        });
    } else {
        layer.msg('请选择要编辑的行', { icon: 2 });
    }
}

//删除
function deleteCustomer(memberId) {
    if (memberId) {
        layer.confirm('会删除粉团队相关业务,确定删除吗?', function (index) {
            //do something
            var cmd = "customer/deleteCustomer";
            var datas = {
                userId: getParam.userId,
                memberId: memberId
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    layer.msg('删除成功!');
                    $('#recycleTable').bootstrapTable('refresh');
                } else {
                    layer.msg(re.msg);
                }
            })
            layer.close(index);
        });
    } else {
        layer.msg('请选择要编辑的行', { icon: 6 });
    }
}


//去除前后空格
function trim(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
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
            customerName: trim($('#customerName').val()),
            customerPhone: trim($('#customerPhone').val()),
            shopId: $('#shopSelect').val()
        })
        params['cmd'] = 'customer/searchCustomerInfo';

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
        },{
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
            field: 'periodTime',
            title: '到期时间',
            // width: 50,
            align: "center",
            formatter: function (val, row, index) {
                var re = "";
                if (row.isFans == 1) {
                    switch (row.type) {
                        case 1:
                            re = "<span>" + val + "</span>";
                            break;
                        case 2:
                            re = "<span style='color:#fa963f;'>" + val + "</span>";
                            break;
                        case -1:
                            re = "<span style='color:#e94c47;'>" + val + "</span>";
                            break;
                        default:
                            re = "<span>" + val + "</span>";;
                            break;
                    }
                } else {
                    re = "-";
                }
                return re;
            }
        }, {
            field: 'credits',
            title: '积分',
            // width: 50,
            align: "center",
            formatter: function (val, row, index) {
                return "<a href='javascript:;' style='color:#337ab7;' onclick='lookIntegral(" + row.userId + ",\"" + row.memberName + "\")'>" + val +"</a>";
            }
        }, {
            field: 'id',
            title: '操作',
            // width: 400,
            align: "center",
            clickToSelect: false,
            formatter: function (val, row, index) {
                // return "<a title='业务办理' href='javascript:;' onclick='addAccount(" + row.memberId + ")'> <img src='img/add_account.png'> </a>&nbsp;&nbsp;"
                return "<a title='查看' href='javascript:;' onclick='lookSearchCustomer(" + row.memberId + ',' + row.shopId + ")'> <img src='img/look.png'> </a>&nbsp;&nbsp;"
                    + "<a title='账户修改' href='javascript:;' onclick='accountModify(" + row.memberId + ")'> <img src='img/account.png'> </a>&nbsp;&nbsp;"
                    + "<a title='后台补卡' href='javascript:;' onclick='cardsPurchAseInit(" + row.memberId + ',' + row.shopId + ',' + row.status + ")'> <img src='img/restore.png'> </a>&nbsp;&nbsp;"
                    + "<a title='卡项修改' href='javascript:;' onclick='purchaseInitCardModify(" + row.memberId + ")'> <img src='img/card.png'> </a>&nbsp;&nbsp;"
                    + "<a title='留店修改' href='javascript:;' onclick='consumeaccAccRecordIndex(" + row.memberId + ")'> <img src='img/keep.png'> </a>&nbsp;&nbsp;"
                    + "<a title='会员提醒' href='javascript:;' onclick='subaccountRemind(" + row.memberId + ',' + row.shopId + ")'> <img src='img/remind.png'> </a>&nbsp;&nbsp;"
                    + "<a title='删除' href='javascript:;' onclick='deleteCustomer(" + row.memberId + ")'> <img src='img/delete_table.png'> </a>";
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