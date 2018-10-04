layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;
		
		
    var roleId = sessionStorage.getItem("roleIds") || "";
    var userNo = sessionStorage.getItem("userno") || "";
    var userId = sessionStorage.getItem("userId") || "";
    var userName = sessionStorage.getItem('username') || "";

	//接口
	var server = {
		merchantUpgradeConfirmList : 'operations/chargeMerchantUpgradeConfirmList', //(查询列表)
        approveMerchantUpgrade : 'operations/approveMerchantRecharge'//(确认)
	}
	


	//日期控件
	var startDate = laydate.render({
		elem: '#startDate',
		min:"1970-1-1",//设置min默认最小值  
		done: function(value,dates) {
			$('.startDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				endDate.config.min ={ 
	                 year:1970,   
	                 month:1, //关键  
	                 date: 1,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				endDate.config.min ={ 
	                 year:dates.year,   
	                 month:dates.month-1, //关键  
	                 date: dates.date,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}
		}
	});

	var endDate = laydate.render({
		elem: '#endDate',
		max:"2099-12-31",//设置一个默认最大值 
		done: function(value,dates) {
			$('.endDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				startDate.config.max ={ 
	                 year:2099,   
	                 month:12, //关键  
	                 date: 31,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				startDate.config.max={  
		        year:dates.year,   
	                month:dates.month-1,//关键   
	                date: dates.date,   
	                hours: 0,   
	                minutes: 0,   
	                seconds : 0  
		       }   
			}
		}
	});

	//状态切换方法
	function stateChange() {
		var status = $(this).attr('data-status');
		sessionStorage.setItem('status', status);
		$(this).addClass('act').siblings().removeClass('act');
		tableInit();
	}

	$('.select-search-div').on('click', stateChange);
	
	
	
	form.on('select(provinceSelector2)', function(data) {
		var selectOption = ''
		var value = data.value;
		var param = "{'parentcode':" + value + "}";
		reqAjaxAsync(serverr.provice, param).then(function(res) {
				var data = res.data;
				$.each(data, function(i, item) {
					selectOption += "<option value=" + item.code + ">" + item.areaname + "</option>"
				})
				$('#citySelector2').html(selectOption);
			form.render('select');
   		})
	});


	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
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

	



	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			phone:$.trim($('#merchantPhone').val()) || "",
			startDate: $('.startDate').eq(0).attr('data-date') || "",
			endDate: $('.endDate').eq(0).attr('data-date') || "",
			status: $('.select-search-div.act').attr('data-status')
		};
		reqAjaxAsync(server.merchantUpgradeConfirmList, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
				if(item.STATUS==1){
                	$(item).attr('statuname', '待确认');
	            }else if(item.STATUS==3){
	                $(item).attr('statuname', '已确认');
	            };
			});
			return callback(res);
		})
	}
	
	
	
	//未审核相关处理
    table.on('tool(merchantTable)', function(obj) {
        var data = obj.data;
        var oldId = data.id;
        console.log(data)
        //查看
        if(obj.event === 'view'){
            //确认
            layer.confirm(
                "是否确认?",
                {icon: 3, title:'提示'},
                function(index,layero){
                    var paramDel = {
                        id:oldId,// 主键
                        userId:userId,// 操作人ID
                        userName:userName// 操作人名称
                    };
                    reqAjaxAsync(server.approveMerchantUpgrade,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg('商户续费成功', {
								icon: 1,
								shade: [0.1, '#fff'],
								offset: '50%',
								anim: 5
							});
                            layer.close(index);
                            tableInit();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }
    });

	//当前表格渲染
	function tableInit() {
		var status = sessionStorage.getItem('status') ? sessionStorage.getItem('status') : $('.select-search-div.act').attr('data-status');
		var eqIndex = "";
		if(status == 1){
			eqIndex = 0
		}else{
			eqIndex = 1
		}
		$('.select-search-div').eq(eqIndex).addClass('act').siblings().removeClass('act');
			if(status == 1){
			var _obj = _tableInit('merchantTable', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        templet: '#titleTpl'
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'ORGNAME'
                    }, {
                        title: '商户账号',
                        align: 'left',
                        field: 'ACCOUNT'
                    }, {
                        title: '联系电话',
                        align: 'left',
                        field: 'PHONE'
                    },  {
                        title: '状态',
                        align: 'left',
                        field: 'statuname'
                    },  {
                        title: '申请时间',
                        align: 'left',
                        field: 'APPLYTIME'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo'
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
                        templet: '#titleTpl'
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'ORGNAME'
                    }, {
                        title: '商户账号',
                        align: 'left',
                        field: 'ACCOUNT'
                    }, {
                        title: '联系电话',
                        align: 'left',
                        field: 'PHONE'
                    },  {
                        title: '状态',
                        align: 'left',
                        field: 'statuname'
                    },  {
                        title: '申请时间',
                        align: 'left',
                        field: 'APPLYTIME'
                    }]
                ],
				pageCallback, 'layTablePage'
			)
		}
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
				$('body').on('click','.layui-table-body table tr',function(){
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