var startTime = "";
var endTime = "";
var oTable;
var onOffLine = "";
var merchantLevel = "";
$(function () {
    oTable = new TableInit();
    startTime = getRequestAddressUrlParameter('startTime');
    endTime = getRequestAddressUrlParameter('endTime');
    onOffLine = getRequestAddressUrlParameter('onOffLine');
    merchantLevel = getRequestAddressUrlParameter('merchantLevel');
    $('#selectview2').selectpicker('refresh');
    if(startTime){
      $('#startTime').val(startTime);
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
        				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
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
            { field: 'upgradeType', title:'升级类型',  width: 150, align : "center",
              formatter: function (res,row) {
                  var onOffLineName = "";
                  if(row.onOffLine==1){
                    onOffLineName = " (线上)";
                  }else if (row.onOffLine==2) {
                    onOffLineName = " (线下)";
                  }
                  if(res==1){
                    return "合作商户"+onOffLineName;
                  }else if (res==2) {
                    return "代理商户"+onOffLineName;
                  }else if (res==3) {
                    return "合作商户续费"+onOffLineName;
                  }else if (res==4) {
                    return "代理商户续费"+onOffLineName;
                  }else {
                    return "-";
                  }
              }
            },
            { field: 'referenceUserName', title:'推荐人',  width: 150, align : "center",
              formatter: function (res,row) {
                if(!res){
                  return "-";
                }
                // 推荐人当时的商户等级 1 个人/2 普通商户/3 合作商户/4 代理商户/5 合伙人/6 内部员工
                var referenceMerchantLevelName = "( )";
                if(row.referenceMerchantLevel==1){
                  referenceMerchantLevelName = " (个人)";
                }else if (row.referenceMerchantLevel==2) {
                  referenceMerchantLevelName = " (普通商户)";
                }else if (row.referenceMerchantLevel==3) {
                  referenceMerchantLevelName = " (合作商户)";
                }else if (row.referenceMerchantLevel==4) {
                  referenceMerchantLevelName = " (代理商户)";
                }else if (row.referenceMerchantLevel==5) {
                  referenceMerchantLevelName = " (合伙人)";
                }else if (row.referenceMerchantLevel==6) {
                  referenceMerchantLevelName = " (内部员工)";
                }
                return '<a href="javascript:" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo(\''+row.referenceUserId+'\',\''+2+'\')">'+res + referenceMerchantLevelName+'</a>';
              }
            },
            { field: 'referenceRealAmount', title:'推荐人佣金(含税)',  width: 100, align : "center",
              formatter : function(res,data) {
                if (res) {
                  return fmoney(res, 2);
                }
              }
            },
            { field: 'status', title:'状态',  width: 100, align : "center",
              formatter: function (res,row) {
                // 1 商户升级审核通过/2 商户升级审核不通过/3 商户升级完成
                if(res==1){
                  return "审核通过";
                }else if (res==2) {
                  return "审核不通过";
                }else if (res==3) {
                  return "升级完成";
                }else {
                  return "-";
                }
              }
            },
            { field: 'commissionStatus', title:'佣金发放',  width: 80, align : "center",
              formatter: function (res,row) {
                if(row.onOffLine==2){
                  return "-";
                }
                if(row.onOffLine==1&&row.referenceMerchantLevel==6){
                  if(res==0){
                    return '<p style="color: red;">未审核</p>';
                  }else if (res==1) {
                    return '<p style="color: #4CAF50;">已审核</p>';
                  }
                }
                if(res==0){
                  return '<p style="color: red;">未结算</p>';
                }else if (res==1) {
                  return '<p style="color: #4CAF50;">已结算</p>';
                }else {
                  return "-";
                }
              }
            },
            { field: 'employeeCommissionStatus', title:'员工结算',  width: 80, align : "center",
              // 0 未结算/1 已结算
              formatter: function (res,row) {
                if(row.referenceMerchantLevel!=6){
                  return "-";
                }
                if(res==0){
                  return '<p style="color: red;">未结算</p>';
                }else if (res==1) {
                  return '<p style="color: #4CAF50;">已结算</p>';
                }else {
                  return "-";
                }
              }
            },
            { field: 'applyTime', title:'申请时间',  width: 150, align : "center"},
            { field: 'upgradeConfirmTime', title:'升级完成时间',  width: 150, align : "center"},
			  ],
          onLoadSuccess: function (data,row) {
            // layer.msg('加载成功');
          	// callBack();
          },
          onLoadError: function(){
            // layer.msg('未检索到**信息');

          }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "merchantUpgrade/selectPageInfoList";
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
    var serialNos=$('#serialNo').val();
    var homeQueryType = "";
    var employeeCommissionStatus = "";
    if(merchantLevel==1||merchantLevel==6){
        // 1 和 6 都表示 平台用户
        homeQueryType = "3";
        merchantLevel = "";
        // employeeCommissionStatus = "1";
    }else {
       homeQueryType = "5";
    }
    var jsonData = {
        applyTimeStart:startTime.replace(/\s+/g,""),
        applyTimeEnd:endTime.replace(/\s+/g,""),
        serialNo:serialNos,
        onOffLine:onOffLine,
        referenceMerchantLevel:merchantLevel,
        homeQueryType:homeQueryType,
        status:3,
        employeeCommissionStatus:employeeCommissionStatus,
        commissionStatus:1
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
