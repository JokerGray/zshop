$(function() {
	const DICTYPELIST = "operations/roleList"//查询角色
	var resourceIds='';
	//搜索展开
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})
	//创建角色名称数组
	var roleNameList = [];
	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	var operatorName = yyCache.get("name");
	//pageCallback回调
	function pageCallback(index, limit , rolename) {
		if(rolename == undefined){rolename = ''}
		return getData(DICTYPELIST, "{'page':" + index + ",'rows':" + limit + ",'rolename':'"+rolename+"'}");
	}

	var _obj = tableInit('roleName',[
			[ //标题栏
				{
					field: 'eq',
					title: '序号',
					width: 80,
					/*sort: true,*/
					event: 'changetable'
				}, {
					field: 'name',
					title: '角色名称',
					width: 400,
					event: 'changetable'
				}, {
					field: 'option',
					title: '操作',
					toolbar: '#barDemo1',
					width: 200
				}
			]
		],
		pageCallback,'laypageLeft'
	)
	table.on('tool(roleName)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; //获得 lay-event 对应的值
			var tr = obj.tr; //获得当前行 tr 的DOM对象
			var roleName = data.name;
			var avaiable = data.isAvailable;
			var roleId = data.id;
			if(layEvent === 'changetable') {
				$('#role').text(obj.data.name);
				tableChange(obj.data.id);
			} else if(layEvent === 'del') { //删除
				var operatorName = data.name;
				var roleId = data.id;
				console.log(data)
				layer.confirm('确定删除吗？', function(index) {
					layer.close(index);
					//向服务端发送删除指令
					roleDel(roleId);
						var _obj = tableInit('roleName',[
							[ //标题栏
								{
									field: 'eq',
									title: '序号',
									width: 80,
									/*sort: true,*/
									event: 'changetable'
								}, {
									field: 'name',
									title: '角色名称',
									width: 400,
									event: 'changetable'
								}, {
									field: 'option',
									title: '操作',
									toolbar: '#barDemo1',
									width: 200
								}
							]
						],
						pageCallback,'laypageLeft'
					)
				});
			} else if(layEvent === 'edit') { //编辑
				//do something
				layer.open({
					type: 2,
					title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
					shadeClose: true,
					area: ['800px', '560px'],
					content: ['edit.html', 'no'],
					btn: ['保存', '取消'],
					btn1: function(index, layero) {
						var body = layer.getChildFrame('body', index);
						var user = body.find('input#user').val();
						var avaiable = body.find('select#avaiable option:selected').val();
						if(user == '') {
							layer.msg("请填写角色名称");
							return false;
						}
						roleChange(user, avaiable, roleId);
					},
					btn2: function(index, layero) {
						layer.closeAll();
					},
					success: function(layero, index) {
						var body = layer.getChildFrame('body', index);
						var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
						body.find('input#user').val(roleName);
						var _option = body.find('#avaiable').children('option');
						var treeDemo = body.find('div#treeDemo');
						console.log(avaiable)
						if(avaiable == "1") {
							body.find('option#yes').attr('selected', '');
						} else {
							body.find('option#no').attr('selected', '');
						};
						tree(roleId, treeDemo);
					}
				})

			}
		});

	//创建rersourceIds列表
	

	var tableInt = null;
	//首次加载右侧table
	function tableChange(roleId) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/roleUserList",
				"version": version,
				"data": "{'roleId':'" + roleId + "','page':1,'rows':1000}"
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				if(res.code == 1) {
					layui.use('table', function() {
						var table = layui.table;
						if(tableInt != null){
							tableInt.reload({
								data:res.data
							})

						}else{
							tableInt = table.render({
								initSort: {
									field: 'userAccount',
									type: 'desc'
								},
								id:'roleList',
								height:'full-250',
								elem: '#roleList',
								data: res.data,
								loading: true,
								skin: 'row',
								even: true,
								page: true,
								limit: 15,
								limits: [15,30],
								cols: [
									[ //标题栏
										{
											field: 'userAccount',
											title: '登录名',
											width: 110
										}, {
											field: 'userName',
											title: '姓名',
											width: 110
										}, {
											field: 'orgName',
											title: '归属部门',
											width: 280
										}, {
											field: 'option',
											title: '操作',
											toolbar: '#barDemo2',
											width: 224
										}
									]
								]
							});
						}
						
						table.on('tool(roleList)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
							var data = obj.data; //获得当前行数据
							var layEvent = obj.event; //获得 lay-event 对应的值
							var tr = obj.tr; //获得当前行 tr 的DOM对象
							console.log(data);
							var userName = data.userAccount;
							var name = data.userName;
							var orgName = data.orgName;
							var roleName = data.roleName;
							var roleId = data.roleId;
							var userId = data.userId;
							console.log(roleId)

							//移动角色
							if(layEvent === 'edit') { //编辑
								//do something
								layer.open({
									type: 2,
									title: ['移动角色', 'font-size:12px;background-color:#0678CE;color:#fff'],
									shadeClose: true,
									area: ['800px', '560px'],
									content: ['remove.html', 'no'],
									btn: ['保存', '取消'],
									btn1: function(index, layero) {
										var body = layer.getChildFrame('body', index);
										var roleIds = body.find('select#role option:selected').val();
										var userId = data.userId;
										removeRole(roleIds, userId, roleId);
									},
									btn2: function(index, layero) {
										layer.closeAll();
									},
									success: function(layero, index) {
										var roleListName = [];
										var res = pageCallback(1,100);
										$.each(res.data,function(i,item){
											roleListName.push(item)
										})
										var body = layer.getChildFrame('body', index);
										var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
										//									    console.log(body.html()) //得到iframe页的body内容
										body.find('div#username').text(userName);
										body.find('div#name').text(name);
										body.find('div#department').text(roleName);
										
										for(var i = 0; i < roleListName.length; i++) {
											body.find('select#role').append("<option value='" + roleListName[i].id + "'>" + roleListName[i].name + "</option>")
										}
										body.find('select#role').val(roleId)
									}
								})
							} else if(layEvent === 'del') {
								layer.confirm('确定取消授权吗？', function(index) {
									obj.del(); //删除对应行（tr）的DOM结构
									layer.close(index);
									//向服务端发送删除指令
									roleCancel(roleId, userId);
								});
							}
						});
					})
				}
			},
			error: function(res) {
				console.log(res.msg)
			}
		});
	}

	//加载ztree
	var zTree;
	var zNodes;

	function tree(roleId, treeDemo) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/resourceTree",
				"version": version,
				"data": "{'roleId':'" + roleId + "'}",
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				var resData = res.data;
				$.each(resData,function(i,item){
					if(item.url.length!=0){
						item.url = '';
					}
					var a = item.children;
					if(a){
						$.each(a,function(i,item){
							if(item.url.length!=0){
								item.url = '';
							}
							var b = item.children;
							if(b){
								$.each(b,function(i,item){
									var c = item.children;
									if(item.url.length!=0){
										item.url = '';
									}
								})
							}
						})
					}
					
				})
				console.log(resData)
				if(res.code == 1) {
					var setting = {
						data: {
							simpleData: {
								enable: true,
								idKey: "id",
								pIdKey: "pid",
								rootPId: null
							}
						},
						view: {
							selectedMulti: true
						},
						check: {
							enable: true
						}
					};
					zTree = $.fn.zTree.init(treeDemo, setting, resData);
				}
			},
			error: function(res) {
				console.log(res.msg)
			}
		});
	}

	
	//修改角色
	function roleChange(user, avaiable, roleId) {
		if(user == '') {
			user = $('#role').text();
		}
		var nodes = zTree.getCheckedNodes();
		var roleList = [];
		if(nodes.length == 0) {
			resourceIds = nodes;
		} else {
			for(var i = 0; i < nodes.length; i++) {
				roleList.push(nodes[i].id);
				resourceIds = roleList.join(',');
			}
		}
		//		console.log(resourceIds);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/roleUpdate",
				"version": version,
				"data": "{'operatorName':'"+operatorName+"','roleId':'" + roleId + "','name':'" + user + "','resourceIds':'" + resourceIds + "','isAvailable':'" + avaiable + "'}"
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				if(res.code == 1) {
					console.log(res.msg);
					var initPage = _obj.tablePage;
					var initTable = _obj.tableIns;
					var res = pageCallback(initPage.curr, initPage.limit);				
					initTable.reload({ data : res.data });
					layer.closeAll();
				}else{
					layer.msg(res.msg);
				}
				
			},
			error: function(res) {
				console.log(res.msg)
			}
		});
	}

	//删除角色
	function roleDel(roleId) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/removeRole",
				"version": version,
				"data": "{'operatorName ':'"+operatorName+"','roleId':'" + roleId + "'}"
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				if(res.code == 1) {

					layer.msg(res.msg)
				}else{
					layer.msg(res.msg)
				}
			},
			error: function(res) {
				console.log(res.msg)
			}
		});
	}

	//取消授权
	function roleCancel(roleId, userId) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/deleteUserRole",
				"version": version,
				"data": "{'operatorName ':'"+operatorName+"','userId':'" + userId + "','roleId':'" + roleId + "'}"
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				console.log(res)
				if(res.code == 1) {
					console.log(res.msg);
				}
			},
			error: function(res) {
				console.log(res.msg)
			}
		});
	}

	//移动角色
	function removeRole(roleId, userId, roleIdOld) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				"cmd": "operations/clearThenCreateUserRole",
				"version": version,
				"data": "{'operatorName ':'"+operatorName+"','userId':'" + userId + "','roleId':'" + roleId + "'}"
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey); 
			},
			success: function(res) {
				if(res.code == 1) {
					console.log(res.msg);
					tableChange(roleIdOld);
					layer.closeAll();
				}
			},
			error: function(res) {
				console.log(res.msg);
			}
		});
	}



	//搜索角色
	$('#toolSearch').on('click', function() {
		var rolename = $("#inquireInput").val();
		var initPage = _obj.tablePage;
		var initTable = _obj.tableIns;
		var res = pageCallback(initPage.curr, initPage.limit,rolename);				
		initTable.reload({ data : res.data });
	})

	//重置
	$('#toolRelize').on('click', function() {
		$("#inquireInput").val('');
		var initPage = _obj.tablePage;
		var initTable = _obj.tableIns;
		var res = pageCallback(initPage.curr, initPage.limit);				
		initTable.reload({ data : res.data });
	})

	//添加角色
	$('#commonAdd').on('click', function() {
		layer.open({
			type: 2,
			title: ['添加角色', 'font-size:12px;background-color:#0678CE;color:#fff'],
			shadeClose: true,
			area: ['800px', '560px'],
			content: ['edit.html', 'no'],
			btn: ['保存', '取消'],
			btn1: function(index, layero) {
				var body = layer.getChildFrame('body', index);
				var user = body.find('input#user').val();
				var avaiable = body.find('select#avaiable option:selected').val();
				var nodes = zTree.getCheckedNodes();
				var reNodes = [];
				for(var i = 0; i < nodes.length; i++) {
					reNodes.push(nodes[i].id);
					resourceIds = reNodes.join(',');
				}
				if(user == '') {
					layer.msg("请填写角色名称");
					return false;
				}
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						"cmd": "operations/addRole",
						"version": version,
						"data": "{'operatorName ':'"+operatorName+"','name':'" + user + "','resourceIds':'" + resourceIds + "','isAvailable':'" + avaiable + "'}"
					},
					beforeSend: function(request) {
						request.setRequestHeader("apikey", apikey);
					},
					success: function(res) {
						if(res.code == 1) {
							var _obj = tableInit('roleName',[
							[ //标题栏
								{
									field: 'eq',
									title: '序号',
									width: 80,
									/*sort: true,*/
									event: 'changetable'
								}, {
									field: 'name',
									title: '角色名称',
									width: 400,
									event: 'changetable'
								}, {
									field: 'option',
									title: '操作',
									toolbar: '#barDemo1',
									width: 200
								}
							]
						],
						pageCallback,'laypageLeft'
					)
							layer.closeAll();
							layer.msg(res.msg)
						}else{
							layer.msg(res.msg)
						}
					},
					error: function(res) {
						console.log(res.msg);
					}
				});

			},
			btn2: function(index, layero) {
				layer.closeAll();
			},
			success: function(layero, index) {
				var body = layer.getChildFrame('body', index);
				var treeDemo = body.find('div#treeDemo');
				tree('', treeDemo);
			}
		})
	})

	//刷新
	$('#refresh').click(function() {
		location.reload();
	});
	
	/* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback , pageDomName) {
		var tableIns, tablePage;

		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-250',
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
			elem:pageDomName,
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
				if(resTwo && resTwo.code == 1){
					tableIns.reload({
						data: resTwo.data
					});
				}
				else{
					layer.msg(resTwo.msg);
				}
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
		
		var _isAvailable;
		
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
			_isAvailable = item.isAvailable == 1?'是':'否'
			$(item).attr('_isAvailable',_isAvailable)
		});
		
		return res;
	}
	
	
	
	
})