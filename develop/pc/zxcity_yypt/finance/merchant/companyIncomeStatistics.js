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
					request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
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
					field : 'onOffLine',
					title : '类型',
					align : "center",
					formatter : function(res, data) {
						
						if (res == "1") {
							return "线上办理";
						} else if(res == "2") {
							return "线下办理";
						} else if(res == '合计'){
							return "合计";
						}
					}
				},
				{	
					field : 'agentMerchant',
					title : '代理商数/10万',
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
					field : 'partnerMerchant',
					title : '合作商户数/3650',
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
					field : 'cuont',
					title : '分类合计',
					align : "center",
					formatter : function(res,data) {
						var a = fmoney(data.agentMerchant + data.partnerMerchant ,2 );
						return a >0 ? a : null;
				}	
			}],
			onLoadSuccess: function (res) {	
				if(res.total > 0){
				var row = {
						Number : '',
						onOffLine : '合计',
						agentMerchant : 0.00,	
						partnerMerchant : 0.00 ,
						cuont : ""
					};				
			if (res.code == 1) {					
				if (res.data.list.length > 0) {
					if(res.data.list.length == 1){
						row.agentMerchant = res.data.list[0].agentMerchant ,
						row.partnerMerchant =res.data.list[0].partnerMerchant  ,
						row.cuont = row.agentMerchant + row.partnerMerchant 
					}else{
						row.agentMerchant = res.data.list[0].agentMerchant+ res.data.list[1].agentMerchant ,
						row.partnerMerchant =res.data.list[0].partnerMerchant + res.data.list[1].partnerMerchant ,
						row.cuont = row.agentMerchant + row.partnerMerchant 
					}
				}
			};
				$('#table').bootstrapTable('insertRow', {
					index : res.data.list.length ,
					row : row
				});
				}
	        }
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
					pageNo : params.offset / params.limit + 1,
					pageSize : params.limit,
					upgradeAutitTimeStart : $('#qBeginTime').val(),
					upgradeAutitTimeEnd : $('#qEndTime').val()
		};
		var res = {
			cmd : "merchantUpdate/companyIncomeStatisticsList",
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
				status : $("#status option:selected").val() ? $("#status option:selected").val() : null,
				commissionStatus : $("#commissionStatus option:selected").val() ? $("#commissionStatus option:selected").val() : null,
				onOffLine : "1",
				upgradeAutitTimeStart : $('#qBeginTime').val(),
				upgradeAutitTimeEnd : $('#qEndTime').val()
			};
		try {
			var excelUrl = reqAjax('merchantUpdate/CompanyIncomeDetailListExport', JSON
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
	
	
