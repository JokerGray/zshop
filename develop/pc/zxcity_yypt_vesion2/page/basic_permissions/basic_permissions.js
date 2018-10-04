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
		getmerchantpermiss : 'operations/getPermissionsPagination',//根据父节点ID查询商户权限树
		addmerchantpermission : 'operations/addMerchantPermission',//新增
		modifymerchantpermission : 'operations/modifyMerchantPermission',//修改
		getallpermenutree : 'operations/getAllPerMenuTree'//获取所有权限树
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

		var tree = reqAjaxAsync(user.getallpermenutree).then(function(res) {
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
	
	
	//默认清空data
	function clearData(){
		$('#treeDemo').removeData('pid', );
		$('#treeDemo').removeData('treeNode');
		$('#treeDemo').removeData('strArr');
	}
	clearData();

	//Ztree回调
	function zTreeOnClick(event, treeId, treeNode) {
		var pid = treeNode.id;
		// var nodes = treeObj.getSelectedNodes();
		var zero = 0;
		var arr = [];
		var nodes = treeObj.getSelectedNodes(true);//已选中权限
		// $.each(nodes,function(i,item){
		// 	arr.push(item.id+'/')
		// })
		// arr.unshift(zero+'/')
		// var strArr = arr.join(',')
		// strArr = strArr.replace(/,/g,'');
		// $('#treeDemo').data('pid', pid);
		// $('#treeDemo').data('treeNode', treeNode);
		// $('#treeDemo').data('strArr', strArr);
		var arr1 = [];
        $.each(nodes,function(i,item){
            if(item.pid == 0 || item.getParentNode()){
                arr=getParents(item,arr);
                arr.unshift(item);
                $.each(arr,function(j,items){
                    if(items){
                        arr1.unshift(items.id+'/');
                    }
                })

            }
        })
        arr1.unshift('0/');
        console.log(arr1)
        var strArr = arr1.join(',')
        strArr = strArr.replace(/,/g,'');
        $('#treeDemo').data('pid', pid);
        $('#treeDemo').data('treeNode', treeNode);
        $('#treeDemo').data('strArr', strArr);
		tableInit();
	};

    function getParents(item,arr){
        var f = function(){
            if(item){
                arr.push(item.getParentNode())
                return getParents(item.getParentNode(),arr)
            }else{
                return arr;
            }
        }
        return f();
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
	$('#fatherTree').on('click', function() {
		tableInit();
	})

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload();
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
				area: ['90%', '90%'],
				end: function() {
					addInit();
				},
				success: function(index, layero) {
					$('#one').val(data.name);
				  	$('#two').val(data.url);
				  	$('#three').val(data.percode);
				  	$('#four').val(data.type);
				  	$('#five').val(data.available);
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render(null, 'addLayer');
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
	
	
	//新增方法
	$('#addButton').on('click',function(){
		layer.open({
			title: ['新增', 'font-size:12px;background-color:#424651;color:#fff'],
			btn: ['确定', '取消'],
			type: 1,
			anim: 5,
			content: $('#addLayer'),
			area: ['90%', '90%'],
			end: function() {
				addInit();
			},
			success: function(index, layero) {
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				form.render(null, 'addLayer');
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
	function addInit() {
		$('#one').val("");
		$('#two').val("");
		$('#three').val("");
		$('#four').val("");
		$('#five').val("");
	}

	//pageCallback回调
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			name: $.trim($('#name').val()) || "",
			pid : $('#treeDemo').data('pid') || ""
		}
		reqAjaxAsync(user.getmerchantpermiss, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				switch(item.available) {
					case('0'):
						$(item).attr('_available', '否');
						break;
					case('1'):
						$(item).attr('_available', '是');
						break;
				}
			});
			return callback(res);
		})
	};

	//修改回调
	function changeCaBack(data, index) {
		var id = data.id;
		var pid = $('#treeDemo').data('pid') || 0;
	  	var strArr = $('#treeDemo').data('strArr')||'null';
	  	var name = $.trim($('#one').val());
	  	var url = $.trim($('#two').val());
	  	var percode = $.trim($('#three').val());
	  	var type = $.trim($('#four').val());
	  	var available = $.trim($('#five').val());
	  	
		var parm = {
			'id' : id,
			'name': name,
			'type': type,
			'url': url,
			'percode': percode,
			'parentid': pid,
			'parentids': strArr,
			'sortstring': '10',
			'available': available,
			'icon': 'icon.jpg'
		}
		parm = JSON.stringify(parm);
		reqAjaxAsync(user.modifymerchantpermission, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			location.reload();
		})
	}
	
	//新增回调
	function addCaBack(index) {
		var pid = $('#treeDemo').data('pid')||0;
	  	var strArr = $('#treeDemo').data('strArr')||'0/';
	  	var name = $.trim($('#one').val());
	  	var url = $.trim($('#two').val());
	  	var percode = $.trim($('#three').val());
	  	var type = $.trim($('#four').val());
	  	var available = $.trim($('#five').val());
		var parm = {
			'name': name,
			'type': type,
			'url': url,
			'percode': percode,
			'parentid': pid,
			'parentids': strArr,
			'sortstring': '10',
			'available': available,
			'icon': 'icon.jpg'
		}
		parm = JSON.stringify(parm);
		reqAjaxAsync(user.addmerchantpermission, parm).then(function(res) {
			layer.msg(res.msg, {
				icon: 1,
				shade: [0.1, '#fff'],
				offset: '50%',
				anim: 5
			});
			layer.close(index);
			location.reload();
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
						title: '权限名',
						align: 'left',
						field: 'name',
						width: 200
					}, {
						title: '权限类型',
						align: 'left',
						field: 'type',
						width: 200
					},{
                    title: '权限代码',
                    align: 'left',
                    field: 'type',
                    width: 200
                	}, {
						title: '权限地址',
						align: 'left',
						field: 'url',
						width: 450
					},{
						title: '是否可用',
						align: 'left',
						field: '_available',
						width: 100
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
			done: function(res, curr, count) {
				$('body').on('click','table tr',function(){
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