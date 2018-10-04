var workItem = "";
$(function() {
		
		//获取跳转前页面传参
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
	    var online = getRequestAddressUrlParameter("online");
	    workItem = getRequestAddressUrlParameter("workItem");
	    // 设置本月起止日期
	    $('#qBeginTime').val(startTime);
	    $('#qEndTime').val(endTime);
	    $('#workItem').prop('value',workItem);
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
			showColumns : false, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			searchOnEnterKey : true,
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
					request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.total;
	                res.rows = res.data;
	                return res;
	            } else {
	            	layer.msg(res.msg);
	            }
			},
			columns : [
				{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter : function(value, row, index) {
						return index + 1;
					}
				},
				{
					field : 'workNo',
					title : '工单号',
					align : "center"
				},
				{
					field : 'merchantName',
					title : '账户名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.merchantId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'orgName',
					title : '商户名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.merchantId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'workItems',
					title : '工单制作项目',
					align : "center",
					formatter : function(res,data) {
						if (res == "0") {
							return "视频拍摄";
						} else if(res == "1") {
							return "720全景";
						} else if (res =="0,1"){
							return "视频拍摄,720全景"
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'workStatus',
					title : '制作状态',
					align : "center",
					formatter : function(res,data) {
						if (res == "0") {
							return "制作中";
						} else if(res == "1") {
							return "制作完成";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'zyzzInfoId',
					title : '工单类型',
					align : "center",
					formatter : function(res,data) {
						if (res == null) {
							return "线下工单";
						} else if(res != null) {
							return "线上工单";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'sourceName',
					title : '工单来源',
					align : "center"
				},
				{
					field : 'reviewVideoReceivable',
					title : '视频制作费用',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'reviewPanoramicReceivable',
					title : '720全景制作费用',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'reviewReceivable',
					title : '应收账款',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'reviewActualReceivable',
					title : '实际收款',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'refUserName',
					title : '推荐人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.refUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'workUserName',
					title : '制作人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.workUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'finishTime',
					title : '工单完成时间',
					align : "center"
				},
				{
					field : 'reviewYyName',
					title : '审核人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'reviewRemark',
					title : '审核备注',
					align : "center"
				},
				{
					field : 'reviewTime',
					title : '审核时间',
					align : "center"
				},
				{
					field : 'reviewStatus',
					title : '财务审核状态',
					align : "center",
					formatter : function(res,data) {
						if (res == "0") {
							return "审核中";
						} else if(res == "1") {
							return '<span style="color: blue">审核通过</span>';
						} else if(res == "2") {
							return '<span style="color: red">审核不通过</span>';
						} else {
							return "错误";
						}
					}
				}
			],
			onLoadSuccess: function (data,row) {
	            // layer.msg('加载成功');
	          	// callBack();
	        	  if(workItem == 1){
	        		  $('#table').bootstrapTable('hideColumn', 'reviewVideoReceivable');
	        		  $('#table').bootstrapTable('showColumn', 'reviewPanoramicReceivable');
	        	  }
	        	  if(workItem == 0){
	        		  $('#table').bootstrapTable('showColumn', 'reviewVideoReceivable');
	        		  $('#table').bootstrapTable('hideColumn', 'reviewPanoramicReceivable');
	        	  }

	          }
		});
	};

	// 获取参数
	table.param = function(params) {
		if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
		}
		
		var startTime=$('#qBeginTime').val();
        var endTime=$('#qEndTime').val();
        var workItem = $('#workItem').val();
        var online = getRequestAddressUrlParameter("online");
		var data = {
			orgName: $("#merchantOrgName").val(),
			workNo: $("#workNo").val(),
			online: online,
			reviewStatus: 1,
			reviewTimeStart: startTime,
			reviewTimeEnd: endTime,
			workItem : workItem,
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		var res = {
			cmd : "payZyzzWorkOrder/selectZyzzWorkOrder",
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
	$("#excelbtn").click(function() {
	    if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
	    }
		var btn = $("#excelbtn");
		// 改变按钮状态
		btn.attr("disabled", "disabled");
		var data = {
			status : "0",
			commissionStatus : null,
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val()
		};
		try {
			var excelUrl = reqAjax('payExcel/exportMerchantUpgrade', JSON.stringify(data));
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



