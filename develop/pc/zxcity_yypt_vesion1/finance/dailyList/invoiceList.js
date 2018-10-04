var oTable;
$(function () {
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
            search: true,            //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
            strictSearch: true,
            showColumns: true,     //是否显示所有的列
            showRefresh: true,     //是否显示刷新按钮
            minimumCountColumns: 2,    //最少允许的列数
            search: true,
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "payTime",     //排序的字段
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
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "desc",
            showPaginationSwitch: true,

            ajaxOptions:{
          	   beforeSend: function(request){
        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			   }
            },
            responseHandler:function(res){
                if(res.code == 1){
                	res.total = res.total;
                	// totalAmount = res.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
                	res.rows = res.data;
                  return res;
                }
            },
            columns: [
            {
              field: 'Number', title:'序号', align : "center", width: 80,
              formatter: function(value,row,index){
                return index+1;
              }
            },
    				{field: 'serialNo', title:'流水号', align : "center", width: 80,},
    				{ field: 'invoiceCompany', title:'申报企业', align : "center", width: 150 }, //申报企业
            { field: 'invoiceTin', title:'纳税人识别号',  width: 100, align : "center" },//信用代码
    				{ field: 'invoiceNo', title:'发票号', width: 150, align : "center"},////发票号
    				{ field: 'amount', title:'申报金额', width: 160, align : "center" ,sortable: true,
              formatter: function (res) {
                 if(res){
                   return fmoney(res, 2);
                 }else{
                   return '-';  
                 }
              }
            },//申报金额
    				{ field: 'invoiceAmount', title:'开票金额',  width: 150, align : "center",
              formatter: function (res) {
                 if(res){
                   return fmoney(res, 2);
                 }else{
                   return '-';
                 }
              }
            },          //开具金额
			      { field: 'createTime', title:'收票时间',  width: 150, align : "center" },          // 收票时间
			  ],
          onLoadSuccess: function (data) {
          //layer.msg('加载成功');
        	// callBack();
        },
          onLoadError: function(){
          // layer.msg('未检索到**信息');
          }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payScInvoiceLog/select";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        // var pageNo = params.pageNumber;
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

// 拼接查询参数
function getSearchParam(pageNo, pageSize){
  	var station=$('#accountnamer').val();
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var serialNo = $('#serialNo').val();
    var invoiceCompany = $('#invoiceCompany').val();
    var jsonData = {
    		startTime: startTimes,
    		endTime: endTimes,
    		accountName: station,
        serialNo:serialNo,
        invoiceCompany:invoiceCompany
    }
    if(pageNo && pageNo){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
    }else{

    }
    return JSON.stringify(jsonData);
  }

  //查询搜索事件
  $("#searchbtn").bind("click", function(){
      oTable.Init();
      accountDynamicColumn.initCookie();
  });

    // 导出excel
  $("#excelbtn").bind("click", function downloadFile(){
      //定义要下载的excel文件路径名
      var excelFilePathName = "";
      try{
      //1. 发送下载请求 , 业务不同，向server请求的地址不同
      var excelUrl = reqAjax('payScInvoiceLog/exportPayScInvoiceLog', getSearchParam());
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
