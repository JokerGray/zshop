(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var USER_URL = {
		RESOURLIST : 'operations/operationLogList' //(查询状态)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = (ev.date || 0).valueOf();
		$(this).parent().attr('data-time',startTime);
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var endTime = (ev.date || 0).valueOf();
		$(this).parent().attr('data-time',endTime);
	});


	//选中表单事件
	$('#app').on('click','tr',function(){
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})
  

		//渲染表单

	var obj = tableInit('table', [
			[{
				title: '序号',
				/*sort: true,*/
				align: 'left',
				field: 'eq',
				width: 80
			}, {
				title: '系统',
				/*sort: true,*/
				align: 'left',
				field: 'system',
				width: 200
			}, {
				title: '业务',
				/*sort: true,*/
				align: 'left',
				field: 'business',
				width: 200
			},{
				title: '执行类',
				/*sort: true,*/
				align: 'left',
				field: 'className',
				width: 300
			},{
				title: '执行方法',
				/*sort: true,*/
				align: 'left',
				field: 'methodName',
				width: 200
			},{
				title: '执行参数',
				/*sort: true,*/
				align: 'left',
				field: 'parameters',
				width: 300
			},{
				title: '执行时间',
				/*sort: true,*/
				align: 'left',
				field: 'time',
				width: 200
			}]
		],
		pageCallback
	);

	/* 表格初始化
	 * tableId:
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-248',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}


		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}




	//左侧表格数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});

		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit , beginTime,endTime) {
		if(beginTime == undefined){beginTime = ''}
		if(endTime == undefined){endTime = ''}
		return getData(USER_URL.RESOURLIST , "{'page':" + index + ",'rows':" + limit + ",'beginTime':'" + beginTime + "','endTime':'" + endTime + "','sort':'time','order':'desc'}");
	}



	//刷新
	$("#refrsh").click(function(){
		location.reload();
	});

	//点击顶部搜索出现各搜索条件
	$('#search').on('click',function(){
		$('#search-tool').slideToggle(200)
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click',function(){
		var beginTime = $.trim($("#jurisdiction-begin").val());
		var begin = $("#datetimepicker1").attr("data-time");
		var endTime = $.trim($("#jurisdiction-end").val());
		var end = $("#datetimepicker2").attr("data-time");

		if(begin>end){
			layer.msg("开始时间不能晚于结束时间哟");
		}
		else{
			if(beginTime=="" && endTime==""){
				getTable();
			}else if(beginTime=="" || endTime==""){
				layer.msg("开始和结束时间都要选择哟");
			}
			else{
				getTable(beginTime,endTime);
			}
		}

	})

	//重置
	$("#toolRelize").on('click',function(){
		$('#jurisdiction-begin').datepicker('clearDates');
		$('#datetimepicker1').attr("data-time","0");
		$('#datetimepicker2').attr("data-time","0");
		$('#jurisdiction-end').datepicker('clearDates');
	});

	//加了入参的公用方法
	function getTable(beginTime,endTime){
		var initPage = obj.tablePage;
		var initTable = obj.tableIns;
		var res = pageCallback(1, 15,beginTime,endTime);
		initTable.reload({ data : res.data });
		layui.use('laypage');
		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit,beginTime,endTime);
				if(resTwo && resTwo.code == 1)
					initTable.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}
		layui.laypage.render(page_options);
	}

})(jQuery)