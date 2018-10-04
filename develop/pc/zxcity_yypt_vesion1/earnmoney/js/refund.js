// 表格初始化
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
        var data = {
            pagination: {
                page: params.offset / params.limit + 1,
                rows: params.limit
            }
        }
        if ($('#comsumerPhone').val().length > 0) data['comsumerPhone'] = $('#comsumerPhone').val()
        if ($('#couponName').val().length > 0) data['couponName'] = $('#couponName').val()

        params['cmd'] = 'earnmoney/getShareOrderRefundList';
        params['data'] = JSON.stringify(data);
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
// 表格初始化
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
        field: 'couponName',
        title: '分享赚标题',
        width: 200,
        align: 'left',
        halign: 'center'
    }, {
        field: 'couponDemand',
        title: '分享赚信息',
        width: 300,
        align: 'left',
        halign: 'center'
    }, {
        field: 'comsumerPhone',
        title: '用户电话号码',
        width: 200,
        align: 'center'
    }, {
        field: 'createTime',
        title: '购买时间',
        width: 200,
        align: 'center'
    }, {
        field: 'orderPrice',
        title: '支付金额',
        width: 200,
        align: 'center'
    }, {
        field: 'orderStatus',
        title: '状态',
        width: 150,
        align: 'center',
        formatter: function(value, row, index) {
            return value == 4 ? '<span class="text-muted">已退款</span>': '<button class="btn btn-danger btn-sm" onclick="refund(this)">退款</button>';
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}
// 搜索
function search() {
    $('#table').bootstrapTable('refresh')
}
// 重置
function refresh() {
    $('#toolbar form')[0].reset();
    $('#table').bootstrapTable('refreshOptions', {pageNumber: 1})
}
// 退款提示
function refund(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    var params = {
        id: data.id,
    }
    var successFunc = function(data) {
        layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) search()
    }
    var confirmIndex = layer.confirm('确定退款？', {title: '即将退款：'+data.couponName}, function(){
        layer.close(confirmIndex);
        layer.msg('退款还没做！');
        // myAjax('earnmoney/deletePlayerGoods', JSON.stringify(params), successFunc)
    });
}