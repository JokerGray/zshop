layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;
		
		
    var roleId = sessionStorage.getItem("roleIds") || "";
    var userNo = sessionStorage.getItem("userno") || "";
    var userId = sessionStorage.getItem("userId") || "";
    var userName = sessionStorage.getItem('username') || "";

	//接口
	var server = {
		queryMerchantBasicRolePermissionPage : 'operations/queryMerchantBasicRolePermissionPage', //(查询列表)
          addMerchantBasicRolePermission:'operations/addMerchantBasicRolePermission', //添加商户角色模板
		  modifyMerchantBasicRolePermission:'operations/modifyMerchantBasicRolePermission',//修改商户角色模板
		  deleteMerchantBasicRolePermission:'operations/deleteMerchantBasicRolePermission',//删除商户角色模板
		  getMerchantBasicRolePermissonTree:'operations/getMerchantBasicRolePermissonTree',//获取商户角色模板已授权的权限树
		  getAllPerMenuTree :'operations/getAllPerMenuTree',//获取所有权限树
		  queryAllMerchantBasicRolePermissionPage:'operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
		  modifyRolePermissionCheckStatus:' operations/modifyRolePermissionCheckStatus'//修改角色权限是否可选状态
	}


	//状态切换方法
	function stateChange() {
		$('#roleName').val("");
		$('#permissionName').val("");
		//data-type 1 角色模板 2是否可选
		var type = $(this).attr('data-type');
		//页面状态都是根据type决定
		$('#searchBtn').data('type',type);
		whatType();
	}

	$('.select-search-div').on('click', stateChange);
	
	
	




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

	



	//pageCallback ->角色模板
	function pageCallbackOne(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			roleName:$.trim($('#roleName').val()) || ""
		};
		reqAjaxAsync(server.queryMerchantBasicRolePermissionPage, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
			});
			return callback(res);
		})
	}
	
	//pageCallback ->是否可选
	function pageCallbackTwo(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			roleName:$.trim($('#roleName').val()) || "",
			permissionName:$.trim($('#permissionName').val()) || ""
		};
		reqAjaxAsync(server.queryAllMerchantBasicRolePermissionPage, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			var _isCheck;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
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
			return callback(res);
		})
	}
	
	

	//当前表格渲染 =>角色模板
	function tableInitOne() {
			var _obj = _tableInit('merchantTable', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq'
                    }, {
                        title: '角色名称',
                        align: 'left',
                        field: 'roleName'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo'
                    }]
                ],
				pageCallbackOne, 'layTablePage'
			)
		}
	
	//当前表格渲染 =>是否可选
	function tableInitTwo() {
			var _obj = _tableInit('merchantTableright',[[
					 {checkbox: true} 
		    		,{title:'序号',sort:false,align:'left',field:'eq'}
				    ,{title:'角色名称',sort:false,align:'left',field:'roleName'}
				    ,{title:'权限名称',sort:false,align:'left',field:'permissionName'}
				    ,{title:'是否可用',sort:false,align:'left',field:'_available'}
				    ,{title:'是否可选',sort:false,align:'left',field:'_isCheck'}
				    ,{title:'操作',align:'left', toolbar: '#barDemoRig'}
			  ]],
				pageCallbackTwo, 'layTablePage'
			)
		}
	
	
	function whatType(){
		var type = $('#searchBtn').data('type');
		if(type == 1){
			$('.layui-form.layui-border-box.layui-table-view').eq(0).show();
			$('.layui-form.layui-border-box.layui-table-view').eq(1).hide();
			$('#chooseBtn').hide();
			$('#addButton').show();
			$('.select-search-div').eq(0).addClass('act').siblings().removeClass('act');
			$('#permissionNameLi').hide();
			tableInitOne();
			//搜索
			$('#searchBtn').on('click', function() {
				tableInitOne();
			})
			//重置
			$('#resetBtn').on('click', function() {
				$("#roleName").val("");
				tableInitOne();
			})
		}else if(type == 2){
			$('.layui-form.layui-border-box.layui-table-view').eq(0).hide();
			$('.layui-form.layui-border-box.layui-table-view').eq(1).show();
			$('#chooseBtn').show();
			$('#addButton').hide();
			$('.select-search-div').eq(1).addClass('act').siblings().removeClass('act');
			$('#permissionNameLi').show();
			tableInitTwo();
		}else{
			$('.layui-form.layui-border-box.layui-table-view').eq(0).show();
			$('.layui-form.layui-border-box.layui-table-view').eq(1).hide();
			$('#chooseBtn').hide();
			$('#addButton').show();
			$('.select-search-div').eq(0).addClass('act').siblings().removeClass('act');
			$('#permissionNameLi').hide();
			tableInitOne();
			//搜索
			$('#searchBtn').on('click', function() {
				tableInitOne();
			})
			//重置
			$('#resetBtn').on('click', function() {
				$("#roleName").val("");
				tableInitOne();
			})
		}
	}
	whatType();
	
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'view') {
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
					$('#one').val(data.roleName);
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render(null, 'changeLayer');
					var parme="{'roleName':'"+data.roleName+"'}";
					reqAjaxAsync(server.getMerchantBasicRolePermissonTree,parme).then(function(res){
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
		}
	})
	
	
	table.on('tool(merchantTableright)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定', '取消'],
				type: 1,
				anim: 5,
				content: $('#addLayer'),
				area: ['1400px', '600px'],
				end: function() {
					$('#addLayer').hide();
				},
				success: function(index, layero) {
					$('#isCheck').val(data.isCheck);
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render(null, 'adder');
				},
				yes: function(index, layero) {
					form.on('submit(formdemo2)', function(err) {
						if(err) {
							var ids = data.id;
							var isCheck = $('#isCheck').val();
							var parm = {
								'ids': ids,
								'isCheck': isCheck
							}
							parm = JSON.stringify(parm);
							reqAjaxAsync(server.modifyRolePermissionCheckStatus, parm).then(function(res) {
								layer.msg(res.msg, {
									icon: 1,
									shade: [0.1, '#fff'],
									offset: '50%',
									anim: 5
								});
								layer.close(index);
								tableInitTwo();
							})
							
						}
					})
				}
			})
		}
	})
	
	
		//是否可选
		$('#chooseBtn').on('click', function() {
			var checkStatus = table.checkStatus('merchantTableright');
			if(checkStatus.data.length == 0){
				layer.msg('请勾选权限')
				return false;
			}
			layer.open({
				title: ['批量操作', 'font-size:12px;background-color:#0678CE;color:#fff'],
				btn: ['保存', '取消'],
				type: 1,
				content: $('#addLayer'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['1400px', '600px'],
				end: function() {
					$('#isCheck').val('')
					$('#addLayer').hide();
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
					var isCheck = $('#isCheck').val();
					var parms = "{'ids':'" + ids + "','isCheck':'" + isCheck + "'}"
					reqAjaxAsync(server.modifyRolePermissionCheckStatus,parms).then(function(res){
						layer.msg(res.msg, {
							icon: 1,
							shade: [0.1, '#fff'],
							offset: '50%',
							anim: 5
						});
						layer.close(index);
						tableInitTwo();
					})

				}
			});
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
				$('#one').val("");
			},
			success: function(index, layero) {
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				form.render(null, 'changeLayer');
				getTree();
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
		var tree = reqAjaxAsync(server.getAllPerMenuTree).then(function(res) {
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

	//新增回调
	function addCaBack(index) {
			var roleName = $.trim($('#one').val());
			var nodes = treeObj.getCheckedNodes(true);//已选中权限
			var arr = [];
			$.each(nodes,function(i,item){
				var name = item.name;
				var id = item.id
				arr.push(id+'-'+name)
				console.log(item)
			})
			var arrString = arr.join('=');//已选中权限树ID
			if(arrString == ''){
				layer.msg('请勾选权限', {
					icon: 2,
					shade: [0.1, '#fff'],
					offset: '50%',
					anim: 5
				});
				return;
			}
			var parm = {
				'roleName': roleName,
				'permissions': arrString
			}
			parm = JSON.stringify(parm);
			reqAjaxAsync(server.addMerchantBasicRolePermission, parm).then(function(res) {
				layer.msg(res.msg, {
					icon: 1,
					shade: [0.1, '#fff'],
					offset: '50%',
					anim: 5
				});
				layer.close(index);
				tableInitOne();
			})
		}
	
	
	
	//修改回调
	function changeCaBack(data, index) {
		var roleName = $('#one').val();
		var roleCode = data.roleCode;
		var nodes = treeObj.getCheckedNodes(true);//已选中权限
		var arr = [];
		$.each(nodes,function(i,item){
			var name = item.name;
			var id = item.id
			arr.push(id+'-'+name)
		})
		var arrString = arr.join('=');//已选中权限树ID
		if(roleCode=='null'||roleCode==null){
			roleCode=''
		}
	  	
		var parm = {
			'permissions' : arrString,
			'roleName': roleName,
			'roleCode': roleCode
		}
		
		parm = JSON.stringify(parm);
		
		reqAjaxAsync(server.modifyMerchantBasicRolePermission, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			tableInitOne();
		})
	}
	
	
	
	

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