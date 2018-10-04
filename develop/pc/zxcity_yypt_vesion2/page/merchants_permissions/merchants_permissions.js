layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
	//接口
	var user = {
		merchantList :'operations/merchantList',//查询商户列表动态
		merchantRoleList : 'operations/merchantRoleList',//左侧列表查询
		queryRelauserList : 'operations/queryRelauserList',//右侧列表查询
		getAllPerMenuTree : 'operations/getAllPerMenuTree', //ZTREE角色树
		getRolePermissonTree : 'operations/getRolePermissonTree', //获取该角色权限树
		addMerchantRole : 'operations/addMerchantRole', //新增角色
		modifyMerchantRole : 'operations/modifyMerchantRole', //修改角色
		delMerchantRole : 'operations/delMerchantRole', //删除角色
		queryNotrelauserList : 'operations/queryNotrelauserList', //查询与选中角色未关联的用户列表接口
		addMerchantRoleUser : 'operations/addMerchantRoleUser', //角色授权接口
		getmerchantpermiss : 'operations/getPermissionsPagination',//根据父节点ID查询商户权限树
		addmerchantpermission : 'operations/addMerchantPermission',//新增
		modifymerchantpermission : 'operations/modifyMerchantPermission',//修改
		getallpermenutree : 'operations/getAllPerMenuTree'//获取所有权限树
	};
	
	
	//商户select列表
	function commercialList(domId,type,data) {
		reqAjaxAsync(user.merchantList).then(function(res){
			var sHtml = "<option value=''>--全部--</option>";
			var udata = res.data;
			if(res.code == 1) {
				$.each(udata, function(i, item) {
					sHtml += `<option value=` + item.merchantId + ` >` + item.orgName + `</option>`
				})
				$("#"+domId).html(sHtml);
				if(type == 'change'){
					$('#' + domId).prop('disabled',true)
					$('#' + domId).val(data.merchantId)
				}
				if(type == 'add' ||type == 'render' ){
					var merchantId = sessionStorage.getItem('merchantId');
					$('#' + domId).val(merchantId);
					$('#' + domId).prop('disabled',false)
				}
				form.render('select');
			} else {
				layer.msg(res.msg);
			}
		});
	}
	
	commercialList('commercialList','render');
	

	
	
	//监听select选择
	form.on('select(commercialList)', function(data,reData){
			var merchantId = data.value;
			sessionStorage.setItem('merchantId', merchantId)
			tableInit();
			doMore(reData);
	}); 
	

	//左侧树
	function getTree() {
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
		var tree = reqAjaxAsync(user.getAllPerMenuTree).then(function(res) {
			var treeData = res.data
			if(treeData) {
				for(var i = 0; i < treeData.length; i++) {
					treeData[i].id = Number(treeData[i].id)
					treeData[i].pid = Number(treeData[i].pid)
					treeData[i].icon = null
				}
				treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
			} else {
				layer.msg(tree.msg)
			};
		})
	}
	

	

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		sessionStorage.setItem('merchantId',"")
		location.reload();
	})


	//左侧表格操作
	table.on('tool(merchantLeftTable)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定', '取消'],
				type: 1,
				anim: 5,
				content: $('#changeLayer'),
				area: ['1400px', '600px'],
				end: function() {
					$('#changeLayer').hide();
					changeInit();
				},
				success: function(index, layero) {
					commercialList('three','change',data);
					$('#one').val(data.name);
				  	$('#two').val(data.available);
				  	$('#four').val(data.isAdminRole).prop('disabled',true);
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render(null, 'changeLayer');
					var parme="{'roleId':'"+data.id+"'}";
					reqAjaxAsync(user.getRolePermissonTree,parme).then(function(res){
						var treeData = res.data;
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
						for(var i=0;i<treeData.length;i++){
		                	treeData[i].id=Number(treeData[i].id)
		                	treeData[i].pid=Number(treeData[i].pid)
		                	treeData[i].icon=null
		            	}
	               		treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
					})
				},
				yes: function(index, layero) {
					form.on('submit(formdemo2)', function(err) {
						if(err) {
							changeCaBack(data, index)
						}
					})
				}
			})
		}else if(obj.event === 'changetable') {
			var roleId = data.id
			sessionStorage.setItem('roleId',roleId);
			sessionStorage.setItem('isAdminRole',data.isAdminRole);
			$('#myListName').html('已关联用户列表,角色名称:' + data.name + '')
			rightTableInit();
		}else if(obj.event === 'delete') {
			var id = data.id;
			layer.confirm('真的删除该角色吗？', function(index) {
				var d3 = {
					"ids": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(user.delMerchantRole, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				tableInit();
				layer.msg(res.msg);
			});
		} 
	})
	
	
	//新增方法
	$('#addButton').on('click',function(){
		layer.open({
			title: ['新增', 'font-size:12px;background-color:#424651;color:#fff'],
			btn: ['确定', '取消'],
			type: 1,
			anim: 5,
			content: $('#changeLayer'),
			area: ['1400px', '600px'],
			end: function() {
				$('#changeLayer').hide();
				changeInit();
			},
			success: function(index, layero) {
				
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				form.render(null, 'changeLayer');
				getTree();
				commercialList('three','add');
				
			},
			yes: function(index, layero) {
				form.on('submit(formdemo2)', function(err) {
					if(err) {
						addCaBack(index)
					}
				})
			}
		})
	})

	//清空表单
	function changeInit() {
		$('#one').val("");
		$('#two').val("");
		$('#three').val("").prop('disabled',false)
		$('#four').val("").prop('disabled',false);
	}
	
	
	//layerPageCallback回调
	function layerPageCallback(index, limit, callback) {
		var parms = {
			roleId: sessionStorage.getItem('roleId') || "",
			isAdminRole: sessionStorage.getItem('isAdminRole') || ""
		}
		reqAjaxAsync(user.queryNotrelauserList, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
			});
			return callback(res);
		})
	};
	
	
	
	
	
	

	//pageCallback回调
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			roleName: $.trim($('#roleName').val()) || "",
			merchantId : sessionStorage.getItem('merchantId') || ""
		}
		reqAjaxAsync(user.merchantRoleList, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				switch(item.available) {
					case('0'):
						$(item).attr('_available', '不可用');
						break;
					case('1'):
						$(item).attr('_available', '可用');
						break;
				}
				if(item.scSysOrg){
					$(item).attr('orgName', item.scSysOrg.orgName);
				}
			});
			doMore(res);
			return callback(res);
		})
	};
	
	function doMore(res){
		if(res){
			sessionStorage.setItem('roleId',res.data[0].id);
			sessionStorage.setItem('isAdminRole',res.data[0].isAdminRole);
		}
		setTimeout(function(){
			var aTr = $('#appZtree .layui-form .layui-table-body tr');
			$(aTr).eq(0).addClass('layui-table-click').siblings().removeClass('layui-table-click');
			rightTableInit();
		},300)
	}
	
	//右侧pageCallback回调
	function rightPageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			roleId : sessionStorage.getItem('roleId') || ""
		}
		reqAjaxAsync(user.queryRelauserList, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				return callback(res);
			})
		})
	};

	//修改回调
	function changeCaBack(data, index) {
		var nodes = treeObj.getCheckedNodes(true);//已选中权限
		var arr = [];
		$.each(nodes,function(i,item){
			arr.push(item.id)
		})
		var arrString = arr.join(',');//已选中权限树ID
		var name = $.trim($('#one').val());
		var available = $('#two').val();
		var merchantId = $('#three').val();
		var id = data.id;
	  	
		var parm = {
			'id' : id,
			'merchantId': merchantId,
			'available': available,
			'permissonid': arrString,
			'name': name
		}
		
		parm = JSON.stringify(parm);
		
		reqAjaxAsync(user.modifyMerchantRole, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			tableInit();
		})
	}
	
	//新增回调
	function addCaBack(index) {
		var name = $.trim($('#one').val());
		var available = $('#two').val();
		var merchantId = $('#three').val();
		var isAdminRole = $('#four').val();
		var nodes = treeObj.getCheckedNodes(true);//已选中权限
		var arr = [];
		$.each(nodes,function(i,item){
			var id = item.id
			arr.push(id)
		})
		var arrString = arr.join(',');//已选中权限树ID
		if(arrString == ''){
			layer.msg('请勾选权限', {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			return;
		}
		var parm = {
			'merchantId': merchantId,
			'available': available,
			'isAdminRole':isAdminRole,
			'permissonid': arrString,
			'name': name
		}
		parm = JSON.stringify(parm);
		reqAjaxAsync(user.addMerchantRole, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			tableInit();
		})
	}
	
	//新增角色用户
	$('#addKv').on('click', function() {
		var roleId = sessionStorage.getItem('roleId');
		var isAdminRole = sessionStorage.getItem('isAdminRole');
		var param = "{'roleId':'"+roleId+"','isAdminRole':'"+isAdminRole+"'}"
		reqAjaxAsync(user.queryNotrelauserList,param).then(function(res){
			if(res.data.length == 0){
				layer.msg('没有可授权的用户~');
				return
			}else{
				layer.open({
					title: ['新增角色用户', 'font-size:12px;background-color:#424651;color:#fff'],
					type: 1,
					content: $('#layerFormDiv'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['800px', '560px'],
					end: function() {
						$('#layerFormDiv').hide();
					},
					success: function(layero, index) {
						layerTableInit();
					}
				});
			}
		})
	})
	
	
	//监听工具条,LAYER表格
	table.on('tool(layerForm)', function(obj) {
		var data = obj.data;
		 if(obj.event === 'grant') {
			var ids = data.id;
			layer.confirm(
            "确认授权吗?",
            {icon: 3, title:'提示'},
            function(index, layero){
            	var roleId = sessionStorage.getItem('roleId');
                var param = "{'ids':'" + ids + "','roleId':'"+roleId+"'}";
                reqAjaxAsync(user.addMerchantRoleUser,param).then(function(res){
	                	if (res.code == 1) {
	                    layer.close(index);
						var isAdminRole = sessionStorage.getItem('isAdminRole');
						var param = "{'roleId':'"+roleId+"','isAdminRole':'"+isAdminRole+"'}"
						layerTableInit();
						rightTableInit();
	                    
	                } else {
	                    layer.msg(res.msg);
	                }
                })
            })
			
		 }
	});
	
	
	//LAYER表格渲染
	function layerTableInit() {
		var _obj = _tableInit('layerForm', [
				[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '账号',
					align: 'left',
					field: 'usercode',
					width: 250
				}, {
					title: '姓名',
					align: 'left',
					field: 'username',
					width: 250
				},{
					title: '操作',
					align: 'left',
					toolbar: '#innerBar',
					width: 100
				}]
			],
			layerPageCallback, 'layerFormPage'
		)
	}
	

	//左侧表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantLeftTable', [
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
				width: 150,
				event: 'changetable'
			}, {
				title: '商户',
				/*sort: true,*/
				align: 'left',
				field: 'orgName',
				width: 220,
				event: 'changetable'
			}, {
				title: '是否可用',
				/*sort: true,*/
				align: 'left',
				field: '_available',
				width: 150,
				event: 'changetable'
			}, {
				title: '操作',
				align: 'left',
				toolbar: '#barDemo',
				width: 240
			}]
		],
			pageCallback, 'layTableLeftPage'
		)
	}
	tableInit();
	
	
	//右侧表格渲染
	function rightTableInit() {
		var __obj = _tableInit('merchantRightTable', [
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
			rightPageCallback, 'layTableRightPage','438'
		)
	}
	
	
	


	//表格方法
	/* 表格初始化
	 * tableId: 表格容器ID
	 * cols:table配置
	 * pageCallback回调(异步)
	 * pageDomName:分页容器ID
	 */
	function _tableInit(tableId, cols, pageCallback, pageDomName,height) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: height || 'full-250',
			cols: cols,
			page: false,
			even: true,
			skin: 'row',
			limit: 15,
			done: function(res, curr, count) {
				$('body').on('click','.layui-table-body table tr',function(){
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