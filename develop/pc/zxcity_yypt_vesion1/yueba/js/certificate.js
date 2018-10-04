var localData = {}
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
        if(localData.serviceName && localData.serviceName.length > 0) pagination['serviceName'] = localData.serviceName;
        if(localData.userName && localData.userName.length > 0) pagination['userName'] = localData.userName;
        if(localData.skillName && localData.skillName.length > 0) pagination['skillName'] = localData.skillName;

        params['cmd'] = 'newservice/findExaminingCertList';
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
        field: 'certName',
        title: '证书名称',
        width: 200,
        align: 'center'
    }, {
        field: 'skill.serviceName',
        title: '服务名称',
        width: 200,
        align: 'center'
    }, {
        field: 'skill.servicePrice',
        title: '服务价格（元）',
        width: 150,
        align: 'center'
    }, {
        field: 'skill.userName',
        title: '发布人',
        width: 150,
        align: 'center'
    }, {
        field: 'skill.createTime',
        title: '创建时间',
        width: 150,
        align: 'center'
    }, {
        field: 'id',
        title: '操作',
        width: 150,
        align: 'center',
        formatter: function(value, row, index) {
            return '<button type="button" class="btn btn-info btn-xs" onclick="openExamLayer(this)">审核</button>'
        }
    }];

    Table = new TableInit('table', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function search(){
    localData.serviceName = $('#serviceName').val();
    localData.userName = $('#userName').val();
    localData.skillName = $('#skillName').val();
    $('#table').bootstrapTable('selectPage', 1);
}

function refreshTable () {
    $('#table').bootstrapTable('refresh');
}

// 打开证书审核页面
function openExamLayer(btn) {
    var data = $('#table').bootstrapTable('getData')[$(btn).parents('tr').index()];
    localStorage.certificateData = JSON.stringify(data);
    layer.open({
        type: 2,
        title: '技能证书审核',
        content: 'certificate_exam.html',
        area: ['1000px', '750px']
    })
}