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
	$('#table').bootstrapTable('destroy').bootstrapTable({
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
			res.rows = res.data;
			return res;
		},
		columns : [ {
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
		}, {
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
		}, {
			field : 'couponTotalNum',
			title : '优惠券总数量',
			align : "center",
			width : 100,
			formatter : function(res) {
				if (res || res == 0) {
					return res;
				} else {
					return "0";
				}
			}
		}, {
			field : 'couponTotalAmount',
			title : '优惠券总金额',
			align : "center",
			width : 100,
			formatter : function(res) {
				if (res || res == 0) {
					return fmoney(res, 2);
				} else {
					return "0.00";
				}
			}
		}, {
			field : 'couponGetTotalNum',
			title : '领用总数量',
			align : "center",
			width : 100,
			formatter : function(res) {
				if (res || res == 0) {
					return res;
				} else {
					return "0";
				}
			}
		}, {
			field : 'couponGetTotalAmount',
			title : '领用总金额',
			align : "center",
			width : 50,
			formatter : function(res) {
				if (res || res == 0) {
					return fmoney(res, 2);
				} else {
					return "0.00";
				}
			}
		} ],
		onLoadSuccess: function (res) {
			//展现视图
			try {
				var yData = echartsCustomerFunction.parseDate(res.data);
				var myChart = echarts.init(document.getElementById('echartsDiv'));
				var option = echartsCustomerFunction.initOption('优惠券领用统计', ['优惠券总数量','优惠券总金额','领用总数量','领用总金额'],yData['modelType'], [yData['couponTotalNum'],yData['couponTotalAmount'],yData['couponGetTotalNum'],yData['couponGetTotalAmount']]);
				myChart.setOption(option);
			} catch (e) {
			}
			var row = {
					Number : '合计',
					modelType : ' ',
					couponTotalNum : '0',
					couponTotalAmount : '0.00',
					couponGetTotalNum : '0',
					couponGetTotalAmount : '0.00'
				};
			if (res.code == 1) {
				if (res.data.length > 0) {
					row.couponTotalNum = res.data[0].numberTotalSum ? res.data[0].numberTotalSum : '0';
					row.couponTotalAmount = fmoney(res.data[0].amountSum ? res.data[0].amountSum : '0.00');
					row.couponGetTotalNum = res.data[0].couponGetSum ? res.data[0].couponGetSum : '0';
					row.couponGetTotalAmount = fmoney(res.data[0].moneyGetSum ? res.data[0].moneyGetSum : '0.00') ;
				} 
			}
			$('#table').bootstrapTable('insertRow', {
				index : res.data.length,
				row : row
			});
        }
	});
};
// 获取参数
table.param = function(params) {
	// JSON.stringify(jsonobj)
	var data = {
		coupon : {
			start : $('#qBeginTime').val(),
			end : $('#qEndTime').val()
		},
		pagination : {
			page : params.offset / params.limit + 1,
			rows : params.limit
		}
	};
	var res = {
		cmd : "payCoupon/getCouponGetSum",
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
// 导出
$("#excelbtn").click(
		function() {
			var btn = $("#excelbtn");
			//改变按钮状态
			btn.attr("disabled","disabled");
			var data = {
				coupon : {
					start : $('#qBeginTime').val(),
					end : $('#qEndTime').val()
				}
			};
			try {
				var excelUrl = reqAjax('payCoupon/exportCouponGetSum', JSON
						.stringify(data));
				if (excelUrl.code != 1) {
					layer.msg(excelUrl.msg);
				}  else if(excelUrl.data)  {
					// 跳转到下载链接
					window.location.href = excelUrl.data;
				}
			} catch (e) {
				alert("异常：" + e);
			}finally{
				//恢复按钮状态
				btn.removeAttr("disabled");
			}
		});