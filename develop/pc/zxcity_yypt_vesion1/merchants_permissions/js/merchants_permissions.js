(function($) {
	sessionStorage.removeItem('merchantId')
	var userno = yyCache.get('userno');
	var userName = yyCache.get('username')
	var userId = yyCache.get('userId');
	var merchantid = sessionStorage.getItem('merchantid');
	const MERCHANTLIST = 'operations/merchantList', //查询商户列表动态
		ROLELIST = 'operations/merchantRoleList', //商户角色列表并分页
		MENUTREE = 'operations/getAllPerMenuTree', //ZTREE角色树
		QUERYRELAUSER = 'operations/queryRelauserList', //查询与选中角色关联的用户列表接口
		ADDMERCHANTROLE = 'operations/addMerchantRole', //新增角色
		MODIFYMERCHANTROLE = 'operations/modifyMerchantRole', //修改角色
		GETROLEPERMISSTREE = 'operations/getRolePermissonTree', //获取该角色权限树
		DELCHANTROLE = 'operations/delMerchantRole', //删除角色
		NOTRELAUSERLIST = 'operations/queryNotrelauserList', //查询与选中角色未关联的用户列表接口
		ADDMERCHANROLEUSER = 'operations/addMerchantRoleUser' //角色授权接口
	
	var form = layui.form;
	var layer = layui.layer;
	var table = layui.table;
	var merchantid = sessionStorage.getItem('merchantid');
	
	
	//商户select列表
	function commercialList() {
		var form = layui.form;
		var res = reqAjax(MERCHANTLIST);
		var sHtml = "";
		var data = res.data;
		if(res.code == 1) {
			$.each(data, function(i, item) {
				sHtml += `<option value=` + item.merchantId + ` >` + item.orgName + `</option>`
			})
			$("#commercialList").html(sHtml)
			form.render('select');
		} else {
			layer.msg(res.msg);
		}
	}
	
	commercialList()
	
	
	
	form.on('select(merchants)', function(data){
			var merchantid = data.value;
			sessionStorage.setItem('merchantid', merchantid)
			reInitTable();
			getList();
	}); 
	
	if(merchantid){
		$("#commercialList").val(merchantid)
		form.render('select');
		reInitTable();
	}else{
		var merchantid = $("#commercialList>option:first").val();
		$("#commercialList").val(merchantid)
		form.render('select');
		sessionStorage.setItem('merchantid',merchantid);
		reInitTable();
	}

		
		


	

	
	layui.use('form', function() {
		form = layui.form;
	})

	var _obj = tableInit('demo', [
			[{
				title: '序号',
				/*sort: true,*/
				align: 'left',
				field: 'eq',
				width: 80,
				event: 'changetable'
			}, {
				title: '角色名',
				/*sort: true,*/
				align: 'left',
				field: 'name',
				width: 220,
				event: 'changetable'
			}, {
				title: '商户',
				/*sort: true,*/
				align: 'left',
				field: 'scSysOrg',
				width: 232,
				event: 'changetable'
			}, {
				title: '是否可用',
				/*sort: true,*/
				align: 'left',
				field: '_available',
				width: 100,
				event: 'changetable'
			}, {
				title: '操作',
				align: 'left',
				toolbar: '#barDemo',
				width: 240
			}]
		],
		pageCallback, 'laypageLeft'
	)

	/* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, pageDomName) {
		var tableIns, tablePage;

		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-250',
			cols: cols,
			page: false,
			even: true,
			skin: 'row',
			done:function(res, curr, count){
				var data = res.data;
				var _id = data[0].id;
				var _isAdminRole = data[0].isAdminRole;
				sessionStorage.setItem('_id',_id);
				sessionStorage.setItem('_isAdminRole',_isAdminRole);
			}
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
			elem: pageDomName,
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
				if(resTwo && resTwo.code == 1) {
					tableIns.reload({
						data: resTwo.data
					});
					getList();
				} else {
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

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
			
			if(item.available){
				var _available = item.available == '1' ? '是' : '否';
				$(item).attr('_available', _available)
			}
			if(item.scSysOrg){
				var scSysOrg = item.scSysOrg.orgName;
				$(item).attr('scSysOrg', scSysOrg)
			}

		});

		return res;
	}

	//pageCallback
	function pageCallback(index, limit, roleName, merchantId) {
		var roleName = $('#inquireInputType').val();
		var merchantId = sessionStorage.getItem('merchantid');
		if(roleName == undefined) {
			roleName = ''
		} else {
			roleName = $.trim(roleName)
		}
		if(merchantId == undefined) {
			merchantId = ''
		}
		return getData(ROLELIST, "{'page':" + index + ",'rows':" + limit + ",'roleName':'" + roleName + "','merchantId':'" + merchantId + "'}");
	}
	
	//pageCallbackRight
	function pageCallbackRight(index, limit, roleId) {
		var roleName = $('#inquireInputType').val();
		var merchantId = sessionStorage.getItem('merchantid');
		if(roleId == undefined) {
			roleId = ''
		} else {
			roleId = $.trim(roleId)
		}
		return getData(QUERYRELAUSER, "{'page':" + index + ",'rows':" + limit + ",'roleId':'" + roleId + "'}");
	}
	//layerpageCallback
	function layerPageCallback(res) {
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
			});

		return data;
	}
	
	

	//右表
	var tableInt = table.render({
		id: 'demodb',
		elem: '#demodb' //指定原始表格元素选择器（推荐id选择器）
			,
		height: '560' //容器高度
			,
		cols: [
			[{
				title: '序号',
				/*sort: true,*/
				align: 'left',
				field: 'eq',
				width: 80
			}, {
				title: '账号',
				/*sort: true,*/
				align: 'left',
				field: 'usercode',
				width: 300
			}, {
				title: '姓名',
				/*sort: true,*/
				align: 'left',
				field: 'username',
				width: 300
			}]
		],
		loading: true,
		page: true,
		even: true,
		skin: 'row',
		limits: [15, 30],
		limit: 15 //默认采用60
	});

		//新增时候查询
		function addSearch() {
			var parms = "{}"
			var res = reqAjax(MERCHANTLIST, parms);
			var data = res.data;
			var sHtml = ''
			$.each(data, function(i, item) {
				sHtml += `<option value=` + item.merchantId + `>` + item.orgName + `</option>`
			});
			$('#merName').append(sHtml)
		}

	//新增角色
	$('#commonAdd').on('click', function() {
		layer.open({
			title: ['新增角色', 'font-size:12px;background-color:#0678CE;color:#fff'],
			btn: ['保存', '取消'],
			type: 1,
			content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['800px', '560px'],
			end: function() {
				$('#demo111').hide();
				$('#addName').val('');
				$('#merName').val('');
				reInitTable();
			},
			success: function(layero, index) {
				$('div.layui-layer-page').addClass('layui-form');
				$('a.layui-layer-btn0').attr('lay-submit', '');
				$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
				addSearch();
				var merchantid = sessionStorage.getItem('merchantid');
				$('#merName').val(merchantid);
				var setting = {
	                    check: {
	                        enable: true
	                    },
	                    data: {
	                        simpleData: {
	                           	enable: true,
								idKey: "id",
								pIdKey: "pid",
								rootPId: 0
	                        },
	                        key: {
								checked: "Checked"
							}
	                    },
	                    view: {
							showIcon: true
						}
	                };
	                var data={};
	                var tree=reqAjax(MENUTREE)
	                var treeData = tree.data;
	                treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
				form.render();
			},
			yes: function(index, layero) {
				form.on('submit(formDemo)', function(done) {
					if(done) {
						var name = $('#addName').val();
						var available = $('#isUserable').val();
						var merchantId = $('#merName').val();
						var isAdminRole = $('#isAdmin').val();
						var nodes = treeObj.getCheckedNodes(true);//已选中权限
						var arr = [];
						$.each(nodes,function(i,item){
							var id = item.id
							arr.push(id)
						})
						var arrString = arr.join(',');//已选中权限树ID
						
						var parms = "{'name':'" + name + "','available':'" + available + "','merchantId':'" + merchantId + "','isAdminRole':'" + isAdminRole + "','permissonid':'" + arrString + "',}"
						var res = reqAjax(ADDMERCHANTROLE, parms);
						if(res.code == 1) {
							layer.msg(res.msg);
							layer.close(index)
							// click save button
							var initPage = _obj.tablePage;
							var initTable = _obj.tableIns;
							var res = pageCallback(initPage.curr, initPage.limit);
							initTable.reload({
								data: res.data
							});
						} else {
							layer.msg(res.msg);
						}

					}
				})
			}
		});
	})
	
	
	
	
	var tableIntt;
	//新增角色用户
	$('#addKv').on('click', function() {
		var roleId = sessionStorage.getItem('_id');
		var isAdminRole = sessionStorage.getItem('_isAdminRole');
		var param = "{'roleId':'"+roleId+"','isAdminRole':'"+isAdminRole+"'}"
		var res = reqAjax(NOTRELAUSERLIST, param);
		if(res.data.length == 0){
			layer.msg('暂无未授权用户');
			return false;
		}
		
		layer.open({
			title: ['新增角色用户', 'font-size:12px;background-color:#0678CE;color:#fff'],
			type: 1,
			content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['800px', '560px'],
			end: function() {
				$('#demo222').hide();
			},
			success: function(layero, index) {
				
				  tableIntt = table.render({
					id: 'layTable',
					elem: '#layTable' //指定原始表格元素选择器（推荐id选择器）
						,
					height: '440' //容器高度
						,
					cols: [
						[{
							title: '序号',
							/*sort: true,*/
							align: 'left',
							field: 'eq',
							width: 80
						}, {
							title: '账号',
							/*sort: true,*/
							align: 'left',
							field: 'usercode',
							width: 250
						}, {
							title: '姓名',
							/*sort: true,*/
							align: 'left',
							field: 'username',
							width: 250
						},{
							title: '操作',
							align: 'left',
							toolbar: '#layerDemo',
							width: 100
						}]
					],
					loading: true,
					page: true,
					data:layerPageCallback(res),
					even: true,
					skin: 'row',
					limits: [15, 30],
					limit: 15 //默认采用60
				});
				$('div.layui-layer-page').addClass('layui-form');
				$('a.layui-layer-btn0').attr('lay-submit', '');
				$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
				addSearch();
			}
		});
	})
	//监听工具条,左侧表格
	table.on('tool(layTable)', function(obj) {
		var data = obj.data;
		 if(obj.event === 'accredit') {
			console.log(data)
			var ids = data.id;
			layer.confirm(
            "确认授权吗?",
            {icon: 3, title:'提示'},
            function(index){
            	var roleId = sessionStorage.getItem('_id');
                var param = "{'ids':'" + ids + "','roleId':'"+roleId+"'}";
                var res = reqAjax(ADDMERCHANROLEUSER, param);
                if (res.code == 1) {
                    layer.close(index);
					var isAdminRole = sessionStorage.getItem('_isAdminRole');
					var param = "{'roleId':'"+roleId+"','isAdminRole':'"+isAdminRole+"'}"
					var res = reqAjax(NOTRELAUSERLIST, param);
                    tableIntt.reload({
                    	data:layerPageCallback(res)
                    })
                    tableInt.reload({
						data:pageCallbackRight(1,15,roleId).data
					})
                    
                } else {
                    layer.msg(res.msg);
                }
            })
			
		 }
	});
	
	
	
	
	
	//监听工具条,左侧表格
	table.on('tool(demo)', function(obj) {
		var data = obj.data;
		
		//自定义事件
		if(obj.event === 'changetable') {
			var roleId = data.id
			tableInt.reload({
				data:pageCallbackRight(1,15,roleId).data
			})
			console.log(data)
			sessionStorage.setItem('_id',roleId);
			sessionStorage.setItem('_isAdminRole',data.isAdminRole);
			$('#myListName').html('已关联用户列表,角色名称:' + data.name + '')
			
		}else if(obj.event === 'del') {
			var id = data.id;
			layer.confirm('真的删除行么', function(index) {
				var d3 = {
					"ids": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(DELCHANTROLE, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				reInitTable();
				layer.msg(res.msg);
			});
		} else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#merName').val('').attr('disabled',false);
					$('#isAdmin').val('').attr('disabled',false);
					$('#addName').val('');
					$('#isUserable').val('');
				},
				success: function(layero, index) {
					console.log(data)
					addSearch();
					$('#merName').val(data.merchantId).attr('disabled','');
					$('#isAdmin').val(data.isAdminRole).attr('disabled','');
					$('#addName').val(data.name);
					$('#isUserable').val(data.available);
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
					var setting = {
	                    check: {
	                        enable: true,
	                        chkStyle: "checkbox",
	                        radioType: "all",
	                        nocheckInherit: true,
	                        chkDisabledInherit: true
	                    },
	                    data: {
	                        simpleData: {
	                           	enable: true,
								idKey: "id",
								pIdKey: "pid",
								rootPId: 0
	                        }
	                    }
	                };
	                var parme="{'roleId':'"+data.id+"'}";
	                var tree=reqAjax(GETROLEPERMISSTREE,parme);
	                var treeData = tree.data
	   
	                for(var i=0;i<treeData.length;i++){
	                	treeData[i].id=Number(treeData[i].id)
	                	treeData[i].pid=Number(treeData[i].pid)
	                	treeData[i].icon=null
	            	}
	                treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							var nodes = treeObj.getCheckedNodes(true);//已选中权限
							var arr = [];
							$.each(nodes,function(i,item){
								arr.push(item.id)
							})
							var arrString = arr.join(',');//已选中权限树ID
							var name = $('#addName').val();
							var available = $('#isUserable').val();
							var merchantId = $('#merName').val();
							var id = data.id;
							var parms = "{'merchantId':'"+merchantId+"','available':'"+available+"','permissonid':'"+arrString+"','name':'"+name +"','id':'"+id+"'}";
							var res = reqAjax(MODIFYMERCHANTROLE,parms);
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index)
								var initPage = _obj.tablePage;
								var initTable = _obj.tableIns;
								var res = pageCallback(initPage.curr, initPage.limit);
								initTable.reload({
									data: res.data
								});
							} else {
								layer.msg(res.msg);
							}
						}
					})

				}
			});
		}
	});

	//新增参数
//	$('#addKv').on('click', function() {
//		layer.open({
//			title: ['添加键值', 'font-size:12px;background-color:#0678CE;color:#fff'],
//			btn: ['保存', '取消'],
//			type: 1,
//			content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
//			area: ['800px', '560px'],
//			end: function() {
//				$('#demo222').hide();
//				$('#addNamer').val('');
//				$('#addValuer').val('');
//				$('#addContentr').val('');
//				$('#typeSelectr').val('')
//			},
//			success: function(layero, index) {
//				var code = sessionStorage.getItem('code');
//				addSearch();
//				$(layero).find('#typeSelectr').val(code)
//				$('div.layui-layer-page').addClass('layui-form')
//				$('a.layui-layer-btn0').attr('lay-submit', '');
//				$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
//				
//				form.render()
//
//			},
//			yes: function(index, layero) {
//				form.on('submit(formDemo)', function(done) {
//					if(done) {
//						var value = $('#addNamer').val();
//						var name = $('#addValuer').val();
//						var note = $('#addContentr').val();
//						var typeCode = $('#typeSelectr>option:selected').attr('value');
//						var parms = "{'name':'" + name + "','value':'" + value + "','note':'" + note + "','typeCode':'" + typeCode + "',}"
//						var res = reqAjax(QUERYVEDIOCATALOGPAGE, parms);
//						if(res.code == 1) {
//							layer.msg(res.msg);
//							layer.close(index)
//							var code = sessionStorage.getItem('code')
//							var parms = "{'code':'" + code + "'}";
//							var ress = reqAjax(DICITEMSGROUP, parms);
//							tableInt.reload({
//								data: addEq(ress.data)
//							});
//						} else {
//							layer.msg(res.msg);
//						}
//					}
//				})
//			}
//		});
//	})

	//数据处理
	function addEq(data) {
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});
		return data;
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})

	layui.onevent()

	//搜索
	$('#toolSearch').on('click', function() {
		reInitTable();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#inquireInputType").val('');
		reInitTable();
	})
	
	

	

	//监听工具条,右侧表格
	table.on('tool(demodb)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo222').hide();
					$('#addNamer').val('');
					$('#addValuer').val('');
					$('#typeSelectr').val('');
					$('#addContentr').val('')
				},
				success: function(layero, index) {
					var code = sessionStorage.getItem('code');
					addSearch();
					$('#typeSelectr').val(code);
					$('#addNamer').val(data.val);
					$('#addValuer').val(data.name);
					$('#typeSelectr').val(data.typeCode);
					$('#addContentr').val(data.note)
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							var id = data.id;
							var name = $('#addValuer').val();
							var value = $('#addNamer').val();
							var typeCode = $('#typeSelectr>option:selected').attr('value');
							var note = $('#addContentr').val();
							var parms = "{'id':'" + id + "','name':'" + name + "','value':'" + value + "','typeCode':'" + typeCode + "','note':'" + note + "'}"
							var res = reqAjax(ADDMERCHANTROLE, parms);
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index)
								var code = sessionStorage.getItem('code')
								var parms = "{'code':'" + code + "'}";
								var ress = reqAjax(DICITEMSGROUP, parms);
								tableInt.reload({
									data: addEq(ress.data)
								});
							} else {
								layer.msg(res.msg);
							}
						}
					})

				}
			});
			//删除
		} else if(obj.event === 'dell') {
			var id = data.id;
			layer.confirm('真的删除行么', function(index) {
				obj.del();
				var d3 = {
					"id": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(MODIFYVEDIOCATALOG, d3);
				layer.close(index);
				layer.msg(res.msg);
			});
		}
	});

	//点击变色
	$('#app').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})

	//初始化渲染右侧表格
	function getList() {
		var aTr = $('tbody tr');
		var _name;
		$(aTr).eq(0).addClass('layui-table-click');
		$.each(aTr, function(i, item) {
			if($(item).hasClass('layui-table-click')) {
				 _name = $(this).children('td').eq(1).children().html();
			}
		})
		var roleId = sessionStorage.getItem('_id');
		tableInt.reload({
			data:pageCallbackRight(1,15,roleId).data
		})
		$('#myListName').html('已关联用户列表,角色名称:' + _name + '')
	}
	//初始化左侧表格
	function reInitTable(){
		var _obj = tableInit('demo', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80,
					event: 'changetable'
				}, {
					title: '角色名',
					/*sort: true,*/
					align: 'left',
					field: 'name',
					width: 232,
					event: 'changetable'
				}, {
					title: '商户店铺',
					/*sort: true,*/
					align: 'left',
					field: 'scSysOrg',
					width: 232,
					event: 'changetable'
				}, {
					title: '是否可用',
					/*sort: true,*/
					align: 'left',
					field: '_available',
					width: 100,
					event: 'changetable'
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 240
				}]
			],
			pageCallback, 'laypageLeft'
		)
	}
	
	
	
	//加载ztree
//	var zTree;
//	var zNodes;
//
//	function tree(roleId, treeDemo) {
//		$.ajax({
//			type: "POST",
//			url: "/zxcity_restful/ws/rest",
//			dataType: "json",
//			data: {
//				"cmd": "operations/resourceTree",
//				"version": version,
//				"data": "{'roleId':'" + roleId + "'}",
//			},
//			beforeSend: function(request) {
//				request.setRequestHeader("apikey", apikey);
//			},
//			success: function(res) {
//				if(res.code == 1) {
//					var setting = {
//						data: {
//							simpleData: {
//								enable: true
//							}
//						},
//						view: {
//							selectedMulti: true
//						},
//						check: {
//							enable: true
//						}
//					};
//					var zNodes = res.data;
//					zTree = $.fn.zTree.init(treeDemo, setting, zNodes);
//				}
//			},
//			error: function(res) {
//				console.log(res.msg)
//			}
//		});
//	}
	
	
	
	
	
	
	
	
	
	
	

	//初始化调用一下方法
	(function() {
		getList();
	})()

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

})(jQuery)