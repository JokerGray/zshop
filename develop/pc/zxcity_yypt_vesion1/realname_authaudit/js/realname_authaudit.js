(function($) {
	const  FEEDBACKLIST = 'user/getAuditAppUserPageList', //查询
		   GETAUDITDETAILS = 'user/getAuditDetails ',//查看详情
		   DELETEREPLY = 'operations/deleteReply',//删除
		   ROLEPERMISSIONPAGE = 'operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
		   CHECKSTATUS = ' operations/modifyRolePermissionCheckStatus', //修改角色权限是否可选状态
		   SAVEAUDITINFO = 'user/saveAuditInfo'

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	
	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker2 .datepicker").hide();
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker1 .datepicker").hide();
	});
	
	//搜索
	$('#toolSearch').on('click', function() {
		var type = $('.search-li.act').attr('data-type');
		init_obj(type);
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#userCode").val('');
		$("#nickName").val('');
		$("#jurisdiction-begin").val("");
		$("#jurisdiction-end").val("");
		$("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");		
		var type = $('.search-li.act').attr('data-type');
		if(type==1){
			$('#choseTime').html('提交时间')
		}else{
			$('#choseTime').html('审核时间')
		};
		init_obj(type);
	})

	function init_obj(type) {
		if(type==1){
			var _obj = tableInit('demo', [
				[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '账号',
					align: 'left',
					field: 'usercode',
					width: 200
				}, {
					title: '昵称',
					align: 'left',
					field: 'username',
					width: 200
				}, {
					title: '性别',
					align: 'left',
					field: 'usersex',
					width: 100
				}, {
					title: '锁定状态',
					align: 'left',
					field: '_locked',
					width: 200
				}, {
					title: '用户性质',
					align: 'left',
					field: '_ismerchant',
					width: 200
				}, {
					title:'提交时间',
					align:'left',
					field:'submissiontime',
					width:200
				},{
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],
			pageCallback
		)
		}else if(type==2){
			var _obj = tableInit('demo', [
				[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '账号',
					align: 'left',
					field: 'usercode',
					width: 200
				}, {
					title: '昵称',
					align: 'left',
					field: 'username',
					width: 200
				}, {
					title: '性别',
					align: 'left',
					field: 'usersex',
					width: 100
				}, {
					title: '锁定状态',
					align: 'left',
					field: '_locked',
					width: 200
				}, {
					title: '用户性质',
					align: 'left',
					field: '_ismerchant',
					width: 200
				}, {
					title:'审核时间',
					align:'left',
					field:'audittime',
					width:200
				},{
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],
			pageCallback
		)
		}
		
	};

	initForAct();

	function initForAct() {
		var type = $('.search-li.act').attr('data-type');
		if(type==1){
			$('#choseTime').html('提交时间')
		}else{
			$('#choseTime').html('审核时间')
		};
		init_obj(type);
	}

	//TAB切换
	$('.search-li').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		var type = $('.search-li.act').attr('data-type');
		if(type==1){
			$('#choseTime').html('提交时间')
		}else{
			$('#choseTime').html('审核时间')
		};
		initForAct();
	})

	//pageCallback回调
	function pageCallback(index, limit, userId, replyStatus, feedbackType, moreField1,startDate,endDate) {
		var aLi = $('.search-li.act')
		var type = $(aLi).attr('data-type');
		var userCode = $('#userCode').val();
		var userCode = $.trim(userCode)
		var nickName = $('#nickName').val();
		var nickName = $.trim(nickName);
		var	startDate=$("#jurisdiction-begin").val() || "";
		var	endDate=$("#jurisdiction-end").val()|| "";
		if(endDate<startDate){
			layer.msg('起始时间不能大于截止时间哦');
			return
		};		
		if(userCode == undefined) {
			userCode = ''
		}
		if(nickName == undefined) {
			nickName = ''
		}
		return getData(FEEDBACKLIST, "{'page':" + index + ",'rows':" + limit + ",'type':'" + type + "','userCode':'" + userCode + "','nickName':'" + nickName + "','startDate':'" + startDate + "','endDate':'" + endDate + "'}");
	}
	
	table.on('tool(demo)', function(obj) {
			var data = obj.data;
			//查看
			if(obj.event === 'detail') {
				layer.open({
					title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['1000px', '700px'],
					end: function() {
						$('#demo111').hide();
						$('#usercode').val('').attr('disabled',true);
						$('#username').val('').attr('disabled',true);
						$('#city_name').val('').attr('disabled',true);
						$('#userbirth').val('').attr('disabled',true);
						$('#usersex').val('').attr('disabled',true);
						$('#realname').val('').attr('disabled',true);
						$('#identificationno').val('').attr('disabled',true);
						$('#mail').val('').attr('disabled',true);
						$('#card_hold_photo').attr('src','').attr('disabled',true);
						$('#audit_opinion').val('').attr('disabled',true);
					},
					success: function(layero, index) {
						//图片加载错误处理
						$('img').error(function(){
						    $(this).attr('src', '../common/image/placeholder.png');
						});
						var user_id = data.user_id;
						var paramInfo = "{'appUserId':'" + user_id + "'}";
	                	var res =reqAjax(GETAUDITDETAILS,paramInfo);
	                	var reData = res.data;
	                	$('#timeType').html("审核时间：");
						$('#submitTime').val(reData.audit_time);
	                	$('#usercode').val(reData.usercode).attr('disabled',true);
						$('#username').val(reData.username).attr('disabled',true);
						$('#city_name').val(reData.city_name).attr('disabled',true);
						$('#userbirth').val(reData.userbirth).attr('disabled',true);
						$('#usersex').val(reData.usersex).attr('disabled',true);;
						$('#realname').val(reData.realname).attr('disabled',true);
						$('#identificationno').val(reData.identificationno).attr('disabled',true);
						$('#mail').val(reData.mail).attr('disabled',true);
						$('#card_hold_photo').attr('src',reData.card_hold_photo).attr('disabled',true);
						$('#audit_opinion').val(reData.audit_opinion).attr('disabled',true);
						form.render()
					}
				});
				
			}  else if(obj.event === 'change') {
				var user_id = data.user_id;
				var paramInfo = "{'appUserId':'" + user_id + "'}";
	        	var res =reqAjax(GETAUDITDETAILS,paramInfo);
	        	var reData = res.data;
				layer.open({
					title: ['实名认证信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					btn: ['认证通过', '不通过'],
					content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['1000px', '700px'],
					end: function() {
						$('#demo111').hide();
						$('#usercode').val('').attr('disabled',true);
						$('#username').val('').attr('disabled',true);
						$('#city_name').val('').attr('disabled',true);
						$('#userbirth').val('').attr('disabled',true);
						$('#usersex').val('').attr('disabled',true);
						$('#realname').val('').attr('disabled',true);
						$('#identificationno').val('').attr('disabled',true);
						$('#mail').val('').attr('disabled',true);
						$('#card_hold_photo').attr('src','').attr('disabled',true);
						$('#audit_opinion').val('').attr('disabled',true);
	
					},
					success: function(layero, index) {
						//图片加载错误处理
						$('img').error(function(){
						    $(this).attr('src', '../common/image/placeholder.png');
						});
						$('div.layui-layer-page').addClass('layui-form')
						$('a.layui-layer-btn0').attr('lay-submit', '');
						$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
	                	$('#usercode').val(reData.usercode);
						$('#username').val(reData.username);
						$('#city_name').val(reData.city_name);
						$('#userbirth').val(reData.userbirth);
						$('#usersex').val(reData.usersex);
						$('#realname').val(reData.realname);
						$('#timeType').html("提交时间：");
						$('#submitTime').val(reData.audit_time);
						$('#identificationno').val(reData.identificationno);
						$('#mail').val(reData.mail);
						$('#card_hold_photo').attr('src',reData.card_hold_photo)
						$('#audit_opinion').val(reData.audit_opinion).attr('disabled',false);
						form.render()
					},
					btn1: function(index, layero) {
						var sysUserId = reData.user_id;
						var status = 90;
						var auditId = reData.audit_id;
						var opinion = $('#audit_opinion').val();
						var updateTime = new Date().toLocaleString( )
						var auditor = yyCache.get('username');
						var paramInfo = "{'sysUserId':'" + sysUserId + "','status':'" + status + "','auditId':'" + auditId + "','opinion':'" + opinion + "','updateTime':'" + updateTime + "','auditor':'" + auditor + "'}";
	        			var res =reqAjax(SAVEAUDITINFO,paramInfo);
	        			layer.msg('操作成功');
	        			layer.close(index);
	        			initForAct();
	        			$('#demo111').hide();
					},
					btn2: function(index, layero) {
						var sysUserId = reData.user_id;
						var status = 91;
						var auditId = reData.audit_id;
						var opinion = $('#audit_opinion').val();
						var updateTime = new Date().toLocaleString( )
						var auditor = yyCache.get('username');
						var paramInfo = "{'sysUserId':'" + sysUserId + "','status':'" + status + "','auditId':'" + auditId + "','opinion':'" + opinion + "','updateTime':'" + updateTime + "','auditor':'" + auditor + "'}";
	        			var res =reqAjax(SAVEAUDITINFO,paramInfo);
	        			layer.msg('操作成功');
	        			layer.close(index);
	        			initForAct();
	        			$('#demo111').hide();
					}
				});
			}
		});



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
		var type = $('.search-li.act').attr('data-type');
		if(type==1){
			$('#choseTime').html('提交时间')
		}else{
			$('#choseTime').html('审核时间')
		};
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
			height: 'full-300',
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
			limits: [15, 30],
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
		var _locked, _ismerchant;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.ismerchant == 0) {
				_ismerchant = '平台用户'
			} else {
				_ismerchant = '商户'
			}
			if(item.locked == 1) {
				_locked = '锁定'
			} else {
				_locked = '启用'
			}
			$(item).attr('_ismerchant', _ismerchant)
			$(item).attr('_locked', _locked)
		});
		return res;
	}

})(jQuery)