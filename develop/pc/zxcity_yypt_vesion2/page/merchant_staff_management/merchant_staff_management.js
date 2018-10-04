layui.use(['form', 'layer', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
	//接口
	var serve = {
		resourlist: 'operations/findScBackUserPageList', //(查询列表)
		information: 'operations/findScBackUserInfo' ,//获取商户员工详细信息
		lock:'operations/changeScBackUserLockStatus',//锁定员工或者启用员工
		resetting :'operations/resetMerchantPassword'//密码重置
	}


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
		//查看
		if(obj.event === 'view') {
				layer.open({
				title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定'],
				type: 1,
				anim: 5,
				content: $('#addLayer'),
				area: ['1400px', '400px'],
				end: function() {
					$('#addLayer').hide();
				},
				success: function(index,layero) {
					var parms = {
						id:data.id
					};
					reqAjaxAsync(serve.information,JSON.stringify(parms)).then(function(res){
                    if(res.code==1){
                    	var row=res.data;
                    	$('#userPhone').val(row.phone);
                    	$('#userName').val(row.orgName);
                    	$('#nickName').val(row.username);
                    };
					})
				},
				yes: function(index,layero) {
					layer.close(index)
				}
			});
		}else if(obj.event==='reset'){
			var userId=data.id;
			var parm={
				id:userId
			};
			layer.confirm("确认密码重置?",{icon:0,title:"提示"},function(index){
				reqAjaxAsync(serve.resetting,JSON.stringify(parm)).then(function(res){
					if(res.code==1){
						layer.alert("已重置,默认密码为123456");
					}else{
						layer.msg(res.msg);
					}
					layer.close(index);
				});
			})
		}else if(obj.event==='lock'){
            var userId=data.id;
            var parm={
                id:userId
            };
            layer.confirm("是否锁定【"+data.phone+"】?",{icon:0,title:"提示"},function(index){
                reqAjaxAsync(serve.lock,JSON.stringify(parm)).then(function(res){
                    if(res.code==1){
                        tableInit();
                    }
                    layer.msg(res.msg);
                    layer.close(index);
                });
            })
        };
	});
	

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			phone:$.trim($('#phone').val()) || "",
			orgName:$.trim($('#name').val()) || ""

		};
		reqAjaxAsync(serve.resourlist, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				if(item.isdel==0){
					$(item).attr('del','未删除')
				}else if(item.isdel==1){
					$(item).attr('del','离职')
				}else if(item.isdel==2){
					$(item).attr('del','删除')
				};
				if(item.locked==1){
					$(item).attr('status','是')
				}else{
					$(item).attr('status','否')
				};


			});
			return callback(res);
		})
	}

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable',[
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 150
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 250
					}, {
						title: '商户名称',
						align: 'left',
						field: 'orgName',
						width: 250
					},
					{
						title: 'App用户昵称',
						align: 'left',
						field: 'username',
						width: 250
					}, {
						title: '是否锁定',
						align: 'left',
						field: 'status',
						width: 250
					}, {
						title: '是否删除',
						align: 'left',
						field: 'del',
						width: 250
					},{
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 250
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