var oTable;
$(function () {
    oTable = new TableInit();
    oTable.Init();

    layer.config({
			extend : 'myskin/style.css', // 加载您的扩展样式
			skin : 'layer-ext-myskin'
		});
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
        				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
      			   }
            },
            responseHandler:function(res){
                if(res.code == 1){
                	res.total = res.total;
                	//totalAmount = res.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
                  totalAmount = res.data.sum;
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
    				{field: 'id', title:'流水号', align : "center", width: 150,},
    				{ field: 'advUsername', title:'广告主', align : "center", width: 100 },
            { field: 'advPhone', title:'手机号', align : "center", width: 150 },
            { field: 'accountBalance', title:'余额',  width: 100, align : "center",
              formatter: function (res) {
                 return fmoney(res, 2);
              }
            },
            { field: 'deductAmount', title:'扣除金额',  width: 100, align : "center",
              formatter: function (res) {
                 return fmoney(res, 2);
              }
            },
            { field: 'amountConsumption', title:'消耗金额',  width: 100, align : "center",
              formatter: function (res) {
                 return fmoney(res, 2);
              }
            },
            { field: 'companyIncome', title:'公司收入',  width: 100, align : "center",
              formatter: function (res) {
                 return fmoney(res, 2);
              }
            },
			      { field: 'supplierName', title:'平台供应商',  width: 100, align : "center" },
            { field: 'supplierType', title:'供应商类型',  width: 100, align : "center",
              formatter: function (res) {
                 var supplierTypeName="-";
                 if(res==1){
                   supplierTypeName="代理商";
                 }else if (res==2) {
                   supplierTypeName="签约作者";
                 }
                 return supplierTypeName;
              }
            },
            { field: 'laborCosts', title:'劳务费',  width: 100, align : "center",
              formatter: function (res) {
                 return fmoney(res, 2);
              }
            },
            { field: 'advStatus', title:'状态',  width: 100, align : "center",
              formatter: function (res) {
                 var advStatusName="-";
                 if(res==1){
                   advStatusName="进行中";
                 }else if (res==2) {
                   advStatusName="已结束";
                 }  
                 return advStatusName;
              }
            },
            { field: 'startTime', title:'时间',  width: 150, align : "center" },
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
        var cmd = "headlines/selectScAdvConsumptionOrdersList";
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
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var serialNos = $('#serialNos').val();
    var advStatus = $('#selectview2').val();
    var jsonData = {
    		startTimeStrQuery: startTimes,
    		endTimeStrQuery: endTimes,
        id:serialNos,
        advStatus:advStatus
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
        var jsonData = "";
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        var serialNos = $('#serialNos').val();
        var advStatus = $('#selectview2').val();
        var data = {
          startTimeStrQuery: startTimes,
          endTimeStrQuery: endTimes,
          id:serialNos,
          advStatus:advStatus
        }
       jsonData = JSON.stringify(data);
       //1. 发送下载请求 , 业务不同，向server请求的地址不同
       var excelUrl = reqAjax('headlines/exportScAdvConsumptionOrdersList', jsonData);
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
