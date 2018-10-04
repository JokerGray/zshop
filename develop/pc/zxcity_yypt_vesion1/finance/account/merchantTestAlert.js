var oTable;
$(function() {
    oTable = new TableInit();
    oTable.Init();

});

var TableInit = function() {
    var oTableInit = new Object();

    oTableInit.Init = function() {
        $('#table').bootstrapTable('destroy').bootstrapTable(
                {
                    url : '/zxcity_restful/ws/rest',
                    method : 'POST', // 请求方式（*）
                    striped : true, // 是否显示行间隔色
                    cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端
                    strictSearch : true,
                    showColumns : true, // 是否显示所有的列
                    showRefresh : true, // 是否显示刷新按钮
                    minimumCountColumns : 2, // 最少允许的列数
                    searchOnEnterKey : true,
                    // toolbar:'#toolbar',
                    // searchText: '',
                    pagination : true, // 是否显示分页（*）
                    sortable : false, // 是否启用排序
                    sortName : "createTime", // 排序的字段
                    sortOrder : "desc", // 排序方式
                    contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
                    queryParams : oTableInit.queryParams,// 传递参数（*）
                    sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber : 1, // 初始化加载第一页，默认第一页
                    pageSize : 10, // 每页的记录行数（*）
                    pageList: [10], //可供选择的每页的行数（*）
                    // strictSearch: true,
                    // clickToSelect: true, //是否启用点击选中行
                    // height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId : "id", // 每一行的唯一标识，一般为主键列
                    cardView : false, // 是否显示详细视图
                    detailView : false, // 是否显示父子表
                    showPaginationSwitch : true,
                    ajaxOptions : {
                        beforeSend : function(request) {
                            request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test"
                                    : yyCache.get("apikey"));
                        }
                    },
                    responseHandler : function(res) {
                        if (res.code == 1) {
                            res.rows = res.data.list;
                            res.total = res.data.total;
                            return res;
                        }
                    },
                    columns : [
                            {
                                field : 'Number',
                                title : '序号',
                                align : "center",
                                width : 100,
                                formatter : function(value, row, index) {
                                    return index + 1;
                                }
                            },
                            {
                                field : 'code',
                                title : '短信标题',
                                align : "center",
                                width : 150
                            },
                            {
                                field : 'content',
                                title : '短信内容',
                                sortable : true,
                                width : 330,
                                align : "center",
                                formatter : function(value, row, index) {
                                    var note = '<div class="note" title="'+value+'">' + newStrByNum(value, 20) + '</div>'
                                    if(value && value){
                                        return note;
                                    }
                                }
                            },
                            {
                                field : 'createTime',
                                title : '创建时间',
                                width : 150,
                                align : "center",
                                formatter : function(value, row, index) {
                                    if (value) {
                                        return getYMDHmm(value);
                                    } else {
                                        return '-';
                                    }
                                }
                            },
                            {
                                field : 'remark',
                                title : '备注',
                                sortable : true,
                                width : 330,
                                align : "center",
                                formatter : function(value, row, index) {
                                    var note = '<div class="note" title="'+value+'">' + newStrByNum(value, 20) + '</div>'
                                    if(value && value){
                                        return note;
                                    }
                                }
                            },
                            {
                                field : '_z',
                                title : '操作',
                                sortable : true,
                                width : 330,
                                align : "center",
                                formatter : function(res, data) {
                                    var btn;
                                    btn = '<button type="button" class="btn btn-xs btn-link" onclick="openForm('
                                            + data.id + ')">修改</button>';
                                    return btn += '<button type="button" class="btn btn-xs btn-link" onclick="del('
                                            + data.id + ')">删除</button>';
                                }
                            } ],
                    onLoadSuccess : function() {
                        // layer.msg('加载成功');
                    },
                    onLoadError : function() {
                        // layer.msg('未检索到**信息');
                    }
                });
    };

    // 得到查询的参数
    oTableInit.queryParams = function(params) {
        var cmd = "trialMsgTemplate/ajaxMsgTemplateList";
        var version = "1";

        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;

        return {
            cmd : cmd,
            data : getSearchParam(pageNo, pageSize),
            version : version
        }
    };
    return oTableInit;
};
// 拼接参数
function getSearchParam(pageNo, pageSize) {
    var jsonData = {};
    var code = $('#code').val();
    var state = $("#state").val();

    jsonData = {
        code : code,
//        startTime : startTimes,
//        endTime : endTimes,
        state : "1"
    };

    if (pageNo && pageNo) {
        jsonData.pageNo = pageNo;
        jsonData.pageSize = pageSize;
    }
    return JSON.stringify(jsonData);
}

// 查询搜索事件
$("#searchbtn").bind("click", function() {
    oTable.Init();
    accountDynamicColumn.initCookie();
});

// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
    // 定义要下载的excel文件路径名
    var excelFilePathName = "";
    try {
        // 1. 发送下载请求 , 业务不同，向server请求的地址不同
        var excelUrl = reqAjax('payExcel/exportMsgTemplateList', getSearchParam());
        // 2.获取下载URL
        excelFilePathName = excelUrl.data;
        // 3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
        if (excelUrl.code != 1) {
            layer.msg(excelUrl.msg);
        } else {
            // 2.获取下载URL
            excelFilePathName = excelUrl.data;
            // 3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
            if ("" != excelFilePathName) {
                var aIframe = document.createElement("iframe");
                aIframe.src = excelFilePathName;
                aIframe.style.display = "none";
                document.body.appendChild(aIframe);
            }
        }
    } catch (e) {
        alert("异常：" + e);
    }
});

//打开编辑模板的弹窗
function openForm(id) {
    var pageState = id && id;
    layer.open({
        type : 2,
        area : [ '800px', '500px' ],
        fix : false, // 不固定
        maxmin : false,
        title : "编辑短信模板",
        content : pageState ? "msgTplDialog.html?id=" + id : 'msgTplDialog.html',
        btn : [ '确认', '关闭' ],
        btn1 : function(index, layero) {
            var body = layer.getChildFrame('body', index);
            if(validation(body)){
                
                // 保存/修改短信模板内容
                var data = reqAjax('trialMsgTemplate/ajaxMsgTemplateSave', JSON.stringify({
                    code : body.find('#code').val(),
                    content : body.find('#content').val(),
                    remark: body.find('#remark').val(),
                    userId: yyCache.get('userId'),
                    id : id
                })
                );
                
                if(data && data.code == 1){
                    layer.msg('操作成功');
                    layer.close(index);
                    oTable.Init();
                    accountDynamicColumn.initCookie();
                }else if(data.code == -1){
                    layer.alert(data.msg);
                }else{
                    layer.alert('操作失败,请联系客服');
                }
            }

        },
        btn2 : function(index, layero) {
            
        }
    });
}

function validation(body){
    var code = body.find('#code').val();
    var content = body.find('#content').val();
    var remark = body.find('#remark').val();
    var flag = true;
    var msg = '';
    
    if(!(code && code)){
        flag = false;
        msg = '短信标题不能为空';
    }else if(!(content && content)){
        flag = false;
        msg = '短信内容不能为空';
    }
    
    if(!flag){
        layer.alert(msg);
    }
    return flag;
}

function del(id) {
    
    layer.confirm('确认要删除吗?',function(){
            var param = {
                id: id,
                state: 0
        }
        
        var data = reqAjax('trialMsgTemplate/ajaxMsgTemplateSave', JSON.stringify(param));
        if(data && data.code == 1){
            layer.msg('操作成功');
            oTable.Init();
            accountDynamicColumn.initCookie();
        }else{
            layer.alert('操作失败,请联系客服');
        }
    });

}
