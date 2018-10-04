(function($) {
    const QUERYROLEPREMISSIONPAGE = 'operations/queryMerchantBasicRolePermissionPage', //分页查询商户角色模板
		  ROLEPERMISSIONPAGE='operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
		  CHECKSTATUS=' operations/modifyRolePermissionCheckStatus'//修改角色权限是否可选状态
		 
		
	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function(){
		 form = layui.form;
	})
  		
	var _obj = tableInit('demo', [[
					 {checkbox: true} 
		    		,{title:'序号',sort:false,align:'left',field:'eq',width:80}
				    ,{title:'角色名称',sort:false,align:'left',field:'roleName',width:300}
				    ,{title:'权限名称',sort:false,align:'left',field:'permissionName',width:300}
				    ,{title:'是否可用',sort:false,align:'left',field:'_available',width:300}
				    ,{title:'是否可选',sort:false,align:'left',field:'_isCheck',width:300}
				    ,{title:'操作',align:'left', toolbar: '#barDemo',width:300}
			  ]],
		pageCallback
	)	
  		
  		
  		

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-220',
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
		var _isCheck;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			var _available = item.available == '1'?'是':'否';
			if(item.isCheck == 1){
            	 _isCheck= '可选'
            }else if(item.isCheck == 2){
            	 _isCheck = '不可选'
            }else{
            	 _isCheck = '推荐'
            }
			$(item).attr('_available',_available)
			$(item).attr('_isCheck',_isCheck)
		});

		return res;
	}
	
	//pageCallback回调
	function pageCallback(index, limit ,roleName ,permissionName) {
		if(roleName == undefined){roleName = ''}
		if(permissionName == undefined){permissionName = ''}
		return getData(ROLEPERMISSIONPAGE , "{'page':" + index + ",'rows':" + limit + ",'roleName':'" + roleName + "','permissionName':'" + permissionName + "'}");
	}		

	//监听工具条,左侧表格
	table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#addName').val('');
					$('#addValue').val('');

				},
				success: function(layero, index) {
					console.log(data)
					$('#addRole').val(data.roleName);
					$('#addPermis').val(data.permissionName);
					$('#addChoose').val(data._available);
					$('#typeSelectr').val(data.isCheck);
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							var ids = data.id;
							var isCheck = $('#typeSelectr').val();
							var parms = "{'ids':'" + ids + "','isCheck':'" + isCheck + "'}"
							var res = reqAjax(CHECKSTATUS, parms);
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index)
								var initPage = _obj.tablePage;
								var initTable = _obj.tableIns;
								var res = pageCallback(initPage.curr, initPage.limit);	
								initTable.reload({
									data: res.data
								});
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
											_obj.tableIns.reload({
												data: resTwo.data
											});
										else
											layer.msg(resTwo.msg);
									}
								}
								layui.laypage.render(page_options);
							} else {
								layer.msg(res.msg);
							}
						}
					})

				}
			});
		}
	});	 


		  //数据处理
		  function addEq(data){
		  	 $.each(data,function(i,item){
	   		  	 $(item).attr('eq',(i+1))
	   		 });
		  	 return data;
		  }
		  
		  //展开按钮
		var flag = true;
		$('#spread').on('click',spread)
		
		
		function spread(){
			var oUl = $('.navList');
			var aLi = oUl.children('li');
			if(flag == true){
				$(this).html('<i class="layui-icon">&#xe630;</i>收起')
				flag = false;
				treeObj.expandAll(true);

			}else{
				$(this).html('<i class="layui-icon">&#xe630;</i>展开')
				flag = true;
				treeObj.expandAll(false);
			}
		}
		  
		  
		  
			
		  $('#search').on('click',function(){
		  		$('#search-tool').slideToggle(200)
		  })
		  
		  
		  
		//搜索功能
		$('#toolSearch').on('click', function() {
			var permissionName = $("#inquireInputType").val();
			var roleName = $("#inquireInputRole").val();
			var initPage = _obj.tablePage;
			var initTable = _obj.tableIns;
			var res = pageCallback(initPage.curr, initPage.limit,roleName,permissionName);				
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
					var resTwo = pageCallback(obj.curr, obj.limit);
					if(resTwo && resTwo.code == 1)
						_obj.tableIns.reload({
							data: resTwo.data
						});
					else
						layer.msg(resTwo.msg);
				}
			}
			layui.laypage.render(page_options);
	
		})  

		//重置功能
		$('#toolRelize').on('click', function() {
			var initPage = _obj.tablePage;
			var initTable = _obj.tableIns;
			var res = pageCallback(initPage.curr, initPage.limit);				
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
					var resTwo = pageCallback(obj.curr, obj.limit);
					if(resTwo && resTwo.code == 1)
						_obj.tableIns.reload({
							data: resTwo.data
						});
					else
						layer.msg(resTwo.msg);
				}
			}
			layui.laypage.render(page_options);
			$("#inquireInputRole").val('');
			$("#inquireInputType").val('');
		})
		
		//是否可选
		$('#commonAdd').on('click', function() {
			var checkStatus = table.checkStatus('demo');
			if(checkStatus.data.length == 0){
				layer.msg('请勾选权限')
				return false;
			}
			console.log(checkStatus)
			layer.open({
				title: ['批量操作', 'font-size:12px;background-color:#0678CE;color:#fff'],
				btn: ['保存', '取消'],
				type: 1,
				content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#typeSelectr').val('')
					$('#demo222').hide();
				},
				success: function(layero, index) {
					
				},
				yes: function(index, layero) {
					var ids = [];
					$.each(checkStatus.data,function(i,item){
						var id = item.id
						ids.push(id)
					})
					ids = ids.join(',');
					var isCheck = $('#typeSelectrr').val();
					var parms = "{'ids':'" + ids + "','isCheck':'" + isCheck + "'}"
					var res = reqAjax(CHECKSTATUS, parms);
					if(res.code == 1) {
						layer.msg(res.msg);
						layer.close(index)
						var initPage = _obj.tablePage;
						var initTable = _obj.tableIns;
						var res = pageCallback(initPage.curr, initPage.limit);	
						initTable.reload({
							data: res.data
						});
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
									_obj.tableIns.reload({
										data: resTwo.data
									});
								else
									layer.msg(resTwo.msg);
							}
						}
						layui.laypage.render(page_options);
					} else {
						layer.msg(res.msg);
					}
				}
			});
		})
		
		
		
		
		
		
		 
		  //点击变色
		  $('#tableBox').on('click','tbody tr',function(){
			  	$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
		  })

		  
		  //刷新
	    function refresh(){
	    	location.reload();
	    }
	    $('#refresh').click(function(){
	    	refresh()
	    });
		  
})(jQuery)