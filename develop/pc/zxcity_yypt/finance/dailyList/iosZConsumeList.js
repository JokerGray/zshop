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
      responseHandler: function (res) {
        if (res.code == 1) {
        	res.total = res.total;
	        //$('#sum').text(res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2));
	        //totalAmount = res.money == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
	        res.rows = res.data
	        return res;
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 100,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'username', title: '用户名称', align: "center", width: 150, sortable: true},
        { field: 'rechargeOrderId', title:'订单号', width: 100, align : "center"},
        {field: 'serialNo', title: '交易流水号', sortable: true, width: 200, align: "center"},
        {field: 'money', title: '充值金额', align: "center", width: 150, sortable: true,
          formatter: function (res) {
             return fmoney(res, 2);
          }
        },
        {field: 'purchaseTime', title: '购买时间', width: 300, align: "center"}
			],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
      },
      onLoadError: function () {
        // layer.msg('未检索到**信息');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "scIosPayRecord/selectList";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    var startTimes = $('#qBeginTime').val();
    var endTimes = $('#qEndTime').val();
    var username= $('#usernames').val();

    var data = {
			pageNo : pageNo,
			pageSize : pageSize,
			startTime : startTimes,
			endTime : endTimes,
      username:username
    };

    return {
      cmd: cmd,
      data: JSON.stringify(data),
      version: version
    }
  };
  return oTableInit;
};

//查询搜索事件
$("#searchbtn").bind("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
});

//查询搜索事件
// $("#addProfitExtract").bind("click", function () {
// 		layer.open({
// 		  type: 2,
// 		  area: ['600px', '400px'],
// 		  fix: false, //不固定
// 		  maxmin: false,
// 		  title : "收入提取",
// 		  content: "addProfitExtract.html"
// 		});
//
// });


// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  // var params="{'dataTable':{'merchantType':'0'}}";
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
     var jsonData = "";
     var version = "1";
     var startTimes = $('#qBeginTime').val();
     var endTimes = $('#qEndTime').val();
     var username= $('#usernames').val();

     var data = {
    		startTime : startTimes,
    		endTime : endTimes,
        username:username
    };
    jsonData = JSON.stringify(data);
    var excelUrl = reqAjax('scIosPayRecord/exportIosPayRecord', jsonData);
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
