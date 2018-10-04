var oTable;
$(function () {
  oTable = new TableInit();
  oTable.Init();
  
  //layer配置
  layer.config({
	  extend: 'myskin/style.css', //加载您的扩展样式
	  skin: 'layer-ext-myskin'
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
      search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
      strictSearch: true,
      showColumns: true,     //是否显示所有的列
      showRefresh: true,     //是否显示刷新按钮
      minimumCountColumns: 2,    //最少允许的列数
      searchOnEnterKey: true,
//      toolbar:'#toolbar',
//      searchText: '',
      pagination: true,          //是否显示分页（*）
      sortable: false,           //是否启用排序
      sortName: "createTime",     //排序的字段
      sortOrder: "desc",          //排序方式
      contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
      queryParams: oTableInit.queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pageNumber: 1,            //初始化加载第一页，默认第一页
      pageSize: 10,            //每页的记录行数（*）
      pageList: [10], //可供选择的每页的行数（*）
      // strictSearch: true,
      // clickToSelect: true,        //是否启用点击选中行
      // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      uniqueId: "createTime",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表
      showPaginationSwitch: true,
      ajaxOptions:{
    	  beforeSend: function(request){ 
				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
			}
      },
      responseHandler: function (res) {
        if (res.code == 1) {
        	res.rows = res.data.list;
        	res.total = res.data.total;
          return res;
        }else{
        	layer.msg(res.msg);
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 100,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'regModeStr', title: '账户类型', width: 150, align: "center" },
        {field: 'accountName', title: '账户名称', width: 150, align: "center" },
        {field: 'number', title: '购买次数', sortable: true, width: 200, align: "center" },
        {field: 'rechargeMoney', title: '购买金额', width: 150, align: "center",
            formatter: function(money){
                return fmoney(money, 2);
            }
        },
        {field: 'ab', title: '智币余额', width: 150, align: "center",
            formatter: function(money){
                return fmoney(money, 2);
            }
        }
        ],
    onLoadSuccess: function (res) {
    	//展现视图
     	 try {
     		  var yData = echartsCustomerFunction.parseDate(res.data.list);
     		  var myChart = echarts.init(document.getElementById('echartsDiv'));
     		  var xData = new Array();
     		  for(var i = 1; i <= $('#table').bootstrapTable('getData').length; i++){
     			  xData.push(i);
     		  }
     		  var option = echartsCustomerFunction.initOption('智币购买统计', ['购买次数','购买金额','智币余额'],xData, [yData['number'],yData['rechargeMoney'],yData['ab']]);
     		  myChart.setOption(option);
 		} catch (e) {
 		}
      },
      onLoadError: function () {
        // layer.msg('未检索到**信息');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "payTransactionLog/selPurchaseStatistics";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    
    return {
      cmd: cmd,
      data: getSearchParam(pageNo, pageSize),
      version: version
    }
  };
  return oTableInit;
};

//拼接查询参数
function getSearchParam(pageNo, pageSize){
	var accountName=$('#accountnamer').val();
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    // 拼接请求参数
    var jsonData = {
    		accountName: accountName,
    		startTime: startTimes,
    		endTime: endTimes
    };
    
    if(pageNo && pageNo){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
    }
    return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchbtn").on("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
});

// 导出excel
$("#excelbtn").on("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    var excelUrl = reqAjax('payExcel/exportPurchaseStatistics', getSearchParam());
    //2.获取下载URL
    excelFilePathName = excelUrl.data;
    //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
    if(excelUrl.code != 1){
    	layer.msg(excelUrl.msg);
    } else {
    	//2.获取下载URL
	    excelFilePathName = excelUrl.data;
	    //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
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

