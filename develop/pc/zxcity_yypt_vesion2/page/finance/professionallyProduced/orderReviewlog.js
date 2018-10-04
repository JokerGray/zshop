//接口
var server = {
    dataList: 'payZyzzWorkOrder/selectZyzzWorkOrder', //(分页记录)
    userInfo: 'userInfo/appUser' //(查询App用户信息)
};
// 表头的初始配置
var cols = [[
    {
        title: '序号',
        align: 'center',
        field: 'eq'
    }, {
        title: '工单号',
        align: 'center',
        field: 'workNo'
    }, {
        title: '账户名称',
        align: 'center',
        field: 'merchantName',
        templet: function (res) {
            if (res.merchantName) {
                return "<span onclick='openUserInfo(" + res.merchantId + ")' style='color: #337ab7; cursor: pointer;'>" + res.merchantName + "</span>";
            }
            return '-';
        }
    }, {
        title: '商户名称',
        align: 'center',
        field: 'orgName',
        templet: function (res) {
            if (res.orgName) {
                return "<span onclick='openUserInfo(" + res.merchantId + ")' style='color: #337ab7; cursor: pointer;'>" + res.orgName + "</span>";
            }
            return '-';
        }
    }, {
        title: '平台角色',
        align: 'center',
        field: 'rolesStr'
    }, {
        title: '工单制作项目',
        align: 'center',
        field: 'workItems',
        templet: function (res) {
            if (res.workItems === "0") {
                return "视频拍摄";
            } else if(res.workItems === "1") {
                return "720全景";
            } else if (res.workItems ==="0,1"){
                return "视频拍摄,720全景"
            } else {
                return "错误";
            }
        }
    }, {
        title: '制作状态',
        align: 'center',
        field: 'workStatus',
        templet: function (res) {
            if (res.workStatus === '0') {
                return "制作中";
            }
            if (res.workStatus === '1') {
                return "制作完成";
            }
        }
    }, {
        title: '工单类型',
        align: 'center',
        field: 'zyzzInfoId',
        templet: function (res) {
            if (res.zyzzInfoId) {
                return "<span style='color: green;'>线上工单</span>";
            } else {
                return "<span style='color:blue;'>线下工单</span>";
            }
        }
    }, {
        title: '工单来源',
        align: 'center',
        field: 'sourceName',
        templet: function (res) {
            if (res.sourceName) {
                return res.sourceName;
            } else {
                return '-';
            }
        }
    }, {
        title: '应收账款',
        align: 'center',
        field: 'reviewReceivable',
        templet: function (res) {
            return getMoneyFormat(res.reviewReceivable);
        }
    }, {
        title: '实际收款',
        align: 'center',
        field: 'reviewActualReceivable',
        templet: function (res) {
            return getMoneyFormat(res.reviewActualReceivable);
        }
    }, {
        title: '推荐人员',
        align: 'center',
        field: 'refUserName',
        templet: function (res) {
            if (res.refUserName) {
                return "<span onclick='openUserInfo(" + res.refUserId + ")' style='color: #337ab7; cursor: pointer;'>" + res.refUserName + "</span>";
            }
            return '-';
        }
    }, {
        title: '推荐提成',
        align: 'center',
        field: 'reviewRefAmount',
        templet: function (res) {
            return getMoneyFormat(res.reviewRefAmount);
        }
    }, {
        title: '制作人员',
        align: 'center',
        field: 'workUserName',
        templet: function (res) {
            if (res.workUserName) {
                return "<span onclick='openUserInfo(" + res.workUserId + ")' style='color: #337ab7; cursor: pointer;'>" + res.workUserName + "</span>";
            }
            return '-';
        }
    }, {
        title: '制作提成',
        align: 'center',
        field: 'reviewWorkAmount',
        templet: function (res) {
            return getMoneyFormat(res.reviewWorkAmount);
        }
    }, {
        title: '工单完成时间',
        align: 'center',
        field: 'finishTime'
    }, {
        title: '审核人员',
        align: 'center',
        field: 'reviewYyName',
        templet: function (res) {
            if (res.reviewYyName) {
                return "<span style='color: #337ab7; cursor: pointer;'>" + res.reviewYyName + "</span>";
            }
            return '-';
        }
    }, {
        title: '审核备注',
        align: 'center',
        field: 'reviewRemark'
    }, {
        title: '审核时间',
        align: 'center',
        field: 'reviewTime'
    }, {
        title: '财务审核状态',
        align: 'center',
        field: 'reviewStatus',
        templet: function (res) {
            if (res.reviewStatus === "0") {
                return "审核中";
            } else if(res.reviewStatus === "1") {
                return '<span style="color: blue">审核通过</span>';
            } else if(res.reviewStatus === "2") {
                return '<span style="color: red">审核不通过</span>';
            } else {
                return "错误";
            }
        }
    }, {
        title: '操作',
        align: 'center',
        field: 'id',
        templet: function (res) {
            return "<button onclick='preview("+ JSON.stringify(res) +")' class='layui-btn layui-btn-normal layui-btn-sm'>查看</button>"
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
                        pageCallback(obj.curr, obj.limit, function(res) {
                            tableIns.reload({
                                data: res.data
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
        $.each(res.data, function(i, item) {
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
    var orgName = $('#orgName').val();
    var workNo = $('#workNo').val();
    var reviewStatus=$('#reviewStatus').val();
    var online=$('#online').val();
    var workItem=$('#workItem').val();
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();

    var parms = {
        orgName: orgName,
        workNo: workNo,
        reviewStatus: reviewStatus,
        online : online,
        workItem : workItem,
        reviewTimeStart : startDate,
        reviewTimeEnd: endDate
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
            area: ['800px', '500px'],
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
 * 查看工单
 * @param res 工单记录详情
 */
function preview (res) {
    layui.use(['form', 'layer'], function () {
        console.log("=============工单详情入参================");
        console.log(res);
        console.log("=============工单详情入参================");
        console.log("=============工单预览参数================");
        var data = {
            _id: res.id,
            _workNo : res.workNo,
            _merchantName: res.merchantName,
            _orgName: res.orgName,
            _workSource: res.workSource,
            _payerName: res.payerName,
            _workStatus: res.workStatus,
            _reviewVideoReceivable: res.reviewVideoReceivable,
            // 720
            _reviewPanoramicReceivable: res.reviewPanoramicReceivable,
            _reviewReceivable: res.reviewReceivable,
            _reviewActualReceivable: res.reviewActualReceivable,
            _refUserName: res.refUserName,
            _workUserName: res.workUserName,
            _reviewRefAmount: res.reviewRefAmount,
            _reviewWorkAmount: res.reviewWorkAmount,
            _reviewRemark: res.reviewRemark,
            _reviewStatus: res.reviewStatus
        };
        if (res.workItems === "0") {
            data._workItems = "视频拍摄";
        } else if(res.workItems === "1") {
            data._workItems = "720全景";
        } else if (res.workItems ==="0,1"){
            data._workItems = "视频拍摄,720全景";
        }
        // 计算提成
        if(res.refUserName){
            data._reviewRefAmount = getMoneyFormat(res.reviewActualReceivable * 0.2, 2);
        }else{
            data._reviewRefAmount = 0;
        }
        if(res.workUserName){
            data._reviewWorkAmount = getMoneyFormat(res.reviewActualReceivable * 0.3, 2);
        }else{
            data._reviewWorkAmount = 0;
        }
        console.log(data);
        console.log("=============工单预览参数================");

        // 注册过滤器
        template.defaults.imports.fmoney = function (value) {
            return getMoneyFormat(value);
        };
        // 弹出层
        layer.open({
            type: 1,
            area: ['1000px', '550px'],
            fix: false,
            maxmin: true,
            title: '专业制作结算查看',
            btn: ['取消'],
            yes: function (index, layero) {
                layer.close(index);
            },
            content: template('previewTpl', data)
        });
        form.render();
    });
}
