// 优惠券汇总
$(function() {
	table.init();
});
var table = new Object();
table.init = function() {
	$('#table')
			.bootstrapTable(
					{
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
			        				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
			        			}
			            },
						responseHandler : function(res) {
							if (res.code == 1) {
								res.rows = res.data;
								return res;
							}
						},
						columns : [
								{
									field : 'Number',
									title : '序号',
									align : "center",
									width : 50,
									formatter : function(value, row, index) {
										return index + 1;
									}
								},
								{
									field : 'merchantBalance',
									title : '商户账户余额',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								},
								{
									field : 'userBalance',
									title : '个人账户余额',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								},
								{
									field : 'uncompleteBalance',
									title : '未完成交易金额',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								}, {
									field : 'income',
									title : '收入',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								}, {
									field : 'recharge',
									title : '充值总金额',
									align : "center",
									width : 50,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								}, {
									field : 'withdraw',
									title : '提现总金额',
									align : "center",
									width : 80,
									formatter : function(res) {
										if (res||res==0) {
											return fmoney(res, 2);
										} else {
											return "-";
										}
									}
								},  {
									field : 'incomeTypeOne',
									title : '商户升级未确认款项',
									align : "center",
									width : 80,
									formatter : function(res) {
											return fmoney(res, 2);
									}
								},{
									field : 'createTime',
									title : '自检日期',
									align : "center",
									width : 80,
									formatter : function(res) {
										if (res) {
											return getYMDHmm(res);
										} else {
											return "-";
										}
									}
								}, {
									field : 'imbalance',
									title : '自检结果',
									align : "center",
									width : 120,
									formatter : function(res) {
										if (res!=0) {
											return '<span style="color: red">'+res+'<span>';
										}else{
											return '<span style="color: green">'+res+'<span>';
										}
									}
								}
						]
					});
};
// 获取参数
table.param = function(params) {
	// JSON.stringify(jsonobj)
	var data = {
		start : $('#qBeginTime').val(),
		end : $('#qEndTime').val(),
		pagination : {
			page : params.offset / params.limit + 1,
			rows : params.limit
		}
	};
	var res = {
		cmd : "payCoupon/getfinanceCheckResult",
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
$("#excelbtn").click(
		function() {
			var btn = $("#excelbtn");
			// 改变按钮状态
			btn.attr("disabled", "disabled");
			var data = {
				start : $('#qBeginTime').val(),
				end : $('#qEndTime').val()
			};
			try {
				var excelUrl = reqAjax('payCoupon/exportfinanceCheckResult', JSON
						.stringify(data));
				if (excelUrl.code != 1) {
					layer.msg(excelUrl.msg);
				} else {
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
