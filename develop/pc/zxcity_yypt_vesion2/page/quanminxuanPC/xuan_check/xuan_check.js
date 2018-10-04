layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function () {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || "";
	//设置默认值
	var USERID = 121;
	if (window.location.host == 'managernew.izxcs.com') {
		USERID = 1706;
	}
	//请求URL
	var API_URL = {
		SEARCH_CODE: "dazzle/searchBestDazzleIdListByKeyWords",  //根据关键字模糊查询
		EDIT_LIST: "dazzle/updateAuditTypeById"                  //修改审核类型
	};
	var rows = 10;     //页显示数量
	var paramKeys = ""; // 
	var pageno = 1;
	 
	form.render('radio');
	//第一个实例   limit每页显示条数  limits 每页条数默认项
	getTable(paramKeys, pageno);
	function getTable(paramKeys, pageno) {
		//第一个实例
		var tableINs = table.render({
			id: 'quanminxuan',
			elem: '#quanminxuan',
			even: true,
			cellMinWidth: 80,
			page: false,
			skin: 'row',
			cols: [[ //表头
				{ type: 'numbers', title: '序号', align: 'left', width: '60', templet: "#indexTpl" },
				{ field: 'dazzleId', title: '编号', align: 'left', width: '80' },
				{ field: 'dazzleType', title: '类型', align: 'left', width: '140', templet: "#dazzleTypeTpl" },
				{ field: 'labelName', title: '标签', align: 'left', width: '80', templet: "#labelNameTpl" },
				{ field: 'coverUrl', title: '封面地址', align: 'left', width: '120', style: 'height:110px', templet: "#imgTpl" },
				{ field: 'videoUrl', title: '视频地址', align: 'left', width: '300' },
				{ field: 'name', title: '名称', align: 'left', width: '160' },
				{ field: 'releaseTime', title: '发布时间', align: 'left', width: '160' },
				{ field: 'modifyTime', title: '精选时间', align: 'left', width: '160' },
				{ title: '操作', fixed: 'right', width: 230, align: 'left', style: 'height:110px', toolbar: '#barDemo' }
			]],
			done: function (res, curr, count) {
				$('body').on('click', '.layui-table-body table tr', function () {
					$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
				})
			}
		});

		var res = pageCallback(paramKeys, pageno);
		if (res) {
			// console.log(res)
			if (res.code == 1) {
				tableINs.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//分页
		layui.use('laypage');
		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			groups: '4',
			limit: rows,//每页条数
			limits: [5, 8, 10]
		}
		//分页渲染
		page_options.jump = function (obj, first) {
			if (!first) {
				rows = obj.limit;
				var resTwo = pageCallback(paramKeys, obj.curr);
				 
				if (resTwo && resTwo.code == 1)
				
					tableINs.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}
		//处理 工具栏 固定右边后 高度不一致问题
		var tr = $('.layui-table-box .layui-table-main tbody tr');
		tr.each(function (index, item) {
			var height = $(item).css('height');
			$('.layui-table-box .layui-table-fixed .layui-table-body tr').eq(index).css('height', height);
		});
		layui.laypage.render(page_options);

	}
	handelEvent();
	//搜索
	$("#search-btn").on('click', function (){
		paramKeys = $("#sercahKey").val();
		// console.log( paramKeys );
		getTable(paramKeys,pageno);
	});
	//获取内容方法
	function pageCallback(paramKeys, pagerows) {
		var param = {
			paramKeys: paramKeys,
			userId: USERID,
			pagination: {
				page: pagerows,
				rows: rows
			}
		}
		var res = reqAjax(API_URL.SEARCH_CODE, JSON.stringify(param));
		if (res.code == 1) {
			return res;
		}
	}
	function handelEvent() {
		//监听工具条
		table.on('tool(quanminxuan)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
			var tr = obj.tr; //获得当前行 tr 的DOM对象
			var dazzleId = data.dazzleId;
			var videoUrl = data.videoUrl;
			var params = {};
			if (layEvent === 'detail') { //查看
				//do somehing
			} else if (layEvent === 'del' || layEvent === 'delete') { //删除
				var param = {
					dazzleId: dazzleId,
					dazzleState: "-1", //状态:0草稿，1发布,-1删除
					userId: USERID
				}
				layer.confirm('真的删除该角色吗？', function (index) {
					//异步请求
					var res = reqAjax(API_URL.EDIT_LIST, JSON.stringify(param));
					if (res.code == 1) {
						obj.del();
						layer.close(index);
						getTable(paramKeys, pageno);
					} else {
						layer.msg(res.msg);
					}
				});
			} else if (layEvent === 'change') { //编辑
				var index = layer.open({
					type: 1,
					anim: 5,
					area: ['560px', '590px'],
					shadeClose: true, //点击遮罩关闭
					shade: 0.6,
					btn: ['确定','取消'],
					title: ['修改审核', 'font-size:12px;background-color:#424651;color:#fff'],
					cancel: function(index, layero){ 
						layer.close(index);
						return false; 
					},  
					success: function(){
						$("#video").attr("src", videoUrl);
						var auditType = $("input[name='audittype']:checked").val();
						param = {
							dazzleId: data.dazzleId,
							auditType: auditType,
							userId: USERID
						};
					},
					yes: function(index,layero){
						var auditType = $("input[name='audittype']:checked").val();
						var data = obj.data
						// var param = {
						// 	dazzleId: data.dazzleId,
						// 	auditType: auditType,
						// 	userId: USERID
						// }
						//异步请求
						// console.log('', param)
						var res = reqAjax(API_URL.EDIT_LIST, JSON.stringify(param));
						if (res.code == 1) {
							obj.del();
							layer.closeAll();
							getTable(paramKeys, pageno);
						} else {
							layer.msg(res.msg);
						}
					},
					btn1: function(index,layero){
						layer.close(index);
					},
					content:    							
						`<form class="layui-form"> 
							<div class="layui-form-item">
								<video id="video" width="560" height="400" autoplay="autoplay" controls -webkit-playsinline webkit-playsinline playsinline   > 
										您的浏览器不支持该视频格式                                            
								</video>  
							</div>
							<div class="layui-form-item">
								<label class="layui-form-label">审核类型:</label>
								<div class="layui-input-block">
									<input id="excellent" type="radio" name="audittype" value="1" title="精选" lay-filter="audittype">
									<input id="ordinary" type="radio" name="audittype" value="2" title="普通" lay-filter="audittype">
								</div>
							</div>
						</form>` 

						// < div class= "layui-form-item" >
						// 	<div class="layui-input-block btn-right">
						// 		<button class="layui-btn layui-layer-btn0" id="editTopic" lay-filter="formDemo">修改</button>
						// 		<button type="reset" id="cancelTopic" class="layui-btn layui-btn-primary cancels layui-layer-btn1" data-dismiss="modal">取消</button>
						// 	</div>
						// 	</div >
				});
				form.render();
				$('#video').attr('src',videoUrl);
				var auditType = obj.data.auditType;
				var query = $('input[value="' + auditType + '"]');
				// console.log(query,dazzleType,$(query));
				query.attr('checked', true);
				form.render();
				// $('#cancelTopic').on('click',function (e) {
				// 	layer.closeAll();
				// })
				//handleEdit(obj);
				 
			}
		});
	}
	function handleEdit(obj) {
		$('#editTopic').on('click',function (e) {
			var auditType = $("input[name='audittype']:checked").val();
			var data = obj.data
			var param = {
				dazzleId: data.dazzleId,
				auditType: auditType,
				userId: USERID
			}
			//异步请求
			// console.log('', param)
			var res = reqAjax(API_URL.EDIT_LIST, JSON.stringify(param));
			if(res.code == 1) {
				obj.del();
				layer.closeAll();
				getTable(paramKeys, pageno);
			}else {
				layer.msg(res.msg);
			}
		});
	}
})