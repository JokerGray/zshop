layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
	//接口
	var USER_URL = {
		RESOURLIST: 'operations/queryOperationTrategyPage', //(查询状态)
		ADDRESOURCE: 'operations/addOperationTrategy', //(新增)
		UPDATERESOURCE: ' operations/modifyOperationTrategy', //(修改)
		DELUSER: 'operations/deleteOperationTrategy' //(删除)
	};

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
        $('.tool-box-ul').find('input,select').val('');
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

	//监听select选择
	form.on('select(addType)', function(data, reData) {
		var typeN = `<option value="1">普通商户</option><option value="2">合作商户</option><option value="3">代理商户</option>`
		var typeM = `<option value="0">普通用户</option>`
		if(data.value == 0) { //商户
			$('#addLevel').html(typeM)
		} else { //个人
			$('#addLevel').html(typeN)
		}
		form.render();
	});
	
	
	
	$('#addButton').click(function(){
		layer.open({
			title: ['新增', 'fon-size:12px;background-color:#424651;color:#fff'],
			btn: ['保存', '取消'],
			type: 1,
			anim: 5,
			content: $('#addDetail'),
			area: ['1400px', '700px'],
			end: function() {
				addInit();
			},
			success: function(index, layero) {
				var typeN = `<option value="1">普通商户</option><option value="2">合作商户</option><option value="3">代理商户</option>`
				var typeM = `<option value="0">普通用户</option>`
				$('#addLevel').html(typeM)
				addInit();
				//给保存按钮添加form属性
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				form.render();
			},
			yes: function(index, layero) {
				form.on('submit(formdemo2)', function(err) {
					if(err) {
						var strategyName = $.trim($('#addName').val())
						var userType = $.trim($('#addType').val())
						var userLevel = $.trim($('#addLevel').val())
						var funcCode = $.trim($('#addCode').val())
						var valueType = $.trim($('#addValueType').val())
						var text = $.trim($('#addValue').val())
						var businessDescription = $.trim($('#addDescription').val())
						var applicableTo = $.trim($('#addGround').val())
						if(valueType == '整数') {
							if(text % 1 != 0) {
								layer.msg('请输入整数', {
									icon: 2,
									shade: [0.1, '#fff'],
									offset: '50%',
									anim: 5
								});
								return;
							} else {
								changeSave(USER_URL.ADDRESOURCE,index,"id",strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
							}
						} else if(valueType == '布尔') {
							if(text != 'true' && text != 'false') {
								layer.msg('请输入布尔值', {
									icon: 2,
									shade: [0.1, '#fff'],
									offset: '50%',
									anim: 5
								});
								return;
							} else {
								changeSave(USER_URL.ADDRESOURCE,index,"id",strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
							}
						} else if(valueType == '天数') {
							if(text % 1 != 0) {
								layer.msg('请输入整数', {
									icon: 2,
									shade: [0.1, '#fff'],
									offset: '50%',
									anim: 5
								});
								return;
							} else {
								changeSave(USER_URL.ADDRESOURCE,index,"id",strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
							}
						} else if(valueType == '文本') {
							changeSave(USER_URL.ADDRESOURCE,index,"id",strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
						} else if(valueType == '小数') {
							var str1 = text.split('.')[0];
							var str2 = text.split('.')[1];
							if((text.split('.')).length == 2 && str1 % 1 == 0 && str2 % 1 == 0) {
								changeSave(USER_URL.ADDRESOURCE,index,"id",strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
							} else {
								layer.msg('请输入小数', {
									icon: 2,
									shade: [0.1, '#fff'],
									offset: '50%',
									anim: 5
								});
							}
						}
	
					}
				})
			}
		});
	})

	//表格操作
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		var id = data.id;
		//查看
		if(obj.event === 'view') {
			layer.open({
				title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定'],
				type: 1,
				anim: 5,
				content: $('#details'),
				area: ['1400px', '700px'],
				end: function() {
					detailInit();
				},
				success: function(index, layero) {
					$('#detailsName').val(data.strategyName);
					$('#detailsType').val(data.userTypename);
					$('#detailsLevel').val(data.userLevelname);
					$('#detailsCode').val(data.funcCode);
					$('#detailsValueType').val(data.valueType);
					$('#detailsValue').val(data.text);
					if(data.applicableTo == 0) {
						$('#detailsApplicableTo').val('店铺');
					} else if(data.applicableTo == 1) {
						$('#detailsApplicableTo').val('商户');
					}
					$('#detailsDescription').val(data.businessDescription);
				}
			});
		} else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'fon-size:12px;background-color:#424651;color:#fff'],
				btn: ['保存', '取消'],
				type: 1,
				anim: 5,
				content: $('#addDetail'),
				area: ['1400px', '700px'],
				end: function() {
					addInit();
				},
				success: function(index, layero) {
					console.log(data);
					var typeN = `<option value="1">普通商户</option><option value="2">合作商户</option><option value="3">代理商户</option>`
					var typeM = `<option value="0">普通用户</option>`
					if(data.userType == 1) { //商户
						$('#addLevel').html(typeN)
					} else { //普通用户
						$('#addLevel').html(typeM)
					}

					$("#addGround").val(data.applicableTo) //应用范围
					$('#addType').val(data.userType); //用户类型
					$('#addValueType').val(data.valueType); //取值类型
					$('#addName').val(data.strategyName); //策略名称
					$('#addCode').val(data.funcCode); //功能编码
					$('#addValue').val(data.text); //取值
					$('#detailsApplicableTo').val(data.applicableTo);
					$('#addDescription').val(data.businessDescription); //业务描述

					//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
					form.render();
				},
				yes: function(index, layero) {
					form.on('submit(formdemo2)', function(err) {
						if(err) {
							var id = data.id;
							var strategyName = $.trim($('#addName').val())
							var userType = $.trim($('#addType').val())
							var userLevel = $.trim($('#addLevel').val())
							var funcCode = $.trim($('#addCode').val())
							var valueType = $.trim($('#addValueType').val())
							var text = $.trim($('#addValue').val())
							var businessDescription = $.trim($('#addDescription').val())
							var applicableTo = $.trim($('#addGround').val())
							if(valueType == '整数') {
								if(text % 1 != 0) {
									layer.msg('请输入整数', {
										icon: 2,
										shade: [0.1, '#fff'],
										offset: '50%',
										anim: 5
									});
									return;
								} else {
									changeSave(USER_URL.UPDATERESOURCE,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
								}
							} else if(valueType == '布尔') {
								if(text != 'true' && text != 'false') {
									layer.msg('请输入布尔值', {
										icon: 2,
										shade: [0.1, '#fff'],
										offset: '50%',
										anim: 5
									});
									return;
								} else {
									changeSave(USER_URL.UPDATERESOURCE,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
								}
							} else if(valueType == '天数') {
								if(text % 1 != 0) {
									layer.msg('请输入整数', {
										icon: 2,
										shade: [0.1, '#fff'],
										offset: '50%',
										anim: 5
									});
									return;
								} else {
									changeSave(USER_URL.UPDATERESOURCE,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
								}
							} else if(valueType == '文本') {
								changeSave(USER_URL.UPDATERESOURCE,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
							} else if(valueType == '小数') {
								var str1 = text.split('.')[0];
								var str2 = text.split('.')[1];
								if((text.split('.')).length == 2 && str1 % 1 == 0 && str2 % 1 == 0) {
									changeSave(USER_URL.UPDATERESOURCE,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo);
								} else {
									layer.msg('请输入小数', {
										icon: 2,
										shade: [0.1, '#fff'],
										offset: '50%',
										anim: 5
									});
								}
							}

						}
					})
				}
			});
		} else if(obj.event === 'del') {
			var id = data.id;
			layer.confirm(
				'确认删除?', {
					icon: 3,
					title: '提示'
				},
				function(index) {
					var parmDel = {
						id: id
					};
					reqAjaxAsync(USER_URL.DELUSER, JSON.stringify(parmDel)).done(function(res) {
						if(res.code == 1) {
							layer.msg('删除成功');
							tableInit();
						} else {
							layer.msg(res.msg)
						}
					});
				}
			)
		}
	});
	
	
	//修改保存
	function changeSave(url,index,id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo){
		if(url == USER_URL.ADDRESOURCE){//新增
			var param = {
	            strategyName :strategyName,
	            userType :userType,
	            userLevel:userLevel,
	            funcCode:funcCode,
	            valueType:valueType,
	            text:text,
	            businessDescription:businessDescription,
	            applicableTo:applicableTo
	        }
		}else{//修改
			var param = {
	            id:id,
	            strategyName :strategyName,
	            userType :userType,
	            userLevel:userLevel,
	            funcCode:funcCode,
	            valueType:valueType,
	            text:text,
	            businessDescription:businessDescription,
	            applicableTo:applicableTo
	        }
		}
		
		reqAjaxAsync(url,JSON.stringify(param)).done(function(res){
			if(res.code == 1){
			 	layer.msg(res.msg, {
					icon: 1,
					shade: [0.1, '#fff'],
					offset: '50%',
					anim: 5
				});
				layer.close(index);	
				tableInit();
			}else{
				layer.msg(res.msg, {
					icon: 2,
					shade: [0.1, '#fff'],
					offset: '50%',
					anim: 5
				});
			}
		})
	}

	//add end
	function addInit() {
		$('#addName').val('');
		$('#addType').val('');
		$('#addLevel').val('');
		$('#addCode').val('');
		$('#addValueType').val('');
		$('#addValue').val('');
		$('#addGround').val('');
		$('#addDescription').val('');
	}

	//detail end
	function detailInit() {
		$('#detailsName').val('');
		$('#detailsType').val('');
		$('#detailsLevel').val('');
		$('#detailsCode').val('');
		$('#detailsValueType').val('');
		$('#detailsValue').val('');
		$('#detailsApplicableTo').val('');
		$('#detailsDescription').val('');
	}

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			userType: $.trim($('#merchantType').val()) || "", //用户类型
			userLevel: $.trim($('#merchantLeve').val()) || "", //用户等级
			strategyName: $.trim($('#merchantName').val()) || "" //策略名称

		};
		reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				if(item.userType == 0) {
					$(item).attr('userTypename', '个人用户');
				} else if(item.userType == 1) {
					$(item).attr('userTypename', '商户');
				};
				if(item.userLevel == 0) {
					$(item).attr('userLevelname', '普通用户');
				} else if(item.userLevel == 1) {
					$(item).attr('userLevelname', '普通商户');
				} else if(item.userLevel == 2) {
					$(item).attr('userLevelname', '合作商户');
				} else if(item.userLevel == 3) {
					$(item).attr('userLevelname', '代理商户');
				}

			});
			return callback(res);
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
						title: '策略名称',
						align: 'left',
						field: 'strategyName',
						width: 200
					}, {
						title: '用户类型',
						align: 'left',
						field: 'userTypename',
						width: 150
					},
					{
						title: '用户等级',
						align: 'left',
						field: 'userLevelname',
						width: 200
					}, {
						title: '功能编码',
						align: 'left',
						field: 'funcCode',
						width: 150
					}, {
						title: '取值类型',
						align: 'left',
						field: 'valueType',
						width: 100
					}, {
						title: '取值',
						align: 'left',
						field: 'text',
						width: 150
					}, {
						title: '业务说明',
						align: 'left',
						field: 'businessDescription',
						width: 300
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 300
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
			cellMinWidth:80,
			done: function(res, curr, count) {
				// do something
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