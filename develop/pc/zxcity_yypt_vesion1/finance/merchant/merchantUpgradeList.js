	// 优惠券汇总
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
			uniqueId : "createTime", // 每一行的唯一标识，一般为主键列
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
					field : 'serialNo',
					title : '流水号',
					align : "center"
				},
				{
					field : 'merchantName',
					title : '商户名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.merchantId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'upgradeType',
					title : '升级类型',
					align : "center",
					formatter : function(res,data) {
						if (res == "1") {
							return "合作商户";
						} else if(res == "2") {
							return "代理商户";
						} else if(res == "3") {
							return "合作商户续费";
						} else if(res == "4") {
							return "代理商户续费";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'upgradeAmount',
					title : '支付金额',
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
					field : 'applyTime',
					title : '申请时间',
					align : "center",
					formatter : function(res) {
						if (res||res==0) {
							return getYMDHmm(res);
						} else {
							return "-";
						}
					}
				}, 
				{
					field : 'status',
					title : '状态',
					align : "center",
					formatter : function(res) {
						if (res == "0") {
							return '<span style="color: green">申请</span>';
						} else if(res == "1"){
							return '<span style="color: blue">商户升级审核通过</span>';
						} else if(res == "2"){
							return '<span style="color: red">商户升级审核不通过</span>';
						} else if(res == "3"){
							return '<span style="color: gray">商户升级完成</span>';
						} else{
							return "-";
						}
					}
				},
				{
					field : 'commissionStatus',
					title : '佣金状态',
					align : "center",
					formatter : function(res) {
						if (res == "0") {
							return '<span style="color: green">未发放</span>';
						} else if(res == "1"){
							return '<span style="color: gray">已发放</span>';
						} else{
							return "-";
						}
					}
				},
				{
					field : 'referenceUserName',
					title : '推荐人',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.referenceUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'referenceMerchantLevel',
					title : '推荐人商户等级',
					align : "center",
					formatter : function(res) {
						if (res == "1") {
							return '个人';
						} else if(res == "2"){
							return '普通商户';
						} else if(res == "3"){
							return '合作商户';
						} else if(res == "4"){
							return '代理商户';
						} else if(res == "5"){
							return '合伙人';
						} else if(res == "6"){
							return '内部员工';
						} else{
							return "-";
						}
					}
				},
				{
					field : 'copartnerUserName',
					title : '合伙人',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.copartnerUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'upgradeAuditUserName',
					title : '升级审核人',
					align : "center"
				},
				{
					field : 'upgradeAutitTime',
					title : '升级审核时间',
					align : "center"
				},
				{
					field : 'referenceAuditUserName',
					title : '佣金审核人',
					align : "center"
				},
				{
					field : 'referenceAuditTime',
					title : '佣金审核时间',
					align : "center"
				},
				{
					field : 'remark',
					title : '备注',
					align : "center"
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
			status : $("#status option:selected").val() ? $("#status option:selected").val() : null,
			commissionStatus : $("#commissionStatus option:selected").val() ? $("#commissionStatus option:selected").val() : null,
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		var res = {
			cmd : "merchantUpgrade/selMerchantUpgradePageList",
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
			param : {
				status : $("#status option:selected").val() ? $("#status option:selected").val() : null,
				merchantName : $("#name").val()
			}
		};
		try {
			var excelUrl = reqAjax('merchantUpdate/exportMerchantUpdateApply', JSON
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
