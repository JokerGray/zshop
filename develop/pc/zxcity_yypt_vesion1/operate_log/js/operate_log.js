(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var USER_URL = {
		RESOURLIST : 'operations/findTOperationLog', //(查询状态)
		JURNAME : 'operations/resourceTree' //(权限树)
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
		getJur();
	});

	function getJur(){
		var param={
			"parentId":"",
			"roleId":""
		}
		reqAjaxAsync(USER_URL.JURNAME,JSON.stringify(param)).done(function(res){
			if(res.code == 1){
				jurSelect(res);
			}else{
				layer.msg(res.msg);
			}
		});
	}

	//权限名称选择
	function jurSelect(res){
			var sHtml='<option data-id="'+ "" +'"> -请选择- </option>';
			for(var i=0;i<res.data.length;i++){
				sHtml += '<option data-id="'+ res.data[i].id +'">' + res.data[i].name + '</option>'
			}
			$("#jurname").html(sHtml);
	}


		//渲染表单

	function getTable(endtime,starttime,usercode,phonenum,powerid){
		var obj = tableInit('table', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '登录名',
					/*sort: true,*/
					align: 'left',
					field: 'usercode',
					width: 100
				}, {
					title: '姓名',
					/*sort: true,*/
					align: 'left',
					field: 'username',
					width: 100
				},{
					title: '手机',
					/*sort: true,*/
					align: 'left',
					field: 'phone',
					width: 200
				},{
					title: '所属部门',
					/*sort: true,*/
					align: 'left',
					field: 'department',
					width: 100
				},{
					title: '版块名称',
					/*sort: true,*/
					align: 'left',
					field: 'powername',
					width: 100
				},
				{
					title: '操作时间',
					/*sort: true,*/
					align: 'left',
					field: 'operation_time',
					width: 180
				},{
					title: '操作日志',
					/*sort: true,*/
					align: 'left',
					field: 'operation_log',
					width: 700
				}, {
					title: '操作',
					fixed: 'right',
					align: 'left',
					toolbar: '#barDemo',
					width: 100
				}]
			],
			pageCallback,'laypageLeft',endtime,starttime,usercode,phonenum,powerid
		);
	}


	/* 表格初始化
	 * tableId:
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, test,endtime,starttime,usercode,phonenum,powerid) {
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
		var res = pageCallback(1, 15,endtime,starttime,usercode,phonenum,powerid);
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
				var resTwo = pageCallback(obj.curr, obj.limit,endtime,starttime,usercode,phonenum,powerid);
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
	function pageCallback(index, limit , endtime,starttime,usercode,phonenum,powerid) {
		if(endtime == undefined){endtime = ''}
		if(starttime == undefined){starttime = ''}
		if(phonenum == undefined){phonenum = ''}
		if(powerid == undefined){powerid = ''}
		if(usercode == undefined){powerid = ''}
		var param = {
			"end_time": endtime,
			"start_time": starttime,
			"usercode": usercode,
			"page": index,
			"phone": phonenum,
			"rows": limit,
			"powerid":powerid
		}
		return getData(USER_URL.RESOURLIST ,param);
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
		var begin = $("#datetimepicker1").attr("data-time") || "";
		var endTime = $.trim($("#jurisdiction-end").val());
		var end = $("#datetimepicker2").attr("data-time") || "";
		var usercode = $.trim($("#serviceName").val());
		var phonenum = $.trim($("#serviceNum").val());
		var powerid = $("#jurname").find("option:checked").attr("data-id");

			if(beginTime=="" && endTime==""){
				getTable("","",usercode,phonenum,powerid);
			}else if(beginTime=="" || endTime==""){
				layer.msg("开始和结束时间都要选择哟");
			}
			else{
				if(begin>end){
					layer.msg("开始时间不能晚于结束时间哟");
				}else{
					getTable(endTime,beginTime,usercode,phonenum,powerid);
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
		$("#jurname").val(" -请选择- ");
	});

	//查看
	//监听工具条
	table.on('tool(table)', function(obj){
		var data = obj.data;
		if(obj.event === 'look'){
			var id = data.id;
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				resize: false,
				type: 1,
				content: $('#details'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				shade: [0.1, '#fff'],
				end: function () {
					$('#details').hide();
					$("#detailsName").val("");
					$("#detailsType").val("");
					$("#phoneNumber").val("");
					$("#detailsCode").val("");
					$("#detailsMenu").val("");
					$("#detailsValueType").val("");
				},
				success: function (layero) {
					$("#detailsName").val(data.usercode);
					$("#detailsType").val(data.username);
					$("#phoneNumber").val(data.phone);
					$("#detailsCode").val(data.department);
					$("#detailsMenu").val(data.powername);
					$("#detailsValueType").val(data.operation_log);
				}
			})
		}
	});


})(jQuery)