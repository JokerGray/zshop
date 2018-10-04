// 定义活动状态
var Status = [
    ['活动发布', '#b692ea'],
    ['活动审核', '#f2ad4e'],
    ['经费发放', '#5ac2df'],
    ['结余申请', '#3279b6'],
    ['结余审核', '#0ac6c8'],
    ['结余发放', '#5cb65c']
]

$(document).ready(function(){
    init();
});

// 初始化
function init() {
    // 时间选择器初始化
    $('#startDate, #endDate').datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd',
        minView: 2,
        startDate: '2000-01-01',
        // endDate: '2020-12-30'
    });
    // 时间选择器互动
    $('#startDate').on('changeDate', function(ev){
        $('#endDate').datetimepicker('setStartDate', ev.date);
        var d = $('#endDate').val();
        if (d) {
            var date = new Date(d.replace(/-/g, '/'));
            if(date != 'Invalid Date' && date < ev.date){
                $('#endDate').datetimepicker('setDate', ev.date)
            }
        }
    });

    // 切换审批和活动
    $('#myCheckBtn').on('click',function(){
        $('#myCheckBtn').removeClass('btn-default').addClass('index-btn-default')
        $('#allActiveBtn').removeClass('index-btn-default').addClass('btn-default')
    })
    $('#allActiveBtn').on('click',function(){
        $('#allActiveBtn').removeClass('btn-default').addClass('index-btn-default')
        $('#myCheckBtn').removeClass('index-btn-default').addClass('btn-default')
    })
    // $('.toggleGroup').on('click', '.btn', function(){
    //     $('.toggleGroup .btn').toggleClass('btn-default index-btn-default');
    // });

    search();
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
   }


// 打开发起活动的页面
function openAddPage(){
    var merchantId = getUrlParam('merchantId');
    var userId = getUrlParam('userId');
    layer.open({
        type: 2,
        content: 'add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=0',
        title: false,
        btn: false,
        area: ['80%', '93%'],   
        end: function(){
            search();   
        }
    });
}
// 打开补录活动的页面
function afterAddPage(){
    var merchantId = getUrlParam('merchantId');
    var userId = getUrlParam('userId');
    layer.open({
        type: 2,
        content: 'add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=2',
        title: false,
        btn: false,
        area: ['80%', '93%'],   
        end: function(){
            search();   
        }
    });
}
//打开 查看状态页面(无权审批)
function checkStatus(active_id){
    var userId = getUrlParam('userId');
    var merchantId = getUrlParam('merchantId');
    layer.open({
        type: 2,
        content: 'status/status.html?merchantId='+merchantId+'&&userId='+userId +'&&isAuth=0',
        title: false,
        btn: false,
        area: ['80%', '80%'],
        success: function(layero, index){
            localStorage.setItem('status_active_id', active_id);
        },
        end: function(){
            localStorage.removeItem('status_active_id');
        }
    });
}
//打开 立即审批页面
function checkStatusByAuth(active_id){
    var userId = getUrlParam('userId');
    var merchantId = getUrlParam('merchantId');
    layer.open({
        type: 2,
        content: 'status/status.html?merchantId='+merchantId+'&&userId='+userId,
        title: false,
        btn: false,
        area: ['80%', '80%'],
        success: function(layero, index){
            localStorage.setItem('status_active_id', active_id);
        },
        end: function(){
            localStorage.removeItem('status_active_id');
            $('#table').bootstrapTable('refresh')
        }
    });
}
//打开编辑活动页面
function editActivity(active_id, step_id){
    var userId = getUrlParam('userId');
    var merchantId = getUrlParam('merchantId');
    layer.open({
        type: 2,
        content: 'add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=1'+'&&activityId='+active_id + '&&stepId='+step_id,
        title: false,
        btn: false,
        area: ['80%', '80%'],
        success: function(layero, index){
            localStorage.setItem('status_active_id', active_id);
        },
        end: function(){
            localStorage.removeItem('status_active_id');
            $('#table').bootstrapTable('refresh')
        }
    });
}

// 表格和查询初始化
function search(flag){
    var merchantId = getUrlParam('merchantId');
    var userId = getUrlParam('userId');
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    var status = $('#status').val();
    //根据参数不同，切换不同数据：全部数据/我的审批
    switch(flag){
        case 'all':
            nextAudUser = '';
            break;
        case 'mine':
            nextAudUser = userId;
            break;
        default:
            nextAudUser = '';
            break;
    }

    $('#table').bootstrapTable('destroy').bootstrapTable({
        url: '/zxcity_restful/ws/rest',
        method: 'post',
        ajaxOptions:{
            headers:{
                apikey: 'test'
            }
        },
        contentType: "application/x-www-form-urlencoded",
        queryParams: function(params){
            var p = {
                cmd: 'fans/getApplyActivityList',
                data: JSON.stringify({
                    userId: userId,
                    merchantId: merchantId,
                    applyStatus: status,
                    nextAudUser: nextAudUser,
                    bTime: startDate,
                    sTime: endDate,
                    sStartpage: params.offset/params.limit + 1,
                    sPagerows: params.limit
                    // pagination: {
                    //     page: params.offset/params.limit + 1,
                    //     rows: params.limit
                    // }
                }),
                version: 1
            }
            return p;
        },
        responseHandler: function(res){
            res.rows = res.data
            return res;
        },
        sidePagination: "server",
        pageNumber:1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        striped: true,
        pagination: true,
        sortable: false,
        cardView: false,
        detailView: false,
        columns: [
            { field: 'name', title: '活动', width: 200, align: 'center'},
            { field: 'startTime', title: '开始时间', width: 200, align: 'center'},
            { field: 'joinNum', title: '报名人数', width: 200, align: 'center', formatter: function (val, row, index) {
                if(val == null){
                    return 0;
                }else{
                    return val;
                }
            }},
            { field: 'perBudget', title: '人均预算', width: 200, align: 'center', formatter: function (val, row, index) {
                if(val == null){
                    return 0;
                }else{
                    return val;
                }
            }},
            { field: 'map', title: '活动状态', width: 200, align: 'center'
                , formatter: function (val, row, index) {
                    text = val.tip
                    num = val.stepId;
                    active_step = val.stepId + 1;
                    // text = $('#status option').eq(num).text()
                    switch(num){
                        case 0:
                            return '<span class="colorGrape">'+active_step+'&nbsp'+text+'</span>';
                        case 1:
                            return '<span class="colorPink">'+active_step+'&nbsp'+text+'</span>';
                        case 2:
                            return '<span class="colorYellow">'+active_step+'&nbsp'+text+'</span>';
                        case 3:
                            return '<span class="colorSkyBlue">'+active_step+'&nbsp'+text+'</span>';
                        case 4:
                            return '<span class="colorDarkBlue">'+active_step+'&nbsp'+text+'</span>';
                        case 5:
                            return '<span class="colorLittleBlue">'+active_step+'&nbsp'+text+'</span>';
                        case 6:
                            return '<span class="colorGreen">'+active_step+'&nbsp'+text+'</span>';
                    }
                }
            },
            { field: 'map', title: '操作', align: 'center',formatter: function(val, row, index){
                // return row.id
                id = row.id;
                var showDetail = '<span class="btn btn-xs btn-link" onclick="checkStatus('+id+')" >查看状态</span>';
                var shenqing = '<span type="button" class="btn btn-xs btn-link text-info"  onclick="checkStatusByAuth('+id+')" >立即申请</span>';
                var approve = '<span type="button" class="btn btn-xs btn-link text-info"  onclick="checkStatusByAuth('+id+')" >立即审批</span>';
                var edit = '<span type="button" class="btn btn-xs btn-link text-info"  onclick="editActivity('+id+','+row.stepId + ')" >再次发起</span>';
            /*    if(val.isAuth == 1 && row.stepId !=0 && row.stepId !=6){
                    return showDetail + approve;
                }else if(row.stepId ==0 && val.isMine ==1){
                    return showDetail + edit;
                }else{
                    return showDetail
                }*/
                switch(row.stepId){
                    case 0:
                        if(val.isMine == 1){
                            return showDetail + edit;
                        }else{
                            return showDetail;
                        }

                    case 1:
                        if(val.isAuth == 1){
                            return approve;
                        }else{
                            return showDetail;
                        }

                    case 2:
                        if(val.isAuth == 1){
                            return approve;
                        }else{
                            return showDetail;
                        }

                    case 3:
                        if(val.isMine == 1){
                            return shenqing;
                        }else{
                            return showDetail;
                        }

                    case 4:
                        if(val.isAuth == 1){
                            return approve;
                        }else{
                            return showDetail;
                        }

                    case 5:
                        if(val.isAuth == 1){
                            return approve;
                        }else{
                            return showDetail;
                        }
                    case 6:
                        return showDetail;
                        
                }
                
            }}
        ]
    });

}

