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
        params['cmd'] = 'earnmoney/getPlayerCardstyleList';
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
        align: 'center',
        formatter: function(value, row, index) {
            var options = $('#table').bootstrapTable('getOptions');
            return (options.pageNumber - 1) * options.pageSize + index + 1
        }
    }, {
        field: 'cardUrl',
        title: '卡券样式',
        width: 200,
        align: 'center',
        class: 'imgInner',
        formatter: function(value, row, index) {
            return '<img src="' + value + '">'
        }
    }, {
        field: 'createTime',
        title: '发布时间',
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return value == null || value.length == 0 ? '-' : value;
        }
    }, {
        field: 'cardStatus',
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
        width: 200,
        align: 'center',
        formatter: function(value, row, index) {
            return ' <button class="btn btn-danger" onclick="del(this)">删除</button>';
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init();
    // 状态切换
    $('table').on('click', '.btn-group .btn', function() {
        changeStatus(this)
    })

}

// 添加卡券
function openAddLayer() {
    layer.open({
        type: 2,
        title: '新增票券样式',
        content: 'coupon_style_add.html',
        area: ['400px', '400px']
    })
}

// 修改状态
function changeStatus(btn) {
    if ($(btn).hasClass('active')) return
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    var params = {
        cardId: data.id,
        cardStatus: btn.value
    }
    var successFunc = function(data) {
        layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) $(btn).addClass('active').siblings().removeClass('active');
    }
    myAjax('earnmoney/updatePlayerCardStyleStatus', JSON.stringify(params), successFunc)
}

// 删除这卡
function del(btn) {
    var dataAll = $('#table').bootstrapTable('getData');
    var data = dataAll[$(btn).parents('tr').index()];
    var params = {
        cardId: data.id,
    }
    var successFunc = function(data) {
        layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) refreshTable();
    }
    var index = layer.confirm('确定删除该卡券？', function() {
        layer.close(index)
        myAjax('earnmoney/deletePlayerCardStyle', JSON.stringify(params), successFunc)
    })
}

function refreshTable() {
    $('#table').bootstrapTable('refresh')
}