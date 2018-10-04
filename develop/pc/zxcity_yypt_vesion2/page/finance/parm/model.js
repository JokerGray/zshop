//接口
var server = {
    dataList: 'commonConfig/selBasePublicModule', //(查询列表)
    exportExcel: 'commonConfig/exportBasePublicModule', //(导出Excel文件)
    addModule: 'commonConfig/insBasePublicModule', //(新增模块)
    updateModule: 'commonConfig/uptBasePublicModule' //(修改模块配置)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '编码',
        align: 'center',
        field: 'moduleNo'
    }, {
        title: '名称',
        align: 'center',
        field: 'moduleName'
    }, {
        title: '简称',
        align: 'center',
        field: 'moduleNote'
    }, {
        title: '创建时间',
        align: 'center',
        field: 'createTime',
        templet: function (res) {
            if (res.createTime) {
                return res.createTime;
            } else {
                return '-';
            }
        }
    }, {
        title: '状态',
        align: 'center',
        field: 'status',
        templet: function (res) {
            if (res.status === '1') {
                return "有效";
            } else {
                return "无效";
            }
        }
    }, {
        title: '备注',
        align: 'center',
        field: 'remark'
    }, {
        title: '操作',
        align: 'center',
        field: 'id',
        templet: function (res) {
            var html = "<button onclick='updateModuleConfig("+ JSON.stringify(res) +")' class='layui-btn layui-btn-normal layui-btn-sm'>编辑</button>";
            if (res.status === '1') {
                html += "<button onclick='updateModuleStatus(" + res.id + ", 0)' class='layui-btn layui-btn-danger layui-btn-sm'>注销</button>";
            } else {
                html += "<button onclick='updateModuleStatus(" + res.id + ", 1)' class='layui-btn layui-btn-sm'>激活</button>";
            }
            return html;
        }
    }
]];
/**
 * main方法，页面初始化
 */
var layer, $;
layui.use(['layer', 'jquery'], function () {
    layer = layui.layer;
    $ = layui.jquery;

    //表格初始化
    tableInit();

    //导出Excel按钮
    $('#exportBtn').on('click', function () {
        exportExcel();
    });
    //搜索按钮
    $('#searchBtn').on('click', function() {
        tableInit();
    });
    //增加配置
    $("#addConfigBtn").on("click", function () {
        addModuleConfig();
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
        console.log("===============请求的数据=================");
        console.log(res);
        console.log("===============请求的数据=================");

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
    //{'module':{'moduleName':''},'pagination':{'page':'1','page2':0,'rows':'10'}}
    var parms = {
        module: {
            moduleName: $('#accountnamer').val()
        }
    };
    if(index && limit){
        parms.pagination = {
            page: index,
            page2: 0,
            rows: limit
        };
    }
    console.log("===============请求的参数=================");
    console.log(JSON.stringify(parms));
    console.log("===============请求的参数=================");
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
 * 增加配置
 */
function addModuleConfig () {
    layer.open({
        type: 1,
        area: ['800px', '500px'],
        fix: false, //不固定
        maxmin: false,
        title: "新增页面",
        btn: ['保存', '取消'],
        yes: function (index, layero) {
            //{"module":{"moduleNo":"1235","moduleName":"1","moduleNote":"2","status":"1","remark":"3"}}
            var formData = $("#form-data").serializeArray(),
                sendData = {};
            for (var i = 0; i < formData.length; i++) {
                sendData[formData[i].name] = formData[i].value;
            }
            console.log("===========提交的数据==============");
            if (!sendData.moduleNo) {
                layer.msg("模块编码不能为空", {icon: 5});
                return;
            }
            if (sendData.moduleNo.length < 4) {
                layer.msg("模块编码必须为4位", {icon: 5});
                return;
            }
            if (!sendData.moduleName) {
                layer.msg("模块名称不能为空", {icon: 5});
                return;
            }
            sendData = {
                module: sendData
            };
            console.log(sendData);
            console.log("===========提交的数据==============");
            var responseData = reqAjax(server.addModule, JSON.stringify(sendData));
            if (responseData.code === 1) {
                layer.msg("添加成功", {icon: 1});
                //刷新表格
                tableInit();
                layer.close(index);
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
        },
        content: template('addModuleConfigTpl', {})
    });
    form.render();
}

/**
 * 更新配置
 * @parm res 模块详情
 */
function updateModuleConfig (res) {
    console.log("==============更新的入参==================");
    console.log(res);
    console.log("==============更新的入参==================");
    layer.open({
        type: 1,
        area: ['800px', '500px'],
        fix: false, //不固定
        maxmin: false,
        title: "修改页面",
        btn: ['确认修改', '取消'],
        yes: function (index, layero) {
            var formData = $("#form-data2").serializeArray(),
                sendData = {};
            for (var i = 0; i < formData.length; i++) {
                sendData[formData[i].name] = formData[i].value;
            }
            console.log("===========提交的数据==============");
            if (!sendData.moduleNo) {
                layer.msg("模块编码不能为空", {icon: 5});
                return;
            }
            if (sendData.moduleNo.length < 4) {
                layer.msg("模块编码必须为4位", {icon: 5});
                return;
            }
            if (!sendData.moduleName) {
                layer.msg("模块名称不能为空", {icon: 5});
                return;
            }
            sendData.id = res.id;
            sendData = {
                module: sendData
            };
            console.log(sendData);
            console.log("===========提交的数据==============");
            var responseData = reqAjax(server.updateModule, JSON.stringify(sendData));
            if (responseData.code === 1) {
                layer.msg(responseData.msg, {icon: 1});
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
            //刷新表格
            tableInit();
            layer.close(index);
        },
        content: template('updateModuleConfigTpl', {
            _moduleNo: res.moduleNo,
            _moduleName: res.moduleName,
            _moduleNote: res.moduleNote,
            _remark: res.remark,
            _status: res.status
        })
    });
    form.render();
}

/**
 * 更新模块激活状态
 * @param id 模块id
 * @param status 当前状态
 */
function updateModuleStatus (id, status) {
    layer.open({
        type: 1,
        fix: false, //不固定
        maxmin: false,
        title: "修改-支付宝手续费配置",
        btn: ['确认修改', '取消'],
        yes: function (index, layero) {
            var status = $("#form-data3").serializeArray()[0].value;
            var responseData = reqAjax(server.updateModule, JSON.stringify({
                module: {
                    id: id,
                    status: status
                }
            }));
            if (responseData.code === 1) {
                layer.msg(responseData.msg, {icon: 1});
            } else {
                layer.msg(responseData.msg, {icon: 5});
            }
            // 刷新表
            tableInit();
            layer.close(index);
        },
        content: template('updateModuleStatusTpl', {_status: status})
    });
    form.render();
}
