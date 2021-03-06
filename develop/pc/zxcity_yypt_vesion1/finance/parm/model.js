$(function () {
    var oTable = new TableInit();
    oTable.Init();
});
var TableInit = function () {
    var oTableInit = new Object();

    oTableInit.Init = function () {
        $('#table').bootstrapTable({
            url: '/zxcity_restful/ws/rest',
            method: 'POST',           //请求方式（*）
            striped: true,           //是否显示行间隔色
            cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端  
            strictSearch: true,  
            showColumns: true,     //是否显示所有的列  
            showRefresh: true,     //是否显示刷新按钮  
            minimumCountColumns: 2,    //最少允许的列数  
            search: true,
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "merchantId",     //排序的字段
            sortOrder: "desc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            showPaginationSwitch: true,
            apikey: yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"),
            responseHandler:function(res){
                if(res.code == 1){
                    return res;
                }
            },
            columns: [
            {field: 'Number',title:'序号',width: 80,align : "center",
                formatter: function(value,row,index){
                    return index+1;
                }
            },
            {field: 'moduleNo',title:'编码',sortable: true,width: 150,align : "center",
            	formatter: function(res){
                    if(!res){
                        return res="-";
                    }else{
                        return res;
                    }
                }
            },
            {field: 'moduleName',title:'名称',width: 150,align : "center",
            	formatter: function(res){
                    if(!res){
                        return res="-";
                    }else{
                        return res;
                    }
                }
            },
            {field: 'moduleNote',title:'简称',width: 150,align : "center",
            	formatter: function(res){
                    if(!res){
                        return res="-";
                    }else{
                        return res;
                    }
                }
            },
            {field: 'createTime',title:'创建时间',width: 150,align : "center",
                formatter: function(res){
                    if(res==null){
                        return res="-";
                    }else{
                        return res;
                    }
                }
            },
//            {field: 'accountName',title:'创建人',width: 150,align : "center",
//                formatter: function(res){
//                    if(res==null){
//                        return res="-";
//                    }else{
//                        return res;
//                    }
//                }
//            },
            {field: 'status',title:'状态',width: 150,align : "center",
                formatter: function(value, row, index){
                    if(value=='1'){
                        return value='有效';
                    }else{
                        return value='无效';
                    }
                }
            },
            {field: 'remark',title:'备注',width: 150,align : "center",
                formatter: function(remark){
                	if(!remark){
                        return remark="-";
                    }else{
                    	return '<div class="note" title="remark">'+newStrByNum(remark,20)+'</div>';
                    }
                }
            },
            {field: 'status',title:'操作',width: 200,align : "center",
                formatter: function(value, row, index){
                    if(value=='1'){
                        var btn='<button type="button" class="btn btn-info btn-sm ml20 edit" aria-hidden="true" style="margin-right:15px;margin-right: 15; padding-top: 0; padding-bottom: 0;" data-toggle="modal" data-target="#editModal">编辑</button>'+
                        '<button type="button" class="btn btn-danger btn-sm ml20 activate" aria-hidden="true" style="margin-right:15px;margin-right: 15; padding-top: 0; padding-bottom: 0;" data-toggle="modal" data-target="#statsModal">注销</button>';
                        return btn;
                    }else{
                        var btn='<button type="button" class="btn btn-info btn-sm ml20 edit" aria-hidden="true" style="margin-right:15px;margin-right: 15; padding-top: 0; padding-bottom: 0;" data-toggle="modal" data-target="#editModal">编辑</button>'+
                        '<button type="button" class="btn btn-success btn-sm ml20 activate" aria-hidden="true" style="margin-right:15px;margin-right: 15; padding-top: 0; padding-bottom: 0;" data-toggle="modal" data-target="#statsModal">激活</button>';
                        return btn;
                    }
                },
                events: operateEvents
            }],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "commonConfig/selBasePublicModule";
        var jsonData="";
        var pageNo = findByCondition ? 1 : params.pageNumber;
        var pageSize = params.pageSize;
        var version = "1";
        var station=$('#accountnamer').val();
        jsonData = "{'module':{'moduleName':'"+station+"'},'pagination':{'page':'"+pageNo+"','page2':0,'rows':'"+pageSize+"'}}";
        findByCondition = false;
        return {
            sort: params.sort,
            order: params.order,
            page: params.offset/params.limit+1,
            rows: params.limit,
            cmd: cmd,
            data: jsonData,
            version: version
        }
    };
    return oTableInit;

};
    var findByCondition = false;
    //查询搜索
$("#searchbtn").bind("click", function(){
    findByCondition = true;
    $('.pagination .page-first').click();
    $('#table').bootstrapTable('refresh');
});


//添加数据
$("#addsave").bind("click",function(){
    var moduleNo=$('#moduleNo').val();
    var reg = /^\d{4}$/;
    if(!reg.test(moduleNo)){
    	layer.msg("模块编码为4位数字");
    	return;
    }
    var moduleName=$('#moduleName').val();
    var moduleNote=$('#moduleNote').val();
    var remark=$('#note').val();
    var status="";
    $('.status').each(function(index, el) {
        if($(this).is(':checked')){
            status=$(this).val();
        }
    });
    var param = '{"module":{"moduleNo":"'+moduleNo+'","moduleName":"'+moduleName+'","moduleNote":"'+moduleNote+'","status":"'+status+'","remark":"'+remark+'"}}';
    res =reqAjax('commonConfig/insBasePublicModule', param);
    if(res.code == 9){
    	layer.msg(res.msg);
    	return
    }
    $('#insFrom').submit();
});




//修改数据
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        var editJson=JSON.stringify(row);
        var parsedJson = $.parseJSON(editJson); 
        $('#editNo').val(parsedJson.moduleNo);
        $('#editName').val(parsedJson.moduleName);
        $('#editNote').val(parsedJson.moduleNote);
        $('#editnote').val(parsedJson.remark);
        $('#id').val(parsedJson.id);
        if(parsedJson.status=='0'){
            $('.status1').prop('checked',true);
            $('.status0').removeAttr('checked');
        }else if(parsedJson.status=='1'){
            $('.status0').prop('checked',true);
            $('.status1').removeAttr('checked');
        }
    },
    'click .activate': function(e, value, row, index) {
        var editJson=JSON.stringify(row);
        var parsedJson = $.parseJSON(editJson);
        $('#id').val(parsedJson.id);
        if(parsedJson.status=='0'){
            $('.status1').prop('checked',true);
            $('.status0').removeAttr('checked');
        }else if(parsedJson.status=='1'){
            $('.status0').prop('checked',true);
            $('.status1').removeAttr('checked');
        }
        
    }
};

    //修改数据
    $('#saveModal').bind('click', function(event) {
        var status="";
        var editNo = $('#editNo').val();
        var reg = /^\d{4}$/;
        if(!reg.test(editNo)){
        	layer.msg("模块编码为4位数字");
        	return;
        }
        var editName = $('#editName').val() == null ? '' : $('#editName').val();
        var editNote = $('#editNote').val() == null ? '' : $('#editNote').val();
        var editnote = $('#editnote').val() == null ? '' : $('#editnote').val();
        var id = $('#id').val();
        $('.statusx').each(function(index, el) {
            if($(this).is(':checked')){
                status=$(this).val();
            }
        });
        var param = '{"module":{"id":"'+id+'","moduleNo":"'+editNo+'","moduleName":"'+editName+'","moduleNote":"'+editNote+'","status":"'+status+'","remark":"'+editnote+'"}}';
        res = reqAjax('commonConfig/uptBasePublicModule', param);
        if(res.code != 1){
			layer.msg(res.msg);
			return;
		}
        $('#insFrom').submit();
    });

    //修改状态
    $('#modalstrat').bind('click', function(event) {
        var status="";
        var id = $('#id').val();
        $('.statusx').each(function(index, el) {
            if($(this).is(':checked')){
                status=$(this).val();
            }
        });

        if(status=='1'){
            status='0';
            var param = '{"module":{"id":"'+id+'","status":"'+status+'"}}';
            res = reqAjax('commonConfig/uptBasePublicModule', param);
            if(res.code != 1){
				layer.msg(res.msg);
				return;
			}
            $('#uptFrom').submit();
        }else if(status=='0'){
            status='1';
            var param = '{"module":{"id":"'+id+'","status":"'+status+'"}}';
            res = reqAjax('commonConfig/uptBasePublicModule', param);
            if(res.code != 1){
				layer.msg(res.msg);
				return;
			}
            $('#uptFrom').submit();
        }
    });


    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() { 
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var station=$('#accountnamer').val();
            var jsonData = "{'module':{'moduleName':'"+station+"'}}";
            var excelUrl = reqAjax('commonConfig/exportBasePublicModule', jsonData);
            if(excelUrl.code != 1){
				layer.msg(excelUrl.msg);
			} else {
				//2.获取下载URL
	            excelFilePathName = excelUrl.data;
	            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
	            if(""!=excelFilePathName){
	                var aIframe = document.createElement("iframe"); 
	                aIframe.src = excelFilePathName;
	                aIframe.style.display = "none";
	                document.body.appendChild(aIframe); 
	            }
			}
        }catch(e){ 
            alert("异常："+e);
        } 
    });




