(function($) {
	const GETAPPFEEDBACK = 'operations/getAppFeedBackPage', //APP端查询
		GETBACKSTAGEFEEDBACK = 'operations/getBackstageFeedBackPage', //商户后台查询
		ADDREPLY = 'operations/addOrUpdateFeedBackReply', //修改
		UPDATEREPLY = 'operations/updateReplyIndex',//查看
		CHECKSTATUS = 'operations/deleteReply'//删除

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	

	//搜索
	$('body').on('click','#toolSearch',function(){
		init_obj();
	})
	//重置功能
	$('body').on('click','#toolRelize',function(){
		$("#nickName").val('');
		$("#phone").val('');
		$("#orgName").val('');
		$("#email").val('');
		$('#datetimepicker1').attr('data-time','');
		$('#datetimepicker2').attr('data-time','');
		$("#jurisdiction-begin").val('');
		$("#jurisdiction-end").val('');
		init_obj();
	})


	function init_obj() {
		var aVi = $('.vesion.act');
		var aSe = $('.search-li.act');
		var moreField1 = $(aVi).attr('data-morefield');
		var replystatus = $(aSe).attr('data-replystatus');
		if(moreField1 == 1) { //后台
			if(replystatus == 0){//后台未回复
					var _obj = tableInit('demo', [
						[{
							title: '序号',
							/*sort: true,*/
							align: 'left',
							field: 'eq',
							width: 80
						}, {
							title: '问题类型',
							sort: true,
							/*sort: true,*/
							align: 'left',
							field: '_feedbackType',
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 150
						}, {
							title: '用户qq',
							/*sort: true,*/
							align: 'left',
							field: 'qqCode',
							width: 150
						}, {
							title: '用户邮箱',
							/*sort: true,*/
							align: 'left',
							field: 'email',
							width: 150
						},{
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
							width: 200
						}, {
							title: '操作',
							align: 'left',
							toolbar: '#barDemo',
							width: 600
						}]
					],
					pageCallback
				)
			}else{//后台已回复
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
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 150
						}, {
							title: '用户qq',
							/*sort: true,*/
							align: 'left',
							field: 'qqCode',
							width: 150
						}, {
							title: '用户邮箱',
							/*sort: true,*/
							align: 'left',
							field: 'email',
							width: 150
						},{
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						},{
							title: '提交时间',
							/*sort: true,*/
							align: 'left',
							field: '_scSysFeedBackReply',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
							width: 200
						}, {
							title: '操作',
							align: 'left',
							toolbar: '#barDemo',
							width: 600
						}]
					],
					pageCallback
				)
			}
			
		}else if(moreField1==5){ //官网
			if(replystatus == 0){//未回复
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
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 200
						}, {
							title: '联系方式',
							/*sort: true,*/
							align: 'left',
							field: '_phone',
							width: 200
						},{
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
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
			}else {//APP已回复
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
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 200
						}, {
							title: '联系方式',
							/*sort: true,*/
							align: 'left',
							field: '_phone',
							width: 200
						}, {
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						}, {
							title: '提交时间',
							/*sort: true,*/
							align: 'left',
							field: '_scSysFeedBackReply',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
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
		}else {
			if(replystatus == 0){//APP未回复
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
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 200
						}, {
							title: '联系方式',
							/*sort: true,*/
							align: 'left',
							field: '_phone',
							width: 200
						},{
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
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
			}else{//APP已回复
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
							width: 100
						}, {
							title: '用户昵称',
							/*sort: true,*/
							align: 'left',
							field: 'nickName',
							width: 200
						}, {
							title: '联系方式',
							/*sort: true,*/
							align: 'left',
							field: '_phone',
							width: 200
						},{
							title: '反馈内容',
							/*sort: true,*/
							align: 'left',
							field: 'problemsSuggestion',
							width: 200
						},{
							title: '提交时间',
							/*sort: true,*/
							align: 'left',
							field: '_scSysFeedBackReply',
							width: 200
						}, {
							title: '反馈时间',
							/*sort: true,*/
							align: 'left',
							field: 'createTime',
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
			
		}

	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}

	$('.vesion').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		changeSearch();
		initForAct();
	})

	//TAB切换
	$('.search-li').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		initForAct();
	})
	
	
	changeSearch();
	//html方法
	function changeSearch(){
		
		var moreField1 = $('.vesion.act').attr('data-morefield')
		var sHtml1=`<div class="input-group">
			<span class="pull-left">商户昵称:</span>
			<input type="text" class="form-control media-input" placeholder="请输入商户昵称" id="orgName" maxlength="18">
		</div>
		<div class="input-group">
			<span class="pull-left">email:</span>
			<input type="text" class="form-control media-input" placeholder="请输入email" id="email" maxlength="18">
		</div>
		<div class="input-group">
			<span class="pull-left">手机号:</span>
			<input type="text" class="form-control media-input" placeholder="请输入手机号" id="phone" maxlength="18">
		</div>
		<div class="input-group lasttime input-medium date-picker" data-date-format="yyyy-mm-dd">
        <div class="input-group">
            <span  class="jurisdiction-label pull-left" for="jurisdiction-begin">开始时间：</span>
            <div class='date form-control' id='datetimepicker1'>
                <input name="dtBegin" type="text"  id="jurisdiction-begin" placeholder="-请选择-" >
                <span class="glyphicon glyphicon-calendar"></span>
            </div>
        </div>
	        <div class="input-group">
	            <span class="jurisdiction-label pull-left" for="jurisdiction-end">至 </span>
	            <div class='date form-control' id='datetimepicker2'>
	                <input name="dtEnd" type="text"  id="jurisdiction-end" placeholder="-请选择-" >
	                <span class="glyphicon glyphicon-calendar"></span>
	            </div>
	        </div>
	    </div>
	    <div class="input-group">
			<button class="layui-btn layui-btn-small layui-btn-normal" id="toolSearch">
				搜索
			</button>
			<button class="layui-btn layui-btn-small layui-btn-normal" id="toolRelize">
				重置
			</button>
		</div>`
		var sHtml2=`<div class="input-group">
			<span class="pull-left">用户昵称:</span>
			<input type="text" class="form-control media-input" placeholder="请输入用户昵称" id="nickName" maxlength="18">
		</div>
		<div class="input-group">
			<span class="pull-left">手机号:</span>
			<input type="text" class="form-control media-input" placeholder="请输入手机号" id="phone" maxlength="18">
		</div>
		<div class="input-group lasttime input-medium date-picker" data-date-format="yyyy-mm-dd">
        <div class="input-group">
            <span  class="jurisdiction-label pull-left" for="jurisdiction-begin">开始时间：</span>
            <div class='date form-control' id='datetimepicker1'>
                <input name="dtBegin" type="text"  id="jurisdiction-begin" placeholder="-请选择-" >
                <span class="glyphicon glyphicon-calendar"></span>
            </div>
        </div>
	        <div class="input-group">
	            <span class="jurisdiction-label pull-left" for="jurisdiction-end">至 </span>
	            <div class='date form-control' id='datetimepicker2'>
	                <input name="dtEnd" type="text"  id="jurisdiction-end" placeholder="-请选择-" >
	                <span class="glyphicon glyphicon-calendar"></span>
	            </div>
	        </div>
	    </div>
	    <div class="input-group">
			<button class="layui-btn layui-btn-small layui-btn-normal" id="toolSearch">
				搜索
			</button>
			<button class="layui-btn layui-btn-small layui-btn-normal" id="toolRelize">
				重置
			</button>
		</div>`
		
		if(moreField1 == 1){//后台
			$('#search-tool').html(sHtml1);
		}else{
			$('#search-tool').html(sHtml2);
		}
		//日期选择
		$('#datetimepicker1 input').datepicker({
			format: 'yyyy-mm-dd',
			autoclose: true,
			language: "zh-CN"
		}).on('changeDate', function(ev) {
			var startTime = $('#jurisdiction-begin').val();
			$(this).parent().attr('data-time', startTime);
			$("#datetimepicker2 .datepicker").hide();
		});
	
		$('#datetimepicker2 input').datepicker({
			format: 'yyyy-mm-dd',
			autoclose: true,
			language: "zh-CN"
		}).on('changeDate', function(ev) {
			var startTime = $('#jurisdiction-end').val();
			$(this).parent().attr('data-time', startTime);
			$("#datetimepicker1 .datepicker").hide();
		});
	}
	
	
	
	

	//pageCallback回调
	function pageCallback(index, limit, orgName,nickName,phone,email,createTimeStart, createTimeEnd, replyStatus, moreField1) {
		
		var moreField1 = $('.vesion.act').attr('data-morefield')
		var replyStatus = $('.search-li.act').attr('data-replystatus');
		
		var orgName = $('#orgName').val();
		var nickName = $('#nickName').val();
		var phone = $('#phone').val();
		var email = $('#email').val();

		var createTimeStart = $('#datetimepicker1').attr('data-time');
		var createTimeEnd = $('#datetimepicker2').attr('data-time');
		
		if(orgName == undefined) {
				orgName = ''
		}if(nickName == undefined) {
				nickName = ''
		}if(phone == undefined) {
				phone = ''
		}if(email == undefined) {
				email = ''
		}
		if(createTimeStart == undefined) {
			createTimeStart = ''
		}
		if(createTimeEnd == undefined) {
			createTimeEnd = ''
		}

		if(moreField1 == 1) {//后台
			return getData(GETBACKSTAGEFEEDBACK, "{'page':" + index + ",'rows':" + limit + ",'orgName':'" + orgName + "','phone':'" + phone + "','email':'" + email + "','createTimeStart':'" + createTimeStart + "','createTimeEnd':'" + createTimeEnd + "','replyStatus':'" + replyStatus + "','moreField1':'" + moreField1 + "'}");
		}else if(moreField1==5){ //官网
			return getData(GETAPPFEEDBACK, "{'page':" + index + ",'rows':" + limit + ",'nickName':'" + nickName + "','phone':'" + phone + "','createTimeStart':'" + createTimeStart + "','createTimeEnd':'" + createTimeEnd + "','replyStatus':'" + replyStatus + "','moreField1':'" + moreField1 + "'}");
		}else{
			return getData(GETAPPFEEDBACK, "{'page':" + index + ",'rows':" + limit + ",'nickName':'" + nickName + "','phone':'" + phone + "','createTimeStart':'" + createTimeStart + "','createTimeEnd':'" + createTimeEnd + "','replyStatus':'" + replyStatus + "','moreField1':'" + moreField1 + "'}");
		}

	}

	table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			
			layer.open({
				title: ['查看回复', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '600px'],
				end: function() {
					$('#demo111').hide();
					$('#reply').val('').attr('disabled', false)
					$("div.holder").show();
				},
				success: function(layero, index) {
					var e2 = {
								id: data.id
							}
					e2 = JSON.stringify(e2);
					var res = reqAjax(UPDATEREPLY, e2);
					$("div.holder").hide();
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled', '')
					$('#reply').val(res.data.reply).attr('disabled', '')
					form.render()
				},
				yes: function(index, layero) {

				}
			});
			
		} else if(obj.event === 'change') {
			console.log(data)
			layer.open({
				title: ['回复', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['确定', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '600px'],
				end: function() {
					$('#demo111').hide();
					$('#reply').val('');

				},
				success: function(layero, index) {
					$("div.holder").hide();
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled', '')
					form.render()
				},
				yes: function(index, layero) {
							var questionId = data.id;
							var userId = yyCache.get('userno');
							var userName = yyCache.get('username');
							var reply = $('#reply').val();
							var e2 = {
								questionId: Number(questionId),
								reply: reply,
								replyStatus: 1,
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
			height: 'full-338',
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
		var _feedbackType, _moreField1,_scSysFeedBackReply;
		$.each(data, function(i, item) {
			var scSysUser=item.scSysUser||"";
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
			if(item.scSysFeedBackReply){
				$(item).attr('_scSysFeedBackReply', item.scSysFeedBackReply.replyTime)
			}
			$(item).attr('_feedbackType', _feedbackType)
			$(item).attr('_moreField1', _moreField1)
			if(scSysUser==""){
				$(item).attr('_phone',"")
			}else{
				$(item).attr('_phone',scSysUser.phone)
			}

		});

		return res;
	}

})(jQuery)