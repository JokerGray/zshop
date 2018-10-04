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

        if ($('#feedbackInfo').val().length > 0) pagination['feedbackInfo'] = $('#feedbackInfo').val()

        params['cmd'] = 'newservice/findFeedBackList';
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
        width: 60,
        align: 'center',
        formatter: function(value, row, index) {
            var options = $('#table').bootstrapTable('getOptions');
            return (options.pageNumber - 1) * options.pageSize + index + 1
        }
    }, {
        field: 'userName',
        title: '发布人',
        width: 100,
        align: 'center'
    }, {
        field: 'categoryName',
        title: '服务类型',
        width: 100,
        align: 'center',
        formatter: function(value, row, index) {
            return value
        }
    }, {
        field: 'fromPage',
        title: '数据来源',
        width: 100,
        align: 'center'
    }, {
        field: 'feedbackInfo',
        title: '服务名称',
        width: 200,
        align: 'center'
    }, {
        field: 'remark',
        title: '理由或建议',
        width: 200,
        align: 'center'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 100,
        align: 'center',
        formatter: function(value, row, index) {
            return value == null || value.length == 0 ? '—' : value;
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function search() {
    $('#table').bootstrapTable('refresh')
}