/**
 * 动态表头配置:
 * 		1.table的id必须为table
 * 		2.在页面添加设置按钮:
 * 				<button class="btn btn-success h34 sechwid" type="button" value="finance/coupon/getAllCoupon" id="setButton">设置</button>
 * 			value : 为当前页面cookie的唯一标识id 不可与其他页面重复 建议取当前页面路径
 * 		3.在table刷新后读取cookie数据,在搜索事件下面调用方法
 * 			accountDynamicColumn.initCookie();
 * 		4.添加js:
 * 				<script type="text/javascript" src="../../common/js/account_dynamic_column.js"></script>
 */
var accountDynamicColumn = new Object();

var totalAmount = "";


function callBack(){
	var visibleColumns = $('#table').bootstrapTable('getVisibleColumns');
	var hiddenColumns = $('#table').bootstrapTable('getHiddenColumns');
    
    var columns = visibleColumns.length + hiddenColumns.length;
    
    var htmlTxt = "<tr> "
    + "<td colspan='"+ columns +"' align='center'>"
    + "<lable>合计：</lable>"
    + " " + totalAmount + " "
    + "</td>"
    + "</tr>";
    
    $('#table').append(htmlTxt);
}


//在table刷新后读取cookie数据
accountDynamicColumn.initCookie = function(){
	if(accountDynamicColumn){
		var dynamicColumnCookie = getCookie(accountDynamicColumn.cookieId);
		if(dynamicColumnCookie){//读取本地cookie设置
			var fields = dynamicColumnCookie.split(',')
			accountDynamicColumn.hideColumn();
			accountDynamicColumn.showColumns(fields);
		}
	}
}
$(function() {
	//layer配置
	layer.config({
		extend: 'myskin/style.css', //加载您的扩展样式
		skin: 'layer-ext-myskin'
	});
	accountDynamicColumn.init();
	
	var dynamicColumnCookie = getCookie(accountDynamicColumn.cookieId);
	if(dynamicColumnCookie){//读取本地cookie设置
		var fields = dynamicColumnCookie.split(',')
		accountDynamicColumn.hideColumn();
		accountDynamicColumn.showColumns(fields);
//		alert(fields.length);
	}
});
/**
 * 初始化
 */
accountDynamicColumn.init = function() {
	accountDynamicColumn.table = $('#table');
	accountDynamicColumn.cookieId = $("#setButton").val();;  //获取当前页面的唯一id
	accountDynamicColumn.visibleColumns = accountDynamicColumn.table.bootstrapTable('getVisibleColumns');
	accountDynamicColumn.hiddenColumns = accountDynamicColumn.table.bootstrapTable('getHiddenColumns');
	accountDynamicColumn.columns = accountDynamicColumn.visibleColumns.concat(accountDynamicColumn.hiddenColumns);
//	alert(accountDynamicColumn.columns.length);
}

/**
 * 获取所有列设置Html
 */
accountDynamicColumn.getColumnsHtml = function() {
	//重新初始化列信息
	accountDynamicColumn.init();
	var columnsTemp = accountDynamicColumn.columns;
	var columns = new Array();
	var need = '<div hidden>';
	for (var i = 0; i < columnsTemp.length; i++) {
		//过滤checkBox Number
		if(columnsTemp[i].field == 'Number'){
			need +='<input  class="form-control" type="checkbox" name="序号" value="Number" checked="checked" />';
		}else if(columnsTemp[i].field == 'checkBox'){
			need +='<input  class="form-control" type="checkbox" name="选择框" value="checkBox" checked="checked" />';
		}else{
			columns.push(columnsTemp[i]);
		}
	}
	need += '</div>';
	var html = '<div class="container-fluid"><form class="form-horizontal">';
	for(var i = 0; i < columns.length; i+=2){
		var left = '<div class="form-group">';
		var right = '';
		//没越界
		if(i+2<=columns.length){
			
			//判断是否勾选
			if(accountDynamicColumn.visibleColumns.indexOf(columns[i])>-1){
				left +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
						'<input  class="form-control" type="checkbox" name="'+columns[i].title+'" value="'+columns[i].field+'"checked="checked">' +
					'</div>';
			}else{
				left +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
					'<input  class="form-control" type="checkbox" name="'+columns[i].title+'" value="'+columns[i].field+'">' +
					'</div>';
			}
			if(accountDynamicColumn.visibleColumns.indexOf(columns[i+1])>-1){
				right +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i+1].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
					'<input  class="form-control" type="checkbox" name="'+columns[i+1].title+'" value="'+columns[i+1].field+'"checked="checked">' +
					'</div></div>';
			}else{
				right +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i+1].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
					'<input  class="form-control" type="checkbox" name="'+columns[i+1].title+'" value="'+columns[i+1].field+'">' +
					'</div></div>';
			}
			
			html += left + right;
		//越界
		}else{
			if(accountDynamicColumn.visibleColumns.indexOf(columns[i])>-1){
				left +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
						'<input  class="form-control" type="checkbox" name="'+columns[i].title+'" value="'+columns[i].field+'"checked="checked">' +
					'</div></div>';
			}else{
				left +=
					'<label class="col-md-2 col-sm-4 control-label">'+columns[i].title+'</label>' +
					'<div class="col-md-4 col-sm-6">' +
					'<input  class="form-control" type="checkbox" name="'+columns[i].title+'" value="'+columns[i].field+'">' +
					'</div></div>';
			}
			html += left;
		}
	}
	return html + need +'</form></div>';
}
/**
 * 获取所有列
 */
accountDynamicColumn.getAllColumns = function() {
	return accountDynamicColumn.columns;
}
/**
 * 隐藏所有列
 */
accountDynamicColumn.hideColumn = function() {
	for (var int = 0; int < accountDynamicColumn.columns.length; int++) {
		accountDynamicColumn.table.bootstrapTable('hideColumn', accountDynamicColumn.columns[int].field);
	}
}

/**
 * 显示列
 */
accountDynamicColumn.showColumn = function(field) {
	accountDynamicColumn.table.bootstrapTable('showColumn', field);
}
/**
 * 显示列
 */
accountDynamicColumn.showColumns = function(fields) {
	for (var int = 0; int < fields.length; int++) {
		if(fields[int]){
			accountDynamicColumn.table.bootstrapTable('showColumn', fields[int]);
		}
	}
}

/**
 * 动态表头弹窗
 */
$("#setButton").click(function() {
	var html = accountDynamicColumn.getColumnsHtml();
	layer.open({
		type : 1,
		title : '表头设置',
		area : ['800px', '500px'],
		btn : ['确认','关闭'],
		bthAlign : 'c',
		content : html,
		// 弹窗加载成功的时候
		success : function() {
			// 修改按钮样式
			$('.layui-layer-btn1').attr('class','layui-layer-btn0');
		},
		btn1 : function(index, layero) {
			accountDynamicColumn.setColumns();
			
			if(typeof(callBack)=="function" && totalAmount != "" && totalAmount != null && totalAmount != undefined){
				callBack();
			}
		},
		btn2 : function(index, layero) {
			layer.close(index);
		}
	});
	
});

/**
 * 动态表头设置
 */
accountDynamicColumn.setColumns = function(){
	accountDynamicColumn.hideColumn();
	var fields = $(":checked");
	var dynamicColumn = new Array();
	$.each(fields, function () {
		dynamicColumn.push($(this).val());
	   accountDynamicColumn.showColumn($(this).val());
    })
    //保存到本地cookie,保存时间为7天
    setCookie(accountDynamicColumn.cookieId, dynamicColumn.join(','), 3600*24*7);
};
/**
 * 操作cookie
 * @param key 
 * @param val
 * @param exp 有效期单位为秒
 */
function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getCookie(c_name){
	if (document.cookie.length>0){
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1){ 
	    c_start=c_start + c_name.length+1 ;
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length
	    	return unescape(document.cookie.substring(c_start,c_end));
	    } 
	  }
	return "";
}
