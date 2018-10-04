//接口
var server = {
    dataList: 'scLaborTaxList/selectList', //(查询列表)
    exportExcel: 'scLaborTaxList/exportScLaborTaxList'//(下载地址)
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
        title: '业务类型',
        align: 'center',
        field: 'businessType'
    }, {
        title: '纳税人名称',
        align: 'center',
        field: 'taxpayerName'
    }, {
        title: '身份证号',
        align: 'center',
        field: 'identificationNumber'
    }, {
        title: '手机号',
        align: 'center',
        field: 'phone'
    }, {
        title: '劳务费',
        align: 'center',
        field: 'laborCosts',
        style: 'color:#5fb878;'
    }, {
        title: '劳务费月总计',
        align: 'center',
        field: 'laborCostsMonthlyTotal'
    }, {
        title: '劳务税',
        align: 'center',
        field: 'laborTax'
    }, {
        title: '劳务税月总计',
        align: 'center',
        field: 'laborTaxMonthlyTotal'
    }, {
        title: '税后金额',
        align: 'center',
        field: 'afterTaxAmount',
        style: 'color:red;'
    }, {
        title: '打款时间',
        align: 'center',
        field: 'playingTime'
    }, {
        title: '提取状态',
        align: 'center',
        field: 'extractionState',
        templet: function (d) {
            var status = d.extractionState;
            if (status) {
                if (status === '1') {
                    return '<span style="color: red;">未提取</span>';
                }
                if (status === '2') {
                    return '<span style="color:#5fb878;">已提取</span>';
                }
            }
            return "-";
        }
    }
]];
var cacheCols = [];
var cacheIndex = [];
/**
 * main方法，页面初始化
 */
layui.use(['layer', 'jquery', 'laydate'], function () {
    var layer = layui.layer,
        $ = layui.jquery,
        laydate = layui.laydate;

    //日期控件
    laydate.render({
        elem: '#startDate',
        done: function(value) {
            $('.startDate').eq(0).attr('data-date', value)
        }
    });
    laydate.render({
        elem: '#endDate',
        done: function(value) {
            $('.endDate').eq(0).attr('data-date', value)
        }
    });

    //表格初始化
    tableInit();

    //导出Excel按钮
    $('#exportBtn').on('click', function () {
        var parms = getSearchParam();
        downloadFile(server.exportExcel, parms);
    });
    //设置按钮
    $('#setBtn').on('click', function () {
       openSettings();
    });
    //搜索按钮
    $('#searchBtn').on('click', function() {
        tableInit();
    });
    //劳务税提取按钮
    $('#extractBtn').on('click', function () {
        openExtractView(layer);
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
            cellMinWidth:80,
            done: function(res, curr, count) {
                console.log("Table rendering completed");
            }
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
    var serialNo=$('#serialNo').val();
    var taxpayerName = $('#taxpayerName').val();
    var businessType = $('#businessType').val();
    var startTime=$('#startDate').val();
    var endTime=$('#endDate').val();

    var parms = {
        serialNo: serialNo,
        taxpayerName: taxpayerName,
        businessType: businessType,
        startTime : startTime,
        endTime : endTime
    };
    if(index && limit){
        parms.pageNo = index;
        parms.pageSize = limit;
    }
    return JSON.stringify(parms);
}

/**
 * 劳务税提取操作
 * @param layer     layer对象
 */
function openExtractView(layer) {
    // 1.判断数据
    var startTime=$('#startDate').val(),
        endTime=$('#endDate').val();
    if (!startTime) {
        layer.msg("开始日期不能为空,请选择日期");
        return;
    }
    if (!endTime) {
        layer.msg("结束日期不能为空,请选择日期");
        return;
    }
    // 2.请求数据（同步）
    var resultData = reqAjax("scLaborTaxList/selectListCount", JSON.stringify({
        startTime: startTime,
            endTime: endTime
    }));
    if (resultData.code === 9) {
        layer.msg(resultData.msg, {icon: 5});
    } else {
        console.log("=============Todo：bug 查询会有多个结果===================");
        console.log(resultData);
        console.log("=============Todo：bug===================");
        // 3.打开弹窗
        layer.open({
            type: 1,
            area: ['800px', '350px'],
            fix: false, //不固定
            maxmin: false,
            title: "劳务税提取",
            btn: ['确认提交', '取消'],
            yes: function (index, layero) {
                // Todo：发起数据提交
                console.log("this is btn1");
            },
            btn2: function (index, layero) {
            },
            content: template('extractTpl', {
                startTime: startTime,
                endTime: endTime
            }),
            success: function(layero, index){
                console.log("弹窗弹出");
            }
        });
    }
}

/**
 * 设置表头
 */
function openSettings() {
    layui.use(['form', 'layer', 'jquery'], function () {
        var form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;

        // 查询表头
        var data = {};
        for (var i = 0; i < cols[0].length; i++) {
            data[cols[0][i].field] = true;
        }
        console.log("===============当前表头==================");
        console.log(data);
        console.log("===============当前表头==================");

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
            if (data.elem.checked) {
                // 添加
                for (var i = 0; i < cacheCols.length; i++) {
                    if (cacheCols[i].field === name) {
                        var node = cacheCols.splice(i, 1);
                        console.log("=================新增的节点===================");
                        console.log(node[0]);
                        console.log("=================新增的节点===================");

                        console.log("=================位置信息=====================");
                        // 查询位置信息
                        var index = cacheIndex[name];
                        console.log("index: " + index);
                        console.log("=================位置信息=====================");

                        console.log("=================截取的信息===================");
                        var newArray = cols[0].splice(index, cols[0].length - index);
                        console.log(newArray);
                        console.log("=================截取的信息===================");
                        console.log("=================更新的信息===================");
                        cols[0].push(node[0]);
                        cols[0] = cols[0].concat(newArray);
                        console.log(cols[0]);
                        console.log("=================更新的信息===================");
                    }
                }
            } else {
                // 减少
                for (var i = 0; i < cols[0].length; i++) {
                    if (cols[0][i].field === name) {
                        console.log("================当前元素==============");
                        console.log("name: " + name);
                        console.log("================当前元素==============");

                        var node = cols[0].splice(i, 1);
                        console.log("=================减少的节点===================");
                        console.log(node[0]);
                        console.log("=================减少的节点===================");
                        // 缓存节点信息
                        cacheCols.push(node[0]);
                        // 保留位置信息
                        cacheIndex[name] = i;
                        console.log("=================缓存的信息===================");
                        console.log(cacheCols);
                        console.log("=================缓存的信息===================");
                        console.log("=================缓存的位置信息===================");
                        console.log(cacheIndex);
                        console.log("=================缓存的位置信息===================");
                        console.log("=================更新的信息===================");
                        console.log(cols[0]);
                        console.log("=================更新的信息===================");
                    }
                }
            }
        });
    });
}
