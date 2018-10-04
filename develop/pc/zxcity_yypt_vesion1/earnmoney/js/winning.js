var TableInit = function(id, url, columns, param) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function() {
        $('#' + id).bootstrapTable({
            url: url,
            method: 'POST',
            contentType: "application/x-www-form-urlencoded",
            ajaxOptions: {
                headers: {
                    apikey: apikey
                }
            },
            responseHandler: function(res) {
                res.rows = res.data;
                return res;
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            toolbar: '#toolbar',
            cache: false,
            pagination: true,
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
    oTableInit.queryParams = function(params) {
        params['sort'] = params.sort;
        params['order'] = params.order;
        params['page'] = params.offset / params.limit + 1;
        params['rows'] = params.limit;
        var pagination = {
            pagination: {
                page: params.offset / params.limit + 1,
                rows: params.limit
            }
        }

        if ($('#phone').val().length > 0) pagination['phone'] = $('#phone').val()
        if ($('#prizeTitle').val().length > 0) pagination['prizeTitle'] = $('#prizeTitle').val()
        if ($('#createTime').val().length > 0) pagination['createTime'] = $('#createTime').val()

        params['cmd'] = 'earnmoney/getPlayerWinningList';
        params['data'] = JSON.stringify(pagination);
        params['version'] = version;

        if (!param) return params;

        for (var k in param) params[k] = param[k]
        return params;
    };
    return oTableInit;
};
$(function() {
    tableInit();
    $('#createTime').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        endDate: new Date()
    });
})

function tableInit() {
    var columns = [{
        field: 'index',
        title: '序号',
        width: 80,
        align: 'center',
        formatter: function(value, row, index) {
            var options = $('#table').bootstrapTable('getOptions');
            return (options.pageNumber - 1) * options.pageSize + index + 1
        }
    }, {
        field: 'phone',
        title: '电话号码',
        width: 200,
        align: 'center'
    }, {
        field: 'prizeTitle',
        title: '奖品名称',
        width: 200,
        align: 'center'
    }, {
        field: 'prizeType',
        title: '奖品类型',
        width: 200,
        align: 'center',
        class: 'imgInner',
        formatter: function(value, row, index) {
            return value == 2 ? '实物' : '票券';
        }
    }, {
        field: 'prizePrice',
        title: '面额',
        width: 200,
        align: 'center'
    }, {
        field: 'createTime',
        title: '中奖时间',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return value.length == 0 ? '—' : value;
        }
    }, {
        field: 'orderStatus',
        title: '状态',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            var arr = ['已确认', '已使用', '已失效', '已发货', '已收货'];
            var result = arr[parseInt(value) - 1];
            return !result ? arr[0] : result;
        }
    }];
    // , {
    //     field: 'id',
    //     title: '操作',
    //     width: 100,
    //     align: 'center',
    //     formatter: function(value, row, index) {
    //         return row.prizeType == 2 ? '<button class="btn btn-warning" onclick="showModify(this)">修改</button>' : '-';
    //     }
    // }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function search() {
    $('#table').bootstrapTable('refresh')
}

function refresh() {
    $('#toolbar form')[0].reset();
    search();
}

// 弹出修改页面
function showModify(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    layer.open({
        type: 1,
        title: '修改发货信息',
        content: 'test',
        area: ['600px', '400px']
    })
}

// 弹出详细弹窗
function showDetail(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
}