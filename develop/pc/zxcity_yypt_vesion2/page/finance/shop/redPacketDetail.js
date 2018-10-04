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
				dataList: 'payTransactionLog/redPacketDetail', //(查询列表)
				exportExcel: 'payExcel/exportRedPacketDetail'//(下载地址)
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
			
			
			//导出excel
			$('#addButton').on('click', function(){
				//var packetStatus = getRequestAddressUrlParameter("packetStatus");
				var packetStatus = "";
				var data = {
					param: {
						userName: $('#accountnamer').val() || "",
						packetStatus: packetStatus,
						createTimeStart: $('#startDate').val(),
						createTimeEnd: $('#endDate').val()
					},
					pagi: {
						
					}
				};
				
				downloadFile(server.exportExcel,JSON.stringify(data));
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
				//var packetStatus = getRequestAddressUrlParameter("packetStatus");
				var packetStatus = "";
				var data = {
					param: {
						userName: $('#accountnamer').val() || "",
						packetStatus: packetStatus,
						createTimeStart: $('#startDate').val(),
						createTimeEnd: $('#endDate').val()
					},
					pagi: {
						page: index,
						rows: limit
					}
				};
				
				reqAjaxAsync(server.dataList, JSON.stringify(data)).then(function(res) {
					if(res.code != 1) {
						return layer.msg(res.msg);
					}
					var resData=res.data;
					$('#amount').text('合计 : '+resData.sum+'')
					var data = res.data.list;
					$.each(data, function(i, item) {
						$(item).attr('eq', (i + 1));
						
						$(item).attr('packetTotalAmount', fmoney(item.packetTotalAmount, 2));
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
							title: '流水号',
							align: 'left',
							field: 'serialNo'
						}, {
							title: '发送人账户名称',
							align: 'left',
							field: 'userName'
						}, {
							title: '发送人手机号',
							align: 'center',
							field: 'userPhone'
						}, {
							title: '发送类型',
							align: 'left',
							field: 'userTypeStr'
						}, {
							title: '红包类型',
							align: 'left',
							field: 'packetTypeStr'
						}, {
							title: '红包金额',
							align: 'left',
							field: 'packetTotalAmount'
						}, {
							title: '红包个数',
							align: 'left',
							field: 'packetNum'
						}, {
							title: '已领取个数',
							align: 'left',
							field: 'packetNumReceive'
						}, {
							title: '创建时间',
							align: 'left',
							field: 'createTime'
						},{
							title: '红包状态',
							align: 'left',
							field: 'packetStatusStr'
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
						data: res.data.list
					})
					//第一页，一页显示15条数据
					layui.use('laypage');
					var page_options = {
						elem: pageDomName,
						count: res ? res.data.total : 0,
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
									data: resTwo.data.list
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