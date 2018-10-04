var oTable;
$(function () {
  oTable = new TableInit();
  oTable.Init();
  selectYearVersionList();
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
        }else{
           layer.msg(res.msg);
          return false;
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 100,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'yearVersion', title: '版本', align: "center", width: 150, sortable: true},
        { field: 'typeOfOperation', title:'操作类型', width: 150, align : "center",
          formatter: function (res,row) {
              if(res==1){
                return '<p style="color:#4cae4c;">添加</p>';
              }else if (res==2) {
                return '<p style="color:#03A9F4;">修改</p>';
              }else if (res==3) {
                return '<p style="color:#E91E63;">删除</p>';
              }
          }
        },
        {field: 'createTime', title: '操作时间', sortable: true, width: 100, align: "center"},
        {field: '', title: '详情记录', width: 150, align: "center",
          formatter: function (res,row) {
               var btnHtml = "";
               btnHtml += '<button type="button" class="btn btn-info" onclick="selectInfo('+row.id+');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-right: 10px;">配置信息</button>';
               btnHtml += '<button type="button" class="btn btn-primary" onclick="selectUserInfo(\''+row.userId+'\')" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;">用户详情</button>';
               return btnHtml;
          }
        }
			],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
      },
      onLoadError: function () {
         layer.msg('系统繁忙');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "scAlipayFeeConfigurationLog/selectList";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    var yearVersion = $("#selectview2").val();
    var startTimes = $('#qBeginTime').val();
    var endTimes = $('#qEndTime').val();
    var data = {
      startTime : startTimes,
      endTime : endTimes,
      yearVersion:yearVersion,
			pageNo : pageNo,
			pageSize : pageSize
    };
    return {
      cmd: cmd,
      data: JSON.stringify(data),
      version: version
    }
  };
  return oTableInit;
};


//查询详情
function  selectInfo(id){
  var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
  //调用后台查询  根据id
  var cmd = 'scAlipayFeeConfigurationLog/selectById';
  var data = JSON.stringify({"id":id});
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    //async : false,
    data : {"cmd" : cmd,"data" : data,"version" : version},
    beforeSend : function(request) {
      request.setRequestHeader("apikey", apikey);
    },
    success : function(re) {
      if(re.code==1){
          layer.close(indexs);
          var index =layer.open({
                type: 1,
                area: ['950px', '560px'],
                fix: false, //不固定
                maxmin: false,
                btn : [],
                title : "配置详情",
                content: addInfo('修改'),
                success : function() {
                  //弹窗加载成功的时候
                  $("#yearVersionId").val(re.data.yearVersion);
                  if(re.data.paymentTypes==1){
                    $("#selectview3Id").val('支付宝');
                  }else{
                    $("#selectview3Id").val('类型未定义');
                  }
                  $("#chargeRatioId").val(re.data.chargeRatio);

                  if(re.data.paymentOperationId==1){
                    $("#paymentOperationId").val('进账');
                  }else if (re.data.paymentOperationId==2) {
                    $("#paymentOperationId").val('出账');
                  }else if (re.data.paymentOperationId==3) {
                    $("#paymentOperationId").val('单笔进账');
                  }else if (re.data.paymentOperationId==4) {
                    $("#paymentOperationId").val('单笔出账');
                  }else{
                    $("#paymentOperationId").val('操作未定义');
                  }

                  $("#effectiveStartTimeId").val(re.data.effectiveStartTime);
                  $("#effectiveEndTimeId").val(re.data.effectiveEndTime);
                  $("input[name='monthlyLimit'][value='" +re.data.monthlyLimit+ "']").prop("checked", "checked");
                  if(re.data.monthlyLimit==0){
                      $("#monthlyMinimumAmountId").val(re.data.monthlyMinimumAmount);		//月最小限额
                      $("#monthlyMaximumAmountId").val(re.data.monthlyMaximumAmount);	//月最大限额
                      $(".edxz-xe").show();
                  }
                  layer.close(indexs);
                },
             });
      }else{
         layer.msg(re.msg);
         return false;
      }
    },
    error : function(re) {
        layer.close(indexs);
        layer.msg('查询失败');
    }
  });
}

function selectUserInfo(id){
  var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
  //调用后台查询  根据id
  var cmd = 'scAlipayFeeConfigurationLog/selectByUserId';
  var data = JSON.stringify({"userId":id}); 
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    //async : false,
    data : {"cmd" : cmd,"data" : data,"version" : version},
    beforeSend : function(request) {
      request.setRequestHeader("apikey", apikey);
    },
    success : function(re) {
      if(re.code==1){
          layer.close(indexs);
          if(!re.data){
            layer.msg('用户信息不存在');
            return false;
          }
          var index =layer.open({
                type: 1,
                area: ['920px', '500px'],
                fix: false, //不固定
                maxmin: false,
                btn : [],
                title : "用户详情",
                content: userInfo(),
                success : function() {
                  $("#userId").val(re.data.id);
                  $("#phone").val(re.data.phone);
                  $("#uname").val(re.data.uname);
                  $("#name").val(re.data.name);
                  if(re.data.status==1){
                    $("#status").val('未锁');
                  }else if(re.data.status==2){
                    $("#status").val('已锁');
                  }else{
                    $("#status").val('未定义');
                  }

                  if(!(re.data.isAdmin)){
                    $("#isAdmin").val('未分配');
                  }else if(re.data.isAdmin==1){
                    $("#isAdmin").val('普通用户');
                  }else if (re.data.isAdmin==2) {
                    $("#isAdmin").val('代理商');
                  }else if (re.data.isAdmin==3) {
                    $("#isAdmin").val('超级管理员');
                  }

                  layer.close(indexs);
                },
             });
      }else{
         layer.msg(re.msg);
         return false;
      }
    },
    error : function(re) {
        layer.close(indexs);
        layer.msg('查询失败');
    }
  });

}

$(document).on('change', '#radioItem0', function() {
  	$(".edxz-xe").show();
});

$(document).on('change', '#radioItem1', function() {
  	$(".edxz-xe").hide();
});

//查询搜索事件
$("#searchbtn").bind("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
});

//查询所以的版本
function selectYearVersionList(){
  var cmd = 'scAlipayFeeConfigurationLog/selectYearVersionList';
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    //async : false,
    data : {"cmd" : cmd,"data" : "","version" : version},
    beforeSend : function(request) {
      request.setRequestHeader("apikey", apikey);
    },
    success : function(re) {
        if(re.code==1){
          var optionHtml = "";
          optionHtml+='<option value="-1">--选择版本--</option>';
          for (var i = 0; i < re.data.length; i++) {
            optionHtml+='<option value="'+re.data[i]+'">'+re.data[i]+'</option>';
          }
          $("#selectview2").empty().append(optionHtml);
          $('#selectview2').selectpicker('render');
          $('#selectview2').selectpicker('refresh');
        }
    },
    error : function(re) {

    }
  });
}

// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  // var params="{'dataTable':{'merchantType':'0'}}";
  try {
     //1. 发送下载请求 , 业务不同，向server请求的地址不同
     var jsonData = "";
     var version = "1";
     var yearVersion = $("#selectview2").val();
     var startTimes = $('#qBeginTime').val();
     var endTimes = $('#qEndTime').val();
     var data = {
       startTime : startTimes,
       endTime : endTimes,
       yearVersion:yearVersion
    };
    jsonData = JSON.stringify(data);
    var excelUrl = reqAjax('scAlipayFeeConfigurationLog/exportAlipayFeeConfigurationLog', jsonData);
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


function addInfo(infoName){
  var html = "";
  html+='<div class="container-fluid" style="margin-top: 30px;">';
  html+='<form class="form-horizontal">';
  html+='<div class="row-fluid" style="padding-bottom: 15px;">';
  html+='<h1 class="text-center dialog-title">配置详情</h1>';
  html+='</div>';
  html+='<div class="row">';
  html+='<div class="pull-left w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>版 &nbsp&nbsp&nbsp 本：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input readonly  type="text" class="form-control" readonly id="yearVersionId" placeholder="选择年份" data-date-format="yyyy" onMouseDown="showYearVersion()"/>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>收费标准：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input readonly class="form-control" id="chargeRatioId" type="text" maxlength="5">';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='<div class="pull-right w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>支付类型：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input readonly  class="form-control" id="selectview3Id" type="text" maxlength="15">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>支付操作：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input readonly  class="form-control" id="paymentOperationId" type="text" maxlength="15">';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group" style="width: 100%;padding-left: 10px;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>有效日期：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input readonly class="form-control" readonly  id="effectiveStartTimeId" data-date-format="yyyy-mm-dd"  type="text"  placeholder="起始时间" style="width: 207px;">';
  html+='</div>';
  html+='<div class="col-md-1 col-sm-1" style="line-height: 36px;width: 35px;text-align: center;">';
  html+='<span>至</span>';
  html+='</div>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input readonly class="form-control" readonly id="effectiveEndTimeId" type="text"  placeholder="结束时间" data-date-format="yyyy-mm-dd">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group" style="width: 100%;padding-left: 10px;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>是否限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<label class="radio-inline" style="padding-right: 30px;">';
  html+='<input disabled type="radio" name="monthlyLimit" id="radioItem0" value="0">限额';
  html+='</label>';
  html+='<label class="radio-inline">';
  html+='<input disabled type="radio" name="monthlyLimit" id="radioItem1" value="1">不限额';
  html+='</label>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group edxz-xe" style="width: 100%;padding-left: 10px;display: none;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>最小限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input readonly class="form-control" id="monthlyMinimumAmountId" type="text" placeholder="最小限额" maxlength="8" style="width: 207px;">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group edxz-xe" style="width: 100%;padding-left: 10px;display: none;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>最大限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input readonly class="form-control" id="monthlyMaximumAmountId" type="text" placeholder="最大限额" maxlength="8" style="width: 207px;">';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='</form>';
  html+='</div>';
  return html;
}


function userInfo(){
  var html = "";
  html+='<div class="container-fluid" style="margin-top: 30px;">';
  html+='<form class="form-horizontal">';
  html+='<div class="row-fluid" style="padding-bottom: 15px;">';
  html+='<h1 class="text-center dialog-title">用户详情</h1>';
  html+='</div>';
  html+='<div class="row">';
  html+='<div class="pull-left w-half">';
  // html+='<div class="form-group">';
  // html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>用户id：</label>';
  // html+='<div class="col-md-7 col-sm-7">';
  // html+='<input readonly  type="text" class="form-control" readonly id="userId"/>';
  // html+='</div>';
  // html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>手机号：</label>';
  html+='<div class="col-md-7 col-sm-7">';
  html+='<input readonly class="form-control" id="phone" type="text">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>登录名：</label>';
  html+='<div class="col-md-7 col-sm-7">';
  html+='<input readonly class="form-control" id="name" type="text">';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='<div class="pull-right w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>用户名称：</label>';
  html+='<div class="col-md-7 col-sm-7">';
  html+='<input readonly  class="form-control" id="uname" type="text">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>是否锁定：</label>';
  html+='<div class="col-md-7 col-sm-7">';
  html+='<input readonly  class="form-control" id="status" type="text">';
  html+='</div>';
  html+='</div>';
  // html+='<div class="form-group">';
  // html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>用户级别：</label>';
  // html+='<div class="col-md-7 col-sm-7">';
  // html+='<input readonly class="form-control" id="isAdmin" type="text">';
  // html+='</div>';
  // html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='</form>';
  html+='</div>';
  return html;
}
