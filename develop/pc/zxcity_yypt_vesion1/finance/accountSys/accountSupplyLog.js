var oTable;
var userId;
var subTotalAmount = "";

$(function () {
  oTable = new TableInit();
  oTable.Init();
  
  //layer配置
  layer.config({
	  extend: 'myskin/style.css', //加载您的扩展样式
	  skin: 'layer-ext-myskin'
  });
  
  
  userId = yyCache.get('userId');
});

/*function callBacks(){
	var visibleColumns = $('#table').bootstrapTable('getVisibleColumns');
	var hiddenColumns = $('#table').bootstrapTable('getHiddenColumns');
	var columns = visibleColumns.length + hiddenColumns.length;
	//小计
	subtotal = parseFloat(subtotal).toFixed(2);
	
    var htmlTxt = "<tr> "
        + "<td colspan='"+ columns +"' align='center'>"
        + "<lable>合计：</lable>"
        + totalAmount + " 元,"
        + "&nbsp;&nbsp;&nbsp;&nbsp;小计：" 
        + subtotal + " 元"
        + "</td>"
        + "</tr>";
        
    $('#table').append(htmlTxt);
}*/


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
        	/*//合计
        	totalAmount = res.data.sum;
        	//小计
        	subTotalAmount = res.data.subtotal;
        	subTotalAmount = parseFloat(subTotalAmount).toFixed(2);*/
	        
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
        {field: 'serialNo', title: '流水号', align: "center", width: 150},
        { field: 'yyUsername', title:'操作人', width: 140, align : "center"},
        {field: 'accountTypeStr', title: '资金池类型', sortable: true, width: 120, align: "center"},
        {field: 'supplyTypeStr', title: '补账类型', sortable: true, width: 120, align: "center"},
        {field: 'money', title: '金额', sortable: true, width: 100, align: "center",
        	formatter: function(res){
        		if(res == null){
        			return "0.00";
        		}else{
        			return fmoney(res, 2);
        		}
        	}
        },
        {field: 'createTime', title: '创建时间', sortable: true, width: 200, align: "center"},
        {field: 'supplyReason', title: '补账原因', sortable: true, width: 200, align: "center",
        	formatter: function(res){
        		if(!res){
        			return "-";
        		}else{
        			res = "<span title='" + res + "' >" + res + "</span>";
        			return res;
        		}
        	}
        }],
        
        /*{field: '_z', title: '操作', width: 200, align: "center",
        	formatter: function (res,row) {
               var btnHtml = "";
               btnHtml += '<button type="button" class="btn btn-info" onclick="updatebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;">修改</button>';
               btnHtml += '<button type="button" class="btn btn-danger" onclick="deletebtn('+ row.id +');" style="padding-bottom: 2px;padding-top: 2px;border-radius: 0px;margin-left: 3px;">删除</button>';
               return btnHtml;
        	}           
        }*/
      onLoadSuccess: function () {
        //layer.msg('加载成功');
    	  //callBack();
      },
      onLoadError: function () {
         layer.msg('系统繁忙');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "accountSupply/selectList";
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
	var serialNo = $('#serialNo').val();
	var operator = $('#operator').val();
	var accountType = $('#selectview1').val();
	var supplyType = $('#selectview2').val();
    var startTime = $('#qBeginTime').val();
    var endTime =$('#qEndTime').val();
  
    var jsonData = {
    	serialNo: serialNo,
    	operator: operator,
    	accountType: accountType,
    	supplyType: supplyType,
    	startTime: startTime,
    	endTime: endTime
    }
    if(pageNo && pageNo){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
    }
    return JSON.stringify(jsonData);
}

//新增事件
$("#addbtn").bind("click", function () {
  var index =layer.open({
        type: 1,
        area: ['980px', '580px'],
        fix: false, //不固定
        maxmin: false,
        btn : [ '确认添加','取消'],
        title : "新增-补账记录",  
        content: addInfo('添加'),
        success : function() {
            //弹窗加载成功的时候
        },
        btn1 : function(index) {
        	var accountType = $("#select3").val();
        	var supplyType = $("#select4").val();
            var money = $("#money_").val();
            var reason = $("#reason").val();
            
            if(!accountType || accountType == -1){
            	layer.msg("请选择资金池类型！");
            	return false;
            }else if(!supplyType || supplyType == -1){
            	layer.msg("请选择补账类型！");
            	return false;
            }else if(!money){
            	layer.msg("请输入金额！");
            	return false;
            }else if(money <= 0){
            	layer.msg("金额必须大于0！");
            	return false;
            }else if(money > 10000000){
            	layer.msg("单笔操作金额不得超过一千万元！");
            	return false;
            }else if(!reason){
            	layer.msg("补账原因不能为空！");
            	return false;
            }
            
            var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
            var jsonData = {
            	entity: {
            		supplyType: supplyType,
            		accountType: accountType,
            	    money: money,
            	    yyUserId: yyCache.get("userId"),
            	    yyUsername: yyCache.get("pcNickname"),
            	    supplyReason: reason
            	}		
            }
            
	        var cmd = 'accountSupply/addSupplyLog';
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



//查询搜索事件
$("#searchbtn").bind("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
	
});


// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
 
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    var jsonData = getSearchParam();
    var version = "1";

    var excelUrl = reqAjax('accountSupply/exportSupplyLogs', jsonData);
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

function addInfo(infoName){  
	  var html = "";
	  html+='<div class="container-fluid" style="margin-top: 30px;">';
	  html+='<form class="form-horizontal">';
	  html+='<div class="row-fluid" style="padding-bottom: 15px;">';
	  html+='</div>';
	  html+='<div class="row">';
	  
	  html+='<input type="hidden" name="logId" id="logId" value="">';
	  html+='<div class="pull-left w-half">';         
	  html+='<div class="form-group">';
	  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>资金池类型：</label>';
	  html+='<div class="col-md-6 col-sm-6">';
	  html+='<select class="form-control selectpicker" style="font-size: 15px;" id="select3">';
	  html+='<option value="-1">--选择资金池类型--</option>';
	  html+='<option value="1">支付宝</option>';
	  html+='<option value="2">微信</option>';
	  html+='</select>';
	  html+='</div>';
	  html+='</div>';
	  html+='<div class="form-group">';
	  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>补账类型：</label>';
	  html+='<div class="col-md-6 col-sm-6">';
	  html+='<select class="form-control selectpicker" style="font-size: 15px;" id="select4">';
	  html+='<option value="-1">--选择补账类型--</option>';
	  html+='<option value="1">增加</option>';
	  html+='<option value="2">扣除</option>';
	  html+='</select>';
	  html+='</div>';
	  html+='</div>';
	  html+='<div class="form-group">';
	  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>金&nbsp&nbsp&nbsp 额：</label>';
	  html+='<div class="col-md-6 col-sm-6">';
	  html+='<input class="form-control" id="money_" type="text" onkeyup="clearNoNum(this)" maxlength="11">';
	  html+='</div>';
	  html+='</div>';
	  html+='<div class="form-group">';
	  html+='<label class="col-md-4 col-sm-4 control-label"><b class="required-icon">*</b>补账原因：</label>';
	  html+='<div class="">';
	  html+='<textarea id="reason" class="form-control poi" rows="6" value="" maxlength="1024" placeholder="请输入补账原因(如： 异常工单等等)"/>';
	  html+='</div>';
	  html+='</div>';
	  html+='</div>';

	  html+='<div class="pull-right w-half">';
	  html+='</div>';
	  
	  html+='</div>';
	  html+='</form>';
	  html+='</div>';
	  return html;
}
