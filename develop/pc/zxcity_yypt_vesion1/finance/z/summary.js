var oTable;
$(function () {
	// 为了使页面进入就有查询条件(导出excel,显示起止时间的列)故此拼接起止时间并设置
	// 获取本月起止日期	
	var endDate = formatDate(new Date(new Date().getTime())/1000);
    var Nowdate=new Date();
    var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);
    
    // 设置datepicker比较的时间
    startTime = new Date(MonthFirstDay);
    endTime = new Date(endDate);
    
    MonthFirstDay=formatDate(MonthFirstDay.getTime()/1000);
    // 设置本月起止日期
    $('#qBeginTime').val(MonthFirstDay);
    $('#qEndTime').val(endDate);
    
    oTable = new TableInit();
    oTable.Init();
});

var TableInit = function () {
    var oTableInit = new Object();

    oTableInit.Init = function () {
        $('#table').bootstrapTable('destroy').bootstrapTable({
            url: '/zxcity_restful/ws/rest',
            method: 'POST',           //请求方式（*）
            striped: true,           //是否显示行间隔色
            cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端  
            strictSearch: true,  
            showColumns: true,     //是否显示所有的列  
            showRefresh: true,     //是否显示刷新按钮  
            minimumCountColumns: 2,    //最少允许的列数 
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

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
                	res.total = res.data.total;
                	totalAmount = res.data.sum;
                	res.rows = res.data.list;
                    return res;
                }
            },

            columns: [
				{
                field: 'Number', title:'序号', align : "center", width: 80, sortable: true,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'moduleName', title:'所属版块', align : "center", width: 150, sortable: true }, // 所属版块
				{ field: 'st', title:'开始时间',  sortable: true, width: 160, align : "center",
					formatter: function(data){
						var startTimes=$('#qBeginTime').val();
						
						return startTimes+' 00:00:00';
					}
				},// 开始日期
				{ field: 'et', title:'结束时间',  sortable: true, width: 160, align : "center",
					formatter: function(data){
					    var endTimes=$('#qEndTime').val();
						return endTimes+' 23:59:59';
					} },// 结束日期
				{ field: 'rechargeMoney', title:'收入总金额', sortable: true, width: 260, align : "center",
					formatter: function(money){
						return fmoney(money, 2);
					}
				} // 金额格式化 // 收入总金额

			],
            onLoadSuccess: function (res) {
            	callBack();
            	//展现视图
	           	 try {
	           		  var yData = echartsCustomerFunction.parseDate(res.data.list);
	           		  var myChart = echarts.init(document.getElementById('echartsDiv'));
	           		  var option = echartsCustomerFunction.initOption('智币收入汇总', ['收入总金额'],yData['moduleName'], [yData['rechargeMoney']]);
	           		  myChart.setOption(option);
	       		} catch (e) {
	       		}
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payTransactionLog/zbPurchaseSummary";
        var jsonData="";
        var pageNo = params.pageNumber;
        var pageSize = params.limit;
        var version = "1";
        jsonData = getSearchParam(pageNo, pageSize);
        
        
        
        return {
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
    	jsonData = "{'startTime':'"+startTimes+"', 'endTime':'"+endTimes+"','rechargeModular':'"+moduleNo+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}"
    }else{
    	jsonData = "{'startTime':'"+startTimes+"', 'endTime':'"+endTimes+"','rechargeModular':'"+moduleNo+"'}";
    }
    return jsonData
}   
    //查询搜索事件
    $("#searchbtn").bind("click", function(){
    	if(valiDate()){
    		
    		
    		oTable.Init();
    		accountDynamicColumn.initCookie();
    	}
    });

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() { 
    	if(valiDate()){
    		//定义要下载的excel文件路径名
    		var excelFilePathName = "";
    		try{
    			//1. 发送下载请求 , 业务不同，向server请求的地址不同
    			var excelUrl = reqAjax('payExcel/exportZbPurchaseSummary', getSearchParam());
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
    	}
    });

function valiDate(){
	var begin,end,result=true,msg;
	begin = $('#qBeginTime').val();
	end = $('#qEndTime').val();
	if(begin == ""){
		msg = '请输入查询起止时间';
		result=false;
	}
	if(end == ""){
		msg = '请输入查询起止时间';
		result=false;
	}
	try {
		new Date(begin);
		new Date(end);
	} catch (e) {
		msg = '时间日期格式不正确';
		result=false;
	}
	if(!result){
		layer.msg(msg);
	}
	return result;
}