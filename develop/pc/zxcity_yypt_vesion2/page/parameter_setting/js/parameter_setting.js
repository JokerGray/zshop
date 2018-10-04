(function($) {
	const QUERYVEDIOCATALOGPAGE = 'operations/addDict', //.新增参数
		ADDVEDIOCATALOG = 'operations/updateDict', //.修改参数
		MODIFYVEDIOCATALOG = 'operations/removeDict', //.删除参数
		DELVEDIOCATALOG = 'operations/dictList', //.查询参数
		DICTYPELIST = 'operations/dicTypeList', //运营参数类型列表
		ADDDICTYPE = 'operations/addDicType', //新增运营参数类型
		MODIFYDICTYPE = 'operations/modifyDicType', //修改运营参数类型
		DICITEMSGROUP = 'operations/dictItemsGroupByType', //查询
		REMOVEDICTTYPE = 'operations/removeDictType' //删除参数类型
	var operatorName = yyCache.get("name");
	var layer = layui.layer;
	var table = layui.table;
	var form = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	var _obj = tableInit('demo', [
			[{
				title: '序号',
				/*sort: true,*/
				align: 'left',
				field: 'eq',
				width: 80
			}, {
				title: '类型编码',
				/*sort: true,*/
				align: 'left',
				field: 'code',
				// width: 224
			}, {
				title: '类型名称',
				/*sort: true,*/
				align: 'left',
				field: 'name',
				// width: 185
			}, {
				title: '操作',
				align: 'left',
				toolbar: '#barDemo',
				width: 325
			}]
		],
		pageCallback,'laypageLeft'
	)
	
	
	
	
	

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
			limit: 15,
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
			limits: [15,30],
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
					getList();
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

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});

		return res;
	}
	
	//pageCallback回调
	function pageCallback(index, limit, name, code) {
		if(name == undefined){name = ''}
		if(code == undefined){code = ''}
		return getData(DICTYPELIST, "{'page':" + index + ",'rows':" + limit + ",'name':'"+name+"','code':'"+code+"','sort':'name','order':'asc'}");
	}
	
	


	//右表
	var tableInt = table.render({
		id: 'demodb',
		elem: '#demodb' //指定原始表格元素选择器（推荐id选择器）
			,
		height: '650' //容器高度
			,
		cols: [
			[{
				title: '序号',
				/*sort: true,*/
				align: 'left',
				field: 'eq',
				width: 80
			}, {
				title: '名称',
				/*sort: true,*/
				align: 'left',
				field: 'name',
				// width: 300
			}, {
				title: '键值',
				/*sort: true,*/
				align: 'left',
				field: 'val',
				// width: 300
			}, {
				title: '操作',
				align: 'left',
				toolbar: '#barDemoR',
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
		var parms = "{'page':1,'rows':10000}"
		var res = reqAjax(DICTYPELIST, parms);
		var data = res.data;
		var sHtml = ''
		$.each(data, function(i, item) {
			sHtml += `<option value=` + item.code + `>` + item.name + `</option>`
		});
		$('#typeSelectr').append(sHtml)
	}

	//新增参数类型
	$('#commonAdd').on('click', function() {
		layer.open({
			title: ['添加参数类型', 'font-size:12px;background-color:#424651;color:#fff'],
			btn: ['保存', '取消'],
			type: 1,
			content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['800px', '560px'],
			end: function() {
				$('#demo111').hide();
				$('#addName').val('');
				$('#addValue').val('');
			},
			success: function(layero, index) {
				$('div.layui-layer-page').addClass('layui-form')
				$('a.layui-layer-btn0').attr('lay-submit', '');
				$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
				form.render()
			},
			yes: function(index, layero) {
				form.on('submit(formDemo)', function(done) {
					if(done) {
						var name = $(layero).find('#addValue').val();
						var code = $(layero).find('#addName').val();
						var parms = "{'operatorName':'"+operatorName+"','name':'" + name + "','code':'" + code + "'}"
						var res = reqAjax(ADDDICTYPE, parms);
						if(res.code == 1) {
							layer.msg(res.msg);
							layer.close(index)
							var _obj = tableInit('demo', [
								[{
									title: '序号',
									/*sort: true,*/
									align: 'left',
									field: 'eq',
									width: 80
								}, {
									title: '类型编码',
									/*sort: true,*/
									align: 'left',
									field: 'code',
									// width: 232
								}, {
									title: '类型名称',
									/*sort: true,*/
									align: 'left',
									field: 'name',
									// width: 232
								}, {
									title: '操作',
									align: 'left',
									toolbar: '#barDemo',
									width: 325
								}]
							],
							pageCallback,'laypageLeft'
						)
						} else {
							layer.msg(res.msg);
						}
					}
				})
			}
		});
	})

//新增参数
	$('#addKv').on('click', function() {
		layer.open({
			title: ['添加键值', 'font - size: 12px; background-color: #424651; color: #fff'],
			btn: ['保存', '取消'],
			type: 1,
			content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['800px', '560px'],
			end: function() {
				$('#demo222').hide();
				$('#addNamer').val('');
				$('#addValuer').val('');
				$('#addContentr').val('');
				$('#typeSelectr').val('')
			},
			success: function(layero, index) {
				var code = sessionStorage.getItem('code');
				addSearch();
				$(layero).find('#typeSelectr').val(code)
				$('div.layui-layer-page').addClass('layui-form')
				$('a.layui-layer-btn0').attr('lay-submit', '');
				$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
				form.render()

			},
			yes: function(index, layero) {
				form.on('submit(formDemo)', function(done) {
					if(done) {
						var value = $('#addNamer').val();
						var name = $('#addValuer').val();
						var note = $('#addContentr').val();
						var typeCode = $('#typeSelectr>option:selected').attr('value');
						var parms = "{'operatorName':'"+operatorName+"','name':'" + name + "','value':'" + value + "','note':'" + note + "','typeCode':'" + typeCode + "',}"
						var res = reqAjax(QUERYVEDIOCATALOGPAGE, parms);
						if(res.code == 1) {
							layer.msg(res.msg);
							layer.close(index)
							var code = sessionStorage.getItem('code')
							var parms = "{'code':'" + code + "'}";
							var ress = reqAjax(DICITEMSGROUP, parms);
		            		tableInt.reload({
							  data:addEq(ress.data)
							});
						} else {
							layer.msg(res.msg);
						}
					}
				})
			}
		});
	})

	

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

	//搜索功能
	$('#toolSearch').on('click', function() {
		var name = $("#inquireInputNote").val();
		var code = $("#inquireInputType").val();
		var initPage = _obj.tablePage;
		var initTable = _obj.tableIns;
		var res = pageCallback(initPage.curr, initPage.limit,name,code);				
		initTable.reload({ data : res.data });
		getList();

	})

	//重置功能
	$('#toolRelize').on('click', function() {
		var initPage = _obj.tablePage;
		var initTable = _obj.tableIns;
		var res = pageCallback(initPage.curr, initPage.limit);				
		initTable.reload({ data : res.data });
		getList();
		$("#inquireInputType").val('');
		$("#inquireInputNote").val('');
		form.render();
	})

	//监听工具条,左侧表格
	table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			layer.open({
				title: ['详情', 'font-size:12px;background-color:#424651;color:#fff'],
				type: 1,
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#addName').val('');
					$('#addValue').val('');
					var aaa = $("#demo111").find('input,textarea,select');
					$.each(aaa, function(i, item) {
						$(item).attr('disabled', false)
					});
				},
				success: function(layero, index) {
					var aaa = $("#demo111").find('input,textarea,select');
					$.each(aaa, function(i, item) {
						$(item).attr('disabled', true)
					});
					console.log(data)
					$('#addName').val(data.code);
					$('#addValue').val(data.name);
				},
				yes: function(index, layero) {

				}
			});
			//删除
		} else if(obj.event === 'del') {
			var id = data.id;
			layer.confirm('真的删除行么', function(index) {
				var d3 = {
					"id": id,
					"operatorName":operatorName
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(REMOVEDICTTYPE, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				layer.msg(res.msg);
				var _obj = tableInit('demo', [
								[{
									title: '序号',
									/*sort: true,*/
									align: 'left',
									field: 'eq',
									width: 80
								}, {
									title: '类型编码',
									/*sort: true,*/
									align: 'left',
									field: 'code',
									// width: 232
								}, {
									title: '类型名称',
									/*sort: true,*/
									align: 'left',
									field: 'name',
									// width: 232
								}, {
									title: '操作',
									align: 'left',
									toolbar: '#barDemo',
									width: 325
								}]
							],
							pageCallback,'laypageLeft'
						)
			});
		} else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
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
					$('#addName').val(data.code);
					$('#addValue').val(data.name);
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							var id = data.id;
							var name = $('#addValue').val();
							var value = $('#addName').val();
							var parms = "{'operatorName':'"+operatorName+"','id':'" + id + "','name':'" + name + "','code':'" + value + "'}"
							var res = reqAjax(MODIFYDICTYPE, parms);
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

	//监听工具条,右侧表格
	table.on('tool(demodb)', function(obj) {
		var data = obj.data;
		//修改
		if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
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
							var parms = "{'operatorName':'"+operatorName+"','id':'" + id + "','name':'" + name + "','value':'" + value + "','typeCode':'" + typeCode + "','note':'" + note + "'}"
							var res = reqAjax(ADDVEDIOCATALOG, parms);
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
				var code = sessionStorage.getItem('code')
				var parms = "{'operatorName':'"+operatorName+"','code':'" + code + "'}";
				var ress = reqAjax(DICITEMSGROUP, parms);
				tableInt.reload({
					data: addEq(ress.data)
				});
				layer.close(index);
				layer.msg(res.msg);
			});
		}
	});

	//点击
	$('#leftTable').on('click', 'tbody tr', function() {
		var code = $(this).children('td').eq(1).children().html();
		var name = $(this).children('td').eq(2).children().html();
		sessionStorage.setItem('code', code);
		$('#myListName').html('键值列表,所属类型:' + name + '');
		tableRight()
	})

	//联查功能
	function tableRight() {
		var code = sessionStorage.getItem('code')
		var parms = "{'code':'" + code + "'}";
		var res = reqAjax(DICITEMSGROUP, parms);
		tableInt.reload({
			data: addEq(res.data)
		});
	}

	//点击变色
	$('#app').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})

	//初始化渲染右侧表格
	function getList() {
		var aTr = $('tbody tr');
		$(aTr).eq(0).addClass('layui-table-click');
		$.each(aTr, function(i, item) {
			if($(item).hasClass('layui-table-click')) {
				var code = $(item).children('td').eq(1).children().html();
				var name = $(this).children('td').eq(2).children().html();
				sessionStorage.setItem('code', code)
				$('#myListName').html('键值列表,所属类型:' + name + '')
				tableRight()
			}
		})
	}

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