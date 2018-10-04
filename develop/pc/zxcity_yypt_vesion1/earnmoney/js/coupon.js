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
                if (res.code != 1) layer.msg(res.msg, {
                    icon: 2
                })
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
            }
        }
        if ($('#prizeTitle').val().length > 0) pagination['prizeTitle'] = $('#prizeTitle').val()
        if ($('#createTime').val().length > 0) pagination['createTime'] = $('#createTime').val()
        if ($('#shopName').val().length > 0) pagination['shopName'] = $('#shopName').val()

        params['cmd'] = 'earnmoney/getPlayerCouponList';
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
        field: 'shopName',
        title: '店铺名称',
        width: 200,
        align: 'center'
    }, {
        field: 'prizeStyle',
        title: '奖券样式',
        width: 200,
        align: 'center',
        class: 'imgInner',
        formatter: function(value, row, index) {
            return '<img src="' + value + '">'
        }
    }, {
        field: 'prizeTitle',
        title: '奖券标题',
        width: 200,
        align: 'center'
    }, {
        field: 'prizePrice',
        title: '面额',
        width: 150,
        align: 'center'
    }, {
        field: 'createTime',
        title: '发布时间',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return value.length == 0 ? '—' : value;
        }
    }, {
        field: 'prizeCount',
        title: '中奖次数',
        width: 100,
        align: 'center',
        formatter: function(value, row, index) {
            return value.length == 0 ? '—' : value;
        }
    }, {
        field: 'prizeStatus',
        title: '上架/下架',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            var btngroup = $($('#tplBtnGroup').html())
            btngroup.find('.btn').eq(parseInt(value) - 1).addClass('active')
            return btngroup.prop('outerHTML');
        }
    }, {
        field: 'id',
        title: '操作',
        width: 100,
        align: 'center',
        formatter: function(value, row, index) {
            var checkBtn = '<button class="btn btn-info" onclick="showDetail(this)">查看</button> ';
            return checkBtn;
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init();
    // 状态切换
    $('table').on('click', '.btn-group .btn', function() {
        changeStatus(this)
    })
}

// 修改状态
function changeStatus(btn) {
    if ($(btn).hasClass('active')) return
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    var params = {
        prizeId: data.id,
        prizeStatus: btn.value
    }
    var successFunc = function(data) {
        layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) $(btn).addClass('active').siblings().removeClass('active');
    }
    myAjax('earnmoney/updatePlayerCouponStatus', JSON.stringify(params), successFunc)
}

// 显示当前虚拟奖品详细
function showDetail(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    layer.open({
        type: 2,
        title: '虚拟奖品详细信息',
        content: 'coupon_detail.html?id=' + data.id,
        area: ['900px', '600px']
    })
}

function refreshTable() {
    $('#table').bootstrapTable('refresh')
}