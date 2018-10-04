var oTable;
$(function () {
  oTable = new TableInit();
  
  
    var date=new Date();
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var date = date.getDate();
	//当前的  年 月 日
	$('#qBeginTime').val(myyear+"-0"+mymonth+"-0"+ 1);
	//当前年 月  月份的第一天
	if(date<10){
		date='0'+date;
	}
	if(mymonth<10){
		mymonth = '0'+mymonth;
	}
	$('#qEndTime').val(myyear+"-"+mymonth+"-"+ date);

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
				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
				}
      },
      responseHandler: function (res) {
        if (res.code == 1) {
        	res.total = res.data.list.total;
	        res.rows = res.data.list.list;
	        totalAmount = fmoney(res.data.totalAmount, 2);
	        minAmount = fmoney(res.data.totalMinAmount, 2);
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
        {field: 'userName', title: '员工姓名', align: "center", width: 150, sortable: true},
        {field: 'orderNo', title:'订单号/流水号', width: 100, align : "center"},
        {field: 'type', title: '业务类型', sortable: true, width: 100, align: "center",
        	formatter : function(res,data) {
    			if (res == '商户升级') {
    				return "<font color='blue'>商户升级</font>";
    			} else if(res == '专业制作-制作') {
    				return "<font color='green'>专业制作-制作</font>";
    			} if (res == '专业制作-推荐') {
    				return "<font color='orange'>专业制作-推荐</font>";
    			}else {
    				return "错误";
    			}
    		}
        },
        {field: 'amount', title: '提成金额', align: "center", width: 150, sortable: true,
          formatter: function (res) {
             return fmoney(res, 2);
          }
        },
        {field: 'merchantName', title: '关联商户', width: 300, align: "center",
        	formatter : function(res,data) {
				if (res) {
					return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.merchantId+')">'+res+'</button>';
				} else {
					return "-";
				}
			}
       
        }, 
        {field: 'time', title:'审核时间', width: 150, align : "center"}
			],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
    	  callBack();
      },
      onLoadError: function () {
        // layer.msg('未检索到**信息');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "EmployeesBill/selectPageList";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    var startTimes = $('#qBeginTime').val();
    var endTimes = $('#qEndTime').val();
    var userName= $('#userName').val();
    var merchantName = $('#merchantName').val();
    var orderNo = $('#orderNo').val();
    
    var data = {
			pageNo : pageNo,
			pageSize : pageSize,
			timeStart : startTimes,
			timeEnd : endTimes,
			userName : userName,
			merchantName : merchantName,
			orderNo : orderNo
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
     var userName= $('#userName').val();
     var merchantName = $('#merchantName').val();
     var orderNo = $('#orderNo').val();

     var data = {
    		timeStart : startTimes,
 			timeEnd : endTimes,
 			userName : userName,
 			merchantName : merchantName,
 			orderNo : orderNo
    };
    jsonData = JSON.stringify(data);
    var excelUrl = reqAjax('EmployeesBill/employeesBillRecord', jsonData);
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
