//接口
var server = {
    dataList: 'accountReversal/selectList', //(查询列表)
    exportExcel: 'accountReversal/exportReversalLogs', //(Excel导出)
    reversalRecord: 'accountReversal/addReversalLog' //(添加倒账记录)
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
        title: '操作人',
        align: 'center',
        field: 'yyUsername'
    }, {
        title: '倒账类型',
        align: 'center',
        field: 'reversalTypeStr'
    }, {
        title: '金额',
        align: 'center',
        field: 'money'
    }, {
        title: '创建时间',
        align: 'center',
        field: 'createTime'
    }, {
        title: '备注',
        align: 'center',
        field: 'remark'
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

    //设置按钮
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
    //新增倒账记录
    $('#addRecordBtn').on('click', function () {
        addReversalRecord();
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
        console.log("==============请求的数据================");
        console.log(res);
        console.log("==============请求的数据================");

        // 序号字段
        $.each(res.data.list, function(i, item) {
            $(item).attr('eq', (i + 1));
        });
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
    var serialNo = $('#serialNo').val();
    var operator = $('#operator').val();
    var type=$('#type').val();
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();

    var parms = {
        serialNo: serialNo,
        operator: operator,
        type : type,
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
 * 导出Excel
 */
function exportExcel () {
    var parms = getSearchParam();
    downloadFile(server.exportExcel, parms);
}

/**
 * 新增倒账记录
 */
function addReversalRecord () {
    layui.use(['layer', 'form', 'jquery'], function () {
        var layer = layui.layer,
            form = layui.form,
            $ = layui.jquery;

        layer.open({
            type: 1,
            area: ['800px', '500px'],
            fix: false, //不固定
            maxmin: false,
            title: "新增-倒账记录",
            btn: ['确认添加', '关闭'],
            yes: function (index, layero) {
                var formData = $("#form-data").serializeArray(),
                    sendData = {};
                for (var i = 0; i < formData.length; i++) {
                    sendData[formData[i].name] = formData[i].value;
                }
                // 判断入参
                if (sendData.reversalType === '-1') {
                    layer.msg('请选择类型', {icon: 5});
                    return;
                }
                if (!sendData.money) {
                    layer.msg('金额不能为空', {icon: 5});
                    return;
                }
                sendData.yyUserId = yyCache.get("userId");
                sendData.yyUsername = yyCache.get("pcNickname");
                console.log("============入参================");
                console.log(sendData);
                console.log("============入参================");
                var responseData = reqAjax(server.reversalRecord, JSON.stringify({entity: sendData}));
                if (responseData.code === 1) {
                    layer.msg(responseData.msg, {icon: 1});
                } else {
                    layer.msg(responseData.msg, {icon: 5});
                }
                // 刷新表格
                tableInit();
                layer.close(index);
            },
            content: template('reversalRecordTpl', {})
        });
        form.render();
    })
}
