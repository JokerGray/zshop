//接口
var server = {
    dataList: 'merchantUpgrade/selMerchantUpgradePageList', //(分页查询商户升级信息)
    exportExcel: 'payExcel/exportMerchantUpgrade', //(导出Excel)
    userInfo: 'userInfo/appUser', //(查询App用户信息)
    auditShare: 'merchantUpgrade/auditShare' //(结算分享人佣金)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '流水号',
        align: 'center',
        field: 'serialNo'
    }, {
        title: '法人姓名',
        align: 'center',
        field: 'legalPersonName',
        templet: function (res) {
            if (res.legalPersonName) {
                return "<span onclick='openUserInfo(" + res.merchantId + ")' style='color: #337ab7; cursor: pointer;'>" + res.legalPersonName + "</span>";
            }
            return '-';
        }
    }, {
        title: '商户名称',
        align: 'center',
        field: 'merchantOrgName',
        templet: function (res) {
            if (res.merchantOrgName) {
                return "<span onclick='openUserInfo(" + res.merchantId + ")' style='color: #337ab7; cursor: pointer;'>" + res.merchantOrgName + "</span>";
            }
            return '-';
        }
    }, {
        title: '平台角色',
        align: 'center',
        field: 'rolesStr'
    }, {
        title: '商户升级详情',
        align: 'center',
        field: 'id',
        templet: function (res) {
            return "<button onclick='lookMerchantUpgradeDetails("+ JSON.stringify(res) +")' class='layui-btn layui-btn-sm'>查看</button>";
        }
    }, {
        title: '升级类型',
        align: 'center',
        field: 'upgradeType',
        templet: function (res) {
            for (var i = 0; i < levelTypeList.length; i++) {
                if (levelTypeList[i].id === parseInt(res.upgradeType)) {
                    return levelTypeList[i].levelName;
                }
            }
        }
    }, {
        title: '缴费金额',
        align: 'center',
        field: 'upgradeRealAmount',
        templet: function (res) {
            return getMoneyFormat(res.upgradeRealAmount);
        }
    }, {
        title: '分享人名称',
        align: 'center',
        field: 'shareUserName',
        templet: function (res) {
            if (res.shareUserName) {
                return "<span onclick='openUserInfo(" + res.merchantId + ")' style='color: #337ab7; cursor: pointer;'>" + res.shareUserName + "</span>";
            }
            return '-';
        }
    }, {
        title: '分享人商户等级',
        align: 'center',
        field: 'shareUserLevelName'
    }, {
        title: '分享人佣金',
        align: 'center',
        field: 'shareRealAmount',
        templet: function (res) {
            return getMoneyFormat(res.shareRealAmount, 2);
        }
    }, {
        title: '审核时间',
        align: 'center',
        field: 'upgradeAutitTime'
    }, {
        title: '结算',
        align: 'center',
        field: 'z_id',
        templet: function (res) {
            if (res.shareCommissionStatus === '0') {
                return "<button onclick='commission(" + JSON.stringify(res) + ")' type='button' class='layui-btn layui-btn-sm'>结算</button>";
            } else if(res.shareCommissionStatus === '1'){
                return '<span style="color: gray">已结算</span>';
            }
        }
    }
]];
var levelTypeList = [];
var payMentList = [];
/**
 * main方法，页面初始化
 */
layui.use(['layer', 'jquery', 'laydate'], function () {
    var layer = layui.layer,
        $ = layui.jquery,
        laydate = layui.laydate;

    //日期控件
    laydate.render({
        elem: '#startDate'
    });
    laydate.render({
        elem: '#endDate'
    });

    //表格初始化
    tableInit();

    //导出Excel
    $('#exportBtn').on('click', function () {
        exportExcel();
    });
    //设置按钮
    $('#setBtn').on('click', function () {
        openSettings();
    });
    //搜索按钮
    $('#searchBtn').on('click', function() {
        tableInit();
    });

});

/**
 * 表格渲染
 */
function tableInit() {
    layui.use(['table', 'laypage'], function () {
        var table = layui.table,
            laypage = layui.laypage,
            tableId = "table",
            pageId = 'layTablePage',
            tableIns;

        // 1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-250',
            cols: cols,
            page: false,
            even: true,
            limit: 15,
            cellMinWidth:80
        });

        //2.第一次加载
        pageCallback(1, 15, function(res) {
            console.log("===========表格数据============");
            console.log(res);
            levelTypeList = res.data.LevelTypeList;
            payMentList = res.data.payMentList;
            console.log("===========表格数据============")

            // 3.重载表格
            tableIns.reload({
                data: res.data.list
            });
            // 4.分页配置
            laypage.render({
                elem: pageId,
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [15],
                limit: 15,
                jump: function(obj, first) {
                    //首次不执行
                    if(!first) {
                        pageCallback(obj.curr, obj.limit, function(resTwo) {
                            tableIns.reload({
                                data: resTwo.data.list
                            });
                        });
                    }
                }
            });
        });
    });
}

/**
 * 请求数据
 * @param index    当前页码
 * @param limit    查询数量
 * @param callback 回调函数
 */
function pageCallback(index, limit, callback) {
    var parms = getSearchParam(index, limit);
    reqAjaxAsync(server.dataList, parms).then(function(res) {
        if(res.code !== 1) {
            return layer.msg(res.msg);
        }
        console.log("================================");
        console.log(res);
        console.log("================================");

        // 序号字段
        $.each(res.data.list, function(i, item) {
            $(item).attr('eq', (i + 1));
            $(item).attr('z_id', (i + 1));
        });
        console.log("请求的数据");
        console.log(res);
        return callback(res);
    })
}

/**
 * 封装请求参数
 * @param index 页码（可以为空）
 * @param limit 页数量（可以为空）
 * @returns {string}
 */
function getSearchParam(index, limit){
    var merchantOrgName = $('#merchantOrgName').val();
    var serialNo = $('#serialNo').val();
    var shareUserName = $('#shareUserName').val();
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();

    var parms = {
        // Todo：version的默认参数
        onOffLine: "2",
        shareCommissionStatusAll: "yes",
        commissionStatus: "1",
        shareUserIs: "no",
        merchantOrgName: merchantOrgName,
        serialNo: serialNo,
        shareUserName: shareUserName,
        upgradeAutitTimeStart: startDate,
        upgradeAutitTimeEnd: endDate
    };
    if(index && limit){
        parms.pageNo = index;
        parms.pageSize = limit;
    }
    return JSON.stringify(parms);
}

/**
 * 导出Excel
 */
function exportExcel () {
    var parms = getSearchParam();
    downloadFile(server.exportExcel, parms);
}

/**
 * 设置表头
 */
function openSettings() {
    layui.use(['form', 'layer', 'jquery'], function () {
        var form = layui.form,
            layer = layui.layer,
            $ = layui.jquery,
            data = {};

        for (var i = 0; i < cols[0].length; i++) {
            data[cols[0][i].field] = !(cols[0][i].hide);
        }

        layer.open({
            type: 1,
            area: ['800px', '360px'],
            fix: false, //不固定
            maxmin: false,
            title: "表头设置",
            btn: ['确认', '关闭'],
            yes: function (index, layero) {
                // 刷新表格
                tableInit();
                layer.close(index);
            },
            content: template('settingsTpl', data)
        });

        // 渲染表单
        form.render();
        // 事件
        form.on('switch()', function (data) {
            var name = $(data.elem).attr("name");
            for (var i = 0; i < cols[0].length; i++) {
                if (cols[0][i].field === name) {
                    cols[0][i].hide = !(data.elem.checked);
                }
            }
        });
    });
}

/**
 * 查询app用户信息
 * @param merchantId 用户id
 */
function openUserInfo (userId) {
    layui.use(['form', 'layer'], function () {
        // 1.查询数据
        var data = reqAjax(server.userInfo, JSON.stringify({
            userId: userId
        }));
        if (data.code === 9) {
            layer.msg(data.msg, {icon: 5});
        } else {
            console.log("=================请求的数据=================");
            console.log(data);
            console.log("=================请求的数据=================");

            // 2.弹出层
            layer.open({
                type: 1,
                area: ['1000px', '550px'],
                fix: false,
                maxmin: true,
                title: '用户详情',
                content: template('userInfoTpl', data)
            });
            form.render();
        }
    });
}

/**
 * 结算
 * @param res 单条记录值
 */
function commission (res) {
    console.log("=============结算入参==============");
    console.log(res);
    console.log("=============结算入参==============");

    layui.use(['layer'], function () {
        layer.open({
            type : 1,
            title : '分享人佣金结算',
            area : [ '300px', '150px' ],
            btn : ['结算','取消'],
            bthAlign : 'c',
            content : '<span>是否打算结算' + res.shareUserName + '的佣金？</span>',
            yes : function(index) {
                // 运营平台审核人员信息
                var shareCommissionUserId = yyCache.get("userId");
                var shareCommissionUserName = yyCache.get("pcNickname");

                var responseData = reqAjax(server.auditShare, JSON.stringify({
                    id: res.id,
                    shareCommissionUserId: shareCommissionUserId,
                    shareCommissionUserName: shareCommissionUserName
                }));
                if (responseData.code === 1) {
                    layer.msg(responseData.msg, {icon: 1});
                } else {
                    layer.msg(responseData.msg, {icon: 5});
                }
                layer.close(index);
            }
        });
    });
}

/**
 * 查看商户升级详情
 * @param res 记录的详情
 */
function lookMerchantUpgradeDetails (res) {
    console.log("============商户升级详情入参=============");
    console.log(res);
    console.log("============商户升级详情入参=============");

    layui.use(['form', 'layer'], function () {
        var layer = layui.layer,
            form = layui.form;

        layer.open({
            type: '1',
            title: '商户升级详情',
            area: ['800px', '500px'],
            fix: false,
            maxmin: false,
            content: template('upgradeDetailTpl', res)
        });
        form.render();
    });
}
