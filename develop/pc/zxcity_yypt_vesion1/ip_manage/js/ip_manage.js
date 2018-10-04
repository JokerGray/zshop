(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var locked = true;
	var USER_URL = {
		RESOURLIST : 'operations/queryIpLimitPage', //(查询状态)
		ADDRESOURCE : 'operations/addIpLimit',//(新增)
		DELUSER : 'operations/deleteIpLimit' //(删除)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

  		//选中表单事件
	$('#app').on('click','tr',function(){
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})
  
		 //新增
		 $('#commonAdd').on('click',function(){
  			layer.open({
			  title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
			  btn: ['保存', '取消'],
				resize:false,
			  type: 1,
			  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			  area: ['800px', '560px'],
				shade: [0.1, '#fff'],
			  end:function(){
			  	$('#demo111').hide();
			  },
				success:function(layero){
					$(layero).find('#address').val("");
					$(layero).find('#reason').val("");
					//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit","");
					$("a.layui-layer-btn0").attr("lay-filter","formdemo");
				},
			  yes:function(index, layero){
				  //form监听事件
				  form.on('submit(formdemo)',function(data){
					  if(data){
						  var address = $(layero).find('#address').val();
						  var remark = $(layero).find('#reason').val();
						  //验证ip
						  var pattern = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/i;
						  var patterns = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
						  if((!pattern.test(address)) || (!patterns.test(address))){
							  $(layero).find('#address').val("");
							  layer.alert("请输入正确的ip地址");
							  return;
						  };

						  var param ={
							  ipAddress : address,
							  reason : remark
						  }
						  if(locked){
							  locked = false;
							  reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
								  if(res.code == 1){
									  var ipAddress = $.trim($("#inquireInput").val());
									  layer.close(index);
									  layer.msg(res.msg);
									  setTimeout(function(){
										  getTable(ipAddress);
										  locked = true;
									  },500);
								  }else{
									  layer.msg(res.msg);
									  locked = true;
								  }
							  });
						  }
					  }
				  });
			  }
  			});
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
				title: 'IP地址',
				/*sort: true,*/
				align: 'left',
				field: 'ipAddress',
				width: 300
			}, {
				title: '限制原因',
				/*sort: true,*/
				align: 'left',
				field: 'reason',
				width: 900
			}, {
				title: '操作',
				fixed: 'right',
				align: 'left',
				toolbar: '#barDemo',
				width: 360
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
	function pageCallback(index, limit , ipAddress) {
		if(ipAddress == undefined){ipAddress = ''}
		return getData(USER_URL.RESOURLIST , "{'page':" + index + ",'rows':" + limit + ",'ipAddress':'" + ipAddress + "'}");
	}


	//监听工具条
	table.on('tool(table)', function(obj){
		var ipAddress = $.trim($("#inquireInput").val());
		var data = obj.data;
		//删除
		if(obj.event === 'del'){
			var id = data.id;
			layer.confirm(
				"确认删除?",
				{icon: 3, title:'提示'},
				function(index){
					var paramDel = {
						ids : id
					};
					reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
							if (res.code == 1) {
								layer.msg("删除成功");
								getTable(ipAddress);
							} else {
								layer.msg(res.msg);
							}
					});
				})
		}
	});

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
		var ipAddress = $.trim($("#inquireInput").val());
		getTable(ipAddress);

	})

	//重置
	$("#toolRelize").on('click',function(){
		$("#inquireInput").val("");
	});

	//加了入参的公用方法
	function getTable(ipAddress){
		var initPage = obj.tablePage;
		var initTable = obj.tableIns;
		var res = pageCallback(1, 15,ipAddress);
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
				var resTwo = pageCallback(obj.curr, obj.limit,ipAddress);
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