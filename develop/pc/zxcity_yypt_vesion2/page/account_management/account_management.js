layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
		form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = 154
	//接口
	var serve = {
		resourlist: 'operations/chargeLevelTypeList' //(查询列表)
	};

	
	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	});
	//重置
	$('#resetBtn').on('click', function() {
		location.reload();
	});


	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			operationUserNo:154,
			levelName:$.trim($('#name').val()) || "",
		};
		reqAjaxAsync(serve.resourlist, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));				
			});
			return callback(res);
		});
	};

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable',[
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 200
					}, {
						title: '名称',
						align: 'left',
						field: 'levelName',
						width: 250
					}, {
						title: '费用',
						align: 'left',
						field: 'amount',
						width: 250
					},
					{
						title: '有效天数',
						align: 'left',
						field: 'numValidDays',
						width: 300
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createTime',
						width: 350
					}, {
						title: '修改时间',
						align: 'left',
						field: 'modifyTime',
						width: 350
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
			done: function(res, curr, count) {
				// do something
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
	};
});