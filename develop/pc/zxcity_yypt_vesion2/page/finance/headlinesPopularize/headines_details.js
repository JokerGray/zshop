layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
		var form = layui.form,
			layer = layui.layer,
			$ = layui.jquery,
			laydate = layui.laydate,
			table = layui.table,
			laypage = layui.laypage;

		var userNo = sessionStorage.getItem("userno") || "";

		//接口
		var server = {
			dataList: 'headlinesPopularize/selectHeadlinesOrderLIst' //(查询列表)
			//exportExcel: 'headlines/exportStatisticsList'//(下载地址)
		}
		
		//日期控件
		laydate.render({
			elem: '#startDate',
			done: function(value) {
				$('.startDate').eq(0).attr('data-date', value)
			}
		});
		laydate.render({
			elem: '#endDate',
			done: function(value) {
				$('.endDate').eq(0).attr('data-date', value)
			}
		});
		
		//接收url传参, 初始化日期控件
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
		var queryStatus = getRequestAddressUrlParameter('queryStatus');
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);
		$('#queryStatus').val(queryStatus);
		
		//搜索
		$('#searchBtn').on('click', function() {
			tableInit();
		})
		//重置
		$('#resetBtn').on('click', function() {
			location.reload()
		})
		
		//导出excel
		/*$('#addButton').on('click', function(){
				var parms = {
					username: $('#accountnamer').val() || "",
					prizeType: $("#selectview2").val(),
					startTime: $('#startDate').val(),
					endTime: $('#endDate').val()
				};
				downloadFile(server.exportExcel,JSON.stringify(parms))
		})*/
		
		//layer展开
		$('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
			if($(this).children('i.description').html() == '展开') {
				$(this).children('i.description').html('收起')
				$(this).children('i.icon').addClass('deg');
				$(this).parent().siblings('.app-layer-content').children('ul').hide();
				$(this).parent().siblings('.app-layer-content').children('.layer-place').show();
			} else {
				$(this).children('i.description').html('展开')
				$(this).children('i.icon').removeClass('deg');
				$(this).parent().siblings('.app-layer-content').children('ul').show();
				$(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
			}
		})
		$('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
			$(this).hide();
			$(this).siblings('ul').show();
			$(this).parent().siblings().children('.package-some').children('.description').html('展开');
			$(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
		})
		
		
		//pageCallback
		function pageCallback(index, limit, callback) {
			var advStatus = "";
			var serialNumber = $('#serialNumber').val();
			var username = $('#username').val();
			var queryStatus = $('#queryStatus').val();
			
			if (queryStatus) {
			    if (queryStatus == 3) {
			        $("#selectview2").val("3");
			        $("#selectview1").val("2");
			    } else if (queryStatus == 1) {
			        $("#selectview1").val("1");
			    } else {
			        $("#selectview1").val("2");
			    }
			    form.render('select');
			} else {
			    advStatus = $("#selectview1").val();
			    queryStatus = $("#selectview2").val();
			}
			
			var parms = {
				pageSize: limit,
				pageNo: index,
				serialNumber: serialNumber,
			    startTime: $("#startDate").val(),
			    endTime: $("#endDate").val(),
			    queryStatus: queryStatus,
			    advStatus: advStatus,
			    username: username
			};
			reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				
				var data = res.data;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					
				});
				return callback(res);
			})
		}

		//当前表格渲染
		function tableInit() {  
			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq'
					}, {
						title: '订单编号',
						align: 'left',
						field: 'id'
					}, {
						title: '广告主名称',
						align: 'left',
						field: 'username',
						templet: function(d){
							if (d.username) {
				              return '<a href="#" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo(' + d.advUserId + ')">' + d.username + '</a>';
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '手机号',
						align: 'center',
						field: 'phone'
					}, {
						title: '订单金额',
						align: 'left',
						field: 'totalAmount',
						templet: function(d){
							if (d.totalAmount) {
				              return fmoney(d.totalAmount, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '消费金额',
						align: 'center',
						field: 'amountConsumption',
						templet: function(d){
							if (d.amountConsumption) {
				              return '<button type="button" class="btn btn-info" style="padding: 2px;width: 90px;border-radius: 0px;" onclick="supplierIncomeDetails(\'' + d.id + '\',\'' + 2 + '\',)">' + fmoney(d.amountConsumption, 2) + '</button>';
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '退款金额',
						align: 'left',
						field: 'refundAmount',
						templet: function(d){
							if (d.refundAmount) {
				              return fmoney(d.refundAmount, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '作者收入',
						align: 'left',
						field: 'supplierIncome',
						templet: function(d){
							if (d.supplierIncome) {
				              return fmoney(d.supplierIncome, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '公司收入',
						align: 'left',
						field: 'companyIncome',
						templet: function(d){
							if (d.companyIncome) {
				              return fmoney(d.companyIncome, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '状态',
						align: 'center',
						field: 'advStatus',
						templet: function(d){
							if (d.advStatus == 1) {
				              return '<p style="color: #cc1e1e;font-size: 16px;">进行中</p>';
				            } else if (d.advStatus == 2) {
				              return '<p style="color: #5fb878;font-size: 16px;">已完成</p>';
				            }
						}
					}, {
						title: '开始时间',
						align: 'left',
						field: 'createTime'
					}, {
						title: '完成时间',
						align: 'left',
						field: 'updateTime'
					}, {
						title: '详情',
						align: 'center',
						field: 'xiangqiang',
						templet: function(d){
							return '<button type="button" class="btn btn-success" style="padding: 2px;width: 70px;border-radius: 0px;" onclick="orderDetails(\'' + d.id + '\',\'' + d.advType + '\',\'' + d.unitPrice + '\',\'' + d.putInNumber + '\',\'' + d.placeName + '\',\'' + d.incomeProportion + '\',)">详情</button>';
						}
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
		tableInit();

		//表格方法
		/* 表格初始化
		 * tableId: 表格容器ID
		 * cols:table配置
		 * pageCallback回调(异步)
		 * pageDomName:分页容器ID
		 */
		function _tableInit(tableId, cols, pageCallback, pageDomName) {
			var tableIns, tablePage;
			//1.表格配置
			tableIns = table.render({
				id: tableId,
				elem: '#' + tableId,
				height: 'full-250',
				cols: cols,
				page: false,
				even: true,
				limit: 15,
				cellMinWidth:80,
				done: function(res, curr, count) {
					$('body').on('click', '.layui-table-body table tr', function() {
						$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
					})
					
				}
			});

			//2.第一次加载
			pageCallback(1, 15, function(res) {
				tableIns.reload({
					data: res.data
				})
				//第一页，一页显示15条数据
				layui.use('laypage');
				var page_options = {
					elem: pageDomName,
					count: res ? res.total : 0,
					layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
					limits: [15],
					limit: 15
				}
				page_options.jump = function(obj, first) {
					tablePage = obj;
					//首次不执行
					if(!first) {
						pageCallback(obj.curr, obj.limit, function(resTwo) {
							tableIns.reload({
								data: resTwo.data
							});
						});
					}
				}
				layui.laypage.render(page_options);
				return {
					tablePage,
					tableIns
				};
			});
		}

})

//作者收入详情
function supplierIncomeDetails(orderId, type) {
  var name = "头条收入详情";
  var url = "page/finance/headlinesPopularize/headines_settlement.html?serialNumber=" + orderId;
  parent.addTabs(url, name);
}

//订单详情
function orderDetails(id, advType, unitPrice, putInNumber, placeName, incomeProportion) {
  var index = layer.open({
    type: 1,
    area: [
      '800px', '500px'
    ],
    fix: false, //不固定
    maxmin: false,
    //btn : [ '取消','确认提交'],
    title: "订单详情",
    content: orderInfo(id, advType, unitPrice, putInNumber, placeName, incomeProportion),
    // 弹窗加载成功的时候
    success: function() {}
  });
}

//拼接信息
function orderInfo(id, advType, unitPrice, putInNumber, placeName, incomeProportion) {
  var advTypeStr = "";
  if (advType == 1) {
    advTypeStr = "浏览";
  } else if (advType == 2) {
    advTypeStr = "点击";
  }
  var html = "";
  html += '<div class="container-fluid" style="margin-top: 30px;">';
  html += '<form class="layui-form">';
  html += '<div class="layui-form-item top" style="padding-top: 15px;">';
  html += '<h1 class="dTitle">订单编号：' + id + '</h1>';
  html += '</div>';
  html += '<div class="dContent">';
  html += '<div class="pull-left">';
  html += '<div class="from-item">';
  html += '<label class="control-label"><b class="required-icon"></b>投放类型：</label>';
  html += '<input readonly class="form-control" id="phone" type="text" value="' + advTypeStr + '">';
  html += '</div>';
  html += '<div class="from-item">';
  html += '<label class="control-label"><b class="required-icon"></b>投放位置：</label>';
  html += '<input readonly class="form-control" id="name" type="text" value="' + placeName + '">';
  html += '</div>';
  html += '<div class="from-item">';
  html += '<label class="control-label"><b class="required-icon"></b>收入比例：</label>';
  html += '<input readonly class="form-control" id="name" type="text" value="' + incomeProportion + '">';
  html += '</div>';
  html += '</div>';
  html += '<div class="pull-right">';
  html += '<div class="from-item">';
  html += '<label class="control-label"><b class="required-icon"></b>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价：</label>';
  html += '<input readonly  class="form-control" id="uname" type="text" value="' + fmoney(unitPrice, 2) + '">';
  html += '<span class="input-group-addon">元</span>';
  html += '</div>';
  html += '<div class="from-item">';
  html += '<label class="control-label"><b class="required-icon"></b>投放次数：</label>';
  html += '<input readonly  class="form-control" id="status" type="text" value="' + putInNumber + '">';
  html += '<span class="input-group-addon">次</span>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</form>';
  html += '</div>';
  return html;
}