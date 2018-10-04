	var totalSum = "";
	var totalAmount = "";
	$(function () {
		
		table.init();
		//layer配置
		/*layer.config({
			extend: 'myskin/style.css', //加载您的扩展样式
			skin: 'layer-ext-myskin'
		});*/
	});
	
	
	function callBacks(){
		var visibleColumns = $('#table2').bootstrapTable('getVisibleColumns');
		var hiddenColumns = $('#table2').bootstrapTable('getHiddenColumns');
		
		var subTotalAmount = 0;
		var subTotalSum = 0;
		
		//获取当前页数据;
		var currentPageData = $('#table2').bootstrapTable('getData');
		//小计
		for(var i=0;i<currentPageData.length;i++){
			subTotalAmount += currentPageData[i].exchangeableMoney;
			subTotalSum += currentPageData[i].giftProfitBalance;
		}
	    
		subTotalAmount = subTotalAmount.toFixed(2);
		totalAmount = totalAmount.toFixed(2);
	    var columns = visibleColumns.length + hiddenColumns.length;
	    
	    var htmlTxt = "<tr> "
	    + "<td colspan='"+ columns +"' align='center'>"
	    + "<lable>合计：</lable>"
	    + " " + totalSum + " Z币/" + totalAmount + " 元,"
	    + "&nbsp;&nbsp;&nbsp;&nbsp;小计：" 
	    + " " + subTotalSum + " Z币/" + subTotalAmount + " 元"
	    + "</td>"
	    + "</tr>";
	    
	    $('#table2').append(htmlTxt);
	}
	
	
	var table = new Object();
	table.init = function() {
		
		$('#table2').bootstrapTable({
			url : '/zxcity_restful/ws/rest',
			method : 'POST', // 请求方式（*）
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端
			strictSearch : true,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			searchOnEnterKey : true,
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortName : "orgName", // 排序的字段
			sortOrder : "asc", // 排序方式
			contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
			queryParams : table.param,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList: [10],    //可供选择的每页的行数（*）
			uniqueId : "merchantId", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			showPaginationSwitch : true,
			ajaxOptions:{
	    		beforeSend: function(request){
					request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.data.total;
	                res.rows = res.data.list;
	                totalAmount = res.data.amount;
	                totalSum = res.data.sum;
	                return res;
	            } else {
	            	layer.msg(res.msg);
	            }
			},
			columns : [
				{field : 'Number',title : '序号',align : "center",
					formatter : function(value, row, index) {
						return index + 1;
					}
				},
				{field : 'shopName',title : '店铺名称',align : "center"},//店铺名称
				{field : 'orgName',title : '商户名称',align : "center",
					formatter : function(res,data) {
						if (res) {
							return res;
						} else {
							return "-";
						}
					}
				},//商户名称
				{field : 'username',title : '主脸姓名',align : "center"},//主脸姓名
				{field : 'giftProfitBalance',title : '礼物总价值(单位：Z币)',align : "center",
					formatter : function(res,data) {
						if (res) {
							return res;
						} else {
							return 0;
						}
					}
				}, //礼物总价值
				{field : 'exchangeableMoney',title : '可兑换金额(单位：元)',align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return fmoney(0,2);
						}
					}
				}, //可兑换金额
				{field : 'exchangeablePiglet',title : '可兑换猪仔(单位：个)',align : "center",
					formatter : function(res,data) {
						if (res) {
							return res;
						} else {
							return 0;
						}
					}
				} //可兑换猪仔
			],
			onLoadSuccess: function (data) {
                //layer.msg('加载成功');
            	callBacks();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
		});
	};

	// 获取参数
	table.param = function(params) {
		//var merchantId = $.parseJSON(getUrlParams("merchantId"));
		var merchantId = getRequestAddressUrlParameter("merchantId");
		var data = {
			merchantId : merchantId,
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		
		var res = {
			cmd : "z/selShopExchangeableZDetail",
			version : "1",
			data : JSON.stringify(data)
		};
		return res;
	};

