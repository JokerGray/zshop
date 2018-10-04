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
                res.rows = res.data.categoryList;
                return res;
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            toolbar: '#toolbar',
            toolbarAlign: 'right',
            cache: false,
            pagination: false,
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
            },
            versionValue: -1
        }

        if ($('#feedbackInfo').val().length > 0) pagination['feedbackInfo'] = $('#feedbackInfo').val()

        params['cmd'] = 'newservice/getCategoryList';
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
        field: 'index',
        title: '序号',
        width: 80,
        searchable: false,
        align: 'center',
        formatter: function(value, row, index) {
            var options = $('#table').bootstrapTable('getOptions');
            return (options.pageNumber - 1) * options.pageSize + index + 1
        }
    }, {
        field: 'categoryName',
        title: '分类名称',
        width: 200,
        align: 'center'
    }, {
        field: 'sort',
        title: '优先级',
        searchable: false,
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return value
        }
    }, {
        field: 'id',
        title: '操作',
        searchable: false,
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return '<button class="btn btn-info btn-sm" onclick="openPage(3, this)">修改</button>'
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init();
    // 初始化子列表
    $('#childTable').bootstrapTable({
        columns: columns,
        toolbar: '#subToolbar',
        toolbarAlign: 'right',
        sidePagination: 'client',
        pagination: true,
        cache: false,
        search: true,
        searchTimeOut: 200
    });
    // 点击事件，显示下一级分类
    $('#table').on('click-row.bs.table', function(e, row, tr) {
        tr.addClass('active').siblings().removeClass('active');
        $('#childTable').bootstrapTable('resetSearch');
        $('#childTable').bootstrapTable('load', row.categoryList);
    })
}

function refreshTable() {
    $('#table').bootstrapTable('refresh');
    $('#childTable').bootstrapTable('resetSearch');
    $('#childTable').bootstrapTable('load', []);
}

// 打开增、改界面
// flag，1、2、3，新增主分类，新增子分类，修改分类
function openPage(flag, btn) {
    var title = '新增服务分类'
    var params = {};
    if (flag == 2) {
        title = '新增子服务分类';
        if ($('#table tr.active').index() < 0) return layer.msg('请选择主分类！', {
            icon: 2
        })
        params = $('#table').bootstrapTable('getData')[$('#table tr.active').index()];
    }
    if (flag == 3) {
        title = '修改服务分类';
        var table = $(btn).parents('table');
        var tr = $(btn).parents('tr');
        // 主服务分类和子服务分类的数据获取方法不一样
        params = table.bootstrapTable('getData')[table.attr('id') == 'table' ? tr.index() : tr.data('index')];
    }
    params._flag = flag;
    localStorage.serviceData = JSON.stringify(params)
    layer.open({
        type: 2,
        title: title,
        content: 'service_add.html',
        area: ['400px', '600px']
    })
}