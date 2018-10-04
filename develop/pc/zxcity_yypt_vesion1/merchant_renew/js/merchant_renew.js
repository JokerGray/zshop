(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno");
	var userId = yyCache.get("userId");
	var userName = yyCache.get('username');
	var pid = '';
	var USER_URL = {
		RESOURLIST: 'operations/chargeMerchantUpgradeConfirmList', //(查询列表)
		LOOKDETAIL: 'operations/approveMerchantRecharge' //(确认)
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	$('#merchantTable').on('click', '.layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})
	 //日期选择
    $('#datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        var endTime =  $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time',startTime);
        $("#datetimepicker2 .datepicker").hide();
    });

    $('#datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        var endTime =  $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time',startTime);
        $("#datetimepicker1 .datepicker").hide();
    });
	
	
	//状态切换方法
	function stateChange() {
		var status = $(this).attr('data-num');
		$(this).addClass('active').siblings().removeClass('active');
		tableInit();
	}
	$('.tab-title li').on('click', stateChange);

	//当前表格渲染
	function tableInit() {
		var status = $('.num-li.active').attr('data-num');
		if(status == 1){
				var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80,
						templet: '#titleTpl'
					}, {
						title: '商户名称',
						align: 'left',
						field: 'ORGNAME',
						width: 100
					}, {
						title: '商户账号',
						align: 'left',
						field: 'ACCOUNT',
						width: 200
					}, {
						title: '联系电话',
						align: 'left',
						field: 'PHONE',
						width: 200
					}, {
						title: '状态',
						align: 'left',
						field: 'status',
						width: 100
					}, {
						title: '提交时间',
						align: 'left',
						field: 'APPLYTIME',
						width: 200
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar:'#barDemo',
						width: 70
					}]
				],
				pageCallback, 'layTablePage'
			)
		}else{
				var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80,
						templet: '#titleTpl'
					}, {
						title: '商户名称',
						align: 'left',
						field: 'ORGNAME',
						width: 100
					}, {
						title: '商户账号',
						align: 'left',
						field: 'ACCOUNT',
						width: 200
					}, {
						title: '联系电话',
						align: 'left',
						field: 'PHONE',
						width: 200
					}, {
						title: '状态',
						align: 'left',
						field: 'status',
						width: 100
					}, {
						title: '提交时间',
						align: 'left',
						field: 'APPLYTIME',
						width: 200
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
		
	}
	tableInit();
	
	
	
	//未审核相关处理
    table.on('tool(merchantTable)', function(obj) {
        var data = obj.data;
        var oldId = data.id;
        if(obj.event === 'change'){
            //确认
            layer.confirm(
                "是否确认?",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = {
                        id:oldId,// 主键
                        userId:userId,// 操作人ID
                        userName:userName// 操作人名称
                    };
                    reqAjaxAsync(USER_URL.LOOKDETAIL,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("确认续费");
                            layer.close(index);
                            tableInit();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }
    });
	
	
	
	

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			phone: $.trim($('#merchantName').val()) || "",
			startDate:$("#jurisdiction-begin").val() || "",
			endDate: $("#jurisdiction-end").val()|| "",
			status: $('.tab-title li.active').attr('data-num')
		};
		reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
				if(item.STATUS == 1){
					$(item).prop('status','待确认')
				}else{
					$(item).prop('status','已确认')
				}
			});
			return callback(res);
		})
	}

	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	});
	$('body').on('click','.layui-table-body table tr',function(){
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
	})
	
	//搜索
	$('#toolSearch').click(function(){
		tableInit()
	})


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
			height: 'full-338',
			cols: cols,
			page: false,
			even: false,
			skin: 'row',
			done: function(res, curr, count) {
				//				var data = res.data;
				//				var _id = data[0].id;
				//				var _isAdminRole = data[0].isAdminRole;
				//				sessionStorage.setItem('_id', _id);
				//				sessionStorage.setItem('_isAdminRole', _isAdminRole);
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
				limits: [15, 30],
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

	//重置
	$("#toolRelize").click(function() {
		$("#merchantName").val("");
		$("#jurisdiction-begin").val("");
		$("#jurisdiction-end").val("");
		$("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");
	});

	//刷新
	$("#refrshbtn").click(function() {
		location.reload();
	});

})(jQuery);