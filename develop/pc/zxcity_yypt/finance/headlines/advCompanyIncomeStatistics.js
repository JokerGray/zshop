	// 商户升级 公司盈利清单
	$(function() {
		table.init();
		// layer配置
		layer.config({
			extend : 'myskin/style.css', // 加载您的扩展样式
			skin : 'layer-ext-myskin'
		});
	});


	var table = new Object();
	table.init = function() {
		$('#table').bootstrapTable({
			url : '/zxcity_restful/ws/rest',
			method : 'POST', // 请求方式（*）
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端
			strictSearch : true,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			search: true,
			searchOnEnterKey : true,
			searchText: '',	
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortName : "createTime", // 排序的字段
			sortOrder : "desc", // 排序方式
			contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
			queryParams : table.param,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList: [10],    //可供选择的每页的行数（*）
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			showPaginationSwitch : true,
			ajaxOptions:{
	    		beforeSend: function(request){
					request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.data.tatal;
	                res.rows = res.data.list;
	                return res;
	            } else {
	            	layer.msg(res.msg);
	            }
			},
			columns : [{
				field : 'Number',
				title : '序号',
				align : "center",
				width : 50,
				formatter : function(value, row, index) {
					if(row.Number){
						return row.Number;
					}
					return index + 1;
					}
				},{
					field : 'id',
					title : '流水号',
					align : "center",
				},{
					field : 'supplierType',
					title : '业务类型',
					align : "center",
					formatter : function(res, data) {
						if (res == "1") {
							return "代理商户广告位";
						} else if(res == "2") {
							return "签约作者广告位";
						}
				   }
				},
				{
					field : 'amountConsumption',
					title : '金额（人民币）',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";SSSS
						}
					}
				},
				{
					field : 'endTime',
					title : '时间',
					align : "center",
				}
			]
		});
	};

	// 获取参数
	table.param = function(params) {
		// JSON.stringify(jsonobj)
		if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
		}
		var data = {
				onOffLine : "1",
	  		    id: $("#serialNo").val(),
				supplierType : $('#supplierType').val(),
				endTimeStart : $('#qBeginTime').val(),
				endTimeEnd : $('#qEndTime').val(),
				pageNo : params.offset / params.limit + 1,
				pageSize : params.limit
		};
		var res = {
			cmd : "headlines/advCompanyIncomeStatisticsList",
			version : "1",
			data : JSON.stringify(data)
		};
		return res;
	};

	// 搜索
	$("#searchbtn").click(function() {
		$('#table').bootstrapTable('destroy');
		table.init();
		accountDynamicColumn.initCookie();
	});

	//导出
	$("#excelbtn").click(function(params) {
	    if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
	    }
		var btn = $("#excelbtn");
		// 改变按钮状态
		btn.attr("disabled", "disabled");
		var data = {
				onOffLine : "1",
				id: $("#serialNo").val(),
				supplierType : $('#supplierType').val(),
				endTimeStart : $('#qBeginTime').val(),
				endTimeEnd : $('#qEndTime').val(),
				pageNo : params.offset / params.limit + 1,
				pageSize : params.limit
			};
		try {
			var excelUrl = reqAjax('headlines/advCompanyIncomeStatisticsExport', JSON
					.stringify(data));
			if (excelUrl.code != 1) {
				layer.msg(excelUrl.msg);
			} else if(excelUrl.data) {
				// 跳转到下载链接
				window.location.href = excelUrl.data;
			}
		} catch (e) {
			layer.msg("异常：" + e);
		} finally {
			// 恢复按钮状态
			btn.removeAttr("disabled");
		}
	});
