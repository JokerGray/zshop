var oTable;
var userId;
var startTime2 = "";
var endTime2 = "";

$(function () {
  oTable = new TableInit();
  oTable.Init();
  selectYearVersionList();
  //layer配置
  layer.config({
	  extend: 'myskin/style.css', //加载您的扩展样式
	  skin: 'layer-ext-myskin'
  });

  userId=sessionStorage.getItem('userId');
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
        {field: 'yearVersion', title: '版本', align: "center", width: 100, sortable: true},
        { field: 'monthlyLimit', title:'月限额', width: 200, align : "center",
          formatter: function (res,row) {
               if(res==0){
                  return fmoney(row.monthlyMinimumAmount, 2)+" — "+fmoney(row.monthlyMaximumAmount, 2);
               }else{
                  return '不限额';
               }
          }
        },
        {field: 'paymentTypes', title: '支付类型', sortable: true, width: 100, align: "center",
          formatter: function (res) {
               if(res==1){
                  return '支付宝';
               }else{
                  return '类型未定义';
               }
          }
        },
        {field: 'paymentOperationName', title: '支付操作', sortable: true, width: 150, align: "center"},
        {field: 'chargeRatio', title: '收费标准', sortable: true, width: 100, align: "center",
          formatter: function (res) {
               if(res){
                  return res+"%";
               }
          }
        },
        {field: 'effectiveStartTime', title: '有效起始时间', sortable: true, width: 200, align: "center"},
        {field: 'effectiveEndTime', title: '有效结束时间', sortable: true, width: 200, align: "center"},
        {field: '', title: '操作', width: 150, align: "center",
          formatter: function (res,row) {
               var btnHtml = "";
               btnHtml += '<button type="button" class="btn btn-info" onclick="updatebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-right: 10px;">修改</button>';
               btnHtml += '<button type="button" class="btn btn-danger" onclick="deletebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;">删除</button>';
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
    var cmd = "scAlipayFeeConfiguration/selectList";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    var yearVersion = $("#selectview2").val();
    var data = {
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

//添加事件
$("#addbtn").bind("click", function () {
  startTime2 = "";
  endTime2 = "";
  var yearVersionHtml = '<input type="text" class="form-control" readonly id="yearVersionId" placeholder="选择年份" data-date-format="yyyy" onMouseDown="showYearVersion()"/>';
  var index =layer.open({
        type: 1,
        area: ['980px', '580px'],
        fix: false, //不固定
        maxmin: false,
        btn : [ '取消','确认添加'],
        title : "添加-支付宝手续费配置",  
        content: addInfo('添加',yearVersionHtml),
        success : function() {
            //弹窗加载成功的时候
        },
        btn1 : function(index) {
            layer.close(index);
        },
        btn2 : function(index) {
          var yearVersion=$("#yearVersionId").val();
          var paymentTypes=$("#selectview3Id option:selected").val();
          var chargeRatio=$("#chargeRatioId").val();
          var paymentOperation=$("#paymentOperationId option:selected").val();
          var effectiveStartTime = $("#effectiveStartTimeId").val();
          var effectiveEndTime=$("#effectiveEndTimeId").val();
          var monthlyLimit=$("input[name='monthlyLimit']:checked").val();
          var monthlyMinimumAmount = "";
          var monthlyMaximumAmount = "";
          if(monthlyLimit==0){
            monthlyMinimumAmount=$("#monthlyMinimumAmountId").val();		//月最小限额
            monthlyMaximumAmount=$("#monthlyMaximumAmountId").val();	//月最大限额
          }
          if(!yearVersion||yearVersion==""){
              layer.msg("版本不能为空");
              return false;
          }
          if(!paymentTypes||paymentTypes==(-1)){
              layer.msg("支付类型不能为空");
              return false;
          }
          if(!chargeRatio){
            layer.msg("收费标准不能为空");
            return false;
          }
          if(!paymentOperation||paymentOperation==(-1)){
            layer.msg("支付操作不能为空");
            return false;
          }
          if(!effectiveStartTime){
            layer.msg("起始时间-不能为空");
            return false;
          }
          if(!effectiveEndTime){
            layer.msg("结束时间-不能为空");
            return false;
          }
          if(!monthlyLimit){
            layer.msg("请选择限额类型");
            return false;
          }
          if(monthlyLimit==0){
            if(!monthlyMinimumAmount||monthlyMinimumAmount==""){
              layer.msg("最小限额-不能为空");
              return false;
            }
            if(!monthlyMaximumAmount||monthlyMaximumAmount==""){
              layer.msg("最大限额-不能为空");
              return false;
            }
            if(parseInt(monthlyMinimumAmount) > parseInt(monthlyMaximumAmount)){
              layer.msg("最小限额不能大于最大限额");
              return false;
            }
          }
          var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
          var addInfo ={
              userId:userId,
              yearVersion:yearVersion,
              paymentTypes:paymentTypes,
              chargeRatio:chargeRatio,
              paymentOperationId:paymentOperation,
              effectiveStartTime:effectiveStartTime,
              effectiveEndTime:effectiveEndTime,
              monthlyLimit:monthlyLimit,
              monthlyMinimumAmount:monthlyMinimumAmount,
              monthlyMaximumAmount:monthlyMaximumAmount
          }
          var cmd = 'scAlipayFeeConfiguration/add';
          var data = JSON.stringify(addInfo);
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
                  oTable.Init();
                  selectYearVersionList();
                  layer.msg(re.msg);
              }else{
                 layer.msg(re.msg);
                 return false;
              }
        		},
        		error : function(re) {
                layer.msg('添加失败');
                return false;
        		}
        	});
          layer.close(indexs);
        }
     });
})

//更新
function  updatebtn(id){
  startTime2 = "";
  endTime2 = "";
  var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
  //调用后台查询  根据id
  var cmd = 'scAlipayFeeConfiguration/selectById';
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
          var yearVersionHtml ='<input type="text" class="form-control" readonly id="yearVersionId" placeholder="选择年份" data-date-format="yyyy"/>';
          layer.close(indexs);
          var index =layer.open({
                type: 1,
                area: ['950px', '580px'],
                fix: false, //不固定
                maxmin: false,
                btn : [ '取消','确认修改'],
                title : "修改-支付宝手续费配置",
                content: addInfo('修改',yearVersionHtml),
                success : function() {
                  //弹窗加载成功的时候
                  $("#yearVersionId").val(re.data.yearVersion);
                  $("#selectview3Id").val(re.data.paymentTypes);
                  $("#chargeRatioId").val(re.data.chargeRatio);
                  $("#paymentOperationId").val(re.data.paymentOperationId);
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
                btn1 : function(index) {
                    layer.close(index);
                },
                btn2 : function(index) {
                    //保存操作
                    var yearVersion=$("#yearVersionId").val();
                    var paymentTypes=$("#selectview3Id option:selected").val();
                    var chargeRatio=$("#chargeRatioId").val();
                    var paymentOperation=$("#paymentOperationId option:selected").val();
                    var effectiveStartTime = $("#effectiveStartTimeId").val();
                    var effectiveEndTime=$("#effectiveEndTimeId").val();
                    var monthlyLimit=$("input[name='monthlyLimit']:checked").val();
                    var monthlyMinimumAmount = "";
                    var monthlyMaximumAmount = "";
                    if(monthlyLimit==0){
                      monthlyMinimumAmount=$("#monthlyMinimumAmountId").val();		//月最小限额
                      monthlyMaximumAmount=$("#monthlyMaximumAmountId").val();	//月最大限额
                    }
                    if(!yearVersion||yearVersion==""){
                        layer.msg("版本不能为空");
                        return false;
                    }
                    if(!paymentTypes||paymentTypes==(-1)){
                        layer.msg("支付类型不能为空");
                        return false;
                    }
                    if(!chargeRatio){
                      layer.msg("收费标准不能为空");
                      return false;
                    }
                    if(!paymentOperation||paymentOperation==(-1)){
                      layer.msg("支付操作不能为空");
                      return false;
                    }
                    if(!effectiveStartTime){
                      layer.msg("起始时间-不能为空");
                      return false;
                    }
                    if(!effectiveEndTime){
                      layer.msg("结束时间-不能为空");
                      return false;
                    }
                    if(monthlyLimit==0){
                      if(!monthlyMinimumAmount||monthlyMinimumAmount==""){
                        layer.msg("最小限额-不能为空");
                        return false;
                      }
                      if(!monthlyMaximumAmount||monthlyMaximumAmount==""){
                        layer.msg("最大限额-不能为空");
                        return false;
                      }
                      if(parseInt(monthlyMinimumAmount) > parseInt(monthlyMaximumAmount)){
                        layer.msg("最小限额不能大于最大限额");
                        return false;
                      }
                    }

                    var indexsb = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
                    var addInfo ={
                        userId:userId,
                        id:re.data.id,
                        yearVersion:yearVersion,
                        paymentTypes:paymentTypes,
                        chargeRatio:chargeRatio,
                        paymentOperationId:paymentOperation,
                        effectiveStartTime:effectiveStartTime,
                        effectiveEndTime:effectiveEndTime,
                        monthlyLimit:monthlyLimit,
                        monthlyMinimumAmount:monthlyMinimumAmount,
                        monthlyMaximumAmount:monthlyMaximumAmount
                    }
                    var cmd = 'scAlipayFeeConfiguration/updateById';
                    var data = JSON.stringify(addInfo);
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
                            oTable.Init();
                            selectYearVersionList();
                            layer.msg(re.msg);
                        }else{
                           layer.msg(re.msg);
                           return false;
                        }
                  		},
                  		error : function(re) {
                          layer.msg('修改失败');
                          return false;
                  		}
                  	});
                    layer.close(indexsb);
                }
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

//删除
function  deletebtn(id){
  layer.confirm('确认要删除吗？', {
      btn : [ '删除', '取消' ]//按钮
  },
  function(index) {
    //layer.close(index);
    //此处请求后台程序，下方是成功后的前台处理……
    var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
    var cmd = 'scAlipayFeeConfiguration/delectById';
    var data = JSON.stringify({"id":id,"userId":userId});
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
        layer.close(indexs);
        if(re.code==1){
            oTable.Init();
            selectYearVersionList();
            layer.msg(re.msg);
        }else{
           layer.msg(re.msg);
           return false;
        }
      },
      error : function(re) {
          layer.close(indexs);
          layer.msg('删除失败');
          return false;
      }
    });
  });
}

function showYearVersion(){
  $('#yearVersionId').datepicker({
  	todayBtn : "linked",
  	todayHighlight : true,
  	weekStart : 1,
  	autoclose : true,
    startView: 2,
    maxViewMode: 2,
    minViewMode:2,
    forceParse: false,
  	language : 'zh-CN'
  }).on('changeDate', function(e) {
  	// qBeginTime = e.date;
  	// $('#endTime').datepicker('setStartDate', qBeginTime);
  });

}

// 校验时间前后
function checkDate(startTime, endTime) {
	if ((endTime && startTime) && (endTime <= startTime)) {
		layer.msg("结束日期必须大于开始日期！");
		return true;
	}
	return false;
}

function showEffectiveStartTime(){
  //显示起始时间
  $('#effectiveStartTimeId').datepicker({
      todayBtn : "linked",
      clearBtn : true,
      autoclose : true,
      todayHighlight : true,
      language : "zh-CN"
      //endDate : new Date()
    }).on('changeDate', function(e) {
      startTime2 = e.date;
    	if (checkDate(startTime2, endTime2)) {
    		$('#effectiveStartTimeId').val(null);
    		startTime = null;
    	}
  });
}

function showEffectiveEndTime(){
  //显示结束时间
  $('#effectiveEndTimeId').datepicker({
      todayBtn : "linked",
      clearBtn : true,
      autoclose : true,
      todayHighlight : true,
      language : "zh-CN"
      //endDate : new Date()
    }).on('changeDate', function(e) {
      endTime2 = e.date;
    	if (checkDate(startTime2, endTime2)) {
    		$('#effectiveEndTimeId').val(null);
    		endTime = null;
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
  var cmd = 'scAlipayFeeConfiguration/selectYearVersionList';
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
     var data = {
       yearVersion:yearVersion
    };
    jsonData = JSON.stringify(data);
    var excelUrl = reqAjax('scAlipayFeeConfiguration/exportAlipayFeeConfiguration', jsonData);
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

//限制只能输入数字 和 2位小数
function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}

function addInfo(infoName,yearVersionHtml){
  var html = "";
  html+='<div class="container-fluid" style="margin-top: 30px;">';
  html+='<form class="form-horizontal">';
  html+='<div class="row-fluid" style="padding-bottom: 15px;">';
  html+='</div>';
  html+='<div class="row">';
  html+='<div class="pull-left w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>版 &nbsp&nbsp&nbsp 本：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  // html+='<input type="text" class="form-control" readonly id="yearVersionId" placeholder="选择年份" data-date-format="yyyy" onMouseDown="showYearVersion()"/>';
  html+=yearVersionHtml;
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>收费标准：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input class="form-control" id="chargeRatioId" type="text" onkeyup="clearNoNum(this)"  maxlength="5">';
  html+='</div><div style="float: left;line-height: 34px;">%</div>';
  html+='</div>';
  html+='</div>';
  html+='<div class="pull-right w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>支付类型：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<select class="form-control selectpicker" id="selectview3Id" style="font-size: 15px;">';
  html+='<option value="-1">--选择类型--</option>';
  html+='<option value="1">支付宝</option>';
  html+='</select>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>支付操作：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<select class="form-control selectpicker" style="font-size: 15px;" id="paymentOperationId">';
  html+='<option value="-1">--选择操作--</option>';
  html+='<option value="1">进账</option>';
  html+='<option value="2">出账</option>';
  html+='<option value="3">单笔进账</option>';
  html+='<option value="4">单笔出账</option>';
  html+='</select>';

  html+='</div>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group" style="width: 100%;padding-left: 10px;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>有效日期：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input class="form-control" readonly  id="effectiveStartTimeId" data-date-format="yyyy-mm-dd"  type="text"  placeholder="起始时间" onMouseDown="showEffectiveStartTime()">';
  html+='</div>';
  html+='<div class="col-md-1 col-sm-1" style="line-height: 36px;width: 35px;text-align: center;">';
  html+='<span>至</span>';
  html+='</div>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input class="form-control" readonly id="effectiveEndTimeId" type="text"  placeholder="结束时间" data-date-format="yyyy-mm-dd" onMouseDown="showEffectiveEndTime()">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group" style="width: 100%;padding-left: 10px;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>是否限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<label class="radio-inline" style="padding-right: 30px;">';
  html+='<input type="radio" name="monthlyLimit" id="radioItem0" value="0">限额';
  html+='</label>';
  html+='<label class="radio-inline">';
  html+='<input type="radio" name="monthlyLimit" id="radioItem1" value="1">不限额';
  html+='</label>';
  html+='</div>';
  html+='</div>';

  html+='<div class="form-group edxz-xe" style="width: 100%;padding-left: 10px;display: none;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>最小限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input class="form-control" id="monthlyMinimumAmountId" type="text" onkeyup="clearNoNum(this)" placeholder="最小限额" maxlength="8" style="width:210px;">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group edxz-xe" style="width: 100%;padding-left: 10px;display: none;">';
  html+='<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>最大限额：</label>';
  html+='<div class="col-md-3 col-sm-3">';
  html+='<input class="form-control" id="monthlyMaximumAmountId" type="text"  onkeyup="clearNoNum(this)"  placeholder="最大限额" maxlength="8" style="width:210px;">';
  html+='</div>';
  html+='</div>';

  html+='</div>';
  html+='</form>';
  html+='</div>';
  return html;
}
