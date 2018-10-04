//接口
var server = {
    dataList: 'payZyzzWorkOrder/selectZyzzWorkOrder', //(查询工单列表)
    userInfo: 'userInfo/appUser', //(查询App用户信息)
    auditWorkOrder: 'payZyzzWorkOrder/uptZyzzWorkOrderReviewStatus' //(查询工单详情)
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
            if (res.workStatus == "0") {
                return '<span>制作中</span>';
            } else if(res.workStatus == "1") {
                return '<span>制作完成</span>';
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
        field: 'sourceName'
    }, {
        title: '应收账款',
        align: 'center',
        field: 'reviewReceivable',
        templet: function (res) {
            return getMoneyFormat(res.reviewReceivable, 2);
        }
    }, {
        title: '实际收款',
        align: 'center',
        field: 'reviewActualReceivable',
        templet: function (res) {
            return getMoneyFormat(res.reviewActualReceivable, 2);
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
        title: '提交审核时间',
        align: 'center',
        field: 'submitTime'
    }, {
        title: '操作',
        align: 'center',
        field: 'id',
        templet: function (res) {
            return "<button onclick='audit("+ JSON.stringify(res) +")' class='layui-btn layui-btn-normal layui-btn-sm'>审核</button>"
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
    // 商户名称
    var orgName = $('#orgName').val();
    // 工单号
    var workNo = $('#workNo').val();
    var online=$('#online').val();
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();

    var parms = {
        reviewStatus: "0",
        orgName: orgName,
        workNo: workNo,
        online : online,
        submitTimeStart : startDate,
        submitTimeEnd: endDate
    };
    if(index && limit){
        parms.pageNo = index;
        parms.pageSize = limit;
    }
    return JSON.stringify(parms);
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
 * 审核工单
 * @param res 工单记录详情
 */
function audit (res) {
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
            data._reviewRefAmount = res.reviewActualReceivable * 0.2;
        }else{
            data._reviewRefAmount = 0;
        }
        if(res.workUserName){
            data._reviewWorkAmount = res.reviewActualReceivable * 0.3;
        }else{
            data._reviewWorkAmount = 0;
        }
        console.log(data);
        console.log("=============工单预览参数================");

        // 弹出层
        layer.open({
            type: 1,
            area: ['1000px', '550px'],
            fix: false,
            maxmin: true,
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                var formData = $("#form-data").serializeArray(),
                    sendData = {};
                for(var i = 0; i < formData.length; i++) {
                    sendData[formData[i].name] = formData[i].value;
                }

                // 运营平台审核人员信息
                var upgradeAuditUserId = yyCache.get("userId");
                var upgradeAuditUserName = yyCache.get("pcNickname");
                sendData.reviewYyUserId = upgradeAuditUserId;
                sendData.reviewYyName = upgradeAuditUserName;

                console.log("==============请求的数据===================");
                console.log(sendData);
                console.log("==============请求的数据===================");

                var responseData = reqAjax(server.auditWorkOrder, JSON.stringify(sendData));
                if (responseData.code === 1) {
                    layer.msg(responseData.msg, {icon: 1});
                } else {
                    layer.msg(responseData.msg, {icon: 5});
                }
                layer.close(index);
            },
            title: '专业制作结算审核',
            content: template('auditTpl', data)
        });
        form.render();
    });
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
