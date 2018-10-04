//接口
var server = {
    dataList: 'scAlipayFeeConfiguration/selectList', //(查询列表)
    versions: 'scAlipayFeeConfiguration/selectYearVersionList', //(查询版本列表)
    exportExcel: 'scAlipayFeeConfiguration/exportAlipayFeeConfiguration', //(导出Excel)
    addConfig: 'scAlipayFeeConfiguration/add', //(添加config配置)
    updateConfig: 'scAlipayFeeConfiguration/updateById', //(更新配置)
    deleteConfig: 'scAlipayFeeConfiguration/delectById' //(删除配置)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '版本',
        align: 'center',
        field: 'yearVersion'
    }, {
        title: '月限额',
        align: 'center',
        field: 'monthlyLimit',
        templet: function (res) {
            if(res.monthlyLimit === '0'){
                return getMoneyFormat(res.monthlyMinimumAmount, 2) + " — " + getMoneyFormat(res.monthlyMaximumAmount, 2);
            }else{
                return '不限额';
            }
        }
    }, {
        title: '支付类型',
        align: 'center',
        field: 'paymentTypes',
        templet: function (res) {
            if (res.paymentTypes === '1') {
                return "支付宝";
            }
            if (res.paymentTypes === '2') {
                return "微信";
            }
        }
    }, {
        title: '支付操作',
        align: 'center',
        field: 'paymentOperationName'
    }, {
        title: '收费标准',
        align: 'center',
        field: 'chargeRatio',
        templet: function (res) {
            return res.chargeRatio + "%";
        }
    }, {
        title: '有效起始时间',
        align: 'center',
        field: 'effectiveStartTime'
    }, {
        title: '有效结束时间',
        align: 'center',
        field: 'effectiveEndTime'
    }, {
        title: '操作',
        align: 'center',
        field: 'id',
        templet: function (res) {
            return "<button onclick='updateConfig("+ JSON.stringify(res) +")' class='layui-btn layui-btn-normal layui-btn-sm'>修改</button>" +
                "<button onclick='deleteConfig("+ res.id +")' class='layui-btn layui-btn-danger layui-btn-sm'>删除</button>"
        }
    }
]];
/**
 * main方法，页面初始化
 */
var layer, $, laydate;
layui.use(['layer', 'jquery', 'laydate'], function () {
    layer = layui.layer;
    $ = layui.jquery;
    laydate = layui.laydate;

    //版本下拉列表
    var responseData = reqAjax(server.versions, {});
    console.log("===========versions===============");
    console.log(responseData.data);
    console.log("===========versions===============");

    $("#yearVersion").append(template('yearVersionTpl', {list: responseData.data}));

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
    //增加配置
    $("#addConfigBtn").on("click", function () {
        addConfig();
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
                data: res.data
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
                                data: resTwo.data
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

        // 序号字段
        $.each(res.data, function(i, item) {
            $(item).attr('eq', (i + 1));
        });
        console.log("===============请求的数据=================");
        console.log(res);
        console.log("===============请求的数据=================");
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
    var parms = {
        yearVersion: $('#yearVersion').val()
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
 * 增加配置
 */
function addConfig () {
    layer.open({
        type: 1,
        area: ['800px', '500px'],
        fix: false, //不固定
        maxmin: false,
        title: "添加-支付宝手续费配置",
        btn: ['确认添加', '取消'],
        yes: function (index, layero) {
            var formData = $("#form-data").serializeArray(),
                sendData = {};
            for (var i = 0; i < formData.length; i++) {
                sendData[formData[i].name] = formData[i].value;
            }
            console.log("===========提交的数据==============");
            if (!sendData.yearVersion) {
                layer.msg("请选择年份", {icon: 5});
                return;
            }
            if (sendData.paymentTypes === "-1") {
                layer.msg("请选择支付类型", {icon: 5});
                return;
            }
            if (!sendData.chargeRatio) {
                layer.msg("请选择收费标准", {icon: 5});
                return;
            }
            if (sendData.paymentOperationId === "-1") {
                layer.msg("请选择支付操作", {icon: 5});
                return;
            }
            if (!sendData.effectiveStartTime) {
                layer.msg("请选择起始日期", {icon: 5});
                return;
            }
            if (!sendData.effectiveEndTime) {
                layer.msg("请选择结束日期", {icon: 5});
                return;
            }
            if (!sendData.monthlyLimit) {
                layer.msg("请选择是否限额", {icon: 5});
                return;
            }
            console.log(sendData);
            console.log("===========提交的数据==============");

            var responseData = reqAjax(server.addConfig, JSON.stringify(sendData));
            if (responseData.code === 1) {
                layer.msg(responseData.msg, {icon: 1});
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
            //刷新表格
            tableInit();
            layer.close(index);
        },
        content: template('addConfigTpl', {})
    });
    laydate.render({
        elem: '#version',
        type: 'year'
    });
    laydate.render({
        elem: '#effectiveStartTime'
    });
    laydate.render({
        elem: '#effectiveEndTime'
    });
    // 监听：是否限额
    form.on("radio(monthlyLimit)", function () {
        var monthlyLimit = $(this).val();
        if (monthlyLimit === '0') {
            // 显示
            $("#monthlyMinimumAmount").toggleClass("layui-hide", false);
            $("#monthlyMaximumAmount").toggleClass("layui-hide", false);
        } else {
            // 隐藏
            $("#monthlyMinimumAmount").toggleClass("layui-hide", true);
            $("#monthlyMaximumAmount").toggleClass("layui-hide", true);
        }
    });
    form.render();
}

/**
 * 更新配置
 * @parm res 当条记录
 */
function updateConfig (res) {
    console.log("==============更新的入参==================");
    console.log(res);
    console.log("==============更新的入参==================");

    layer.open({
        type: 1,
        area: ['800px', '500px'],
        fix: false, //不固定
        maxmin: false,
        title: "修改-支付宝手续费配置",
        btn: ['确认修改', '取消'],
        yes: function (index, layero) {
            var formData = $("#form-data2").serializeArray(),
                sendData = {};
            for (var i = 0; i < formData.length; i++) {
                sendData[formData[i].name] = formData[i].value;
            }
            console.log("===========提交的数据==============");
            if (!sendData.yearVersion) {
                layer.msg("请选择年份", {icon: 5});
                return;
            }
            if (sendData.paymentTypes === "-1") {
                layer.msg("请选择支付类型", {icon: 5});
                return;
            }
            if (!sendData.chargeRatio) {
                layer.msg("请选择收费标准", {icon: 5});
                return;
            }
            if (sendData.paymentOperationId === "-1") {
                layer.msg("请选择支付操作", {icon: 5});
                return;
            }
            if (!sendData.effectiveStartTime) {
                layer.msg("请选择起始日期", {icon: 5});
                return;
            }
            if (!sendData.effectiveEndTime) {
                layer.msg("请选择结束日期", {icon: 5});
                return;
            }
            if (!sendData.monthlyLimit) {
                layer.msg("请选择是否限额", {icon: 5});
                return;
            }
            if (sendData.monthlyLimit === '1') {
                sendData.monthlyMaximumAmount = "";
                sendData.monthlyMinimumAmount = "";
            }
            sendData.id = res.id;
            sendData.userId = yyCache.get("userId");
            console.log(sendData);
            console.log("===========提交的数据==============");

            var responseData = reqAjax(server.updateConfig, JSON.stringify(sendData));
            if (responseData.code === 1) {
                layer.msg(responseData.msg, {icon: 1});
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
            //刷新表格
            tableInit();
            layer.close(index);
        },
        content: template('updateConfigTpl', {
            _yearVersion: res.yearVersion,
            _paymentTypes: res.paymentTypes,
            _chargeRatio: res.chargeRatio,
            _paymentOperationId: res.paymentOperationId,
            _effectiveStartTime: res.effectiveStartTime,
            _effectiveEndTime: res.effectiveEndTime,
            _monthlyLimit: res.monthlyLimit,
            _monthlyMinimumAmount: res.monthlyMinimumAmount,
            _monthlyMaximumAmount: res.monthlyMaximumAmount
        })
    });
    laydate.render({
        elem: '#version2',
        type: 'year'
    });
    laydate.render({
        elem: '#effectiveStartTime2'
    });
    laydate.render({
        elem: '#effectiveEndTime2'
    });
    // 监听：是否限额
    form.on("radio(monthlyLimit)", function () {
        var monthlyLimit = $(this).val();
        if (monthlyLimit === '0') {
            // 显示
            $("#monthlyMinimumAmount2").toggleClass("layui-hide", false);
            $("#monthlyMaximumAmount2").toggleClass("layui-hide", false);
        } else {
            // 隐藏
            $("#monthlyMinimumAmount2").toggleClass("layui-hide", true);
            $("#monthlyMaximumAmount2").toggleClass("layui-hide", true);
        }
    });
    form.render();
}

/**
 * 删除配置
 * @param id 当前记录的id
 */
function deleteConfig (id) {
    console.log("================入参的id================");
    console.log("id: " + id);
    console.log("================入参的id================");
    layer.open({
        type: 1,
        fix: false, //不固定
        maxmin: false,
        title: "删除-支付宝手续费配置",
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var responseData = reqAjax(server.deleteConfig, JSON.stringify({
                id: id,
                userId: yyCache.get("userId")
            }));
            if (responseData.code === 1) {
                layer.msg(responseData.msg, {icon: 1});
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
            //刷新表格
            tableInit();
            layer.close(index);
        },
        content: "<p style='padding: 20px 10px;'>确定要删除吗？</p>"
    });
}
