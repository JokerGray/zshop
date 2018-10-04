(function($) {
	const  FEEDBACKLIST = 'operations/feedBackList', //查询
		   ADDREPLY = 'operations/addReply',//修改
		   DELETEREPLY = 'operations/deleteReply',//删除
		   ROLEPERMISSIONPAGE = 'operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
		   CHECKSTATUS = ' operations/modifyRolePermissionCheckStatus' //修改角色权限是否可选状态

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	//搜索
	$('#toolSearch').on('click', function() {
		init_obj();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#feedbackType").val('');
		$("#moreField1").val('');
		init_obj();
	})

	function init_obj() {
		var _obj = tableInit('demo', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '问题类型',
					/*sort: true,*/
					align: 'left',
					field: '_feedbackType',
					width: 200
				}, {
					title: '用户昵称',
					/*sort: true,*/
					align: 'left',
					field: 'nickName',
					width: 200
				}, {
					title: '联系电话',
					/*sort: true,*/
					align: 'left',
					field: 'moreField2',
					width: 100
				}, {
					title: '用户QQ',
					/*sort: true,*/
					align: 'left',
					field: 'qqCode',
					width: 100
				}, {
					title: '用户邮箱',
					/*sort: true,*/
					align: 'left',
					field: 'email',
					width: 100
				}, {
					title: '反馈时间',
					/*sort: true,*/
					align: 'left',
					field: 'createTime',
					width: 200
				}, {
					title: '来源',
					/*sort: true,*/
					align: 'left',
					field: '_moreField1',
					width: 200
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],
			pageCallback
		)
	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}

	//TAB切换
	$('.search-li').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		initForAct();
	})

	//pageCallback回调
	function pageCallback(index, limit, userId, replyStatus, feedbackType, moreField1) {
		var aLi = $('.search-li.act')
		var replyStatus = $(aLi).attr('data-replystatus');
		var feedbackType = $('#feedbackType').val();
		var moreField1 = $('#moreField1').val();
		var userId = yyCache.get('userId');
		if(userId == undefined) {
			userId = ''
		}
		if(replyStatus == undefined) {
			replyStatus = ''
		}
		if(feedbackType == undefined) {
			feedbackType = ''
		}
		if(moreField1 == undefined) {
			moreField1 = ''
		}
		return getData(FEEDBACKLIST, "{'page':" + index + ",'rows':" + limit + ",'userId':'" + userId + "','replyStatus':'" + replyStatus + "','feedbackType':'" + feedbackType + "','moreField1':'" + moreField1 + "'}");
	}
table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			layer.open({
				title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#problemsSuggestion').val('').attr('disabled',false)
					$('#replyStatus').val('').attr('disabled',false)
					$('#reply').val('').attr('disabled',false)
					$('#layImg').attr('url','');
					$("div.holder").show();
				},
				success: function(layero, index) {
					$("div.holder").hide();
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
					$('#reply').attr('disabled','')
					if(data.replyStatus==null){
						data.replyStatus=0;
					}
					$('#replyStatus').val(data.replyStatus).attr('disabled','')
					$('#layImg').attr('url',data.problemsImgurl);
					form.render()
				},
				yes: function(index, layero) {

				}
			});
			//删除
		} else if(obj.event === 'del') {
			var id = data.id;
			layer.confirm('真的删除行么', function(index) {
				var d3 = {
					"id": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(DELETEREPLY, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				init_obj();
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
					$('#reply').val('');
					$('#replyStatus').val('');

				},
				success: function(layero, index) {
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
					$('#replyStatus').val(data.replyStatus);
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							console.log(data)
							var questionId = data.id;
							var userId = yyCache.get('userno');
							var userName = yyCache.get('username');
							var reply =  $('#reply').val();
							var replyStatus = $('#replyStatus').val();
							var e2 = {
								questionId: Number(questionId),
								reply: reply,
								replyStatus: Number(replyStatus),
								userId: Number(userId),
								userName: userName
							}
							e2 = JSON.stringify(e2);
							var res = reqAjax(ADDREPLY, e2);
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index)
								init_obj();
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
	function addEq(data) {
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});
		return data;
	}

	//展开按钮
	var flag = true;
	$('#spread').on('click', spread)

	function spread() {
		var oUl = $('.navList');
		var aLi = oUl.children('li');
		if(flag == true) {
			$(this).html('<i class="layui-icon">&#xe630;</i>收起')
			flag = false;
			treeObj.expandAll(true);

		} else {
			$(this).html('<i class="layui-icon">&#xe630;</i>展开')
			flag = true;
			treeObj.expandAll(false);
		}
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})



	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

	})

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-220',
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
			limits: [15, 50, 100, 300, 800, 1000],
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

	//数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;
		var _feedbackType, _moreField1;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.feedbackType == 0) {
				_feedbackType = '系统问题'
			} else if(item.isCheck == 1) {
				_feedbackType = '页面问题'
			} else {
				_feedbackType = '其它问题'
			}
			if(item.moreField1 == 1) {
				_moreField1 = 'PC端'
			} else {
				_moreField1 = 'APP'
			}
			$(item).attr('_feedbackType', _feedbackType)
			$(item).attr('_moreField1', _moreField1)
		});

		return res;
	}

})(jQuery)