//接口
var server = {
    dataList: 'depositManageMent/selectList', //(分页查询定金记录)
    exportExcel: 'depositManageMent/exportDepositList', //(Excel导出)
    sourceList: 'payZyzz/getSourceList', //(动态获取下拉款)
    addDepositRecord: 'depositManageMent/addDepositRecord', //(新增-智扮/智管定金)
    carryForward: 'depositManageMent/carryForward', //(定金结转),
    editDepositRecord: 'depositManageMent/edit' //(修改定金记录)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '商户名称',
        align: 'center',
        field: 'merchantName'
    }, {
        title: '手机号',
        align: 'center',
        field: 'phone'
    }, {
        title: '法人姓名',
        align: 'center',
        field: 'corporationName'
    }, {
        title: '定金金额',
        align: 'center',
        field: 'money',
        templet: function (res) {
            return getMoneyFormat(res.money);
        }
    }, {
        title: '类型',
        align: 'center',
        field: 'typeStr'
    }, {
        title: '来源',
        align: 'center',
        field: 'sourceName'
    }, {
        title: '创建时间',
        align: 'center',
        field: 'createTime'
    }, {
        title: '备注',
        align: 'center',
        field: 'remark',
        templet: function (res) {
            if (res.remark) {
                return res.remark;
            }
            return "-";
        }
    }, {
        title: '关联商户名称',
        align: 'center',
        field: 'relativeMerchantName',
        templet: function (res) {
            if (res.relativeMerchantName) {
                return res.relativeMerchantName;
            }
            return "-";
        }
    }, {
        // Todo: 缺少字段
        title: '关联法人名称',
        align: 'center',
        field: 'relativeCorporationName',
        templet: function (res) {
            if (res.relativeCorporationName) {
                return res.relativeCorporationName;
            }
            return "-";
        }
    }, {
        title: '实付金额',
        align: 'center',
        field: 'realMoney',
        templet: function (res) {
            if (res.realMoney) {
                return res.realMoney;
            }
            return "-";
        }
    }, {
        title: '是否结转',
        align: 'center',
        field: 'carriedForwardFlagStr',
        templet: function (res) {
            if (res.carriedForwardFlag === 0) {
                return '<span style="color: red;">' + res.carriedForwardFlagStr +'</span>'
            }
            if (res.carriedForwardFlag === 1) {
                return '<span style="color: green;">' + res.carriedForwardFlagStr +'</span>'
            }
        }
    }, {
        title: '结转金额',
        align: 'center',
        field: 'carriedForwardMoney',
        templet: function (res) {
            if (res.carriedForwardMoney) {
                return res.carriedForwardMoney;
            }
            return "-";
        }
    }, {
        title: '操作',
        align: 'center',
        field: 'id',
        templet: function (res) {
            return "<button onclick='updateDepositRecord("+ JSON.stringify(res) +")' class='layui-btn layui-btn-normal layui-btn-sm'>修改</button>" +
                "<button onclick='forwardBtn("+ res.id +")' class='layui-btn layui-btn-sm'>结转</button>";
        }
    }
]];

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

    //导出Excel按钮
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
    //新增按钮
    $('#addbtn').on('click', function () {
        addDepositRecord();
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
            // 3.重载表格
            tableIns.reload({
                data: res.data.list
            });
            // 4.分页配置
            laypage.render({
                elem: pageId,
                count: res ? res.data.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [15],
                limit: 15,
                jump: function(obj, first) {
                    //首次不执行
                    if(!first) {
                        pageCallback(obj.curr, obj.limit, function(res) {
                            tableIns.reload({
                                data: res.data.list
                            });
                            // 添加：[小计] 定金总额、[总计] 定金总额
                            adjustTable(res);
                        });
                    }
                }
            });
            // 5.添加：[小计] 定金总额、[总计] 定金总额
            adjustTable(res);
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
    var type = $('#type').val();
    var merchantName = $('#merchantName').val();
    var phone=$('#phone').val();
    var corporationName=$('#corporationName').val();
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();
    var parms = {
        type: type,
        merchantName: merchantName,
        phone: phone,
        corporationName : corporationName,
        startTime : startDate,
        endTime: endDate
    };
    if(index && limit){
        parms.pageNo = index;
        parms.pageSize = limit;
    }
    return JSON.stringify(parms);
}

/**
 * 导出excel
 */
function exportExcel () {
    var parms = getSearchParam();
    downloadFile(server.exportExcel, parms);
};

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
 * 新增-智扮/智管定金
 */
function addDepositRecord() {
    layui.use(['form', 'layer', 'jquery'], function () {
        var form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;

        var sourceList = reqAjax(server.sourceList, {});
        console.log("==============动态列表==============");
        console.log(sourceList);
        console.log("==============动态列表==============");

        layer.open({
            type: 1,
            area: ['800px', '420px'],
            fix: false, //不固定
            maxmin: false,
            title: "新增-智扮/智管定金",
            btn: ['确认添加', '关闭'],
            yes: function (index, layero) {
                var data = $("#form-data").serializeArray(),
                    sendData = {};
                for (var i = 0; i < data.length; i++) {
                    sendData[data[i].name] = data[i].value;
                }
                if (!sendData.merchantName) {
                    layer.msg('商户名称为空', {icon: 5});
                    return;
                }
                if (!sendData.phone) {
                    layer.msg('手机号不能为空', {icon: 5});
                    return;
                }
                if (!sendData.corporationName) {
                    layer.msg('法人姓名不能为空', {icon: 5});
                    return;
                }
                if (!sendData.money) {
                    layer.msg('定金金额不能为空', {icon: 5});
                    return;
                }
                if (sendData.type === "-1") {
                    layer.msg('类型不能为空', {icon: 5});
                    return;
                }
                if (sendData.source === "-1") {
                    layer.msg('来源不能为空', {icon: 5});
                    return;
                } else {
                    sendData.sourceId = sendData.source.split("_")[0];
                    sendData.sourceName = sendData.source.split("_")[1];
                    delete sendData.source;
                }
                console.log("==============表单数据==============");
                console.log(sendData);
                console.log("==============表单数据==============");
                var responseData = reqAjax(server.addDepositRecord, JSON.stringify({entity: sendData}));
                if (responseData.code === 1) {
                    layer.msg("添加成功", {icon:1});
                    layer.close(index);
                } else {
                    layer.msg(responseData.msg, {icon: 5});
                }
            },
            content: template('depositTpl', sourceList)
        });
        // 渲染表单
        form.render();
    });
}

/**
 * 结转
 * @param id 记录id
 */
function forwardBtn (id) {
    layui.use(['layer'], function () {
        var layer = layui.layer;

        var responseData = reqAjax(server.carryForward, JSON.stringify({id: id}));
        if (responseData.code === 1) {
            layer.msg(responseData.msg, {icon: 1});
            return;
        } else {
            layer.msg(responseData.msg, {icon: 5});
        }
    });
}

/**
 * [小计] 定金总额、[合计] 定金总额
 * @param res 数据
 */
function adjustTable (res) {
    $("tbody").append(
        '<tr>' +
        '<td colspan="' + cols[0].length +'" align="center">' +
        "<lable style='color: red;'>[小计] </lable>" +
        "定金总额： " + res.data.subtotalDeposit + " 元,&nbsp&nbsp&nbsp&nbsp  已结转总金额： " + getMoneyFormat(res.data.subtotalForward) + " 元" +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="' + cols[0].length +'" align="center">' +
        '<lable style="color: red;">[合计] </lable>' +
        '定金总额： ' + res.data.totalDeposit + ' 元,&nbsp&nbsp&nbsp&nbsp  已结转总金额： ' + getMoneyFormat(res.data.totalForward) + ' 元' +
        '</td>' +
        '</tr>'
    );
}

/**
 * 修改-智扮/智管定金
 * @param res 记录详情
 */
function updateDepositRecord(res) {
    layui.use(['layer', 'form', 'jquery'], function () {
        console.log("===============记录入参==================");
        console.log(res);
        var data = {
            _id: res.id,
            _merchantName: res.merchantName,
            _phone: res.phone,
            _corporationName: res.corporationName,
            _money: res.money,
            _type: res.type,
            _sourceId: res.sourceId,
            _remark: res.remark
        };
        console.log(data);
        console.log("===============记录入参==================");

        console.log("==============动态列表==============");
        var sourceList = reqAjax(server.sourceList, {});
        console.log(sourceList);
        data._sourceList = sourceList.data;
        console.log("==============动态列表==============");

        var layer = layui.layer,
            form = layui.form,
            $ = layui.jquery;
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            fix: false, //不固定
            maxmin: false,
            title: "修改-智扮/智管定金",
            btn: ['确认添加', '关闭'],
            yes: function (index, layero) {
                var formData = $("#_form-data").serializeArray(),
                    sendData = {};
                for (var i = 0; i < formData.length; i++) {
                    sendData[formData[i].name] = formData[i].value;
                }
                sendData.sourceId = sendData.source.split("_")[0];
                sendData.sourceName = sendData.source.split("_")[1];
                delete sendData.source;
                console.log("==============发送的数据===============");
                console.log(sendData);
                console.log("==============发送的数据===============");
                var responseData = reqAjax(server.editDepositRecord, JSON.stringify(sendData));
                if (responseData.code === 1) {
                    layer.msg(responseData.msg, {icon: 1});
                } else {
                    layer.msg(responseData.msg, {icon: 5});
                }
                layer.close(index);
            },
            content: template('updateDepositTpl', data)
        });
        form.render();
    });
}
