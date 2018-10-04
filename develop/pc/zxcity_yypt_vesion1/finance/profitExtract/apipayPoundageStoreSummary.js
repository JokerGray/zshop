var oTable;
var	shouldStoreSum = '';
var	totalStoreSum = '';
var	notStoreSum = '';

$(function () {
    oTable = new TableInit();
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
            search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
            strictSearch: true,
            showColumns: true,     //是否显示所有的列
            showRefresh: true,     //是否显示刷新按钮
            minimumCountColumns: 2,    //最少允许的列数
            search: true,
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "Number",     //排序的字段
            sortOrder: "asc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "type",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "asc",

            showPaginationSwitch: true,

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
                	res.total = res.data.total;
                	//求各字段数据之和
                	var data = res.data.list;
                	shouldStoreSum = data.shouldStore;
                	totalStoreSum = data.totalStore;
                	notStoreSum = (shouldStoreSum - totalStoreSum).toFixed(2);
                	//保留2位小数
                	shouldStoreSum = shouldStoreSum.toFixed(2);
                	totalStoreSum = totalStoreSum.toFixed(2);
                	
                	var arr = new Array();
                	arr.push(data);
                	res.rows = arr;
                    return res;
                }
            },

            columns: [
				{
					field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'type', title:'类型', width: 150, align : "center",
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getTypeInfo()">支付宝手续费</button>';
						return btn;
					}
				},//类型  支付宝手续费
				{ field: 'shouldStore', title:'应存手续费',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},//应存手续费
				{ field: 'totalStore', title:'已存手续费',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},//已存手续费
				{ field: 'notStore', title:'未存手续费',  width: 150, align : "center",
					formatter: function(value,row,index){
						return fmoney((row.shouldStore-row.totalStore), 2);
					}
				},//未存手续费
				{
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openStore('+(index+1)+')">存入手续费</button>';
						var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail()">历史记录</button>';
						return btn1 + '     ' + btn2;
					}
				}
			],
            onLoadSuccess: function (data) {
				//合计
            	addLine();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "scAlipayPoundage/alipayPoundageStatistics";
        var version = "1";
		var data = {};
		
        return {
            cmd: cmd,
            data: JSON.stringify(data),
            version: version
        }
    };
    return oTableInit;

};
	

	//收入提取按钮
	function openStore(type){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', type);
		var upperLimit = parseFloat(notStoreSum);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "支付宝手续费存入",
		  content: template('storeTpl',{
			  row: tempRow
		  }),
		  success: function(layero, index){
			  $('#storeBtn').on('click', function(){
				  	var userId = yyCache.get("userId");
				  	var username = yyCache.get("username");
					var amount = $('#storeMoney').val();
					var operator = $('#yyUserName').val();
					if(!(amount && amount)){
						layer.msg('请填写存入金额');
						return;
					}else if(!amountCheck(amount)){
						layer.msg('请正确输入金额');
						return;
					}else if(amount <= 0 ){
						layer.msg('存入金额必须大于0');
						return;
					}else if(amount > upperLimit){
						layer.msg('存入金额不得超过未存手续费');
						return;
					}else if(!(operator && operator)){
						layer.msg('存入人不能为空');
						return;
					}
					
					var data = {
						t:{
							taxation: amount,
							yyUsername: operator,
							yyName: username,
							yyUserId: userId
						}
					};
					
					var res = reqAjax('scAlipayPoundage/storeAlipayPoundage', JSON.stringify(data));
					if(res.code == 1){
						layer.msg("存入成功！");
						layer.close(index);
						oTable.Init();
					}else{
						layer.msg(res.msg);
					}
			});
		  }
		});
	}
	
	function amountCheck(obj){
		if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
     
			if(obj < 0) {
				return false;
			}
			return true;
		}
		return false;

	}
	
	function addLine(){
    	var htmlTxt = "<tr> "
	    + "<td align='center'><label class='notice'>合计</label></td>"
	    + "<td align='center'>——</td>"
	    + "<td align='center'>"+shouldStoreSum+"</td>"
	    + "<td align='center'>"+totalStoreSum+"</td>"
	    + "<td align='center'>"+notStoreSum+"</td>"
	    + "<td align='center'>——</td>"
	    + "</tr>";

    	$('#table').append(htmlTxt);
    
	}
	
	function getTypeInfo(){
		var name = "支付宝手续费存入月统计";
		var url = "finance/profitExtract/alipayPoundageStoreMonthInfo.html";
		addTabs(url, name);	
	}
	
	function getStoreDetail(){
		var name = "支付宝手续费存入明细";
		var scale = 'all';
		var url = "finance/profitExtract/alipayPoundageStoreLog.html?scale="+scale;
		addTabs(url, name);	
	}
	