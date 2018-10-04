

$(document).ready(function(){
    search();
});


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
   }


// 表格和查询初始化
function search(){
    var merchantId = getUrlParam('merchantId');

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
                cmd: 'fans/getLeaveList',
                data: JSON.stringify({
                    merchantId: merchantId,
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
            { 
                // field: 'name', 
                title: '序号', 
                width: 250, 
                align: 'center',
                formatter: function (val, row, index) {
                    // return index+1
                    var pageSize = $('#table').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#table').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            { field: 'userName', title: '姓名', width: 250, align: 'center'},
            { title: '请假时间', width: 250, align: 'center', formatter: function (val, row, index) {
                return row.leaveStartTime.substring(0,10) + ' ~ ' + row.leaveEndTime.substring(0,10)
            }},
            { field: 'leaveDay', title: '天数（天）', width: 250, align: 'center', formatter: function (val, row, index) {
                if(val == null){
                    return 0;
                }else{
                    return val;
                }
            }},
            { field: 'map', title: '操作', align: 'center',formatter: function(val, row, index){
                var edit = '<span class="btn btn-xs btn-link" onclick="editLeave('+row.leaveId+')" >编辑</span>';
                var del_leave = '<span type="button" class="btn btn-xs btn-link text-info"  onclick="deleteLeave('+row.leaveId+')" >删除</span>';
                return edit + '|' + del_leave;
            }}
        ]
    });

}
//新增请假
function restApply(){
    var merchantId = getUrlParam('merchantId');
    var newRest = layer.open({
        type: 2,
        // content: 'add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=0',
        content: 'newRest/rest.html?merchantId='+merchantId,
        title: false,
        // btn: ['取消','确认'],
        area: ['800px', '500px'],  
        // btn1: function(){//取消按钮
        //     parent.layer.closeAll()
        // },
        // btn2: function(){//确认按钮

        // },
        end: function(){
            search();
        }
    });
}
//编辑请假
function editLeave(id){
    var merchantId = getUrlParam('merchantId');
    var newRest = layer.open({
        type: 2,
        // content: 'add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=0',
        content: 'newRest/editRest.html?merchantId='+merchantId + '&leave_id='+id,
        title: false,
        // btn: ['取消','确认'],
        area: ['800px', '500px'],   
        // btn1: function(){//取消按钮
        //     parent.layer.closeAll()
        // },
        // btn2: function(){//确认按钮

        // },
        end: function(){
            search();
        }
    });
}
//删除请假
function deleteLeave(id){
    layer.confirm('确认删除这次请假吗？', {
        title: '删除请假',
        btn: ['取消','确认'] //按钮
      }, function(){
        layer.closeAll()
      }, function(){
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            headers: {
                apikey: 'test'
            },
            data: {
                cmd: 'fans/delLeave',
                data: JSON.stringify({
                    leaveId: id
                }),
            },
            beforeSend: function (request) {
                layer.load(0, { shade: [0.3, "#fff"] })
            },
            success: function (re) {
                layer.closeAll();
                search();
            },
            error: function (re) {
                parent.layer.msg('网络错误,稍后重试');
            },
            complete: function (re) {
                layer.closeAll();
            }
        });
      });
}