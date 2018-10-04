(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var USER_URL = {
		RESOURLIST : 'operations/findCustomserviceOnlineHistory' //(查询状态)
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
		var startTime = (ev.date || "").valueOf();
		$(this).parent().attr('data-time',startTime);
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var endTime = (ev.date || "").valueOf();
		$(this).parent().attr('data-time',endTime);
	});


	//选中表单事件
	$('#app').on('click','tr',function(){
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})
  
	//初始化
	$(function(){
		getTable();
	});


		//渲染表单

	function getTable(endtime,starttime,usercode,phonenum){
		var obj = tableInit('table', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '客服工号',
					/*sort: true,*/
					align: 'left',
					field: 'usercode',
					width: 200
				}, {
					title: '客服名',
					/*sort: true,*/
					align: 'left',
					field: 'username',
					width: 200
				},{
					title: '在线接入量',
					/*sort: true,*/
					align: 'left',
					field: 'online_access',
					width: 200
				},{
					title: '手机号',
					/*sort: true,*/
					align: 'left',
					field: 'phone',
					width: 300
				},{
					title: '电话接入量',
					/*sort: true,*/
					align: 'left',
					field: 'telephone_access',
					width: 300
				},{
					title: '首次登录时间',
					/*sort: true,*/
					align: 'left',
					field: 'first_landing_time',
					width: 200
				},{
					title: '最后登录时间',
					/*sort: true,*/
					align: 'left',
					field: 'final_operation_time',
					width: 200
				}]
			],
			pageCallback,'laypageLeft',endtime,starttime,usercode,phonenum
		);
	}


	/* 表格初始化
	 * tableId:
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, test,endtime,starttime,usercode,phonenum) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-280',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15,endtime,starttime,usercode,phonenum);
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
				var resTwo = pageCallback(obj.curr, obj.limit,endtime,starttime,usercode,phonenum);
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

		var res = reqAjax(url, JSON.stringify(parms));

		var data = res.data;

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});

		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit , endtime,starttime,usercode,phonenum) {
		if(endtime == undefined){endtime = ''}
		if(starttime == undefined){starttime = ''}
		if(usercode == undefined){usercode = ''}
		if(phonenum == undefined){phonenum = ''}
		var param = {
			"endtime": endtime,
			"starttime": starttime,
			"usercode": usercode,
			"page": index,
			"phonenum": phonenum,
			"rows": limit
		}
		return getData(USER_URL.RESOURLIST ,param);
	}



	//刷新
	$("#refresh").click(function(){
		location.reload();
	});
	//点击顶部搜索出现各搜索条件
	$('#search').on('click',function(){
		$('#search-tool').slideToggle(200)
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click',function(){
		var beginTime = $.trim($("#jurisdiction-begin").val());
		var begin = $("#datetimepicker1").attr("data-time") || "";
		var endTime = $.trim($("#jurisdiction-end").val());
		var end = $("#datetimepicker2").attr("data-time") || "";
		var usercode = $.trim($("#serviceName").val());
		var phonenum = $.trim($("#serviceNum").val());

			if(beginTime=="" && endTime==""){
				getTable("","",usercode,phonenum);
			}else if(beginTime=="" || endTime==""){
				layer.msg("开始和结束时间都要选择哟");
			}
			else{
				if(begin>end){
					layer.msg("开始时间不能晚于结束时间哟");
				}else{
					getTable(endTime,beginTime,usercode,phonenum);
				}
			}

	})

	//重置
	$("#toolRelize").on('click',function(){
		$('#jurisdiction-begin').datepicker('clearDates');
		$('#datetimepicker1').attr("data-time","");
		$('#datetimepicker2').attr("data-time","");
		$('#jurisdiction-end').datepicker('clearDates');
		$("#serviceName").val("");
		$("#serviceNum").val("");
	});



})(jQuery)