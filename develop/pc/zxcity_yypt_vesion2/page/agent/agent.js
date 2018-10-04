layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;

	sessionStorage.setItem('status','T1')
	//接口
	var server = {
		merchantUpgradeConfirmList: 'operations/queryAppUserRecommendRelationPage', //(查询列表)
		approveMerchantUpgrade: 'operations/approveMerchantRecharge', //(确认)
		queryAppUserUnboundedRecommendPage:"operations/queryAppUserUnboundedRecommendPage",
		delAppUserRecommendRelation: "operations/delAppUserRecommendRelation",//(删除)
        addAppUserRecommendRelation: "operations/addAppUserRecommendRelation"//(新增)
	}

	//状态切换方法
	function stateChange() {
		var status = $(this).attr('data-num');
		var index =  $(this).attr('data-status');
		sessionStorage.setItem('status', status);
		sessionStorage.setItem('_index', index);
		$(this).addClass('act').siblings().removeClass('act');
		tableInit();
		if(status == 'T1' || status == 'T3'){
			$('#addButton').css('visibility','visible')
		}else{
			$('#addButton').css('visibility','hidden')
		}
	}

	// $('.select-search-div').on('click', stateChange);


	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
	})

	
	
	//新增
	$('#addButton').click(function(){
		var layerMerid = "";
		layer.open({
				title: ['新增', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定', '取消'],
				type: 1,
				anim: 5,
				content: $('#agentAdd'),
				area: ['1500px', '700px'],
				end: function() {
					$('#merchantPhoneLayer').val("");
				},
				success: function(index, layero) {
					layerTableInit();
					layui.table.on('tool(merchantTableLayer)', function(objs) {
			            var tr = objs.tr; //获得当前行 tr 的DOM对象
			            if(objs.event === 'changetable'){
			                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
			                layerMerid  = objs.data.id;
			            }
			        });
			        $("#searchBtnLayer").on('click',function(){
			        	layerTableInit();
			        })
			        $("#resetBtnLayer").on('click',function(){
			        	$('#merchantPhoneLayer').val("");
			        	layerTableInit();
			        })
				},
				yes: function(index, layero) {
					if(layerMerid == ""){
						layer.msg("请选择要绑定的代理商", {
								icon: 2,
								shade: [0.1, '#fff'],
								offset: '50%',
								anim: 5
						});
						return
					}else{
						var params = {
		                    code : sessionStorage.getItem('status'),
		                    userId : layerMerid,
		                    addUserId : sessionStorage.getItem('userId'),
		                    addUserName : sessionStorage.getItem('username')
		                };
		                reqAjaxAsync(server.addAppUserRecommendRelation,JSON.stringify(params)).then(function(res){
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
				}
			})
	})

	

	//未审核相关处理
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		var oldId = data.id;
		 if(obj.event === 'unbind'){
                layer.confirm('确定要删除吗?', function(index){
                var params = {
                    id : data.id
                };
                reqAjaxAsync(server.delAppUserRecommendRelation, JSON.stringify(params)).then(function(resp){
                	if (resp) {
	                    if (resp.code == 1) {
	                    	layer.msg(resp.msg, {
								icon: 1,
								shade: [0.1, '#fff'],
								offset: '50%',
								anim: 5
							});
	                        obj.del();
	                        tableInit();
	                    }
	                    else if (resp.code == 9) {
	                        layer.msg(resp.msg, {
								icon: 2,
								shade: [0.1, '#fff'],
								offset: '50%',
								anim: 5
							});
	                    }
	                    else {
	                    	layer.msg('服务访问失败', {
								icon: 2,
								shade: [0.1, '#fff'],
								offset: '50%',
								anim: 5
							});
	                    }
                	}
                	layer.close(index);
                });
			});
		}
	});

	//当前表格渲染
	function tableInit() {
		var index = sessionStorage.getItem('_index') ? sessionStorage.getItem('_index') : $('.select-search-div.act').attr('data-status');
		$('.select-search-div').eq(index).addClass('act').siblings().removeClass('act');
		var _obj = _tableInit('merchantTable', [
				[{
					field: 'eq',
					title: '序号'
				}, {
					field: 'username',
					title: 'APP用户昵称'
				}, {
					field: 'phone',
					title: '手机号码'
				}, {
					field: 'addUserName',
					title: '操作人'
				}, {
					field: 'addTime',
					title: '操作时间'
				},{
					title: '操作',
					fixed: 'right',
					align: 'left',
					toolbar: '#barDemo'
				}]
			],
			pageCallback, 'layTablePage'
		)
}
tableInit();

//LAYER表格渲染
	function layerTableInit() {
		var _obj = _tableInit('merchantTableLayer', [
				[{
					field: 'eq',
					title: '序号'
				}, {
					field: 'username',
					title: 'APP用户昵称',
					event:'changetable'
				}, {
					field: 'phone',
					title: '手机号码',
					event:'changetable'
				},{
					field: 'usersex',
					title: '性别',
					event:'changetable'
				}, {
					field: 'createtime',
					title: '注册时间',
					event:'changetable'
				}, {
					field: '_isrealname',
					title: '是否实名',
					event:'changetable'
				}]
			],
			pageCallbackLayer, 'layTablePageLayer'
		)
}
tableInit();

//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			phone: $.trim($('#merchantPhone').val()) || "",
			code: $('.select-search-div.act').attr('data-num')
		};
		reqAjaxAsync(server.merchantUpgradeConfirmList, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
			});
			return callback(res);
		})
	}
	
	
	//pageCallback
	function pageCallbackLayer(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			phone: $.trim($('#merchantPhoneLayer').val()) || "",
			username: ""
		};
		reqAjaxAsync(server.queryAppUserUnboundedRecommendPage, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				if(item.isrealname == 0){
					$(item).prop('_isrealname','未实名')
				}else if(item.isrealname == 2){
					$(item).prop('_isrealname','已实名')
				}
			});
			return callback(res);
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
		height: 'full',
		cols: cols,
		page: false,
		even: true,
		limit: 15,
		cellMinWidth:80,
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