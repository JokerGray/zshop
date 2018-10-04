var table;
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
			        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
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
									field : 'modelType',
									title : '版块',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res) {
											return res;
										} else {
											return "-";
										}
									}
								},
								{
									field : 'couponType',
									title : '劵类型',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res) {
											return res;
										} else {
											return "-";
										}
									}
								},
								{
									field : 'couponName',
									title : '名称',
									align : "center",
									width : 100,
									formatter : function(name, data) {
										if (!name) {
											return "";
										} else {
											return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView('
													+ data.id
													+ ');">'
													+ name
													+ '</button>';
										}
									}
								}, {
									field : 'merchantId',
									title : '商户名称',
									align : "center",
									width : 100,
									formatter : function(res) {
										if (res) {
											return res;
										} else {
											return "-";
										}
									}
								}, {
									field : 'numberTotal',
									title : '总可用数量',
									align : "center",
									width : 50,
									formatter : function(num) {
										if (num || num == 0) {
											return num;
										} else {
											return "-";
										}
									}
								}, {
									field : 'amount',
									title : '优惠劵金额',
									align : "center",
									width : 80,
									formatter : function(money) {
										if (money || money == 0) {
											return fmoney(money, 2);
										} else {
											return "-";
										}
									}
								}, {
									field : 'amountMin',
									title : '最低消费',
									align : "center",
									width : 80,
									formatter : function(money) {
										if (money || money == 0) {
											return fmoney(money, 2);
										} else {
											return "-";
										}
									}
								}, {
									field : 'beginTime',
									title : '优惠券开始时间',
									align : "center",
									width : 120,
									formatter : function(value, row, index) {
										if (value) {
											return getYMDHmm(value);
										} else {
											return "-";
										}
									}
								}, {
									field : 'endTime',
									title : '优惠券结束时间',
									align : "center",
									width : 120,
									formatter : function(value, row, index) {
										if (value) {
											return getYMDHmm(value);
										} else {
											return "-";
										}
									}
								}, {
									field : 'statusInfo',
									title : '状态',
									align : "center",
									width : 50,
									formatter : function(statusInfo) {
										if (statusInfo) {
											return statusInfo;
										} else {
											return "-";
										}
									}
								}, {
									field : 'createTime',
									title : '创建日期',
									align : "center",
									width : 120,
									formatter : function(value, row, index) {
										if (value) {
											return getYMDHmm(value);
										} else {
											return "-";
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
		coupon : {
			couponName : $("#name").val(),
			modelType : $("#selectview option:selected").val(),
			status : $("#status option:selected").val(),
			start : $('#qBeginTime').val(),
			end : $('#qEndTime').val()
		},
		pagination : {
			page : params.offset / params.limit + 1,
			rows : params.limit
		}
	};
	var res = {
		cmd : "payCoupon/getAllCoupon",
		version : "1",
		data : JSON.stringify(data)
	};
	return res;
};
// 查询详细信息
openInfoView = function(id) {
	if (id) {
		var html, res;
		// 读取前端模板 并且 ajax读取用户信息
		res = reqAjax('payCoupon/getCouponById', JSON.stringify({
			coupon : {
				id : id
			}
		}));
		if (res.code == 1) {
			// 数据格式化
			var data = res.data;
			data.amount = fmoney(data.amount, 2);
			data.amountMin = fmoney(data.amountMin, 2);
			// 加载模板
			html = template('selectCouponInfoTpl', res.data);
			// 打开弹窗
			layer.open({
				type : 1,
				title : '优惠券信息',
				area : [ '800px', '500px' ],
				btn : [ '关闭', '导出'],
				bthAlign : 'c',
				content : html,
				// 弹窗加载成功的时候
				success : function() {
					$('.layui-layer-btn1').attr('id','btn2');
					// 修改按钮样式
					$('.layui-layer-btn1').attr('class','layui-layer-btn0');
				},
				btn1 : function(index, layero) {
					layer.close(index);
				},
				btn2:function(){
					exportCouponInfo($("#couponId").val());
				}
			});
		} else {
			layer.msg(res.msg);
		}

	} else {
		layer.msg('优惠券ID异常, 请联系客服');
	}
}

// 搜索
$("#searchbtn").click(function() {
	$('#table').bootstrapTable('destroy');
	table.init();
	accountDynamicColumn.initCookie();
});
// 导出
$("#excelbtn").click(
		function() {
			var btn = $("#excelbtn");
			// 改变按钮状态
			btn.attr("disabled", "disabled");
			var data = {
				coupon : {
					couponName : $("#name").val(),
					modelType : $("#selectview option:selected").val(),
					status : $("#status option:selected").val(),
					start : $('#qBeginTime').val(),
					end : $('#qEndTime').val()
				}
			};
			try {
				var excelUrl = reqAjax('payCoupon/exportAllCoupon', JSON
						.stringify(data));
				if (excelUrl.code != 1) {
					layer.msg(excelUrl.msg);
				}  else if(excelUrl.data)  {
					// 跳转到下载链接
					window.location.href = excelUrl.data;
				}
			} catch (e) {
				alert("异常：" + e);
			} finally {
				// 恢复按钮状态
				btn.removeAttr("disabled");
			}
		});
// 导出详情
function exportCouponInfo(id) {
	var btn = $("#btn2");
	// 改变按钮状态
	btn.attr("disabled", "disabled");
	try {
		var excelUrl = reqAjax('payCoupon/exportCouponInfo', JSON.stringify({
			coupon : {
				id : id
			}
		}));
		if (excelUrl.code != 1) {
			layer.msg(excelUrl.msg);
		}  else if(excelUrl.data)  {
			// 跳转到下载链接
			window.location.href = excelUrl.data;
		}
	} catch (e) {
		alert("异常：" + e);
	} finally {
		// 恢复按钮状态
		btn.removeAttr("disabled");
	}
}