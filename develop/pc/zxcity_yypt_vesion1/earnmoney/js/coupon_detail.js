var prizeId = GetQueryString('id');
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
            prizeId: prizeId
        }

        params['cmd'] = 'earnmoney/getPlayerCouponUserList';
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
    dataInit();
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
        title: '用户电话号码',
        width: 200,
        align: 'center'
    }, {
        field: 'createTime',
        title: '中奖时间',
        width: 200,
        align: 'center'
    }, {
        field: 'cardNumber',
        title: '票券号',
        width: 200,
        align: 'center'
    }, {
        field: 'orderStatus',
        title: '状态',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return value == 1 ? '未消费' : value == 2 ? '已消费': '已失效';
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init();
    // 状态切换
    $('table').on('click', '.btn-group .btn', function() {
        changeStatus(this)
    })
}

function dataInit() {
    var id = GetQueryString('id');
    var params = {
        prizeId: id
    }
    var successFunc = function(data) {
        if (data.code != 1) layer.msg(data.msg, {
            icon: 2
        })
        if (data.code == 1) {
            for (var key in data.data) $('#' + key).text(data.data[key])
            var status = data.data['prizeStatus'];
            $('#prizeStatus').text(status == 1 ? '上架' : '下架');
            $('#prizeStatus').addClass(status == 1 ? '' : 'down');
            $('#prizeCount').text($('#prizeCount').text() + ' 人')
            $('#prizePrice').text($('#prizePrice').text() + ' 元')
        }
    }
    myAjax('earnmoney/getPlayerCouponDetail', JSON.stringify(params), successFunc)
}