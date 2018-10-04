(function($) {
	var page = 1;
	var rows = 15;
    var roleId = yyCache.get("roleIds");
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
	var pid = '';
	var locked = true;
	sessionStorage.removeItem('mId');
	var USER_URL = {
		MERCHANTLIST:'operations/getMerchantPageList', //(商户查询列表)
		SHOPLIST: 'operations/getShopTurnoverStatisticsList', //(店铺数据归档列表查询)
		ADD: 'operations/addOperationsMerchantTurnoverStatistics',//运营后台商户归档信息新增
		SHOPNAME:'backUser/listMerShops'//店铺名称
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	});


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


	//日期选择
	$('#datetimepicker3 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker4').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker4 .datepicker").hide();
	});

	$('#datetimepicker4 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker4').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker4 .datepicker").hide();
	});		
	
	//左侧表格
	function _tableInit(){
//			//渲染表单
		var objs = tableInit('demo', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80,
						event:'clickAble'
					}, {
						title: '商户名称',
						align: 'left',
						field: 'orgName',
						width: 150,
						event:'clickAble'
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 150,
						event:'clickAble'
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createDatetime',
						width: 250,
						event:'clickAble'
					},{
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 150					
					}
				]
			],
	
			pageCallback, 'laypageLeft', 0
		);	
	};
	_tableInit();
	
	
//  //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };
//  //pageCallback回调
    function pageCallback(index, limit) {
		var phone = $.trim($("#phone").val())||"";
		var orgName = $("#orgName").val()||"";
		var param = {
			page: index,
			rows: limit,
			phone: phone, //手机号
			orgName:orgName//商户名称
		}
		return getData(USER_URL.MERCHANTLIST, JSON.stringify(param));
    };	
	
   /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
     //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-249',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });
      //2.第一次加载
        var res = pageCallback(page, rows);
      //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        };

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
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
        };


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    };	

	//监听工具条,左侧表格
	table.on('tool(demo)', function(obj) {
			var data=obj.data;
			var merchantId=data.merchantId;
		if(obj.event==='clickAble'){
			//渲染店铺名
			
			var parm={
				merchantId:merchantId
			};
			reqAjaxAsync(USER_URL.SHOPNAME,JSON.stringify(parm)).then(function(res){
				var data=res.data;
				var mHtml='<option value="">-请选择-</option>';
				for(var i=0;i<data.length;i++){
					mHtml+='<option value="'+data[i].id+'">'+data[i].shopName+'</option>'
				}
				$('#chargeType').html(mHtml);
				form.render();
			});
			if(merchantId==null){
				return false
			}else{
				sessionStorage.setItem('mId',merchantId);
				_tableInitdetial();
			}
		
		}if(obj.event === 'change') {
			layer.open({
				title: ['归档', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['570px', '400px'],
				end: function() {
					$('#demo111').hide();
					$('#jurisdiction-begin3').val('');
					$('#jurisdiction-end4').val('');

				},
				success: function(layero, index) {
					$('#name').val(data.orgName);
					$('#creatTime').val(data.createDatetime);					
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							var startDate=$('#jurisdiction-begin3').val();
							var endDate=$('#jurisdiction-end4').val();
							if(endDate<startDate){
								layer.msg('起止时间不能大于截止时间哦');
								return;
							};
							var parm={
								startDate:startDate,
								endDate:endDate,
								merchatId:merchantId
							};
							reqAjaxAsync(USER_URL.ADD,JSON.stringify(parm)).then(function(res){
								if(res.code == 1) {
									layer.msg('归档成功');
									layer.close(index);
									_tableInitdetial()
								} else {
									layer.msg(res.msg);
								}								
							})

						}
					})

				}
			});
		}
	});
	//右侧表格
	function _tableInitdetial(){
			//渲染表单
		var objs = tableInitDetial('demoDetial', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '店铺名称',
						align: 'left',
						field: 'shopName',
						width: 150
					}, {
						title: '归档日期',
						align: 'left',
						field: '_statisticsDate',
						width: 200
					}, {
						title: '销售',
						align: 'left',
						field: 'sales',
						width: 150
					}, {
						title: '消耗',
						align: 'left',
						field: 'consumption',
						width: 150
					}, {
						title: '费用',
						align: 'left',
						field: 'cost',
						width: 150
					}
				]
			],
	
			pageCallbackDetial, 'laypageLeftDetial', 0
		);	
	};
	_tableInitdetial();
	
	
    //右侧表格数据处理
    function getDatatial(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                $(item).attr('_statisticsDate',item.statisticsDate.slice(0,10))
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };

    //pageCallback回调
    function pageCallbackDetial(index, limit) {
		var merchantId = sessionStorage.getItem('mId');
		if(merchantId==null){
			return
		}
		var shopId = $("#chargeType").val()||"";
		var	startDate=$("#jurisdiction-begin").val() || "";
		var	endDate=$("#jurisdiction-end").val()|| "";
		if(endDate<startDate){
			layer.msg('起始时间不能大于截止时间哦');
			return
		}
		var params = {
			page: index,
			rows: limit,
			merchantId: merchantId, 
			shopId:shopId,
			startDate:startDate,
			endDate:endDate
		}
		return getDatatial(USER_URL.SHOPLIST, JSON.stringify(params));
    };	


   /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInitDetial(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-320',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(page, rows);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        };

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
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
        };


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    };



	//点击表格变色
	$('body').on('click', '.layui-form .layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	});


	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});
//左侧
	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
		_tableInit();
		
	})

	//重置
	$("#toolRelize").click(function() {
		$("#orgName").val("");
		$('#phone').val("");	
		_tableInit();
	});
	
//右侧
	//搜索条件进行搜索
	$('#toolSearchDetial').on('click', function() {
		_tableInitdetial();
		
	})

	//重置
	$("#toolRelizeDetial").click(function() {
		$("#chargeType").val("");
		$("#jurisdiction-begin").val("");
		$("#jurisdiction-end").val("");
		$("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");
		_tableInitdetial();
	});	
	
	//刷新
	$('#refresh').click(function(){
		location.reload()
	})
})(jQuery)