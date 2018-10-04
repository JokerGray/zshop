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
			dataList: 'mainMenu/selectCircleTransferList' //(查询列表)
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
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);
	
		//搜索
		$('#searchBtn').on('click', function() {
			tableInit();
		})
		//重置
		$('#resetBtn').on('click', function() {
			location.reload()
		})
		
		
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
			var serialNo = $('#serialNo').val();
		    var payerName = $('#payerName').val();
		    var payerPhone = $('#payerPhone').val();
			
			var parms = {
				pageSize: limit,
				pageNo: index,
		        startTime: $("#startDate").val(),
		        endTime: $("#endDate").val(),
		        serialNo:serialNo,
		        payerName:payerName,
		        payerPhone:payerPhone
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
						title: '编号',
						align: 'left',
						field: 'serialNo'
					}, {
						title: '转账时间',
						align: 'center',
						field: 'billTime'
					}, {
						title: '发起人',
						align: 'center',
						field: 'payerName',
						templet: function(d){
						   if(d.payerName){
		                      return '<a href="javascript:;" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo('+d.userId+')">'+d.payerName+'</a>';
		                   }else{
		                      return "-";
		                   }
						}
					}, {
						title: '发起人手机号',
						align: 'center',
						field: 'payerPhone'
					}, {
						title: '转账金额',
						align: 'center',
						field: 'money',
						templet: function(d){
							return fmoney(d.money, 2);
						}
					}, {
						title: '接收人',
						align: 'center',
						field: 'payeeName',
						templet: function(d){
						   if(d.payeeName){
		                      return '<a href="javascript:;" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo('+d.payeeUserId+')">'+d.payeeName+'</a>';
		                   }else{
		                      return "-";
		                   }
						}
					}, {
						title: '接收人手机号',
						align: 'center',
						field: 'payeePhone'
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