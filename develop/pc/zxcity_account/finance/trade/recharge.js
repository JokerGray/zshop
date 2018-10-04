
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
            // pageList: [10, 25, 50, 100],    //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "desc",
            
            showPaginationSwitch: true,
            apikey: sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'),
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
//                	res.total = res.data.total;
//                	$('#sum').text(res.data.sum);
//                	res.data = res.data.list;
                    return res;
                }else if(res.code == 9){
//                	layer.msg(res.msg);
                	alert(res.msg);
                	return res;
                }
            },

            columns: [
				{
                fileld: 'Number', title:'序号', align : "center", width: 80, sortable: true,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				//{ field: 'merchantId', title:'所属板块', align : "center", width: 150, sortable: true }, // 所属板块
				{ field: 'accountName', title:'账户名称', sortable: true, width: 150, align : "center" }, //账户名称
//				{ field: 'accountName', title:'用户姓名', sortable: true, width: 150, align : "center" }, //用户姓名
				{ field: 'phone', title:'电话号码', sortable: true, width: 150, align : "center" }, // 电话号码
				{ field: 'createTime', title:'注册时间',  sortable: true, width: 160, align : "center" },// 注册时间
				{ field: 'regMode', title:'账户类别', sortable: true, width: 100, align : "center" },// 账户类别
				{ field: 'rechargeMoney', title:'充值金额', sortable: true, width: 150, align : "center",
					formatter: function(money){
						return fmoney(money, 2);
					}
				}, // 金额格式化 // 充值金额
				{ field: 'createTime', title:'充值时间',  sortable: true, width: 160, align : "center" },// 充值时间
//				{ field: 'remark', title:'备注', sortable: true, width: 300, align : "center",
//					formatter: function(remark){
//						var note='<div class="note">暂无'+newStrByNum(remark,20)+'</div>'
//						return note;
//					}
//				}//备注
			],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            },
            onLoadError: function(){
                 layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payTransactionLog/rechargeList";
        var jsonData="";
        var pageNo = params.pageNumber;
        var pageSize = params.pageSize;
        var version = "1";
        jsonData = getSearchParam(pageNo, pageSize);
        
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
//拼接查询参数
function getSearchParam(pageNo, pageSize){
	var station=$('#accountnamer').val();
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var moduleNo = $('#selectview').val();
    var jsonData = '';
    if(pageNo && pageNo){
    	jsonData = "{'startTime':'"+startTimes+"', 'endTime':'"+endTimes+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}"
    }else{
    	jsonData = "{'startTime':'"+startTimes+"', 'endTime':'"+endTimes+"','accountName':'"+station+"'}";
    }
    return jsonData
}
    //查询搜索事件
    $("#searchbtn").bind("click", function(){
        $('#table').bootstrapTable('refresh');
    });

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() { 
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var excelUrl = reqAjax('payExcel/exportRechargeList', getSearchParam());
            //2.获取下载URL
            excelFilePathName = excelUrl.data;
            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
            if(""!=excelFilePathName){
                var aIframe = document.createElement("iframe"); 
                aIframe.src = excelFilePathName;
                aIframe.style.display = "none";
                document.body.appendChild(aIframe); 
            }
        }catch(e){ 
            alert("异常："+e);
        } 
    });

