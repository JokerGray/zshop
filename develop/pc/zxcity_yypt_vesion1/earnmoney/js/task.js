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
            striped: true,
            cache: false,
            pagination: true,
            sortable: false,
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
        if ($('#value').val().length > 0) pagination['value'] = $('#value').val()

        params['cmd'] = 'earnmoney/getReaprintExplainList';
        params['data'] = JSON.stringify(pagination);
        params['version'] = version;

        if (!param) return params;

        for (var k in param) params[k] = param[k]
        return params;
    };
    return oTableInit;
};
$(function() {
    tableInit()
})

function tableInit() {
    var columns = [{
        field: 'name',
        title: '序列号',
        width: 80,
        align: 'center'
    }, {
        field: 'value',
        title: '说明内容'
    }, {
        field: 'sort',
        title: '排序',
        width: 100,
        align: 'center'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 200,
        align: 'center'
    }, {
        field: 'id',
        title: '操作',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            var modifyBtn = '<button class="btn btn-warning btn-xs" onclick="showLayer(this)">修改</button> ';
            var delbtn = '<button class="btn btn-danger btn-xs" onclick="del(this)">删除</button> ';
            return modifyBtn + delbtn;
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function refreshTable() {
    $('#table').bootstrapTable('refresh')
}

// 显示新增或修改界面
function showLayer(btn) {
    var data = {};
    var title = '添加任务说明';
    if (btn) {
        var dataAll = $('#table').bootstrapTable('getData');
        data = dataAll[$(btn).parents('tr').index()];
        title = '修改任务说明';
    }
    localStorage.taskData = JSON.stringify(data);
    layer.open({
        type: 2,
        title: title,
        content: 'task_add.html',
        area: ['400px', '500px']
    })
}


function del(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    var params = {
        dictionaryId: data.id,
    }
    var successFunc = function(data) {
        layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) refreshTable();
    }
    var index = layer.confirm('确定删除该任务说明？', function() {
        layer.close(index)
        myAjax('earnmoney/deleteReaprintExplainDetail', JSON.stringify(params), successFunc)
    })
}