
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
				{ field: 'accountName', title:'月份', sortable: true, width: 150, align : "center" }, //月份
				{ field: 'merchantType', title:'账户类别', sortable: true, width: 100, align : "center",
					formatter: function(res){
						if(res==0){
							return '个人';
						}else if(res==1){
							return '商家';
						}
					} 
				},// 账户类别
				{ field: 'phoneNum', title:'充值次数', sortable: true, width: 150, align : "center" }, // 充值次数
				{ field: 'merchantType', title:'充值金额', sortable: true, width: 150, align : "center",
					formatter: function(money){
						return fmoney(money, 2);
					}
				}// 金额格式化 // 充值金额 
			],
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
        var cmd = "payStatistics/selectAllMerchantInfo";
        var jsonData="";
        var pageNo = params.pageNumber;
        var pageSize = params.pageSize;
        var version = "1";
        //var station=$('#accountnamer').val();
        //var selectplate=$("#selectplate option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        //if(selectplate=='免费试用版'){
        //    selectplate=0;
        //}else if(selectplate=='正式版'){
        //    selectplate=1;
        //}
        //if($('#accountnamer').val() ==""){
            jsonData = "{'dataTable':{'merchantType':'0','pageNo':"+pageNo+",'pageSize':"+pageSize+"}}";
        //}else{
        //    jsonData = "{'dataTable':{'merchantType':'0','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}}";
        //}
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
            var excelUrl = reqAjax('payExcel/exportAllMerchantInfo', "");
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

