var oTable;
var userId;
var sourceList = "",
	totalDeposit = "",
	totalForward = "",
	subtotalDeposit = "",
	subtotalForward = "";

$(function () {
  oTable = new TableInit();
  oTable.Init();
  getSourceList();
  //layer配置
  layer.config({
	  extend: 'myskin/style.css', //加载您的扩展样式
	  skin: 'layer-ext-myskin'
  });

  userId = yyCache.get('userId');
});

function callBacks(){
	var visibleColumns = $('#table').bootstrapTable('getVisibleColumns');
	var hiddenColumns = $('#table').bootstrapTable('getHiddenColumns');
	var columns = visibleColumns.length + hiddenColumns.length;
	
	totalDeposit = parseFloat(totalDeposit).toFixed(2);
	totalForward = parseFloat(totalForward).toFixed(2);
	subtotalDeposit = parseFloat(subtotalDeposit).toFixed(2);
	subtotalForward = parseFloat(subtotalForward).toFixed(2);
	
	var htmlTxt = "<tr> "
		+ "<td colspan='"+ columns +"' align='center'>"
	    + "<lable style='color: red;'>[小计] </lable>"
	    + "定金总额： " + subtotalDeposit + " 元,&nbsp&nbsp&nbsp&nbsp  已结转总金额： " + subtotalForward + " 元"
	    + "</td>"
	    + "</tr>"
	    + "<tr>"
	    + "<td colspan='"+ (columns+1) +"' align='center'>"
	    + "<lable style='color: red;'>[合计] </lable>"
	    + "定金总额： " + totalDeposit + " 元,&nbsp&nbsp&nbsp&nbsp  已结转总金额： " + totalForward + " 元"
	    + "</td>"
	    + "</tr>";
	    
    $('#table').append(htmlTxt);
}


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
      sortName : "createTime",     //排序的字段
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
      uniqueId: "id",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表
      // singleSelect : true,        //是否只能选中一个
      sortOrder: "desc",
      showPaginationSwitch: true,
      ajaxOptions:{
    	  beforeSend: function(request){
    		  request.setRequestHeader("apikey", yyCache.get('apikey') == null ? "test" : yyCache.get('apikey'));
		  }
      },
      responseHandler: function (res) {
        if (res.code == 1) {
        	res.total = res.data.total;
        	//统计定金总额及已结转总金额
	        totalDeposit = res.data.totalDeposit;
	        totalForward = res.data.totalForward;
	        subtotalDeposit = res.data.subtotalDeposit;
	        subtotalForward = res.data.subtotalForward;
	        totalAmount = totalDeposit;
	        
        	res.rows = res.data.list;
	        return res;
        }else{
           layer.msg(res.msg);
          return false;
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 60,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'merchantName', title: '商户名称', align: "center", width: 150},
        { field: 'phone', title:'手机号', width: 100, align : "center"},
        {field: 'corporationName', title: '法人姓名', sortable: true, width: 120, align: "center",
          formatter: function (res) {
               if(!res){
                  return '-';
               }else{
                  return res;
               }
          }
        },
        {field: 'money', title: '定金金额', sortable: true, width: 100, align: "center",
        	formatter: function(res){
        		if(res == null){
        			return "-";
        		}else{
        			return fmoney(res, 2);
        		}
        	}
        },
        {field: 'typeStr', title: '类型', sortable: true, width: 80, align: "center"},
        {field: 'sourceName', title: '来源', sortable: true, width: 150, align: "center"},
        {field: 'createTime', title: '创建时间', sortable: true, width: 240, align: "center"},
        {field: 'remark', title: '备注', sortable: true, width: 200, align: "center",
        	formatter: function(res){
        		if(!res){
        			return "-";
        		}else{
        			return res;
        		}
        	}
        },
        {field: 'relativeMerchantName', title: '关联商户名称', width: 150, align: "center"},
        {field: 'relativeCorporationName', title: '关联法人名称', width: 120, align: "center"},
        {field: 'realMoney', title: '实付金额', width: 100, align: "center",
        	formatter: function(res){
        		if(res == null){
        			return "-";
        		}else{
        			return fmoney(res, 2);
        		}
        	}
        },
        {field: 'carriedForwardFlag', title: '是否结转', sortable: true, width: 90, align: "center",
        	formatter: function(res, row){
        		if(res == 0){
        			return "<span style='color: red;' >未结转</span>";
        		}else if(res == 1){
        			return "<span style='color: green;' >已结转</span>";
        		}
        		return "-";
        	}
        },
        {field: 'carriedForwardMoney', title: '结转金额', sortable: true, width: 100, align: "center",
        	formatter: function(res, row){
        		if(row.carriedForwardFlag == 0){
        			return "-";
        		}else if(row.carriedForwardFlag == 1){
        			return fmoney(res, 2);
        		}
        		return "-";
        	}
        },
        {field: '_z', title: '操作', width: 200, align: "center",
          formatter: function (res,row) {
               var btnHtml = "";
               if(row.carriedForwardFlag == 1){
            	   btnHtml += '<button type="button" disabled="disabled" class="btn btn-info" onclick="updatebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;">修改</button>';
               }else{
            	   btnHtml += '<button type="button" class="btn btn-info" onclick="updatebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;">修改</button>';
               }
               //btnHtml += '<button type="button" class="btn btn-danger" onclick="deletebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-left: 3px;">删除</button>';
               if(row.carriedForwardFlag == 1){
            	   btnHtml += '<button type="button" disabled="disabled" class="btn btn-primary" onclick="forwardbtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-left: 3px;">结转</button>';
               }else{
            	   btnHtml += '<button type="button" class="btn btn-primary" onclick="forwardbtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-left: 3px;">结转</button>';
               }
               return btnHtml;
          }
        }],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
    	  callBacks(); 
      },
      onLoadError: function () {
         layer.msg('系统繁忙');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "depositManageMent/selectList";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    
    var jsonData = getSearchParam(pageNo, pageSize);
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
	var type = $('#selectview2').val();
	var merchantName = $('#merchantName').val();
	var phone = $('#phone').val();
	var corporationName = $('#corporationName').val();
    var startTime = $('#qBeginTime').val();
    var endTime =$('#qEndTime').val();
  
    var jsonData = {
    	type: type,
    	merchantName: merchantName,
    	phone: phone, 
    	corporationName: corporationName,
    	startTime: startTime,
    	endTime: endTime
    }
    if(pageNo && pageNo){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
    }
    return JSON.stringify(jsonData);
}

//动态获取下拉框
function getSourceList(){
	var options = "";
	var cmd = 'payZyzz/getSourceList';
    var jsonData = {};
    jsonData = JSON.stringify(jsonData);
    $.ajax({
		type : "POST",
		url : "/zxcity_restful/ws/rest",
		dataType : "json",
	  //async : false,
		data : {"cmd" : cmd, "data" : jsonData, "version" : 1},
		beforeSend : function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success : function(re) {
	      if(re.code==1){
	    	  var list = re.data;
	          $.each(list, function(index, item){
	        	  options += "<option value='" + item.id + "' >" + item.name + "</option>";
	          })
	          sourceList = options;
	      }else{
	         //layer.msg(re.msg);
	         return false;
	      }
		},
		error : function(re) {
			return false;
		}
	});
	
}


//新增事件
$("#addbtn").bind("click", function () {
  var index =layer.open({
        type: 1,
        area: ['980px', '580px'],
        fix: false, //不固定
        maxmin: false,
        btn : [ '确认添加','取消'],
        title : "新增-智扮/智管定金",  
        content: addInfo('添加', sourceList),
        success : function() {
            //弹窗加载成功的时候
        },
        btn1 : function(index) {
        	var merchantName = $("#merchantName_").val();   
            var phone = $("#phone_").val();
            var corporationName = $("#corporationName_").val();
            var money = $("#money_").val();
            var type = $("#select1").val();
            var sourceId = $("#select2").val();
            var sourceName = $("#select2 option:selected").text();
            var remark = $("#remark_").val();
          
            if(!merchantName){
            	layer.msg("请输入商户名称！");
            	return false;
            }else if(!merchantName.replace(/\s/g,"")){
            	layer.msg("商户名称不能为空字符！");
            	return false;
            }else if(!phone || phone.length >= 13){
            	layer.msg("手机号输入有误, 请重新输入！");
            	return false;
            }else if(isNaN(phone)){
            	layer.msg("手机号不能包含数字以外的其它字符！");
            	return false;
            }else if(!corporationName){
            	layer.msg("请输入法人名称！");
            	return false;
            }else if(!corporationName.replace(/\s/g,"")){
            	layer.msg("法人名称不能为空字符！");
            	return false;
            }else if(!money){
            	layer.msg("请输入定金金额！");
            	return false;
            }else if(money <= 0){
            	layer.msg("定金金额必须大于0！");
            	return false;
            }else if(!type || type == -1){
            	layer.msg("请选择类型！");
            	return false;
            }else if(!sourceId || sourceId == -1 || !sourceName){
            	layer.msg("请选择来源！");
            	return false;
            }
          
            var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
            var jsonData = {
            	entity: {
            		merchantName: merchantName,
    	            phone: phone,
    	            corporationName: corporationName,
    	            money: money,
    	            type: type,
    	            sourceId: sourceId,
    	            sourceName: sourceName,
    	            remark: remark
            	}		
            }
            
	        var cmd = 'depositManageMent/addDepositRecord';
	        var data = JSON.stringify(jsonData);
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
            layer.close(index);
            layer.close(indexs);
        },
        btn2 : function(index) {
            layer.close(index);
        }
     });
})



//修改
function updatebtn(id){
	var row = $('#table').bootstrapTable('getRowByUniqueId', id);
	var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
	//layer.close(indexs);
    var index =layer.open({
        type: 1,
        area: ['950px', '580px'],
        fix: false, //不固定
        maxmin: false,
        btn : [ '确认修改','取消'],
        title : "修改-智扮/智管定金",
        content: addInfo('修改', sourceList),
        success : function() {
        	//弹窗加载成功的时候
        	$("#merchantName_").val(row.merchantName);
        	$("#phone_").val(row.phone);
        	$("#corporationName_").val(row.corporationName);
        	$("#money_").val(row.money);
        	$("#select1").val(row.type);
        	$("#select2").val(row.sourceId);
        	$("#remark_").val(row.remark);
        	layer.close(indexs);
        },
        btn1 : function(index) {
            //确认修改
        	var merchantName = $("#merchantName_").val();   
            var phone = $("#phone_").val();
            var corporationName = $("#corporationName_").val();
            var money = $("#money_").val();
            var type = $("#select1").val();
            var sourceId = $("#select2").val();
            var sourceName = $("#select2 option:selected").text();
            var remark = $("#remark_").val();
        	
            if(!merchantName){
            	layer.msg("请输入商户名称！");
            	return false;
            }else if(!merchantName.replace(/\s/g,"")){
            	layer.msg("商户名称不能为空字符！");
            	return false;
            }else if(!phone || phone.length >= 13){
            	layer.msg("手机号输入有误, 请重新输入！");
            	return false;
            }else if(isNaN(phone)){
            	layer.msg("手机号不能包含数字以外的其它字符！");
            	return false;
            }else if(!corporationName){
            	layer.msg("请输入法人名称！");
            	return false;
            }else if(!corporationName.replace(/\s/g,"")){
            	layer.msg("法人名称不能为空字符！");
            	return false;
            }else if(!money){
            	layer.msg("请输入定金金额！");
            	return false;
            }else if(money <= 0){
            	layer.msg("定金金额必须大于0！");
            	return false;
            }else if(!type || type == -1){
            	layer.msg("请选择类型！");
            	return false;
            }else if(!sourceId || sourceId == -1 || !sourceName){
            	layer.msg("请选择来源！");
            	return false;
            }
            
            var indexsb = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
            var jsonData = {
        		id: id,
        		merchantName: merchantName,
	            phone: phone,
	            corporationName: corporationName,
	            money: money,
	            type: type,
	            sourceId: sourceId,
	            sourceName: sourceName,
	            remark: remark
            }
            var cmd = 'depositManageMent/edit';
            var data = JSON.stringify(jsonData);
            $.ajax({
          		type : "POST",
          		url : "/zxcity_restful/ws/rest",
          		dataType : "json",
          	  //async : false,
          		data : {"cmd" : cmd, "data" : data, "version" : version},
          		beforeSend : function(request) {
          			request.setRequestHeader("apikey", apikey);
          		},
          		success : function(re) {
	                if(re.code==1){
	                    oTable.Init();
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
            layer.close(index);
            layer.close(indexsb);
        },
        btn2 : function(index) {
            layer.close(index);
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
    var cmd = 'depositManageMent/deleteByLogic';
    var data = JSON.stringify({id: id});
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

//结转
function forwardbtn(id){
  layer.confirm('确认要结转吗？', {
      btn : [ '结转', '取消' ]//按钮
  },
  function(index) {
    //layer.close(index);
    //此处请求后台程序，下方是成功后的前台处理……
    var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
    var cmd = 'depositManageMent/carryForward';
    var data = JSON.stringify({id: id});
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
            layer.msg(re.msg);
        }else{
           layer.msg(re.msg);
           return false;
        }
      },
      error : function(re) {
          layer.close(indexs);
          layer.msg('结转失败');
          return false;
      }
    });
  });
}


//查询搜索事件
$("#searchbtn").bind("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
	getSourceList();
});


// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
 
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    var jsonData = getSearchParam();
    var version = "1";

    var excelUrl = reqAjax('depositManageMent/exportDepositList', jsonData);
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

function addInfo(infoName, sourceList){
  var html = "";
  html+='<div class="container-fluid" style="margin-top: 30px;">';
  html+='<form class="form-horizontal">';
  html+='<div class="row-fluid" style="padding-bottom: 15px;">';
  html+='</div>';
  html+='<div class="row">';
  
  html+='<div class="pull-left w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>商户名称：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input class="form-control" id="merchantName_" type="text" maxlength="20">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>法人姓名：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input class="form-control" id="corporationName_" type="text" maxlength="20">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>类&nbsp&nbsp&nbsp 型：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<select class="form-control selectpicker" style="font-size: 15px;" id="select1">';
  html+='<option value="-1">--选择类型--</option>';
  html+='<option value="0">智扮</option>';
  html+='<option value="1">智管</option>';
  html+='</select>';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label">备&nbsp&nbsp&nbsp 注：</label>';
  html+='<div class="col-md-8 col-sm-6">';
  html+='<textarea id="remark_" class="form-control" rows="4" value="" maxlength="100" placeholder="备注字数不能超出100"/>';
  html+='</div>';
  html+='</div>';
  html+='</div>';

  html+='<div class="pull-right w-half">';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>手机号：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input class="form-control" id="phone_" type="text" maxlength="20">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>定金金额：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<input class="form-control" id="money_" type="text" onkeyup="clearNoNum(this)" maxlength="20">';
  html+='</div>';
  html+='</div>';
  html+='<div class="form-group">';
  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>来&nbsp&nbsp&nbsp 源：</label>';
  html+='<div class="col-md-6 col-sm-6">';
  html+='<select class="form-control selectpicker" style="font-size: 15px;" id="select2">';
  html+='<option value="-1">--选择来源--</option>';
  html+=sourceList;
  html+='</select>';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  
  html+='</div>';
  html+='</form>';
  html+='</div>';
  return html;
}
