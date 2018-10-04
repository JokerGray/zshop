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
		root: 'operations/getAllTrees', //顶级商户组织机构树
		list: 'operations/merchantOrgFirstList', //顶级组织机构的列表
		sublist: 'operations/merchantOrgList', //子节点组织机构的列表
		updateOrgName: 'operations/modify_org' //修改组织名称
	};

	//左侧树
	function getTree() {
		var setting = {
			check: {
				enable: false,
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
				},
				key: {
					checked: "checked"
				}
			},
			view: {
				showIcon: true,
				expandSpeed: "normal"
			},
			callback: {
				onClick: zTreeOnClick
			}

		};

		var tree = reqAjaxAsync(user.root).then(function(res) {
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
	getTree();

	//Ztree回调
	function zTreeOnClick(event, treeId, treeNode) {
		var pid = treeNode.id;
		$('#treeDemo').data('pid', pid)
		var nodes = treeObj.getSelectedNodes();
		ztreeTableInit();
	};
	
	$('#fatherTree').on('click', function() {
		tableInit();
	})

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		$('.tool-box-ul').find('input').val('')
        tableInit();
	})

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

	//表格操作
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定', '取消'],
				type: 1,
				anim: 5,
				content: $('#addLayer'),
				area: ['1400px', '400px'],
				end: function() {
					addInit();
				},
				success: function(index, layero) {
					$('#one').val(data.orgName);
					$('#two').val(data._orgType);
					$('#three').val(data.priority);
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render(null, 'adder');
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

	//清空表单
	function addInit() {
		$('#one').val("");
		$('#two').val("");
		$('#three').val("");
	}

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			orgName: $.trim($('#orgName').val()) || ""
		};
		reqAjaxAsync(user.list, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				switch(item.orgType) {
					case('0'):
						$(item).attr('_orgType', '公司');
						break;
					case('1'):
						$(item).attr('_orgType', '店铺');
						break;
					case('2'):
						$(item).attr('_orgType', '部门');
						break;
					case('3'):
						$(item).attr('_orgType', '集团');
						break;
					case('4'):
						$(item).attr('_orgType', '总部');
						break;
					case('5'):
						$(item).attr('_orgType', '团队');
						break;
				}
			});
			return callback(res);
		})
	}
	//Ztree pageCallback回调
	function pageCallbackZtree(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			id: $('#treeDemo').data('pid') || ""
		}
		reqAjaxAsync(user.sublist, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				switch(item.orgType) {
					case('0'):
						$(item).attr('_orgType', '公司');
						break;
					case('1'):
						$(item).attr('_orgType', '店铺');
						break;
					case('2'):
						$(item).attr('_orgType', '部门');
						break;
					case('3'):
						$(item).attr('_orgType', '集团');
						break;
					case('4'):
						$(item).attr('_orgType', '总部');
						break;
					case('5'):
						$(item).attr('_orgType', '团队');
						break;
				}
			});
			return callback(res);
		})
	};

	//修改回调
	function changeCaBack(data, index) {
		var id = data.id;
		var parentId = data.parentId;
		var orgName = $('#one').val();
		var priority = $('#three').val();
		var orgIcon = data.orgIcon;
		var merchantId = data.merchantId;
		var shopId = data.shopId;
		var userId = sessionStorage.getItem('userno');
		var parm = {
			'id': id,
			'parentId': parentId,
			'orgName': orgName,
			'priority': priority,
			'orgIcon': orgIcon,
			'merchantId': merchantId,
			'shopId': shopId,
			'userId': userId,
		}
		parm = JSON.stringify(parm);
		reqAjaxAsync(user.updateOrgName, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			ztreeTableInit();
		})
	}

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '组织名称',
						align: 'left',
						field: 'orgName',
						width: 400
					}, {
						title: '组织类型',
						align: 'left',
						field: '_orgType',
						width: 400
					},
					{
						title: '优先级',
						align: 'left',
						field: 'priority',
						width: 400
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 200
					}
				]
			],
			pageCallback, 'layTablePage'
		)
	}
	tableInit();
	//ztree回调表格渲染
	function ztreeTableInit() {
		var _obj = _tableInit('merchantTable', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '组织名称',
						align: 'left',
						field: 'orgName',
						width: 400
					}, {
						title: '组织类型',
						align: 'left',
						field: '_orgType',
						width: 400
					},
					{
						title: '优先级',
						align: 'left',
						field: 'priority',
						width: 400
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 200
					}
				]
			],
			pageCallbackZtree, 'layTablePage'
		)
	}

	//表格方法
	/* 表格初始化
	 * tableId: 表格容器ID
	 * cols:table配置
	 * pageCallback回调(异步)
	 * pageDomName:分页容器ID
	 */
	function _tableInit(tableId, cols, pageCallback, pageDomName) {
		var tableIns;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-250',
			cols: cols,
			page: false,
			even: true,
			limit:15,
			done: function(res, curr, count) {
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
				layout: ['count', 'prev', 'page', 'next', 'limit','skip'],
				limits: [15],
				limit:15,
				jump:function(obj, first){
					//首次不执行
					    if(!first){
					      	pageCallback(obj.curr, obj.limit, function(resTwo) {
								tableIns.reload({
									data: resTwo.data
								});
							});
							
					    }
					}
				}
			
			layui.laypage.render(page_options);
			return {
				tableIns
			};
		});
	}
})