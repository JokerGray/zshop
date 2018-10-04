//接口
var server = {
    dataList: 'accountQualityInspection/selAccountInspectionDetailByPage' //(查询列表)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '用户姓名',
        align: 'center',
        field: 'userRealName',
        templet: function (res) {
            if (res.userRealName) {
                return res.userRealName;
            } else {
                return '-';
            }
        }
    }, {
        title: '用户昵称',
        align: 'center',
        field: 'userName'
    }, {
        title: '手机号',
        align: 'center',
        field: 'userPhone'
    }, {
        title: '账户余额',
        align: 'center',
        field: 'accountBalance'
    }, {
        title: '检查时间',
        align: 'center',
        field: 'inspectionTime'
    }, {
        title: '流水质检',
        align: 'center',
        field: 'inspectionStatus',
        templet: function (res) {
            if(res.inspectionStatus === "0"){
                return "<span style='color:green;'>正常</span>";
            }else if(res.inspectionStatus === "1"){
                return "<span style='color:red;'>异常</span>";
            }
        }
    }, {
        title: '业务质检',
        align: 'center',
        field: 'bizInspectionStatus',
        templet: function (res) {
            if (res.bizInspectionStatus) {
                return res.bizInspectionStatus;
            } else {
                return '-';
            }
        }
    }, {
        title: '详情',
        align: 'center',
        field: 'id',
        templet: function (res) {
            // URL附加参数
            var url = "page/finance/accountQualityInspection/bizInspectionDetail.html?id=" + res.id + "&userName=" + res.userName + "&userPhone=" + res.userPhone;
            url = encodeURI(url);
            return '<a href="#" onclick="getBizInspectionDetail(this)" data-url="' + url + '"><i class="fa fa-reorder"></i> <cite>业务质检详情</cite></a>';
        }
    }
]];
/**
 * main方法，页面初始化
 */
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer,
        $ = layui.jquery;

    //表格初始化
    tableInit();

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
    var username = $('#username').val();
    var phone = $('#phone').val();
    var status=$('#status').val();

    var parms = {
        username: username,
        phone: phone,
        status : status
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
 * 业务质检详情（通过父层打开页面）
 * @param _this 当前点击的元素
 */
function getBizInspectionDetail (_this) {
    top.addTab($(_this));
}
