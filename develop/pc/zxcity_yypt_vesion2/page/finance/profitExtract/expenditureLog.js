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
			dataList: 'mainMenu/selectExpenditureLog' //(查询列表)
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
			var parms = {
				pageSize: limit,
				pageNo: index,
				username: $('#accountnamer').val() || "",
				startTime: $('#startDate').val(),
				endTime: $('#endDate').val()
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
						title: '用户名称',
						align: 'left',
						field: 'username'
					}, {
						title: '金额',
						align: 'left',
						field: 'money',
						templet: function(d){
							if(d.money){
								return fmoney(d.money, 2);
							}
							return "0.00";
						}
					}, {
						title: '收费金额',
						align: 'left',
						field: 'alipayFee',
						templet: function(d){
							if(d.money){
								return fmoney(d.money, 2);
							}
							return "0.00";
						}
					}, {
						title: '到账类型',
						align: 'center',
						field: 'type',
						templet: function(d){
							if(d.type == 1){
								return '当日';
							}else if(d.type == 2){
								return "次日";
							}
							return "-";
						}
					}, {
						title: '业务类型',
						align: 'left',
						field: 'businessType',
						templet: function(d){
							if(d.businessType == 1){
								return '预支';
							}else if(d.businessType == 2){
								return "充值";
							}
						}
					}, {
						title: '系统账户类型',
						align: 'left',
						field: 'scAccountSysId',
						templet: function(d){
							if(d.scAccountSysId == 4){
								return '盈利账户';
							}
						}
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createTime'
					}, {
						title: '修改时间',
						align: 'center',
						field: 'updateTime',
						templet: function(d){
							if(!d.updateTime){
								return "-";
							}
							return d.updateTime;
						}
					}, {
						title: '备注',
						align: 'center',
						field: 'remarks',
						templet: function(d){
							if(d.remarks){
								return d.remarks;
							}
							return "-";
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