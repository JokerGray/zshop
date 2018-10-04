var startTime = "";
var endTime = "";
var orderByType = "";
var oTable;
$(function () {
    oTable = new TableInit();
    startTime = getRequestAddressUrlParameter('startTime');
    endTime = getRequestAddressUrlParameter('endTime');
    orderByType = getRequestAddressUrlParameter('orderByType');
    var queryStatus = getRequestAddressUrlParameter('queryStatus');
    $("#selectview2").val(queryStatus);
    $('#selectview2').selectpicker('refresh');
    if(startTime){
      $('#startTime').val(startTime);
      //$("#startTime").datetimepicker("setStartDate",startTime);
    }
    if(endTime){
      $('#endTime').val(endTime);
    }
    getStartTime();
    getEndTime();
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
            search: false,            //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
            strictSearch: true,
            showColumns: true,       //是否显示所有的列
            showRefresh: true,       //是否显示刷新按钮
            minimumCountColumns: 2,  //最少允许的列数
            searchOnEnterKey: false,
            //searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "payTime",     //排序的字段
            sortOrder: "desc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,             //初始化加载第一页，默认第一页
            pageSize: 10,             //每页的记录行数（*）
            pageList: [10],           //可供选择的每页的行数（*）
            // strictSearch: true,
            clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",     //每一行的唯一标识，一般为主键列
            cardView: false,           //是否显示详细视图
            detailView: false,         //是否显示父子表
            singleSelect : true,       //是否只能选中一个
            sortOrder: "desc",
            showPaginationSwitch: true,
            ajaxOptions:{
          	   beforeSend: function(request){
        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			   }
            },
            responseHandler:function(res){
                if(res.code == 1&&res.total>0){
                	res.total = res.total;
                  res.rows = res.data;
                  return res;
                }else{
                  return false;
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
    				{ field: 'businessType', title:'业务类型', align : "center", width: 150,
              formatter: function (res,row) {
                   if(res==1){
                      return "直播佣金";
                   }else if (res==2) {
                      return "商户升级";
                   }else if (res==3) {
                      return "头条推广";
                   }
              }
            },
            { field: 'taxpayerName', title:'纳税人名称',  width: 100, align : "center",
              formatter: function (res,row) {
                   if(res){
                      return '<a href="javascript:" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo('+row.userId+')">'+res+'</a>';
                   }else{
                      return "-";
                   }
              }
            },
            { field: 'identificationNumber', title:'身份证号码',  width: 180, align : "center"},
            { field: 'phone', title:'手机号',  width: 180, align : "center"},
            { field: 'laborCosts', title:'劳务费', align : "center", width: 150,
              formatter: function (res) {
                   if(res){
                      return fmoney(res, 2);
                   }else{
                      return "-";
                   }
              }
            },
            { field: 'laborCostsMonthlyTotal', title:'劳务费当月总计',  width: 150, align : "center",
              formatter: function (res) {
                   if(res){
                      return fmoney(res, 2);
                   }else{
                      return "-";
                   }
              }
            },
            { field: 'laborTax', title:'劳务税',  width: 150, align : "center",
              formatter: function (res) {
                   if(res){
                      return fmoney(res, 2);
                   }else{
                      return "-";
                   }
              }
            },
            { field: 'laborTaxMonthlyTotal', title:'劳务税月总计',  width: 150, align : "center",
              formatter: function (res) {
                   if(res){
                      return fmoney(res, 2);
                   }else{
                      return "-";
                   }
              }
            },
            { field: 'afterTaxAmount', title:'税后金额',  width: 150, align : "center",
              formatter: function (res,row) {
                  if(res){
                     return fmoney(res, 2);
                  }else{
                     return "-";
                  }
              },
            },
            { field: 'playingTime', title:'打款时间',  width: 150, align : "center"},
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
        var cmd = "scLaborTaxList/selectList";
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
    var serialNo = $('#serialNo').val();
    var taxpayerName = $('#taxpayerName').val();
    var queryStatus=$('#queryStatus').val();

    if(queryStatus){
      if(queryStatus==1){
        $("#selectview2").val("1");
        $('#selectview2').selectpicker('refresh');
      }else if(queryStatus==2){
        $("#selectview2").val("2");
        $('#selectview2').selectpicker('refresh');
      }else if(queryStatus==3){
        $("#selectview2").val("3");
        $('#selectview2').selectpicker('refresh');
      }else if (queryStatus==0) {
        $("#selectview2").val("-1");
        $('#selectview2').selectpicker('refresh');
      }
    }else{
        queryStatus =$("#selectview2").val();
    }

    var jsonData = {
        serialNo:serialNo,
        startTime:startTime,
        endTime:endTime,
        businessType:queryStatus,
        taxpayerName:taxpayerName,
        orderByType:orderByType
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
      $('#queryStatus').val("");
      var startTimes=$('#startTime').val();
  		var endTimes=$('#endTime').val();
      startTime=startTimes;
      endTime=endTimes;
      oTable.Init();
      accountDynamicColumn.initCookie();
  });

  // 导出excel
  $("#excelbtn").bind("click", function downloadFile(){
      //定义要下载的excel文件路径名
      var excelFilePathName = "";
      try{
        var jsonData = "";
        var taxpayerNames = $('#taxpayerNames').val();
        var phones = $('#phones').val();
        var data = {
            taxpayerName:taxpayerNames,
            phone:phones
        }
       jsonData = JSON.stringify(data);
      //1. 发送下载请求 , 业务不同，向server请求的地址不同
      var excelUrl = reqAjax('headlines/exportStatisticsList', jsonData);
      if(excelUrl.code != 1){
  		    layer.msg(excelUrl.msg);
			} else {
  				//2. 获取下载URL
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
